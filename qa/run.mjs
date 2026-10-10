#!/usr/bin/env node
// Browser QA for the built site. Run from the repo root: npm run qa
// Builds dist/, serves it locally and checks, in Chromium:
//   layout     no horizontal overflow at 320/360/390/1440 px, no console errors
//   a11y       axe-core (WCAG 2.x A/AA + best practice) on every page, light + dark, phone + desktop
//   security   every page with the production CSP applied: no violations, scripts still run
//   flows      fare widget → booking prefill → all steps → send screen; validation; draft restore
//   no-JS      widget submits to the booking page; booking is one complete form
//   endpoint   with a mocked bookingEndpoint: one request per submit, success and failure screens
// Set CHROME_PATH to use an installed Chromium instead of Playwright's download.
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync, rmSync } from 'node:fs';
import { join, extname, relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const root = resolve(new URL('..', import.meta.url).pathname);
const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const failures = [];
const fail = (m) => failures.push(m);
const section = (t) => console.log(`\n— ${t}`);
// Run one block; a thrown error (timeout, missing element) becomes a reported failure, not a crash.
async function guard(name, fn) {
  try { await fn(); } catch (e) { fail(`${name}: ${String(e.message).split('\n')[0]}`); }
}

/* ---------- build + serve ---------- */
function build(outDir, siteOverride) {
  const env = { ...process.env };
  if (siteOverride) env.TBU_SITE_OVERRIDE = JSON.stringify(siteOverride);
  execFileSync(process.execPath, ['src/build.mjs', '--out', outDir], { cwd: root, env, stdio: 'ignore' });
  return join(root, outDir);
}
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain' };
function serve(dir) {
  const server = createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = join(dir, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
    if (!f.startsWith(dir) || !existsSync(f)) { res.writeHead(404, { 'content-type': TYPES['.html'] }); return res.end(readFileSync(join(dir, '404.html'))); }
    res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' });
    res.end(readFileSync(f));
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok({ server, base: `http://127.0.0.1:${server.address().port}` })));
}
function pagesIn(dir) {
  const out = [];
  (function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) out.push('/' + relative(dir, p).replace(/index\.html$/, '')); } })(dir);
  return out.sort();
}
function cspHeaders(dir) {
  const block = readFileSync(join(dir, '_headers'), 'utf8').split('\n\n')[0].split('\n').slice(1);
  return Object.fromEntries(block.map((l) => { const i = l.indexOf(':'); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-proxy-server'] });
const newContext = browser.newContext.bind(browser);
browser.newContext = async (o) => { const c = await newContext(o); c.setDefaultTimeout(8000); return c; };
const dist = build('dist');
const { server, base } = await serve(dist);
const pages = pagesIn(dist);
console.log(`${pages.length} pages at ${base}`);

/* ---------- layout ---------- */
section('layout: overflow + console errors');
for (const width of [320, 360, 390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 } });
  for (const path of pages) {
    const page = await ctx.newPage();
    page.on('pageerror', (e) => fail(`${width}px ${path}: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error') fail(`${width}px ${path}: console ${m.text()}`); });
    await page.goto(base + path, { waitUntil: 'load' });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (over > 0) fail(`${width}px ${path}: page scrolls sideways by ${over}px`);
    await page.close();
  }
  await ctx.close();
}

/* ---------- a11y ---------- */
section('a11y: axe-core');
for (const scheme of ['light', 'dark']) {
  for (const width of [390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
    for (const path of pages) {
      const page = await ctx.newPage();
      await page.goto(base + path, { waitUntil: 'load' });
      await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
      await page.addScriptTag({ content: axeSource });
      const v = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] })).violations.map((x) => `${x.id}: ${x.nodes[0]?.target.join(' ')}`));
      v.forEach((x) => fail(`${scheme} ${width}px ${path}: ${x}`));
      await page.close();
    }
    await ctx.close();
  }
}

/* ---------- security ---------- */
section('security: production CSP applied');
{
  const hdr = cspHeaders(dist);
  const ctx = await browser.newContext();
  await ctx.route('**/*', async (route) => {
    const r = await route.fetch();
    const h = { ...r.headers() };
    if ((h['content-type'] || '').includes('text/html')) Object.assign(h, hdr);
    await route.fulfill({ response: r, headers: h });
  });
  for (const path of pages) {
    const page = await ctx.newPage();
    page.on('console', (m) => { if (/Content Security Policy|Refused to/.test(m.text())) fail(`CSP ${path}: ${m.text().slice(0, 160)}`); });
    await page.goto(base + path, { waitUntil: 'load' });
    if (!(await page.evaluate(() => document.documentElement.classList.contains('js')))) fail(`CSP ${path}: inline script blocked`);
    await page.close();
  }
  await ctx.close();
}

/* ---------- flows ---------- */
section('flows: widget → booking → send');
await guard('flow', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fail(`flow: ${e.message}`));
  await ctx.route('mailto:*', (r) => r.abort());
  await page.goto(base + '/');
  await page.click('label.chip:has-text("Nieuwegein")');
  await page.click('label.opt:has-text("Taxibus")');
  const widgetPrice = await page.textContent('[data-out="price"]');
  await page.fill('#fw-van', 'Oudegracht 1, Utrecht');
  await Promise.all([page.waitForURL(/\/boeken\//), page.click('form[data-fare] button[type=submit]')]);
  if ((await page.inputValue('#bk-naar')) !== 'nieuwegein') fail('flow: booking did not take the widget route');
  if ((await page.textContent('[data-sum="price"]')) !== widgetPrice) fail(`flow: price changed between widget (${widgetPrice}) and booking`);
  await page.click('[data-next]');
  if (!(await page.isVisible('[data-step="1"]'))) fail('flow: step 1 advanced without a drop-off address');
  await page.fill('#bk-naar-adres', 'Stadsplein 1, Nieuwegein');
  await page.click('[data-next]');
  await page.click('[data-next]');
  await page.fill('#bk-naam', 'Test');
  await page.fill('#bk-tel', '123');
  await page.fill('#bk-mail', 'test@example.com');
  await page.check('#bk-ok');
  await page.click('[data-submit]');
  if (await page.isVisible('[data-done]')) fail('flow: accepted an invalid phone number');
  await page.fill('#bk-tel', '06 12345678');
  await page.click('[data-submit]');
  await page.waitForSelector('[data-done]:not([hidden])', { timeout: 3000 }).catch(() => fail('flow: send screen did not appear'));
  const summary = await page.textContent('[data-done-summary]');
  for (const want of ['Rit: Utrecht – Nieuwegein', 'Afzetten: Stadsplein 1, Nieuwegein', 'Auto: Taxibus', `Prijs: ${widgetPrice}`]) if (!summary.includes(want)) fail(`flow: summary is missing "${want}"`);
  // draft survives a reload
  await page.goto(base + '/boeken/');
  await page.fill('#bk-van', 'Biltstraat 1, Utrecht');
  await page.reload();
  if ((await page.inputValue('#bk-van')) !== 'Biltstraat 1, Utrecht') fail('flow: draft was not restored after reload');
  // mobile menu
  const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await m.newPage();
  await mp.goto(base + '/tarieven/');
  await mp.click('[data-menu]');
  if (!(await mp.isVisible('#menu a[href="/zakelijk/"]'))) fail('flow: mobile menu did not open');
  await m.close();
  await ctx.close();
});

/* ---------- no JS ---------- */
section('no JavaScript');
await guard('no-JS', async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(base + '/');
  await page.click('label.chip:has-text("Odijk")');
  await Promise.all([page.waitForURL(/\/boeken\//), page.click('form[data-fare] button[type=submit]')]);
  const visible = await page.evaluate(() => [...document.querySelectorAll('[data-step]')].every((s) => s.getBoundingClientRect().height > 0));
  if (!visible) fail('no-JS: not every booking step is visible');
  if (!(await page.isVisible('[data-submit]'))) fail('no-JS: no submit button');
  if (!(await page.isVisible('#menu a[href="/tarieven/"]'))) fail('no-JS: menu links hidden');
  await ctx.close();
});

server.close();

/* ---------- endpoint ---------- */
section('form endpoint (mocked)');
await guard('endpoint', async () => {
  const epDist = build('dist-qa-endpoint', { bookingEndpoint: 'https://forms.example.test/f/qa' });
  const { server: s2, base: b2 } = await serve(epDist);
  for (const status of [200, 500]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    let posts = 0;
    await ctx.route('https://forms.example.test/**', async (r) => { posts++; await new Promise((x) => setTimeout(x, 300)); await r.fulfill({ status, contentType: 'application/json', body: '{}' }); });
    const page = await ctx.newPage();
    await page.goto(b2 + '/boeken/?naar=schiphol');
    await page.fill('#bk-van', 'Oudegracht 1, Utrecht');
    await page.click('[data-next]');
    await page.click('[data-next]');
    await page.fill('#bk-naam', 'Test');
    await page.fill('#bk-tel', '0612345678');
    await page.fill('#bk-mail', 'test@example.com');
    await page.check('#bk-ok');
    await page.click('[data-submit]');
    await page.click('[data-submit]', { force: true, timeout: 500 }).catch(() => {});
    await page.waitForTimeout(800);
    if (posts !== 1) fail(`endpoint ${status}: ${posts} requests for one booking`);
    const done = await page.isVisible('[data-done]');
    if (status === 200 && !done) fail('endpoint 200: no confirmation screen');
    if (status === 500 && (done || !(await page.isVisible('#boeken > [data-form-error]')))) fail('endpoint 500: no error message');
    await ctx.close();
  }
  s2.close();
  rmSync(epDist, { recursive: true, force: true });
});

await browser.close();
console.log(failures.length ? `\n✗ ${failures.length} problem(s):\n  - ${failures.join('\n  - ')}` : '\n✓ browser QA passed');
process.exit(failures.length ? 1 : 0);

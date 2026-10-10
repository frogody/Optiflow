#!/usr/bin/env node
// Browser QA for the built site. Run from the repo root: npm run qa
// Builds dist/, serves it locally and checks, in Chromium:
//   layout     no horizontal overflow or split heading words at 320–1440 px, no console errors
//   a11y       axe-core (WCAG 2.x A/AA + best practice) on every page, light + dark, phone + desktop
//   security   every page with the production CSP applied: no violations, scripts still run
//   flows      fare widget → booking prefill → all steps → send screen; validation; draft restore
//   no-JS      widget submits to the booking page; booking is one complete form
//   endpoint   with a mocked bookingEndpoint: one request per submit, success and failure screens
//   maps       (when a Mapbox token is set) address suggestions, live route map, route suggestion,
//              'use my location', service-area pins, axe with the map open — Mapbox itself is mocked
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
  const env = { MAPBOX_TOKEN: 'pk.qa-dummy.not-a-real-token', ...process.env }; // Mapbox is mocked in QA
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
// Never reach the real Mapbox from QA (quota, flakiness): block it everywhere; the maps section mocks it.
browser.newContext = async (o) => {
  const c = await newContext(o);
  c.setDefaultTimeout(8000);
  await c.route(/^https:\/\/([a-z0-9-]+\.)*mapbox\.com\//, (r) => r.abort());
  return c;
};
const fromMapbox = (m) => /mapbox\.com/.test((m.location && m.location().url) || '') || /Kaart niet beschikbaar|mapbox/i.test(m.text());
const dist = build('dist');
const { server, base } = await serve(dist);
const pages = pagesIn(dist);
console.log(`${pages.length} pages at ${base}`);

/* ---------- layout ---------- */
section('layout: overflow + console errors');
for (const width of [320, 360, 390, 768, 1024, 1280, 1440]) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 } });
  for (const path of pages) {
    const page = await ctx.newPage();
    page.on('pageerror', (e) => fail(`${width}px ${path}: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error' && !fromMapbox(m)) fail(`${width}px ${path}: console ${m.text()}`); });
    await page.goto(base + path, { waitUntil: 'load' });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (over > 0) fail(`${width}px ${path}: page scrolls sideways by ${over}px`);
    // A heading word may only break at a (soft) hyphen; overflow-wrap splitting "Nieuwegei|n" is a bug.
    const split = await page.evaluate(() => {
      const out = [];
      for (const h of document.querySelectorAll('h1, h2, h3')) {
        const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          for (const m of n.data.matchAll(/[^\s­-]+/g)) {
            const r = document.createRange();
            r.setStart(n, m.index);
            r.setEnd(n, m.index + m[0].length);
            // Chromium reports the hyphen drawn at a soft-hyphen break as part of the next word.
            const afterShy = n.data[m.index - 1] === '\u00AD';
            const em = parseFloat(getComputedStyle(h).fontSize);
            const rects = [...r.getClientRects()].filter((x, i) => x.width > 0 && !(afterShy && i === 0 && x.width < em * 0.5));
            const tops = new Set(rects.map((x) => Math.round(x.top)));
            if (tops.size > 1) out.push(m[0]);
          }
        }
      }
      return out;
    });
    for (const w of split) fail(`${width}px ${path}: heading word "${w}" is split across lines`);
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
      await page.evaluate(axeSource);
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
    if (!route.request().url().startsWith(base)) return route.abort();
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

/* ---------- maps (Mapbox mocked: GL JS from npm, canned geocoding/directions) ---------- */
section('maps: suggestions, live route, service area');
await guard('maps', async () => {
  const gl = { js: readFileSync(require.resolve('mapbox-gl/dist/mapbox-gl.js')), css: readFileSync(require.resolve('mapbox-gl/dist/mapbox-gl.css')) };
  const feat = (name, town, lng, lat, full) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] }, properties: { name, name_preferred: name, place_formatted: town, full_address: full, feature_type: 'address', context: { place: { name: town } } } });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, permissions: ['geolocation'], geolocation: { latitude: 52.0907, longitude: 5.1214 } });
  await ctx.route('https://api.mapbox.com/**', async (r) => {
    const u = r.request().url();
    if (u.includes('/mapbox-gl.js')) return r.fulfill({ body: gl.js, contentType: 'text/javascript' });
    if (u.includes('/mapbox-gl.css')) return r.fulfill({ body: gl.css, contentType: 'text/css' });
    if (u.includes('/styles/v1/')) return r.fulfill({ contentType: 'application/json', body: JSON.stringify({ version: 8, sources: {}, layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#18263C' } }] }) });
    if (u.includes('/geocode/v6/forward')) {
      const q = new URL(u).searchParams.get('q');
      const f = /stads/i.test(q) ? [feat('Stadsplein 1', 'Nieuwegein', 5.0866, 52.0291, 'Stadsplein 1, 3431 LZ Nieuwegein')] : [feat('Oudegracht 1', 'Utrecht', 5.1205, 52.0925, 'Oudegracht 1, 3511 AA Utrecht'), feat('Oudegracht 10', 'Utrecht', 5.1206, 52.0922, 'Oudegracht 10, 3511 AB Utrecht')];
      return r.fulfill({ contentType: 'application/json', body: JSON.stringify({ features: f }) });
    }
    if (u.includes('/geocode/v6/reverse')) return r.fulfill({ contentType: 'application/json', body: JSON.stringify({ features: [feat('Domplein 9', 'Utrecht', 5.1213, 52.0908, 'Domplein 9, 3512 JC Utrecht')] }) });
    if (u.includes('/directions/v5/')) return r.fulfill({ contentType: 'application/json', body: JSON.stringify({ routes: [{ distance: 12345, duration: 905, geometry: { type: 'LineString', coordinates: [[5.1205, 52.0925], [5.1, 52.06], [5.0866, 52.0291]] } }] }) });
    return r.fulfill({ status: 404, body: '' });
  });
  await ctx.route(/^https:\/\/([a-z]+\.)?(events|tiles)\.mapbox\.com\//, (r) => r.fulfill({ status: 204, body: '' }));
  // Serve our pages with the production CSP so Mapbox GL is proven to work under it (workers, blobs, tiles).
  const hdr = cspHeaders(dist);
  await ctx.route((u) => u.href.startsWith(base), async (route) => {
    const r = await route.fetch();
    const h = { ...r.headers() };
    if ((h['content-type'] || '').includes('text/html')) Object.assign(h, hdr);
    await route.fulfill({ response: r, headers: h });
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fail(`maps: ${e.message}`));
  page.on('console', (m) => { if (/Content Security Policy|Refused to/.test(m.text())) fail(`maps CSP: ${m.text().slice(0, 160)}`); });
  await page.goto(base + '/boeken/');
  if (await page.evaluate(() => !!window.mapboxgl)) fail('maps: Mapbox GL loaded before anyone touched the form');
  await page.click('#bk-van');
  await page.keyboard.type('Oudegr', { delay: 20 });
  await page.waitForSelector('.ac:not([hidden]) li');
  if ((await page.getAttribute('#bk-van', 'aria-expanded')) !== 'true') fail('maps: combobox not expanded');
  await page.keyboard.press('ArrowDown');
  if (!(await page.getAttribute('#bk-van', 'aria-activedescendant'))) fail('maps: arrow key did not move the active option');
  // a11y with the suggestion list open
  await page.evaluate(axeSource);
  for (const v of await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] })).violations.map((x) => `${x.id}: ${x.nodes[0]?.target.join(' ')}`))) fail(`maps a11y (suggestions open): ${v}`);
  await page.keyboard.press('Enter');
  if (!(await page.inputValue('#bk-van')).startsWith('Oudegracht 1,')) fail('maps: picking a suggestion did not fill the address');
  await page.selectOption('#bk-naar', 'odijk');
  await page.click('#bk-naar-adres');
  await page.keyboard.type('Stadsp', { delay: 20 });
  await page.waitForSelector('.ac:not([hidden]) li');
  await page.click('.ac:not([hidden]) li >> nth=0');
  await page.waitForFunction(() => document.querySelector('[data-sum="meta"]').textContent.includes('12,3'), null, { timeout: 8000 });
  const map = await page.evaluate(() => { const el = document.querySelector('[data-route-map]'); const m = el.tbuMap; const r = el.getBoundingClientRect(); return { live: el.classList.contains('is-live') && !el.hidden, pins: document.querySelectorAll('.pin').length, fit: m ? m.getCanvas().clientWidth === Math.round(r.width) : false }; });
  if (!map.live) fail('maps: route map not shown');
  if (map.pins !== 2) fail(`maps: expected 2 pins, got ${map.pins}`);
  if (!map.fit) fail('maps: map canvas does not fill its frame');
  if (!(await page.isVisible('[data-route-hint]'))) fail('maps: no route suggestion for Utrecht → Nieuwegein');
  await page.click('[data-route-hint-use]');
  if ((await page.inputValue('#bk-naar')) !== 'nieuwegein') fail('maps: route suggestion did not select Utrecht – Nieuwegein');
  await page.click('[data-locate]');
  await page.waitForFunction(() => document.querySelector('#bk-van').value.startsWith('Domplein'), null, { timeout: 5000 }).catch(() => fail('maps: "Gebruik mijn locatie" did not fill the pickup'));
  // service-area map
  const area = await ctx.newPage();
  area.on('pageerror', (e) => fail(`area map: ${e.message}`));
  await area.goto(base + '/werkgebied/');
  await area.evaluate(() => document.querySelector('[data-area-map]').scrollIntoView());
  await area.waitForFunction(() => document.querySelectorAll('.town-pin').length > 0, null, { timeout: 8000 }).catch(() => {});
  const pins = await area.$$eval('.town-pin', (l) => l.map((a) => a.getAttribute('href')));
  if (pins.length !== 12) fail(`area map: expected 12 town pins, got ${pins.length}`);
  if (!pins.includes('/werkgebied/nieuwegein/')) fail('area map: town pins do not link to town pages');
  await area.evaluate(axeSource);
  for (const v of await area.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] })).violations.map((x) => `${x.id}: ${x.nodes[0]?.target.join(' ')}`))) fail(`area map a11y: ${v}`);
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

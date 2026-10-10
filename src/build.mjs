#!/usr/bin/env node
// Static site build. Usage: node src/build.mjs [--preview] [--out dist]
import { mkdirSync, rmSync, writeFileSync, cpSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, fares, places, todos, linker, assetNames } from './lib.mjs';
import { document, INLINE_JS } from './layout.mjs';
import { pageFactories, boeken } from './pages.mjs';

const args = process.argv.slice(2);
const mode = args.includes('--preview') ? 'preview' : 'production';
const outArg = args.indexOf('--out');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, outArg > -1 ? args[outArg + 1] : mode === 'preview' ? 'dist-preview' : 'dist');

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'assets'), { recursive: true });
for (const f of ['favicon.svg', 'og.png', 'apple-touch-icon.png', 'icon-512.png']) cpSync(join(root, 'src/assets', f), join(out, 'assets', f));
const src = (f) => readFileSync(join(root, 'src/assets', f), 'utf8');
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);
// Safe minifier: drops comments and collapses whitespace around { } ; , only (never around ":" — ".a :focus" ≠ ".a:focus").
const minifyCss = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,])\s*/g, '$1').replace(/;}/g, '}').trim();
if (mode === 'production') {
  // One stylesheet (fonts + site), fingerprinted so it can be cached for a year.
  cpSync(join(root, 'src/assets/fonts'), join(out, 'assets/fonts'), { recursive: true });
  mkdirSync(join(out, 'assets/build'), { recursive: true });
  const css = minifyCss(src('fonts.css').replace(/url\(fonts\//g, 'url(../fonts/') + '\n' + src('site.css'));
  const js = src('site.js');
  for (const [name, body] of [['site.css', css], ['site.js', js]]) {
    const [base, ext] = name.split('.');
    const file = `/assets/build/${base}.${hash(body)}.${ext}`;
    writeFileSync(join(out, file), body);
    assetNames[`/assets/${name}`] = file;
  }
} else {
  for (const f of ['site.css', 'site.js']) cpSync(join(root, 'src/assets', f), join(out, 'assets', f));
}

const fileFor = (p) => (p.endsWith('.html') ? p.slice(1) : join(p.slice(1), 'index.html'));
const factories = [pageFactories[0], boeken, ...pageFactories.slice(1)];
const pages = [];
for (const make of factories) {
  const probe = make({ mode: 'production', ...linker('/', 'production') });
  todos.length = 0; // count markers once, from the real render below
  pages.push({ path: probe.path, make });
}
const seen = new Set();
for (const p of pages) {
  if (seen.has(p.path)) throw new Error(`Duplicate page path ${p.path}`);
  seen.add(p.path);
  const ctx = { mode, ...linker(p.path, mode) };
  const page = p.make(ctx);
  p.noindex = page.noindex;
  const file = join(out, fileFor(page.path));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, document(page, ctx));
}

/* ---------- SEO + hosting files ---------- */
const today = new Date().toISOString().slice(0, 10);
const urls = pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${site.origin}${p.path}</loc><lastmod>${today}</lastmod></url>`);
writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
writeFileSync(
  join(out, 'site.webmanifest'),
  JSON.stringify({ name: site.name, short_name: 'Taxi Utrecht', start_url: '/', display: 'standalone', background_color: '#0E1726', theme_color: '#0E1726', icons: [{ src: '/assets/favicon.svg', sizes: 'any', type: 'image/svg+xml' }, { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }] }, null, 2),
);

// 301s from the old site's URLs so existing rankings and links carry over.
const redirects = [
  ['/reserveren/', '/boeken/'],
  ['/taxi-schiphol-airport/', '/luchthavens/schiphol/'],
  ['/taxi-eindhoven-airport/', '/luchthavens/eindhoven-airport/'],
  ['/zakelijk-vervoer-utrecht/', '/zakelijk/'],
  ['/elektrische-taxi-utrecht/', '/elektrische-taxi/'],
  ['/groepsvervoer/', '/taxibus/'],
  ...places.map((p) => [`/taxi-${p.slug}/`, `/werkgebied/${p.slug}/`]),
];
const variants = redirects.flatMap(([from, to]) => [[from, to], [from.replace(/\/$/, ''), to]]);
writeFileSync(join(out, '_redirects'), variants.map(([f, t]) => `${f} ${t} 301`).join('\n') + '\n');
const endpointOrigin = site.bookingEndpoint ? new URL(site.bookingEndpoint).origin : '';
const csp = [
  "default-src 'self'",
  `script-src 'self' 'sha256-${createHash('sha256').update(INLINE_JS).digest('base64')}'`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self'${endpointOrigin ? ` ${endpointOrigin}` : ''}`,
  `form-action 'self' mailto:${endpointOrigin ? ` ${endpointOrigin}` : ''}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');
export const headers = [
  { source: '/(.*)', headers: [
    ['Content-Security-Policy', csp],
    ['Strict-Transport-Security', 'max-age=63072000; includeSubDomains'],
    ['X-Content-Type-Options', 'nosniff'],
    ['X-Frame-Options', 'DENY'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()'],
  ] },
  { source: '/assets/build/(.*)', headers: [['Cache-Control', 'public, max-age=31536000, immutable']] },
  { source: '/assets/fonts/(.*)', headers: [['Cache-Control', 'public, max-age=31536000, immutable']] },
];
const vercelHeaders = headers.map((h) => ({ source: h.source, headers: h.headers.map(([key, value]) => ({ key, value })) }));
writeFileSync(
  join(out, 'vercel.json'),
  JSON.stringify({ cleanUrls: false, trailingSlash: true, headers: vercelHeaders, redirects: redirects.map(([source, destination]) => ({ source: source.replace(/\/$/, ''), destination, permanent: true })) }, null, 2),
);
writeFileSync(join(out, '_headers'), headers.map((h) => `${h.source.replace('(.*)', '*')}\n${h.headers.map(([k, v]) => `  ${k}: ${v}`).join('\n')}`).join('\n\n') + '\n');
writeFileSync(
  join(out, '.htaccess'),
  `ErrorDocument 404 /404.html\n${redirects.map(([f, t]) => `Redirect 301 ${f.replace(/\/$/, '')} ${t}`).join('\n')}\n`,
);

/* ---------- report: what the business still has to supply ---------- */
const missing = [];
if (!site.whatsapp) missing.push('site.whatsapp — WhatsApp-nummer (knoppen zijn verborgen tot dit is ingevuld)');
if (!site.kvk) missing.push('site.kvk — KVK-nummer (wettelijk verplicht op de website)');
if (!site.btw) missing.push('site.btw — btw-identificatienummer');
if (!site.address.verified) missing.push('site.address — adres komt uit een bedrijvengids; bevestigen en verified: true zetten');
if (!site.reviews) missing.push('site.reviews — echte reviewscore met bron (blok is verborgen tot dit is ingevuld)');
if (!site.bookingEndpoint) missing.push('site.bookingEndpoint — formulieren openen nu het e-mailprogramma van de bezoeker');
const noPrice = fares.routes.filter((r) => r.price == null).map((r) => r.name);
console.log(`\n✓ ${pages.length} pagina's gebouwd (${mode}) → ${out}`);
if (noPrice.length) console.log(`\n• Nog geen vaste prijs (toont "op aanvraag"): ${noPrice.join(', ')}`);
if (missing.length) console.log(`\n• Ontbrekende bedrijfsgegevens:\n  - ${missing.join('\n  - ')}`);
const uniq = [...new Set(todos)];
if (uniq.length) console.log(`\n• Zichtbare [placeholders] op de site (${uniq.length}):\n  - ${uniq.join('\n  - ')}`);
console.log('');

// Shared data + helpers. Every price, distance and contact detail on the site comes from src/data.
import { readFileSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));

// TBU_SITE_OVERRIDE (JSON) lets the browser QA build a variant, e.g. with a mocked bookingEndpoint.
export const site = { ...read('./data/site.json'), ...(process.env.TBU_SITE_OVERRIDE ? JSON.parse(process.env.TBU_SITE_OVERRIDE) : {}) };
export const fares = read('./data/fares.json');
export const places = read('./data/places.json');
export const airports = read('./data/airports.json');
export const routes = Object.fromEntries(fares.routes.map((r) => [r.id, r]));
// The Mapbox token never lives in the repository: it comes from MAPBOX_TOKEN in the environment
// (Vercel/Netlify project settings) or, for local builds, a git-ignored .env.local / .env file.
for (const f of ['../.env.local', '../.env']) {
  if (process.env.MAPBOX_TOKEN) break;
  try {
    const m = readFileSync(new URL(f, import.meta.url), 'utf8').match(/^MAPBOX_TOKEN=(.+)$/m);
    if (m) process.env.MAPBOX_TOKEN = m[1].trim();
  } catch { /* no local env file */ }
}
if (process.env.MAPBOX_TOKEN) site.mapboxToken = process.env.MAPBOX_TOKEN;
export const MAPBOX_GL_VERSION = '3.2.0';
export const hasMap = () => Boolean(site.mapboxToken);
export const placeBySlug = Object.fromEntries(places.map((p) => [p.slug, p]));

export const NB = ' ';

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const money = (n) => `€${NB}${n}`;
export const busPrice = (p) => Math.round(p * site.busFactor);

/** Display label for a route price, or null when the business has not confirmed one. */
export function priceLabel(r, { bus = false } = {}) {
  if (!r || r.price == null) return null;
  const v = bus ? busPrice(r.price) : r.price;
  return `${r.from ? 'v.a. ' : ''}${bus ? 'ca. ' : ''}${money(v)}`;
}
export const kmLabel = (r) => (r && r.km ? `${r.km}${NB}km` : null);
export const minLabel = (r) => (r && r.min ? `±${NB}${r.min}${NB}min` : null);
export const metaLabel = (r) => [kmLabel(r), minLabel(r)].filter(Boolean).join(' · ');

export const phoneNb = site.phone.replace(/ /g, NB);
export const telHref = `tel:${site.phoneE164}`;
export const waHref = site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/\D/g, '')}` : null;
export const mailHref = `mailto:${site.email}`;

/** Missing business facts render as a visible marker and are counted for the build report. */
export const todos = [];
export function todo(label, where = '') {
  todos.push(`${label}${where ? ` (${where})` : ''}`);
  return `<mark class="todo">[${esc(label)}]</mark>`;
}

/** Fingerprinted asset names, filled in by the production build (e.g. /assets/site.css → /assets/site.3f9a1c2b.css). */
export const assetNames = {};

/** Link builder. Production: clean absolute URLs. Preview: relative links to index.html files. */
export function linker(pagePath, mode) {
  const segs = pagePath.split('/').filter(Boolean);
  const depth = pagePath.endsWith('.html') ? segs.length - 1 : segs.length;
  const up = '../'.repeat(depth);
  const link = (to) => {
    if (/^(https?:|tel:|mailto:|#)/.test(to)) return to;
    const [p, hash] = to.split('#');
    if (mode !== 'preview') return to;
    const rel = p === '/' ? 'index.html' : p.replace(/^\//, '') + (p.endsWith('/') ? 'index.html' : '');
    return up + rel + (hash ? `#${hash}` : '');
  };
  const asset = (p) => {
    const q = assetNames[p] || p;
    return mode === 'preview' ? up + q.replace(/^\//, '') : q;
  };
  return { link, asset };
}

/** Safe CSS minifier: drops comments and collapses whitespace around { } ; , only.
 *  Never touches spaces around ":" because ".a :focus" and ".a:focus" mean different things. */
export const minifyCss = (css) =>
  css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,])\s*/g, '$1').replace(/;}/g, '}').trim();

/* ---------- icons (inline stroke SVG, currentColor) ---------- */
const svg = (d, { size = 20, sw = 2, label } = {}) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${
    label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true" focusable="false"'
  }>${d}</svg>`;

const P = {
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  invoice: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  card: '<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
};
export const icon = (name, opts) => svg(P[name], opts);

export const logoMark = (cls = 'logo__mark') =>
  `<svg class="${cls}" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="8" fill="#FFC629"/><path d="M13 27V19a6 6 0 0 1 6-6h8" fill="none" stroke="#0E1726" stroke-width="3.2" stroke-linecap="round"/><circle cx="13" cy="28" r="3.4" fill="#0E1726"/><circle cx="28" cy="13" r="3.4" fill="#0E1726"/></svg>`;

/* Line illustrations for the fleet (drawn, not photographed). */
export const vehicleArt = {
  sedan: `<svg class="vehicle__icon" viewBox="0 0 240 92" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 66h18M70 66h100M208 66h18"/><path d="M14 66v-12c0-4 3-7 7-8l28-6 26-18c4-3 9-4 14-4h52c6 0 11 2 15 6l20 18 34 5c4 1 8 5 8 9v10"/><path d="M84 40l18-14h38v14zM150 26h4c4 0 8 2 11 5l9 9h-24z"/><circle cx="51" cy="66" r="13"/><circle cx="189" cy="66" r="13"/><path d="M108 18h24" stroke-width="5"/><path d="M4 82h232" stroke-dasharray="6 8" opacity=".5"/></svg>`,
  ev: `<svg class="vehicle__icon" viewBox="0 0 240 92" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 66h18M70 66h100M208 66h18"/><path d="M14 66v-10c0-5 3-8 8-9l34-8 24-15c5-3 10-4 16-4h40c7 0 13 2 18 6l22 16 30 5c4 1 8 5 8 9v10"/><path d="M90 38l16-12h50l16 12z"/><circle cx="51" cy="66" r="13"/><circle cx="189" cy="66" r="13"/><path d="M118 46l-6 9h10l-6 9" stroke-width="2.6"/><path d="M4 82h232" stroke-dasharray="6 8" opacity=".5"/></svg>`,
  bus: `<svg class="vehicle__icon" viewBox="0 0 240 92" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 66h20M72 66h96M206 66h20"/><path d="M14 66V30c0-6 4-10 10-10h150c6 0 11 3 14 8l24 22c3 3 4 6 4 10v6"/><path d="M28 30h32v14H28zM70 30h32v14H70zM112 30h32v14h-32zM154 30h22l16 14h-38z"/><circle cx="53" cy="66" r="13"/><circle cx="187" cy="66" r="13"/><path d="M4 82h232" stroke-dasharray="6 8" opacity=".5"/></svg>`,
};

// Data integrity checks. The build refuses to run when the data contradicts itself,
// so a typo in a JSON file can never ship as a broken link or a wrong price.

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const GROUPS = ['stad', 'regio', 'luchthaven'];

export function validateData({ site, fares, places, airports }) {
  const errors = [];
  const err = (m) => errors.push(m);
  const posInt = (v) => Number.isInteger(v) && v > 0;

  /* site */
  if (!/^https:\/\/[^/]+$/.test(site.origin)) err(`site.origin must be https://host without a trailing slash (got ${site.origin})`);
  const digits = String(site.phone).replace(/\D/g, '');
  if (site.phoneE164 !== `+31${digits.replace(/^0/, '')}`) err(`site.phoneE164 (${site.phoneE164}) does not match site.phone (${site.phone})`);
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(site.email)) err(`site.email is not an e-mail address (${site.email})`);
  if (site.whatsapp != null && !/^\d{10,15}$/.test(site.whatsapp)) err('site.whatsapp must be digits only, with country code (e.g. 31612345678)');
  if (site.bookingEndpoint != null && !/^https:\/\//.test(site.bookingEndpoint)) err('site.bookingEndpoint must be an https:// URL');
  if (site.kvk != null && !/^\d{8}$/.test(site.kvk)) err('site.kvk must be 8 digits');
  if (site.mapboxToken != null && !/^pk\.[\w-]+\.[\w-]+$/.test(site.mapboxToken)) err('site.mapboxToken must be a Mapbox PUBLIC token (pk.…); never put a secret sk. token in the site');
  if (!(typeof site.busFactor === 'number' && site.busFactor >= 1 && site.busFactor <= 3)) err('site.busFactor must be a number between 1 and 3');
  if (site.reviews != null) {
    const r = site.reviews;
    if (!(r.score > 0 && r.score <= 5)) err('site.reviews.score must be between 0 and 5');
    if (!posInt(r.count)) err('site.reviews.count must be a positive whole number');
    if (!r.source) err('site.reviews.source is required (e.g. "Google")');
  }

  /* fares */
  const ids = new Set();
  for (const r of fares.routes) {
    if (ids.has(r.id)) err(`fares: duplicate route id "${r.id}"`);
    ids.add(r.id);
    if (!SLUG.test(r.id)) err(`fares: route id "${r.id}" must be lowercase-with-dashes`);
    if (!GROUPS.includes(r.group)) err(`fares: route "${r.id}" has unknown group "${r.group}"`);
    if (r.price != null && !posInt(r.price)) err(`fares: route "${r.id}" price must be a whole number of euros or null`);
    for (const k of ['km', 'min']) if (r[k] != null && !posInt(r[k])) err(`fares: route "${r.id}" ${k} must be a positive whole number or null`);
  }
  const route = (id) => fares.routes.find((r) => r.id === id);

  /* places */
  const slugs = new Set(places.map((p) => p.slug));
  if (slugs.size !== places.length) err('places: duplicate slug');
  for (const p of places) {
    if (!SLUG.test(p.slug)) err(`places: slug "${p.slug}" must be lowercase-with-dashes`);
    if (!route(p.route)) err(`places: "${p.slug}" points to unknown route "${p.route}"`);
    if (!p.intro || !p.area) err(`places: "${p.slug}" needs an intro and an area text`);
    if (!p.districts?.length) err(`places: "${p.slug}" needs at least one district`);
    if (!p.spots?.length) err(`places: "${p.slug}" needs at least one spot`);
    if (!(p.lat > 50 && p.lat < 54 && p.lng > 3 && p.lng < 8)) err(`places: "${p.slug}" needs lat/lng in the Netherlands`);
    for (const n of p.nearby || []) {
      if (n === p.slug) err(`places: "${p.slug}" lists itself as nearby`);
      else if (!slugs.has(n)) err(`places: "${p.slug}" lists unknown nearby place "${n}"`);
    }
  }

  /* airports */
  const aslugs = new Set();
  for (const a of airports) {
    if (aslugs.has(a.slug)) err(`airports: duplicate slug "${a.slug}"`);
    aslugs.add(a.slug);
    const r = route(a.route);
    if (!r) err(`airports: "${a.slug}" points to unknown route "${a.route}"`);
    else if (r.group !== 'luchthaven') err(`airports: "${a.slug}" route "${a.route}" is not in group "luchthaven"`);
    if (!(a.lat > 49 && a.lat < 54 && a.lng > 2 && a.lng < 9)) err(`airports: "${a.slug}" needs lat/lng`);
  }
  return errors;
}

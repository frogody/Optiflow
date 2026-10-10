export const INLINE_JS = "document.documentElement.classList.add('js')";
import { site, esc, icon, logoMark, telHref, phoneNb, waHref, mailHref, places, airports } from './lib.mjs';

const NAV = [
  ['/boeken/', 'Boeken', 'boeken'],
  ['/tarieven/', 'Tarieven', 'tarieven'],
  ['/luchthavens/', 'Luchthavens', 'luchthavens'],
  ['/zakelijk/', 'Zakelijk', 'zakelijk'],
  ['/werkgebied/', 'Werkgebied', 'werkgebied'],
  ['/contact/', 'Contact', 'contact'],
];

function header(page, { link }) {
  const items = NAV.map(([href, label, key]) => {
    const cur = page.path === href ? ' aria-current="page"' : page.nav === key ? ' aria-current="true"' : '';
    return `<li><a href="${link(href)}"${cur}>${label}</a></li>`;
  }).join('');
  return `<a class="skip" href="#inhoud">Naar de inhoud</a>
<header class="hdr">
  <div class="wrap hdr__in">
    <a class="logo" href="${link('/')}">${logoMark()}<span class="logo__txt"><span class="logo__name">Taxi Bestellen</span><span class="logo__city">Utrecht</span></span></a>
    <nav class="nav" id="menu" aria-label="Hoofdmenu"><ul class="nav__list">${items}</ul></nav>
    <div class="hdr__act">
      ${waHref ? `<a class="btn btn--ghost-ink btn--sm hdr__wa" href="${waHref}">${icon('chat', { size: 18 })}WhatsApp</a>` : ''}
      <a class="btn btn--signal btn--sm hdr__call" href="${telHref}" aria-label="Bel&nbsp;${esc(phoneNb)}">${icon('phone', { size: 18, sw: 2.2 })}<span class="hdr__call-num">${esc(phoneNb)}</span></a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-menu><span class="sr-only">Menu</span>${icon('menu')}</button>
    </div>
  </div>
</header>`;
}

function footer({ link }) {
  const a = site.address;
  const legalIds = [site.kvk ? `KVK ${esc(site.kvk)}` : null, site.btw ? `btw ${esc(site.btw)}` : null].filter(Boolean).join(' · ');
  const townLinks = places.slice(0, 6).map((p) => `<a href="${link(`/werkgebied/${p.slug}/`)}">Taxi ${esc(p.name)}</a>`).join('');
  const airportLinks = airports.slice(0, 4).map((p) => `<a href="${link(`/luchthavens/${p.slug}/`)}">${esc(p.name)}</a>`).join('');
  return `<footer class="ftr">
  <div class="wrap ftr__in">
    <div class="ftr__cols">
      <div class="ftr__col">
        <span class="eyebrow">Bestellen · 24/7</span>
        <a class="ftr__phone" href="${telHref}">${esc(phoneNb)}</a>
        ${waHref ? `<a href="${waHref}">WhatsApp</a>` : ''}
        <a href="${mailHref}">${esc(site.email)}</a>
        <a href="${link('/boeken/')}">Online boeken</a>
      </div>
      <div class="ftr__col">
        <span class="eyebrow">Diensten</span>
        <a href="${link('/tarieven/')}">Tarieven</a>
        <a href="${link('/zakelijk/')}">Zakelijk vervoer</a>
        <a href="${link('/taxibus/')}">Taxibus &amp; groepen</a>
        <a href="${link('/elektrische-taxi/')}">Elektrische taxi</a>
        <a href="${link('/veelgestelde-vragen/')}">Veelgestelde vragen</a>
      </div>
      <div class="ftr__col">
        <span class="eyebrow">Luchthavens</span>
        ${airportLinks}
        <a href="${link('/luchthavens/')}">Alle luchthavens</a>
      </div>
      <div class="ftr__col">
        <span class="eyebrow">Werkgebied</span>
        ${townLinks}
        <a href="${link('/werkgebied/')}">Alle plaatsen</a>
      </div>
      <div class="ftr__col">
        <span class="eyebrow">Bedrijf</span>
        <a href="${link('/over-ons/')}">Over ons</a>
        <a href="${link('/contact/')}">Contact</a>
        <a href="${link('/algemene-voorwaarden/')}">Algemene voorwaarden</a>
        <a href="${link('/privacy/')}">Privacyverklaring</a>
        <a href="${link('/cookies/')}">Cookies</a>
      </div>
    </div>
    <div class="ftr__legal">
      <span>${esc(site.name)} · ${esc(a.street)}, ${esc(a.postalCode)} ${esc(a.city)}${legalIds ? ` · ${legalIds}` : ''}</span>
      <span>Alle prijzen inclusief btw</span>
    </div>
  </div>
</footer>`;
}

function actionbar({ link }) {
  return `<nav class="actionbar" aria-label="Snel bestellen">
  <a href="${telHref}">${icon('phone', { sw: 2.2 })}Bellen</a>
  ${waHref ? `<a href="${waHref}">${icon('chat', { sw: 2.2 })}WhatsApp</a>` : ''}
  <a class="actionbar__main" href="${link('/boeken/')}">Boek je rit</a>
</nav>`;
}

export function document(page, ctx) {
  const { mode, link, asset } = ctx;
  const canonical = site.origin + page.path;
  const title = page.path === '/' ? (mode === 'preview' ? site.name : page.title) : `${page.title} | ${site.name}`;
  const fonts =
    mode === 'preview'
      ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&amp;family=IBM+Plex+Mono:wght@400;500;600&amp;display=swap">`
      : `<link rel="preload" href="${asset('/assets/fonts/archivo-latin-wdth-normal.woff2')}" as="font" type="font/woff2" crossorigin>`;
  const ld = (page.jsonld || []).map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n');
  const head = `<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="website">
<meta property="og:locale" content="nl_NL">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.origin}/assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.name)}: je taxi in Utrecht, de prijs weet je vooraf">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0E1726">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="${asset('/assets/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${asset('/assets/apple-touch-icon.png')}">
<link rel="manifest" href="${asset('/site.webmanifest')}">
${fonts}
<link rel="stylesheet" href="${asset('/assets/site.css')}">
<script>${INLINE_JS}</script>
${ld}`;
  const body = `${header(page, ctx)}
<main id="inhoud">
${page.body}
</main>
${footer(ctx)}
${page.path === '/boeken/' ? '' : actionbar(ctx)}
<script src="${asset('/assets/site.js')}" defer></script>`;

  // The preview host wraps its entry page in its own document skeleton.
  if (mode === 'preview' && page.path === '/') return `${head}\n${body}\n`;
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}
</head>
<body>
${body}
</body>
</html>
`;
}

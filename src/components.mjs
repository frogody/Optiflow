import {
  site, routes, places, airports, placeBySlug, esc, icon, money, busPrice, priceLabel, kmLabel, minLabel, metaLabel,
  telHref, waHref, vehicleArt, NB,
} from './lib.mjs';

export const VEHICLES = [
  { id: 'std', name: 'Standaard', sub: '1–4 personen', factor: 1 },
  { id: 'ev', name: 'Elektrisch', sub: 'Tesla · zelfde prijs', factor: 1 },
  { id: 'bus', name: 'Taxibus', sub: `${site.busPassengers} personen`, factor: site.busFactor },
];

export const arrow = (cls = 'btn__arrow') => `<span class="${cls}">${icon('arrow', { sw: 2.4 })}</span>`;
export const tick = () => icon('check', { size: 18, sw: 2.4 });

export function secHead({ eyebrow, title, lead, side, h = 'h2', id }) {
  return `<div class="sec__head"><div>${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}<${h} class="h2"${id ? ` id="${id}"` : ''}>${title}</${h}></div>${
    lead ? `<p class="lead">${lead}</p>` : ''
  }${side || ''}</div>`;
}

/* ---------- breadcrumbs ---------- */
export function crumbs(items, { link }) {
  const li = items
    .map((c, i) =>
      i === items.length - 1 ? `<li><span aria-current="page">${esc(c.name)}</span></li>` : `<li><a href="${link(c.path)}">${esc(c.name)}</a></li>`,
    )
    .join('');
  return `<nav class="crumbs" aria-label="Kruimelpad"><ol>${li}</ol></nav>`;
}
export function crumbsLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: site.origin + c.path })),
  };
}

/* ---------- fare widget (works without JS: submits to /boeken/) ---------- */
export function fareWidget({ ids, selected, title = 'Waar wil je heen?', link, idp = 'fw' }) {
  const list = ids.map((id) => routes[id]).filter(Boolean);
  const sel = routes[selected] || list[0];
  const chips = list
    .map(
      (r) => `<label class="chip"><input type="radio" name="naar" value="${r.id}"${r.id === sel.id ? ' checked' : ''} data-name="${esc(
        r.name,
      )}" data-price="${r.price ?? ''}" data-from="${r.from ? 1 : ''}" data-meta="${esc(metaLabel(r))}"><span>${esc(r.name)}</span></label>`,
    )
    .join('');
  const vehs = VEHICLES.map(
    (v, i) => `<label class="opt"><input type="radio" name="auto" value="${v.id}"${i === 0 ? ' checked' : ''} data-factor="${v.factor}"><span><b>${v.name}</b><small>${v.sub}</small></span></label>`,
  ).join('');
  const p = priceLabel(sel);
  return `<form class="card" action="${link('/boeken/')}" method="get" data-fare aria-labelledby="${idp}-t">
  <div class="card__top">
    <h2 class="card__title" id="${idp}-t">${title}</h2>
    <fieldset class="seg"><legend class="sr-only">Wanneer</legend>
      <label><input type="radio" name="wanneer" value="nu" checked><span>Nu</span></label>
      <label><input type="radio" name="wanneer" value="later"><span>Later</span></label>
    </fieldset>
  </div>
  <div class="legs">
    <label class="leg" for="${idp}-van"><span class="leg__dot"></span><span class="leg__body"><span class="leg__lbl">VAN</span><input id="${idp}-van" name="van" type="text" autocomplete="street-address" placeholder="Ophaaladres, bijv. Oudegracht 1"></span></label>
    <div class="leg"><span class="leg__sq"></span><span class="leg__body"><span class="leg__lbl">NAAR</span><output data-out="name" for="${idp}-naar">${esc(sel.name)}</output></span><span class="leg__meta" data-out="meta">${esc(metaLabel(sel))}</span></div>
  </div>
  <fieldset class="chips" id="${idp}-naar"><legend class="sr-only">Bestemming</legend>${chips}</fieldset>
  <fieldset class="opts"><legend class="sr-only">Auto</legend>${vehs}</fieldset>
  <div class="quote">
    <div class="quote__l"><span class="quote__note" data-out="note">${p ? 'Vaste prijs · incl. btw · per rit' : 'Je hoort de vaste prijs vóór je boekt'}</span><output class="quote__price${
      p ? '' : ' quote__price--ask'
    }" data-out="price" aria-live="polite">${p || 'Prijs op aanvraag'}</output></div>
    <button class="btn btn--primary btn--lg" type="submit">Boek deze rit ${arrow()}</button>
  </div>
  <p class="small muted">Liever bellen? <a href="${telHref}"><strong>${esc(site.phone)}</strong></a> — ook midden in de nacht.</p>
</form>`;
}

/* ---------- departure board ---------- */
export function board(ids, { link, light = false, bus = false, caption }) {
  const rows = ids
    .map((id) => routes[id])
    .filter(Boolean)
    .map((r) => {
      const p = priceLabel(r);
      const meta = metaLabel(r);
      const air = r.group === 'luchthaven' ? icon('plane', { size: 18, label: 'Luchthaven' }) : '';
      return `<tr>
  <th scope="row"><span class="board__name">${esc(r.name)}${air}</span>${meta || (bus && p) ? `<span class="board__sub">${esc([meta, bus && p ? `Taxibus ${priceLabel(r, { bus: true })}` : ''].filter(Boolean).join(' · '))}</span>` : ''}</th>
  <td class="board__m c-km">${kmLabel(r) || '—'}</td>
  <td class="board__m c-min">${minLabel(r) || '—'}</td>
  <td>${p ? `<span class="board__p">${p}</span>` : '<span class="board__p board__p--ask">Op aanvraag</span>'}</td>
  ${bus ? `<td class="c-bus">${p ? `<span class="board__p board__p--bus">${priceLabel(r, { bus: true })}</span>` : '<span class="board__p board__p--ask">—</span>'}</td>` : ''}
  <td class="board__go"><a href="${link('/boeken/')}?naar=${r.id}" aria-label="${esc(r.name)} boeken"><span class="board__go-t">Boeken</span>${icon('arrow', { size: 18 })}</a></td>
</tr>`;
    })
    .join('');
  return `<div class="board-wrap${light ? ' board-wrap--light' : ''}"><table class="board${light ? ' board--light' : ''}">
${caption ? `<caption class="sr-only">${esc(caption)}</caption>` : ''}
<thead><tr><th scope="col">Bestemming</th><th scope="col" class="c-km">Afstand</th><th scope="col" class="c-min">Reistijd</th><th scope="col">${bus ? 'Standaard · EV' : 'Vaste prijs'}</th>${
    bus ? '<th scope="col" class="c-bus">Taxibus</th>' : ''
  }<th scope="col"><span class="sr-only">Boeken</span></th></tr></thead>
<tbody>${rows}</tbody></table></div>`;
}

/* ---------- faq ---------- */
export function faq(items) {
  return `<div class="faq">${items
    .map((q) => `<details><summary>${esc(q.q)}${icon('chev', { sw: 2.2 })}</summary><div class="faq__a"><p>${q.a}</p></div></details>`)
    .join('')}</div>`;
}
export function faqLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a.replace(/<[^>]+>/g, '') } })),
  };
}

const schiphol = routes.schiphol;
export const FAQ = {
  speed: { q: 'Hoe snel is de taxi er?', a: `In Utrecht en directe omgeving meestal binnen ${site.pickupMinutes} minuten. Vooruit reserveren kan ook, voor elk tijdstip.` },
  night: { q: 'Betaal ik ’s nachts meer?', a: 'Nee. Onze vaste prijzen gelden 24 uur per dag, 7 dagen per week. Geen nachttoeslag en geen piektarief.' },
  traffic: { q: 'Wat als we in de file staan?', a: 'Dan betaal je de afgesproken prijs. Er komt geen toeslag bij voor files, omleidingen of wachten bij verkeerslichten.' },
  pay: { q: 'Hoe kan ik betalen?', a: 'Met pin, creditcard of contant in de taxi. Zakelijke klanten kunnen op maandfactuur betalen.' },
  airports: {
    q: 'Naar welke luchthavens rijden jullie?',
    a: 'Schiphol, Eindhoven Airport, Rotterdam The Hague Airport, Maastricht Aachen Airport, Düsseldorf Airport en Brussels Airport Zaventem, altijd tegen een vaste prijs die je vooraf weet.',
  },
  bus: { q: 'Wat kost een taxibus?', a: `Een taxibus voor ${site.busPassengers} personen kost ca. ${Math.round((site.busFactor - 1) * 100)}% meer dan een standaardrit. Je betaalt per rit, niet per persoon.` },
  ev: { q: 'Is een elektrische taxi duurder?', a: 'Nee. Een rit in een Tesla Model 3 of Model Y kost hetzelfde als in een standaardauto.' },
  book: { q: 'Hoe bestel ik een taxi?', a: `Bel <a href="${telHref}">${esc(site.phone)}</a>, boek online${waHref ? ' of stuur een WhatsApp-bericht' : ''}. Je hoort of ziet de vaste prijs voordat je bevestigt.` },
  reserve: { q: 'Kan ik vooruit reserveren?', a: 'Ja. Geef bij het boeken de datum en ophaaltijd door. Voor een vroege vlucht raden we aan de avond ervoor te boeken.' },
  business: { q: 'Kan ik zakelijk op rekening rijden?', a: 'Ja. Met een zakelijk account boeken meerdere collega’s op rekening van het bedrijf en ontvang je één factuur per maand.' },
  schiphol: {
    q: 'Wat kost een taxi van Utrecht naar Schiphol?',
    a: schiphol.price ? `${money(schiphol.price)} vast, inclusief btw, voor 1–4 personen. Met de taxibus (${site.busPassengers} personen) ca. ${money(busPrice(schiphol.price))} per rit.` : 'Je hoort de vaste prijs voordat je boekt.',
  },
};

/* ---------- blocks ---------- */
export function channels({ link }) {
  return `<div class="channels">
  <div class="channel"><span class="eyebrow">Bellen</span><h3 class="h3">Direct iemand aan de lijn</h3><p>Dag en nacht bereikbaar. Je hoort meteen de vaste prijs voor je route.</p><a class="channel__big" href="${telHref}">${esc(site.phone)}</a></div>
  <div class="channel"><span class="eyebrow">Online</span><h3 class="h3">Boek in een paar stappen</h3><p>Adres, tijd en auto kiezen. Je ziet de prijs voordat je je aanvraag verstuurt.</p><a class="link-arrow" href="${link('/boeken/')}">Rit plannen ${icon('arrow', { size: 18 })}</a></div>
  ${
    waHref
      ? `<div class="channel"><span class="eyebrow">WhatsApp</span><h3 class="h3">Stuur je adres</h3><p>Deel je ophaaladres en bestemming. Je krijgt de prijs en de ophaaltijd terug.</p><a class="link-arrow" href="${waHref}">Open WhatsApp ${icon('arrow', { size: 18 })}</a></div>`
      : `<div class="channel"><span class="eyebrow">Zakelijk</span><h3 class="h3">Rijden op rekening</h3><p>Eén account voor je team en één factuur per maand.</p><a class="link-arrow" href="${link('/zakelijk/')}">Zakelijk account ${icon('arrow', { size: 18 })}</a></div>`
  }
</div>`;
}

export function fleet({ link, headless = false } = {}) {
  return `<div class="fleet">
  <article class="vehicle">${vehicleArt.sedan}<div class="vehicle__head"><h3 class="h3">Standaard</h3><span class="vehicle__cap">1–4 PERS.</span></div><p>Comfortabele sedan met ruimte voor koffers. Het basistarief van alle vaste prijzen.</p></article>
  <article class="vehicle vehicle--featured">${vehicleArt.ev}<div class="vehicle__head"><h3 class="h3">Elektrisch</h3><span class="vehicle__cap">1–4 PERS.</span></div><span class="pill">Zelfde prijs</span><p>Tesla Model 3 of Model Y. Stil, zonder uitstoot en ruim 400 km bereik, dus ook naar Schiphol en terug.</p>${
    headless ? '' : `<a class="link-arrow" href="${link('/elektrische-taxi/')}">Over elektrisch rijden ${icon('arrow', { size: 18 })}</a>`
  }</article>
  <article class="vehicle">${vehicleArt.bus}<div class="vehicle__head"><h3 class="h3">Taxibus</h3><span class="vehicle__cap">${site.busPassengers.replace('–', '–')} PERS.</span></div><p>Tot 8 personen inclusief bagage. Ca. ${Math.round(
    (site.busFactor - 1) * 100,
  )}% boven het standaardtarief, per rit en niet per persoon.</p>${headless ? '' : `<a class="link-arrow" href="${link('/taxibus/')}">Taxibus boeken ${icon('arrow', { size: 18 })}</a>`}</article>
</div>`;
}

export function airportList({ link, exclude } = {}) {
  return `<ul class="linklist">${airports
    .filter((a) => a.slug !== exclude)
    .map((a) => {
      const r = routes[a.route];
      const p = priceLabel(r);
      return `<li><a href="${link(`/luchthavens/${a.slug}/`)}"><span class="linklist__t"><b>${esc(a.name)}</b><small>${esc([r.code, minLabel(r)].filter(Boolean).join(' · '))}</small></span>${
        p ? `<span class="linklist__p">${p}</span>` : '<span class="linklist__p linklist__p--ask">Prijs op aanvraag</span>'
      }</a></li>`;
    })
    .join('')}</ul>`;
}

export function bizBand({ link }) {
  return `<div class="band--signal split" style="align-items:center">
  <div class="stack"><span class="eyebrow">Zakelijk</span><h2 class="h2">Eén factuur per maand. Geen bonnetjes meer.</h2><div><a class="btn btn--ink" href="${link('/zakelijk/')}">Zakelijk account aanvragen ${arrow()}</a></div></div>
  <ul class="checks">
    <li>${icon('check', { size: 24, sw: 2.4 })}<span><b>Maandelijkse verzamelfactuur</b>Je medewerkers schieten niets voor.</span></li>
    <li>${icon('check', { size: 24, sw: 2.4 })}<span><b>Meerdere boekers</b>Collega’s boeken op rekening van het bedrijf.</span></li>
    <li>${icon('check', { size: 24, sw: 2.4 })}<span><b>Vaste contactpersoon</b>Eén aanspreekpunt voor al je vervoer.</span></li>
  </ul>
</div>`;
}

export function proof() {
  const a = site.address;
  const items = [];
  if (site.reviews) {
    items.push(`<div><span class="proof__score num">${esc(String(site.reviews.score).replace('.', ','))} / 5</span><span>${esc(site.reviews.count)} beoordelingen op ${esc(site.reviews.source)}${
      site.reviews.url ? ` · <a href="${esc(site.reviews.url)}">lees ze</a>` : ''
    }</span></div>`);
  }
  items.push(`<div><b>Gevestigd in ${esc(a.city)}</b><span>${esc(a.street)}, ${esc(a.postalCode)} ${esc(a.city)}${site.kvk ? ` · KVK ${esc(site.kvk)}` : ''}</span></div>`);
  items.push(`<div><b>Dag en nacht</b><span>24/7 bereikbaar, zonder nachttoeslag</span></div>`);
  items.push(`<div><b>Betalen zoals je wilt</b><span>Pin, creditcard of contant in de taxi</span></div>`);
  return `<div class="proof">${items.join('')}</div>`;
}

export function townsGrid({ link, exclude = [] }) {
  return `<nav class="towns" aria-label="Werkgebied">${places
    .filter((p) => !exclude.includes(p.slug))
    .map((p) => `<a href="${link(`/werkgebied/${p.slug}/`)}">${esc(p.name)}${icon('arrow', { size: 18 })}</a>`)
    .join('')}</nav>`;
}

export function rules() {
  const r = [
    ['Inclusief btw.', 'Geen kosten achteraf.'],
    ['Geen nachttoeslag.', 'Hetzelfde tarief, dag en nacht.'],
    ['Geen file-toeslag.', 'Ook niet bij omleiding of verkeerslichten.'],
    ['Per rit,', 'niet per persoon.'],
  ];
  return `<ul class="rules">${r.map(([b, t]) => `<li>${icon('check', { size: 22, sw: 2.4 })}<span><strong>${b}</strong> ${t}</span></li>`).join('')}</ul>`;
}

export function cta({ link, title = 'Waar mogen we je naartoe brengen?' }) {
  return `<section class="sec sec--ink"><div class="wrap cta"><h2 class="display">${title}</h2><div class="row">
  <a class="btn btn--signal btn--lg" href="${link('/boeken/')}">Rit plannen</a>
  <a class="btn btn--ghost-ink btn--lg" href="${telHref}">Bel ${esc(site.phone)}</a>
</div></div></section>`;
}

/* ---------- structured data ---------- */
export function businessLd() {
  const a = site.address;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${site.origin}/#bedrijf`,
    name: site.name,
    url: `${site.origin}/`,
    telephone: site.phoneE164,
    email: site.email,
    address: { '@type': 'PostalAddress', streetAddress: a.street, postalCode: a.postalCode, addressLocality: a.city, addressCountry: 'NL' },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
    ],
    areaServed: places.map((p) => ({ '@type': 'City', name: p.name })),
    paymentAccepted: 'Cash, Debit Card, Credit Card, Invoice',
    currenciesAccepted: 'EUR',
    ...(site.kvk ? { taxID: site.kvk } : {}),
    ...(site.reviews
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: site.reviews.score, reviewCount: site.reviews.count } }
      : {}),
  };
}

export function serviceLd(r, name, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name,
    url: site.origin + path,
    provider: { '@id': `${site.origin}/#bedrijf` },
    areaServed: 'Utrecht en omgeving',
    ...(r && r.price != null
      ? {
          offers: {
            '@type': 'Offer',
            price: r.price,
            priceCurrency: 'EUR',
            priceSpecification: { '@type': 'PriceSpecification', price: r.price, priceCurrency: 'EUR', valueAddedTaxIncluded: true, ...(r.from ? { minPrice: r.price } : {}) },
          },
        }
      : {}),
  };
}

export { placeBySlug, NB };

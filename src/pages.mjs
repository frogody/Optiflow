import {
  site, routes, places, airports, placeBySlug, esc, icon, money, busPrice, priceLabel, kmLabel, minLabel, metaLabel,
  telHref, waHref, mailHref, todo, vehicleArt, NB,
} from './lib.mjs';
import {
  VEHICLES, arrow, tick, secHead, crumbs, crumbsLd, fareWidget, board, faq, faqLd, FAQ, channels, fleet, airportList,
  bizBand, proof, townsGrid, rules, cta, businessLd, serviceLd,
} from './components.mjs';

const HOME = { name: 'Home', path: '/' };
const pct = Math.round((site.busFactor - 1) * 100);
const regio = places.map((p) => p.route).filter((id) => id !== 'utrecht');
const priced = (ids) => ids.filter((id) => routes[id] && routes[id].price != null);
const ticks = (items) => `<ul class="ticks">${items.map((t) => `<li>${tick()}${t}</li>`).join('')}</ul>`;

function inkHero({ ctx, trail, eyebrow, title, lead, extra = '', aside = '', grid = true }) {
  return `<section class="hero ${grid ? 'grid-bg' : 'sec--ink'}">
  <div class="wrap">${trail ? crumbs(trail, ctx) : ''}</div>
  <div class="wrap hero__in">
    <div class="hero__copy">${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}<h1 class="display">${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${extra}</div>
    ${aside}
  </div>
</section>`;
}

/* ================= HOME ================= */
function home(ctx) {
  const { link } = ctx;
  const body = `
<section class="hero grid-bg">
  <div class="wrap hero__in">
    <div class="hero__copy">
      <div class="tags"><span class="tag tag--signal">24/7 bereikbaar</span><span class="tag">Geen nachttoeslag</span><span class="tag">Prijs vooraf</span></div>
      <h1 class="display">Je taxi in Utrecht. De prijs weet je vooraf.</h1>
      <p class="lead">Binnen Utrecht en directe omgeving staat je taxi meestal binnen ${site.pickupMinutes} minuten voor de deur. Geen meter en geen piektarief: de prijs die je ziet, betaal je.</p>
      ${ticks(['Pin, creditcard of contant', 'Tesla voor hetzelfde tarief', 'Taxibus tot 8 personen'])}
    </div>
    ${fareWidget({ ids: ['schiphol', 'nieuwegein', 'leidsche-rijn', 'groenekan', 'odijk'], selected: 'schiphol', link })}
  </div>
</section>

<section class="sec sec--line"><div class="wrap">${channels(ctx)}</div></section>

<section class="sec sec--ink"><div class="wrap">
  ${secHead({ eyebrow: 'Vertrek vanaf Utrecht Centraal', title: 'Populaire ritten, vaste prijs', side: `<a class="link-arrow" href="${link('/tarieven/')}">Alle tarieven ${icon('arrow', { size: 18 })}</a>` })}
  ${board(['schiphol', 'nieuwegein', 'odijk', 'groenekan', 'leidsche-rijn', 'eindhoven'], { link, caption: 'Populaire ritten met vaste prijs' })}
  <p class="small" style="color:var(--on-ink-subtle);margin-top:18px">Prijzen inclusief btw, per rit, voor een standaardauto met 1–4 personen. Elektrisch: zelfde prijs. Taxibus: ca. ${pct}% hoger.</p>
</div></section>

<section class="sec"><div class="wrap">
  ${secHead({ eyebrow: 'Ons wagenpark', title: 'Kies je auto. De prijs blijft eerlijk.' })}
  ${fleet(ctx)}
</div></section>

<section class="sec sec--mist"><div class="wrap split">
  <div class="stack"><span class="eyebrow">Luchthavenvervoer</span><h2 class="h2">Op tijd voor je vlucht, zonder verrassingen achteraf</h2>
  <p class="lead">File op de A2 of een omleiding? Je betaalt de afgesproken prijs. Ook om 04:00 uur, zonder nachttoeslag.</p>
  <div><a class="btn btn--primary" href="${link('/luchthavens/schiphol/')}">Taxi naar Schiphol${routes.schiphol.price ? ` — ${money(routes.schiphol.price)}` : ''} ${arrow()}</a></div></div>
  ${airportList(ctx)}
</div></section>

<section class="sec"><div class="wrap">${bizBand(ctx)}</div></section>

<section class="sec sec--tight sec--line" style="border-top:1px solid var(--line)"><div class="wrap">${proof()}</div></section>

<section class="sec"><div class="wrap">
  ${secHead({ eyebrow: 'Werkgebied', title: 'Utrecht en de hele regio', lead: 'Ophalen in de stad én in de dorpen eromheen. Kies je plaats voor lokale ritten en prijzen.' })}
  ${townsGrid(ctx)}
</div></section>

<section class="sec sec--mist"><div class="wrap split">
  <div class="stack"><span class="eyebrow">Veelgestelde vragen</span><h2 class="h2">Kort en duidelijk</h2><a class="link-arrow" href="${link('/veelgestelde-vragen/')}">Alle vragen ${icon('arrow', { size: 18 })}</a></div>
  ${faq([FAQ.speed, FAQ.night, FAQ.traffic, FAQ.pay, FAQ.airports, FAQ.bus])}
</div></section>

${cta(ctx)}`;
  return {
    path: '/',
    title: `Taxi Utrecht met vaste prijs, 24/7 | ${site.name}`,
    description: `Taxi bestellen in Utrecht met een vaste prijs vooraf. 24/7, geen nachttoeslag, naar Schiphol voor ${money(routes.schiphol.price)}. Bel ${site.phone} of boek online.`,
    body,
    jsonld: [businessLd(), faqLd([FAQ.speed, FAQ.night, FAQ.traffic, FAQ.pay, FAQ.airports, FAQ.bus])],
  };
}

/* ================= TARIEVEN ================= */
function tarieven(ctx) {
  const { link } = ctx;
  const trail = [HOME, { name: 'Tarieven', path: '/tarieven/' }];
  const group = (title, sub, ids) => `<div class="stack" style="gap:16px">
    <div class="sec__head" style="margin-bottom:0"><div><h2 class="h3" style="font-size:clamp(26px,3vw,36px)">${title}</h2></div><span class="eyebrow">${sub}</span></div>
    ${board(ids, { link, light: true, bus: true, caption: title })}
  </div>`;
  const body = `${inkHero({
    ctx,
    trail,
    eyebrow: 'Tarieven · geldig 24/7',
    title: 'Vaste prijzen. Altijd vooraf.',
    lead: 'De prijs hangt af van de afstand tussen ophaal- en bestemmingsadres. Niet van het tijdstip, het verkeer of de drukte.',
    aside: `<div class="card"><h2 class="card__title">Prijs voor jouw adres</h2><p class="muted">Staat je adres er niet bij? Kies je route in de boekingsmodule of bel ons: je hoort de vaste prijs vóór je boekt.</p><div class="row"><a class="btn btn--primary" href="${link(
      '/boeken/',
    )}">Rit plannen ${arrow()}</a><a class="btn btn--ghost" href="${telHref}">Bel ${esc(site.phone)}</a></div></div>`,
  })}
<section class="sec sec--tight sec--line"><div class="wrap">${rules()}</div></section>
<section class="sec"><div class="wrap stack" style="gap:56px">
  ${group('Binnen Utrecht', `Ophalen meestal binnen ${site.pickupMinutes} min`, ['utrecht', 'leidsche-rijn'])}
  ${group('Regio', 'Van en naar Utrecht Centraal', regio.filter((id) => id !== 'leidsche-rijn'))}
  ${group('Luchthavens', 'Ook om 04:00 · geen nachttoeslag', airports.map((a) => a.route))}
  <p class="muted" style="max-width:62ch">Prijzen van en naar Utrecht Centraal, voor een standaardauto of Tesla met 1–4 personen. Taxibus (${site.busPassengers} personen): ca. ${pct}% boven het standaardtarief. Staat er “op aanvraag”? Dan hoor je de vaste prijs bij het boeken, voordat je bevestigt.</p>
</div></section>
<section class="sec sec--mist"><div class="wrap cta"><div class="stack"><h2 class="h2">Zakelijk vaak onderweg?</h2><p class="lead">Dezelfde vaste prijzen, op één maandfactuur.</p></div><a class="btn btn--primary btn--lg" href="${link('/zakelijk/')}">Zakelijk account ${arrow()}</a></div></section>
${cta(ctx)}`;
  const offers = priced(Object.keys(routes)).map((id) => ({ '@type': 'Offer', name: `Taxi Utrecht – ${routes[id].name}`, price: routes[id].price, priceCurrency: 'EUR' }));
  return {
    path: '/tarieven/',
    nav: 'tarieven',
    title: 'Taxi tarieven Utrecht',
    description: `Vaste taxiprijzen van en naar Utrecht, inclusief btw. Schiphol ${money(routes.schiphol.price)}, Nieuwegein ${money(routes.nieuwegein.price)}. Geen nachttoeslag en geen file-toeslag.`,
    body,
    jsonld: [crumbsLd(trail), { '@context': 'https://schema.org', '@type': 'OfferCatalog', name: 'Taxitarieven Utrecht', itemListElement: offers }],
  };
}

/* ================= LUCHTHAVENS ================= */
function luchthavens(ctx) {
  const { link } = ctx;
  const trail = [HOME, { name: 'Luchthavens', path: '/luchthavens/' }];
  const body = `${inkHero({
    ctx,
    trail,
    eyebrow: 'Luchthavenvervoer',
    title: 'Naar elke luchthaven, voor een vaste prijs',
    lead: 'Van je voordeur in Utrecht en omgeving naar de vertrekhal. Je weet vooraf wat je betaalt, ook bij file of een omleiding.',
    extra: ticks(['24/7, ook voor de vroege vlucht', 'Geen nachttoeslag', 'Taxibus voor groepen']),
  })}
<section class="sec"><div class="wrap split">
  <div class="stack"><h2 class="h2">Kies je luchthaven</h2><p class="lead">Schiphol rijden we het vaakst. Voor de andere luchthavens hoor je de vaste prijs bij het boeken, vóór je bevestigt.</p></div>
  ${airportList(ctx)}
</div></section>
<section class="sec sec--mist"><div class="wrap">
  ${secHead({ title: 'Zo werkt het' })}
  ${steps()}
</div></section>
<section class="sec"><div class="wrap split">
  <h2 class="h2">Vragen over luchthavenvervoer</h2>
  ${faq([FAQ.schiphol, FAQ.night, FAQ.traffic, FAQ.reserve, FAQ.bus])}
</div></section>
${cta(ctx)}`;
  return {
    path: '/luchthavens/',
    nav: 'luchthavens',
    title: 'Taxi naar Schiphol en andere luchthavens',
    description: 'Taxi vanuit Utrecht naar Schiphol, Eindhoven, Rotterdam The Hague, Düsseldorf, Brussel en Maastricht Aachen. Vaste prijs vooraf, 24/7.',
    body,
    jsonld: [crumbsLd(trail)],
  };
}

function steps() {
  return `<ol class="steps">
  <li class="step"><span class="step__n">01</span><h3 class="h3">Boek en zie je prijs</h3><p>Online, telefonisch${waHref ? ' of via WhatsApp' : ''}. Betalen doe je pas in de taxi.</p></li>
  <li class="step"><span class="step__n">02</span><h3 class="h3">Bevestiging van je rit</h3><p>Met ophaaltijd en vaste prijs, zodat je weet waar je aan toe bent.</p></li>
  <li class="step"><span class="step__n">03</span><h3 class="h3">Op tijd voor de deur</h3><p>Je chauffeur staat op de afgesproken tijd klaar. Jij stapt in, wij rijden.</p></li>
</ol>`;
}

function airportCard(r, a, { link }) {
  const p = priceLabel(r);
  const vehs = VEHICLES.map(
    (v, i) =>
      `<label class="opt"><input type="radio" name="auto" value="${v.id}"${i === 0 ? ' checked' : ''} data-factor="${v.factor}"><span><b>${v.name}</b><small>${
        r.price != null ? (v.factor > 1 ? `ca. ${money(busPrice(r.price))}` : money(r.price)) : v.sub
      }</small></span></label>`,
  ).join('');
  return `<form class="card" action="${link('/boeken/')}" method="get" data-fare aria-labelledby="ac-t">
  <h2 class="card__title" id="ac-t">Plan je rit naar ${esc(a.name)}</h2>
  <input type="hidden" name="naar" value="${r.id}" data-name="${esc(r.name)}" data-price="${r.price ?? ''}" data-meta="${esc(metaLabel(r))}">
  <label class="field" for="ac-van">Ophaaladres<input class="input" id="ac-van" name="van" type="text" autocomplete="street-address" placeholder="Straat en huisnummer, plaats"></label>
  <div class="fields">
    <label class="field" for="ac-datum">Datum<input class="input" id="ac-datum" name="datum" type="date"></label>
    <label class="field" for="ac-tijd">Ophaaltijd<input class="input" id="ac-tijd" name="tijd" type="time"></label>
  </div>
  <input type="hidden" name="wanneer" value="later">
  <fieldset class="opts"><legend class="sr-only">Auto</legend>${vehs}</fieldset>
  <div class="quote">
    <div class="quote__l"><span class="quote__note" data-out="note">${p ? 'Vaste prijs · incl. btw · per rit' : 'Je hoort de vaste prijs vóór je boekt'}</span><output class="quote__price${p ? '' : ' quote__price--ask'}" data-out="price" aria-live="polite">${
    p || 'Prijs op aanvraag'
  }</output></div>
    <button class="btn btn--primary btn--lg" type="submit">${p ? 'Boek deze rit' : 'Vraag je prijs'} ${arrow()}</button>
  </div>
</form>`;
}

function airportPage(a) {
  return (ctx) => {
    const { link } = ctx;
    const r = routes[a.route];
    const p = priceLabel(r);
    const path = `/luchthavens/${a.slug}/`;
    const trail = [HOME, { name: 'Luchthavens', path: '/luchthavens/' }, { name: a.name, path }];
    const facts = [
      kmLabel(r) ? ['Afstand', kmLabel(r)] : null,
      minLabel(r) ? ['Reistijd', minLabel(r)] : null,
      ['Rijdt', '24/7'],
      ['Nachttoeslag', 'Geen'],
    ].filter(Boolean);
    const qa = [
      p
        ? { q: `Wat kost een taxi van Utrecht naar ${a.name}?`, a: `${money(r.price)} vast, inclusief btw, voor 1–4 personen. Met de taxibus (${site.busPassengers} personen) ca. ${money(busPrice(r.price))} per rit.` }
        : { q: `Wat kost een taxi van Utrecht naar ${a.name}?`, a: `Je krijgt een vaste prijs voor je ophaaladres voordat je boekt. Bel <a href="${telHref}">${esc(site.phone)}</a> of plan je rit online.` },
      r.min ? { q: 'Hoe lang duurt de rit?', a: `Ongeveer ${r.min} minuten${r.km ? ` voor ${r.km} km` : ''}, afhankelijk van het verkeer. De prijs verandert daardoor niet.` } : null,
      { q: 'Kan ik midden in de nacht vertrekken?', a: 'Ja. We rijden 24/7 en rekenen geen nachttoeslag.' },
      { q: `Kan ik ook vanaf ${a.name} worden opgehaald?`, a: 'Ja. Geef bij het boeken je vluchtnummer en de aankomsttijd door.' },
      FAQ.bus,
    ].filter(Boolean);
    const body = `<section class="hero grid-bg">
  <div class="wrap">${crumbs(trail, ctx)}</div>
  <div class="wrap" style="padding-top:28px"><div class="route-strip" aria-hidden="true"><span>Utrecht</span><span class="route-strip__a"></span><span class="route-strip__line"></span>${icon('plane')}<span class="route-strip__b">${esc(r.code || a.name)}</span></div></div>
  <div class="wrap hero__in" style="padding-top:40px">
    <div class="hero__copy">
      <h1 class="display">${esc(a.title)}</h1>
      <div class="bigprice">${p ? `<span class="bigprice__v">${p}</span><span class="bigprice__note">vaste prijs, incl. btw</span>` : `<span class="bigprice__v bigprice__v--ask">Vaste prijs op aanvraag</span>`}</div>
      <p class="lead">${esc(a.intro)}</p>
      <dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    </div>
    ${airportCard(r, a, ctx)}
  </div>
</section>
<section class="sec"><div class="wrap split">
  <div class="stack"><span class="eyebrow">Wat je krijgt</span><h2 class="h2">${p ? `Voor ${p}. Niet meer, ook niet in de file.` : 'Een vaste prijs. Ook in de file.'}</h2></div>
  <ul class="checks">
    <li>${icon('check', { size: 24, sw: 2.4 })}<span><b>Van je voordeur tot de vertrekhal</b>Prijs vooraf bevestigd, welke route het verkeer ook vraagt.</span></li>
    <li>${icon('check', { size: 24, sw: 2.4 })}<span><b>Ook voor de vroege vlucht</b>Om 04:00 betaal je hetzelfde als om 14:00.</span></li>
    <li>${icon('check', { size: 24, sw: 2.4 })}<span><b>Tesla zonder meerprijs</b>Model 3 of Model Y, ruim 400 km bereik.</span></li>
    <li>${icon('check', { size: 24, sw: 2.4 })}<span><b>Met z’n allen? Taxibus</b>Tot 8 personen inclusief bagage${r.price != null ? `, ca. ${money(busPrice(r.price))} per rit` : ''}.</span></li>
  </ul>
</div></section>
<section class="sec sec--mist"><div class="wrap">${secHead({ title: 'Zo werkt het' })}${steps()}</div></section>
<section class="sec"><div class="wrap split"><h2 class="h2">Vragen over je rit naar ${esc(a.name)}</h2>${faq(qa)}</div></section>
<section class="sec sec--ink"><div class="wrap split">
  <div class="stack"><span class="eyebrow">Andere luchthavens</span><h2 class="h2">Ook naar</h2></div>
  ${airportList({ ...ctx, exclude: a.slug })}
</div></section>
${cta(ctx)}`;
    return {
      path,
      nav: 'luchthavens',
      title: a.title,
      description: p
        ? `${a.title} voor ${money(r.price)} vast, inclusief btw. ${minLabel(r) ? `${minLabel(r)}, ` : ''}24/7 en zonder nachttoeslag. Boek online of bel ${site.phone}.`
        : `${a.title} tegen een vaste prijs die je vooraf weet. 24/7 en zonder nachttoeslag. Boek online of bel ${site.phone}.`,
      body,
      jsonld: [crumbsLd(trail), serviceLd(r, a.title, path), faqLd(qa)],
    };
  };
}

/* ================= WERKGEBIED ================= */
function werkgebied(ctx) {
  const { link } = ctx;
  const trail = [HOME, { name: 'Werkgebied', path: '/werkgebied/' }];
  const body = `${inkHero({
    ctx,
    trail,
    eyebrow: 'Werkgebied',
    title: 'Utrecht en de hele regio',
    lead: 'We halen je op in de stad en in de dorpen eromheen, dag en nacht. Kies je plaats voor lokale ritten en prijzen.',
  })}
<section class="sec"><div class="wrap">${townsGrid(ctx)}</div></section>
<section class="sec sec--ink"><div class="wrap">
  ${secHead({ eyebrow: 'Van en naar Utrecht Centraal', title: 'Vaste prijzen in de regio', side: `<a class="link-arrow" href="${link('/tarieven/')}">Alle tarieven ${icon('arrow', { size: 18 })}</a>` })}
  ${board(['utrecht', ...regio], { link, caption: 'Vaste prijzen in de regio' })}
</div></section>
${cta(ctx)}`;
  return {
    path: '/werkgebied/',
    nav: 'werkgebied',
    title: 'Werkgebied: taxi in Utrecht en omgeving',
    description: 'Taxi in Utrecht, Leidsche Rijn, Nieuwegein, De Bilt, Zeist, Houten, Bunnik, IJsselstein, Maarssen, Vianen, Odijk en Groenekan. Vaste prijs vooraf.',
    body,
    jsonld: [crumbsLd(trail)],
  };
}

function placePage(pl) {
  return (ctx) => {
    const { link } = ctx;
    const r = routes[pl.route];
    const p = priceLabel(r);
    const path = `/werkgebied/${pl.slug}/`;
    const trail = [HOME, { name: 'Werkgebied', path: '/werkgebied/' }, { name: pl.name, path }];
    const isCity = pl.slug === 'utrecht';
    const routeCard = `<div class="card">
  <span class="eyebrow">${isCity ? 'Binnen de stad' : `${esc(pl.name)} ↔ Utrecht Centraal`}</span>
  <div class="quote" style="border-top:0;padding-top:0">
    <div class="quote__l"><span class="quote__note">${p ? 'Vaste prijs · incl. btw · per rit' : 'Je hoort de vaste prijs vóór je boekt'}</span><span class="quote__price${p ? '' : ' quote__price--ask'}">${p || 'Prijs op aanvraag'}</span></div>
    ${metaLabel(r) ? `<span class="leg__meta">${esc(metaLabel(r))}</span>` : ''}
  </div>
  ${p ? `<p class="small muted">Taxibus (${site.busPassengers} personen): ${priceLabel(r, { bus: true })}</p>` : ''}
  <div class="row"><a class="btn btn--primary" href="${link('/boeken/')}?naar=${r.id}">Taxi in ${esc(pl.name)} boeken ${arrow()}</a><a class="btn btn--ghost" href="${telHref}">Bel ${esc(site.phone)}</a></div>
</div>`;
    const qa = [
      p
        ? { q: isCity ? 'Wat kost een taxi binnen Utrecht?' : `Wat kost een taxi van ${pl.name} naar Utrecht Centraal?`, a: `${p} vast, inclusief btw, voor 1–4 personen. Ook ’s nachts en in de spits.` }
        : { q: `Wat kost een taxi in ${pl.name}?`, a: `Je krijgt een vaste prijs voor je adres voordat je boekt. Bel <a href="${telHref}">${esc(site.phone)}</a> of plan je rit online.` },
      { q: `Rijden jullie vanuit ${pl.name} naar Schiphol?`, a: 'Ja, tegen een vaste prijs die je hoort voordat je boekt. Boek vooruit voor een vroege vlucht.' },
      FAQ.speed,
      FAQ.pay,
    ];
    const body = `<section class="hero grid-bg">
  <div class="wrap">${crumbs(trail, ctx)}</div>
  <div class="wrap hero__in">
    <div class="hero__copy">
      <span class="eyebrow">Taxi</span>
      <h1 class="display">${esc(pl.name)}</h1>
      <p class="lead">${esc(pl.intro)}</p>
      ${ticks(['24/7 bereikbaar', 'Geen nachttoeslag', 'Pin, creditcard of contant'])}
    </div>
    ${routeCard}
  </div>
</section>
<section class="sec"><div class="wrap split">
  <div class="stack"><span class="eyebrow">In ${esc(pl.name)}</span><h2 class="h2">We kennen de weg</h2><p class="lead">${esc(pl.area)}</p>
    <h3 class="h3" style="margin-top:12px">${isCity ? 'Wijken' : 'Kernen en wijken'}</h3>
    <ul class="pills">${pl.districts.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
  </div>
  <div class="stack"><span class="eyebrow">Veelgevraagde adressen</span>
    <ul class="checks">${pl.spots.map((s) => `<li>${icon('pin', { size: 22 })}<span><b>${esc(s.name)}</b>${esc(s.note)}</span></li>`).join('')}</ul>
  </div>
</div></section>
<section class="sec sec--mist"><div class="wrap split"><h2 class="h2">Taxi ${esc(pl.name)}: vragen</h2>${faq(qa)}</div></section>
<section class="sec"><div class="wrap">
  ${secHead({ eyebrow: 'In de buurt', title: 'Ook in' })}
  <nav class="towns" aria-label="Plaatsen in de buurt">${pl.nearby
    .map((s) => placeBySlug[s])
    .filter(Boolean)
    .map((n) => `<a href="${link(`/werkgebied/${n.slug}/`)}">Taxi ${esc(n.name)}${icon('arrow', { size: 18 })}</a>`)
    .join('')}</nav>
</div></section>
${cta(ctx)}`;
    return {
      path,
      nav: 'werkgebied',
      title: `Taxi ${pl.name}`,
      description: `Taxi in ${pl.name} met een vaste prijs vooraf${p ? `: ${isCity ? 'binnen de stad' : 'naar Utrecht Centraal'} ${p}` : ''}. 24/7 en zonder nachttoeslag. Bel ${site.phone} of boek online.`,
      body,
      jsonld: [crumbsLd(trail), serviceLd(r, `Taxi ${pl.name}`, path), faqLd(qa)],
    };
  };
}

/* ================= DIENSTEN ================= */
function zakelijk(ctx) {
  const { link } = ctx;
  const trail = [HOME, { name: 'Zakelijk', path: '/zakelijk/' }];
  const body = `<section class="band--signal band--full">
  <div class="wrap">${crumbs(trail, ctx).replace('class="crumbs"', 'class="crumbs" style="color:var(--on-signal)"')}</div>
  <div class="wrap hero__in">
    <div class="hero__copy"><span class="eyebrow">Zakelijk vervoer Utrecht</span><h1 class="display">Zakelijk rijden zonder bonnetjes.</h1></div>
    <div class="stack"><p style="font-size:20px;max-width:30em">Eén account voor je hele team. Vaste prijzen, één maandfactuur en één contactpersoon die je vervoer regelt.</p>
    <div class="row"><a class="btn btn--ink btn--lg" href="#aanvraag">Account aanvragen ${arrow()}</a><a class="btn btn--lg" style="box-shadow:inset 0 0 0 2px var(--ink);color:var(--ink)" href="${telHref}">Bel ons</a></div></div>
  </div>
</section>
<section class="sec"><div class="wrap features">
  <div class="feature">${icon('invoice')}<h2 class="h3">Eén maandfactuur</h2><p>Alle ritten op één factuur. Je medewerkers hoeven niets voor te schieten.</p></div>
  <div class="feature">${icon('users')}<h2 class="h3">Meerdere boekers</h2><p>Geef collega’s of het secretariaat toestemming om op rekening van het bedrijf te boeken.</p></div>
  <div class="feature">${icon('phone')}<h2 class="h3">Vaste contactpersoon</h2><p>Eén aanspreekpunt voor terugkerende ritten, gasten en evenementen.</p></div>
  <div class="feature">${icon('bolt')}<h2 class="h3">Elektrisch, zelfde prijs</h2><p>Vaste prijzen gelden voor sedan, Tesla en taxibus.</p></div>
</div></section>
<section class="sec sec--ink"><div class="wrap">
  ${secHead({ title: 'In drie stappen op rekening' })}
  <ol class="steps">
    <li class="step"><span class="step__n">Stap 01</span><h3 class="h3">Vraag een account aan</h3><p>Met je bedrijfsgegevens en KVK-nummer.</p></li>
    <li class="step"><span class="step__n">Stap 02</span><h3 class="h3">Geef je boekers door</h3><p>Wie er mag boeken, en op welke afdeling of kostenplaats.</p></li>
    <li class="step"><span class="step__n">Stap 03</span><h3 class="h3">Rijden en één factuur</h3><p>Boek online of per telefoon. Aan het eind van de maand: één factuur.</p></li>
  </ol>
</div></section>
<section class="sec" id="aanvraag"><div class="wrap split">
  <div class="stack"><span class="eyebrow">Account aanvragen</span><h2 class="h2">Vertel ons wie je bent</h2><p class="lead">Liever eerst praten? Bel <a href="${telHref}"><strong>${esc(site.phone)}</strong></a> of mail <a href="${mailHref}"><strong>${esc(site.email)}</strong></a>.</p></div>
  ${mailForm({
    id: 'zakelijk',
    subject: 'Aanvraag zakelijk account',
    submit: 'Aanvraag versturen',
    fields: `<div class="fields">
      <label class="field" for="z-bedrijf">Bedrijfsnaam<input class="input" id="z-bedrijf" name="Bedrijfsnaam" autocomplete="organization" required></label>
      <label class="field" for="z-kvk">KVK-nummer<input class="input" id="z-kvk" name="KVK-nummer" inputmode="numeric" pattern="[0-9]{8}" title="8 cijfers"></label>
      <label class="field" for="z-naam">Contactpersoon<input class="input" id="z-naam" name="Contactpersoon" autocomplete="name" required></label>
      <label class="field" for="z-tel">Telefoon<input class="input" id="z-tel" name="Telefoon" type="tel" autocomplete="tel" required></label>
    </div>
    <label class="field" for="z-mail">Zakelijk e-mailadres<input class="input" id="z-mail" name="E-mail" type="email" autocomplete="email" required></label>
    <label class="field" for="z-ritten">Ritten per maand, ongeveer<select class="select" id="z-ritten" name="Ritten per maand"><option>Minder dan 10</option><option>10–50</option><option>Meer dan 50</option><option>Weet ik nog niet</option></select></label>
    <label class="field" for="z-msg">Waar kunnen we mee helpen? <span class="field__hint">optioneel</span><textarea class="textarea" id="z-msg" name="Bericht" rows="3" placeholder="bijv. vaste ritten naar Schiphol, gasten ophalen op Utrecht Centraal"></textarea></label>`,
    link,
  })}
</div></section>
${cta(ctx)}`;
  return {
    path: '/zakelijk/',
    nav: 'zakelijk',
    title: 'Zakelijk vervoer Utrecht',
    description: 'Zakelijke taxi in Utrecht op rekening: één maandfactuur, meerdere boekers en een vaste contactpersoon. Vaste prijzen voor sedan, Tesla en taxibus.',
    body,
    jsonld: [crumbsLd(trail)],
  };
}

export function mailForm({ id, subject, submit, fields, link }) {
  const action = site.bookingEndpoint || `${mailHref}?subject=${encodeURIComponent(subject)}`;
  return `<form class="bk__form" id="${id}" data-mailform data-subject="${esc(subject)}"${site.bookingEndpoint ? ` data-endpoint="${esc(site.bookingEndpoint)}"` : ''} action="${esc(action)}" method="post"${
    site.bookingEndpoint ? '' : ' enctype="text/plain"'
  }>
  <div class="stack" data-form-fields>
    ${fields}
    <button class="btn btn--primary btn--lg" type="submit">${submit}</button>
    <p class="small muted">We gebruiken je gegevens alleen om op je aanvraag te reageren. Zie onze <a href="${link('/privacy/')}">privacyverklaring</a>.</p>
    <p class="form-error" data-form-error hidden></p>
  </div>
  <div class="done" data-form-done hidden tabindex="-1">
    <span class="done__icon">${icon('check', { size: 30, sw: 2.6 })}</span>
    <h2 class="h3" data-done-title>Bijna klaar</h2>
    <p class="muted" data-done-text>Je e-mailprogramma opent met je bericht. Verstuur het daar, dan reageren we zo snel mogelijk.</p>
    <pre data-done-summary></pre>
    <div class="row"><a class="btn btn--primary" data-done-mail href="${mailHref}">Open e-mail opnieuw</a><a class="btn btn--ghost" href="${telHref}">Of bel ${esc(site.phone)}</a></div>
  </div>
</form>`;
}

function taxibus(ctx) {
  const { link } = ctx;
  const trail = [HOME, { name: 'Taxibus', path: '/taxibus/' }];
  const body = `${inkHero({
    ctx,
    trail,
    eyebrow: 'Taxibus & groepsvervoer',
    title: `Met z’n allen in één taxi`,
    lead: `Een taxibus voor ${site.busPassengers} personen, inclusief bagage. Je betaalt per rit, niet per persoon: ca. ${pct}% boven het standaardtarief.`,
    extra: `<div class="row"><a class="btn btn--signal btn--lg" href="${link('/boeken/')}?auto=bus">Taxibus boeken</a><a class="btn btn--ghost-ink btn--lg" href="${telHref}">Bel ${esc(site.phone)}</a></div>`,
    aside: `<div class="card" style="align-items:stretch">${vehicleArt.bus}<dl class="sum-dl" style="border-top:0;color:var(--fg)"><dt class="muted">Personen</dt><dd>Tot 8, incl. bagage</dd><dt class="muted">Prijs</dt><dd>ca. +${pct}% per rit</dd><dt class="muted">Beschikbaar</dt><dd>24/7</dd></dl></div>`,
  })}
<section class="sec"><div class="wrap">
  ${secHead({ eyebrow: 'Vaste prijzen', title: 'Wat kost een taxibus?', lead: 'De taxibusprijs is het standaardtarief plus ca. ' + pct + '%. Altijd goedkoper dan twee aparte taxi’s.' })}
  ${board(priced(['schiphol', 'nieuwegein', 'odijk', 'groenekan', 'leidsche-rijn', 'utrecht']), { link, light: true, bus: true, caption: 'Taxibusprijzen' })}
</div></section>
<section class="sec sec--mist"><div class="wrap split">
  <div class="stack"><h2 class="h2">Handig voor</h2></div>
  <ul class="checks">
    <li>${icon('plane', { size: 24 })}<span><b>Gezinnen naar het vliegveld</b>Iedereen en alle koffers in één keer naar Schiphol.</span></li>
    <li>${icon('users', { size: 24 })}<span><b>Uitjes en feesten</b>Samen naar een bruiloft, diner of concert, en weer terug.</span></li>
    <li>${icon('invoice', { size: 24 })}<span><b>Zakelijke groepen</b>Gasten van het station naar kantoor, op maandfactuur.</span></li>
  </ul>
</div></section>
<section class="sec"><div class="wrap split"><h2 class="h2">Vragen over de taxibus</h2>${faq([FAQ.bus, FAQ.reserve, FAQ.pay])}</div></section>
${cta(ctx)}`;
  return {
    path: '/taxibus/',
    title: 'Taxibus Utrecht',
    description: `Taxibus in Utrecht voor ${site.busPassengers} personen inclusief bagage. Vaste prijs per rit, ca. ${pct}% boven standaard. Ook naar Schiphol.`,
    body,
    jsonld: [crumbsLd(trail)],
  };
}

function elektrisch(ctx) {
  const { link } = ctx;
  const trail = [HOME, { name: 'Elektrische taxi', path: '/elektrische-taxi/' }];
  const body = `${inkHero({
    ctx,
    trail,
    eyebrow: 'Elektrische taxi',
    title: 'Elektrisch rijden kost bij ons niets extra',
    lead: 'Een Tesla Model 3 of Model Y voor hetzelfde vaste tarief als een standaardauto. Stil, zonder uitstoot en met ruim 400 km bereik.',
    extra: `<div class="row"><a class="btn btn--signal btn--lg" href="${link('/boeken/')}?auto=ev">Tesla boeken</a></div>`,
    aside: `<div class="card">${vehicleArt.ev}<dl class="sum-dl" style="border-top:0;color:var(--fg)"><dt class="muted">Modellen</dt><dd>Tesla Model 3 · Model Y</dd><dt class="muted">Bereik</dt><dd>Ruim 400 km</dd><dt class="muted">Meerprijs</dt><dd>Geen</dd></dl></div>`,
  })}
<section class="sec"><div class="wrap split">
  <div class="stack"><h2 class="h2">Waarom elektrisch</h2></div>
  <ul class="checks">
    <li>${icon('bolt', { size: 24 })}<span><b>Zelfde vaste prijs</b>Je kiest voor elektrisch zonder meer te betalen.</span></li>
    <li>${icon('plane', { size: 24 })}<span><b>Ook naar Schiphol en terug</b>Met ruim 400 km bereik is ook een lange rit geen probleem.</span></li>
    <li>${icon('check', { size: 24, sw: 2.4 })}<span><b>Stil en comfortabel</b>Fijn na een lange vlucht of een drukke dag.</span></li>
  </ul>
</div></section>
<section class="sec sec--mist"><div class="wrap">${secHead({ title: 'Of kies een ander voertuig' })}${fleet({ link, headless: true })}</div></section>
<section class="sec"><div class="wrap split"><h2 class="h2">Vragen over elektrisch rijden</h2>${faq([FAQ.ev, FAQ.reserve, FAQ.pay])}</div></section>
${cta(ctx)}`;
  return {
    path: '/elektrische-taxi/',
    title: 'Elektrische taxi Utrecht',
    description: 'Elektrische taxi in Utrecht: Tesla Model 3 of Model Y voor hetzelfde vaste tarief. Ruim 400 km bereik, ook naar Schiphol.',
    body,
    jsonld: [crumbsLd(trail)],
  };
}

/* ================= BEDRIJF ================= */
function overOns(ctx) {
  const trail = [HOME, { name: 'Over ons', path: '/over-ons/' }];
  const body = `${inkHero({ ctx, trail, eyebrow: 'Over ons', title: 'Een taxibedrijf uit Utrecht, voor Utrecht', lead: 'Vaste prijzen, ervaren chauffeurs en dag en nacht bereikbaar. Zo simpel moet een taxi zijn.' })}
<section class="sec"><div class="wrap split">
  <div class="prose">
    <h2>Wie we zijn</h2>
    <p>${todo('Ons verhaal: sinds wanneer, wie het bedrijf runt, hoeveel chauffeurs en auto’s', 'over-ons')}</p>
    <h2>Waar we voor staan</h2>
    <p>Je hoort de prijs voordat je instapt, en die prijs verandert niet. Niet ’s nachts, niet in de file en niet bij een omleiding.</p>
    <p>Ons wagenpark loopt van comfortabele sedans tot ruime taxibussen en volledig elektrische Tesla’s. Voor elk voertuig geldt dezelfde vaste prijs; alleen de taxibus is ca. ${pct}% duurder.</p>
  </div>
  <ul class="checks">
    <li>${icon('clock', { size: 24 })}<span><b>24/7 bereikbaar</b>Ook ’s nachts, in het weekend en op feestdagen.</span></li>
    <li>${icon('card', { size: 24 })}<span><b>Betalen zoals je wilt</b>Pin, creditcard, contant of op rekening.</span></li>
    <li>${icon('pin', { size: 24 })}<span><b>Gevestigd in Utrecht</b>${esc(site.address.street)}, ${esc(site.address.postalCode)} ${esc(site.address.city)}</span></li>
  </ul>
</div></section>
${cta(ctx)}`;
  return { path: '/over-ons/', title: 'Over ons', description: `${site.name}: vaste prijzen, ervaren chauffeurs en 24/7 bereikbaar in Utrecht en omgeving.`, body, jsonld: [crumbsLd(trail)] };
}

function contact(ctx) {
  const { link } = ctx;
  const trail = [HOME, { name: 'Contact', path: '/contact/' }];
  const a = site.address;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${a.street}, ${a.postalCode} ${a.city}`)}`;
  const body = `${inkHero({ ctx, trail, eyebrow: 'Contact · 24/7', title: 'We zijn er, dag en nacht', lead: 'Voor een rit bel je het snelst. Voor vragen, offertes en zakelijke afspraken kun je ook mailen of het formulier gebruiken.' })}
<section class="sec"><div class="wrap split">
  <ul class="contact-list">
    <li><span class="k">Telefoon</span><a class="v" href="${telHref}">${esc(site.phone)}</a></li>
    ${waHref ? `<li><span class="k">WhatsApp</span><a class="v" href="${waHref}">Stuur een bericht</a></li>` : ''}
    <li><span class="k">E-mail</span><a class="v" href="${mailHref}">${esc(site.email)}</a></li>
    <li><span class="k">Adres</span><span class="v">${esc(a.street)}<br>${esc(a.postalCode)} ${esc(a.city)}<br><a class="small" style="font-weight:600" href="${maps}">Bekijk op de kaart</a></span></li>
    <li><span class="k">Bereikbaar</span><span class="v">24 uur per dag, 7 dagen per week</span></li>
    ${site.kvk ? `<li><span class="k">KVK</span><span class="v">${esc(site.kvk)}</span></li>` : ''}
  </ul>
  ${mailForm({
    id: 'contact',
    subject: 'Vraag via de website',
    submit: 'Bericht versturen',
    fields: `<div class="fields">
      <label class="field" for="c-naam">Naam<input class="input" id="c-naam" name="Naam" autocomplete="name" required></label>
      <label class="field" for="c-mail">E-mail<input class="input" id="c-mail" name="E-mail" type="email" autocomplete="email" required></label>
    </div>
    <label class="field" for="c-tel">Telefoon <span class="field__hint">optioneel</span><input class="input" id="c-tel" name="Telefoon" type="tel" autocomplete="tel"></label>
    <label class="field" for="c-msg">Je vraag<textarea class="textarea" id="c-msg" name="Bericht" rows="5" required></textarea></label>`,
    link,
  })}
</div></section>`;
  return { path: '/contact/', nav: 'contact', title: 'Contact', description: `Contact met ${site.name}: bel ${site.phone} (24/7), mail ${site.email} of gebruik het contactformulier.`, body, jsonld: [crumbsLd(trail), businessLd()] };
}

function vragen(ctx) {
  const trail = [HOME, { name: 'Veelgestelde vragen', path: '/veelgestelde-vragen/' }];
  const groups = [
    ['Bestellen', [FAQ.book, FAQ.speed, FAQ.reserve]],
    ['Prijzen', [FAQ.night, FAQ.traffic, FAQ.bus, FAQ.ev]],
    ['Betalen', [FAQ.pay, FAQ.business]],
    ['Luchthavens', [FAQ.schiphol, FAQ.airports]],
  ];
  const all = groups.flatMap((g) => g[1]);
  const body = `${inkHero({ ctx, trail, eyebrow: 'Veelgestelde vragen', title: 'Antwoorden, kort en duidelijk', lead: `Staat je vraag er niet bij? Bel ${esc(site.phone)}, ook ’s nachts.` })}
${groups.map(([t, items], i) => `<section class="sec${i % 2 ? ' sec--mist' : ''}"><div class="wrap split"><h2 class="h2">${t}</h2>${faq(items)}</div></section>`).join('\n')}
${cta(ctx)}`;
  return { path: '/veelgestelde-vragen/', title: 'Veelgestelde vragen', description: 'Antwoorden over taxi bestellen in Utrecht: prijzen, nachttoeslag, betalen, taxibus, elektrisch en luchthavenvervoer.', body, jsonld: [crumbsLd(trail), faqLd(all)] };
}

/* ================= JURIDISCH ================= */
function legal(ctx, { path, name, title, lead, prose, description }) {
  const trail = [HOME, { name, path }];
  const body = `${inkHero({ ctx, trail, title, lead, grid: false })}
<section class="sec"><div class="wrap"><div class="prose">${prose}</div></div></section>`;
  return { path, title: name, description, body, jsonld: [crumbsLd(trail)] };
}

function privacy(ctx) {
  const a = site.address;
  return legal(ctx, {
    path: '/privacy/',
    name: 'Privacyverklaring',
    title: 'Privacyverklaring',
    lead: 'Welke gegevens we gebruiken, waarvoor en hoe lang.',
    description: `Privacyverklaring van ${site.name}: welke persoonsgegevens we verwerken voor je taxirit en welke rechten je hebt.`,
    prose: `<p>${todo('Concept — laat deze tekst juridisch controleren vóór publicatie', 'privacy')}</p>
<h2>Wie wij zijn</h2>
<p>${esc(site.name)}, ${esc(a.street)}, ${esc(a.postalCode)} ${esc(a.city)}${site.kvk ? `, KVK ${esc(site.kvk)}` : ''}, is verantwoordelijk voor de verwerking van je persoonsgegevens zoals beschreven in deze verklaring. Vragen? Mail <a href="${mailHref}">${esc(site.email)}</a>.</p>
<h2>Welke gegevens we gebruiken</h2>
<ul><li>Naam, telefoonnummer en e-mailadres</li><li>Ophaal- en bestemmingsadres, datum en tijd van je rit</li><li>Eventueel je vluchtnummer en je bericht aan de chauffeur</li><li>Voor zakelijke klanten: bedrijfsnaam, KVK-nummer en factuurgegevens</li></ul>
<h2>Waarvoor</h2>
<ul><li>Je rit plannen, uitvoeren en bevestigen</li><li>Contact met je opnemen over je rit of je vraag</li><li>Facturen opstellen en onze wettelijke administratieplicht nakomen</li></ul>
<p>De grondslag is de uitvoering van de overeenkomst (je rit) en, voor de administratie, een wettelijke verplichting.</p>
<h2>Hoe lang</h2>
<p>Ritgegevens bewaren we ${todo('bewaartermijn ritgegevens', 'privacy')}. Facturen bewaren we 7 jaar, zoals de fiscale bewaarplicht vereist.</p>
<h2>Met wie we gegevens delen</h2>
<p>Alleen met de chauffeur die je rit uitvoert en met partijen die ons helpen de dienst te leveren, zoals ${todo('verwerkers: bijv. hosting, e-mail, boekingssysteem', 'privacy')}. We verkopen je gegevens nooit.</p>
<h2>Cookies en analyse</h2>
<p>Deze website plaatst geen tracking- of advertentiecookies en laadt geen lettertypen of scripts van derden. Zie ook onze <a href="${ctx.link('/cookies/')}">cookieverklaring</a>.</p>
<h2>Je rechten</h2>
<p>Je mag je gegevens inzien, laten corrigeren of laten verwijderen, en bezwaar maken tegen het gebruik ervan. Mail daarvoor naar <a href="${mailHref}">${esc(site.email)}</a>. Ben je het niet eens met hoe we met je gegevens omgaan, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens.</p>`,
  });
}

function voorwaarden(ctx) {
  return legal(ctx, {
    path: '/algemene-voorwaarden/',
    name: 'Algemene voorwaarden',
    title: 'Algemene voorwaarden',
    lead: 'De afspraken die gelden voor elke rit.',
    description: `Algemene voorwaarden van ${site.name} voor taxivervoer in Utrecht en omgeving.`,
    prose: `<p>${site.termsName ? `Op al onze ritten zijn de ${esc(site.termsName)} van toepassing.` : todo('Welke voorwaarden gelden: eigen voorwaarden of een branche-set, plus de volledige tekst of een download', 'voorwaarden')}</p>
<h2>In het kort</h2>
<ul><li>De vaste prijs die je vooraf hoort of ziet, is de prijs die je betaalt, inclusief btw.</li><li>Geen toeslag voor nacht, files, omleidingen of wachten bij verkeerslichten.</li><li>De taxibus kost ca. ${pct}% boven het standaardtarief, per rit.</li><li>Je betaalt met pin, creditcard of contant in de taxi. Zakelijke klanten kunnen op factuur betalen.</li><li>Annuleren: ${site.freeCancelHours ? `kosteloos tot ${esc(site.freeCancelHours)} uur voor de ophaaltijd.` : todo('annuleringsvoorwaarden', 'voorwaarden')}</li></ul>`,
  });
}

function cookies(ctx) {
  return legal(ctx, {
    path: '/cookies/',
    name: 'Cookies',
    title: 'Cookieverklaring',
    lead: 'Kort: we volgen je niet.',
    description: `${site.name} plaatst geen tracking- of advertentiecookies.`,
    prose: `<p>Deze website plaatst geen tracking-, analyse- of advertentiecookies. Daarom vragen we ook geen toestemming met een cookiebanner.</p>
<p>Als je een route kiest en doorklikt naar het boekingsformulier, onthoudt je browser die keuze tijdelijk (sessionStorage), zodat je hem niet opnieuw hoeft in te vullen. Die gegevens blijven op je eigen apparaat en verdwijnen als je het tabblad sluit.</p>
<p>Lettertypen en scripts worden vanaf onze eigen server geladen. Er gaan dus geen gegevens naar externe partijen zoals Google Fonts.</p>`,
  });
}

function notFound(ctx) {
  const { link } = ctx;
  return {
    path: '/404.html',
    noindex: true,
    title: 'Pagina niet gevonden',
    description: 'Deze pagina bestaat niet (meer).',
    body: `<section class="sec"><div class="wrap lost"><span class="eyebrow">Fout 404</span><h1 class="display">Deze afslag bestaat niet.</h1><p class="lead">De pagina is verplaatst of bestaat niet meer. Waar wil je heen?</p>
<div class="row"><a class="btn btn--primary btn--lg" href="${link('/boeken/')}">Rit plannen</a><a class="btn btn--ghost btn--lg" href="${link('/')}">Naar de homepage</a><a class="btn btn--ghost btn--lg" href="${telHref}">Bel ${esc(site.phone)}</a></div></div></section>`,
  };
}

export { boeken } from './booking.mjs';
export const pageFactories = [
  home,
  tarieven,
  luchthavens,
  ...airports.map(airportPage),
  werkgebied,
  ...places.map(placePage),
  zakelijk,
  taxibus,
  elektrisch,
  overOns,
  contact,
  vragen,
  privacy,
  voorwaarden,
  cookies,
  notFound,
];

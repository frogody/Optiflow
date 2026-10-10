import { site, fares, routes, hasMap, esc, icon, money, busPrice, metaLabel, telHref, phoneNb, waHref, mailHref } from './lib.mjs';
import { VEHICLES, arrow, crumbs, crumbsLd } from './components.mjs';

const DEF = routes.schiphol;
// Fixed prices are for a route to or from Utrecht, so the select names the route, not a destination.
const routeLabel = (r) => (r.id === 'utrecht' ? 'Binnen Utrecht' : `Utrecht – ${r.name}`);
const GROUPS = [
  ['stad', 'Utrecht'],
  ['regio', 'Regio (heen of terug)'],
  ['luchthaven', 'Luchthavens (heen of terug)'],
];

export function boeken(ctx) {
  const { link } = ctx;
  const trail = [{ name: 'Home', path: '/' }, { name: 'Boeken', path: '/boeken/' }];
  const options = GROUPS.map(
    ([g, label]) =>
      `<optgroup label="${label}">${fares.routes
        .filter((r) => r.group === g)
        .map(
          (r) =>
            `<option value="${r.id}" data-price="${r.price ?? ''}" data-from="${r.from ? 1 : ''}" data-meta="${esc(metaLabel(r))}" data-air="${r.group === 'luchthaven' ? 1 : ''}"${
              r.id === 'schiphol' ? ' selected' : ''
            } data-name="${esc(r.name)}">${esc(routeLabel(r))}</option>`,
        )
        .join('')}</optgroup>`,
  ).join('');
  const vehicles = VEHICLES.map(
    (v, i) =>
      `<label class="opt"><input type="radio" name="auto" value="${v.id}"${i === 0 ? ' checked' : ''} data-factor="${v.factor}" data-label="${v.name}"><span><span class="stack" style="gap:3px"><b>${v.name}</b><small>${
        v.id === 'std' ? 'Sedan · 1–4 personen' : v.id === 'ev' ? 'Tesla Model 3 of Y · 1–4 personen · zelfde prijs' : `${site.busPassengers} personen incl. bagage · prijs per rit`
      }</small></span><span class="opt__price" data-vprice="${v.id}">${v.factor > 1 ? `ca. ${money(busPrice(DEF.price))}` : money(DEF.price)}</span></span></label>`,
  ).join('');
  const action = site.bookingEndpoint || `${mailHref}?subject=${encodeURIComponent('Taxi boeken')}`;

  const body = `<section class="sec sec--mist" style="padding-block:clamp(28px,4vw,48px) clamp(64px,8vw,96px)">
<div class="wrap stack stack--lg">
  <div class="stack" style="gap:10px">${crumbs(trail, ctx).replace('class="crumbs"', 'class="crumbs crumbs--light"')}<h1 class="h2">Taxi boeken</h1></div>
  <ol class="bk__progress js-only" data-progress>
    <li aria-current="step"><span class="n">1</span><span>Route</span></li>
    <li><span class="n">2</span><span>Auto</span></li>
    <li><span class="n">3</span><span>Gegevens</span></li>
    <li><span class="n">4</span><span>Versturen</span></li>
  </ol>
  <div class="bk">
    <form class="bk__form" id="boeken" data-booking${site.bookingEndpoint ? ` data-endpoint="${esc(site.bookingEndpoint)}"` : ''} data-email="${esc(site.email)}" action="${esc(action)}" method="post"${
      site.bookingEndpoint ? '' : ' enctype="text/plain"'
    } aria-describedby="bk-intro">
      <p class="muted no-js-only" id="bk-intro">Vul je rit in en verstuur je aanvraag. We bevestigen je rit en de vaste prijs per telefoon of e-mail.</p>

      <fieldset class="bk__step" data-step="1">
        <legend>Waar en wanneer?</legend>
        <div class="field-wrap"><label class="field">Ophaaladres<input class="input" id="bk-van" name="Ophaaladres" type="text" autocomplete="address-line1" placeholder="Straat en huisnummer, plaats" required></label>${hasMap() ? '<button class="locate" type="button" data-locate hidden>Gebruik mijn locatie</button>' : ''}</div>
        <label class="field">Rit <span class="field__hint">vaste prijs, heen of terug</span><select class="select" id="bk-naar" name="Rit" data-dest>${options}<option value="anders" data-price="" data-name="Andere rit">Andere rit (prijs op aanvraag)</option></select></label>
        <div class="field-wrap"><label class="field">Afzetadres <span class="field__hint" data-drop-hint>waar moeten we je afzetten?</span><input class="input" id="bk-naar-adres" name="Afzetadres" type="text" autocomplete="off" placeholder="Straat en huisnummer, plaats"></label></div>
        ${hasMap() ? `<p class="route-hint" data-route-hint hidden><span data-route-hint-text></span> <button class="btn btn--ghost btn--sm" type="button" data-route-hint-use>Kies deze rit</button></p>` : ''}
        <fieldset class="seg" style="justify-self:start"><legend>Wanneer</legend>
          <label><input type="radio" name="Wanneer" value="Zo snel mogelijk" checked data-when="nu"><span>Zo snel mogelijk</span></label>
          <label><input type="radio" name="Wanneer" value="Op een tijdstip" data-when="later"><span>Op een tijdstip</span></label>
        </fieldset>
        <div class="fields" data-later>
          <label class="field">Datum<input class="input" id="bk-datum" name="Datum" type="date"></label>
          <label class="field">Ophaaltijd<input class="input" id="bk-tijd" name="Ophaaltijd" type="time"></label>
        </div>
        <p class="small muted" data-now>In Utrecht en directe omgeving meestal binnen ${site.pickupMinutes} minuten.</p>
      </fieldset>

      <fieldset class="bk__step" data-step="2">
        <legend>Kies je auto</legend>
        <fieldset class="opts opts--list"><legend class="sr-only">Auto</legend>${vehicles}</fieldset>
        <div class="fields">
          <label class="field">Personen<select class="select" id="bk-pers" name="Personen"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option></select></label>
          <label class="field">Koffers<select class="select" id="bk-koffers" name="Koffers"><option>Geen</option><option selected>1–2</option><option>3–4</option><option>Meer dan 4</option></select></label>
          <label class="field" data-air-field>Vluchtnummer <span class="field__hint">optioneel</span><input class="input" id="bk-vlucht" name="Vluchtnummer" type="text" autocapitalize="characters" placeholder="bijv. KL1234"></label>
        </div>
        <p class="small muted" data-bus-hint hidden>Meer dan 4 personen? Kies de taxibus, dan past iedereen en alle bagage in één auto.</p>
      </fieldset>

      <fieldset class="bk__step" data-step="3">
        <legend>Je gegevens</legend>
        <div class="fields">
          <label class="field">Naam<input class="input" id="bk-naam" name="Naam" type="text" autocomplete="name" required></label>
          <label class="field">Mobiel nummer<input class="input" id="bk-tel" name="Telefoon" type="tel" autocomplete="tel" inputmode="tel" placeholder="06 …" required></label>
        </div>
        <label class="field">E-mail <span class="field__hint">voor je bevestiging</span><input class="input" id="bk-mail" name="E-mail" type="email" autocomplete="email" required></label>
        <label class="field">Bericht voor de chauffeur <span class="field__hint">optioneel</span><textarea class="textarea" id="bk-msg" name="Bericht" rows="3" placeholder="bijv. achteringang, kinderzitje nodig"></textarea></label>
        <fieldset class="chips"><legend>Betalen</legend>
          <label class="chip"><input type="radio" name="Betaalwijze" value="Pin in de taxi" checked><span>Pin in de taxi</span></label>
          <label class="chip"><input type="radio" name="Betaalwijze" value="Creditcard"><span>Creditcard</span></label>
          <label class="chip"><input type="radio" name="Betaalwijze" value="Contant"><span>Contant</span></label>
          <label class="chip"><input type="radio" name="Betaalwijze" value="Op rekening (zakelijk)"><span>Op rekening (zakelijk)</span></label>
        </fieldset>
        <label class="check"><input id="bk-ok" type="checkbox" name="Akkoord" value="Ja" required><span>Ik ga akkoord met de <a href="${link('/algemene-voorwaarden/')}">voorwaarden</a> en de <a href="${link('/privacy/')}">privacyverklaring</a>.</span></label>
      </fieldset>

      <p class="form-error" data-form-error hidden></p>

      <div class="bk__nav" data-nav>
        <button class="btn btn--ghost js-only" type="button" data-back hidden>Terug</button>
        <span></span>
        <button class="btn btn--primary btn--lg js-only" type="button" data-next>Volgende ${arrow()}</button>
        <button class="btn btn--primary btn--lg" type="submit" data-submit>Aanvraag versturen ${arrow()}</button>
      </div>

      <div class="done" data-done hidden tabindex="-1">
        <span class="done__icon">${icon('check', { size: 32, sw: 2.6 })}</span>
        <h2 class="h2" data-done-title>Bijna klaar</h2>
        <p class="lead" data-done-text>Je e-mailprogramma opent met je aanvraag. Verstuur het bericht, dan bevestigen we je rit en de vaste prijs.</p>
        <pre data-done-summary></pre>
        <div class="row">
          <a class="btn btn--primary" href="${mailHref}" data-done-mail>Open e-mail opnieuw</a>
          <a class="btn btn--ghost" href="${telHref}">Bel&nbsp;${esc(phoneNb)}</a>
          ${waHref ? `<a class="btn btn--ghost" href="${waHref}" data-done-wa>Stuur via WhatsApp</a>` : ''}
        </div>
        <button class="btn btn--ghost btn--sm" type="button" data-restart>Nog een rit plannen</button>
      </div>
    </form>

    <aside class="bk__aside" aria-label="Overzicht van je rit">
      <span class="eyebrow">Jouw rit</span>
      ${hasMap() ? '<div class="route-map" data-route-map role="region" aria-label="Kaart met je route"></div>' : ''}
      <div class="sum">
        <span class="sum__dot"></span><span><span class="sum__k">Ophalen</span><span class="sum__v" data-sum="van">Je ophaaladres</span></span>
        <span class="sum__line"></span><span></span>
        <span class="sum__sq"></span><span><span class="sum__k">Afzetten</span><span class="sum__v" data-sum="naar">${esc(DEF.name)}</span></span>
      </div>
      <dl class="sum-dl">
        <dt>Rit</dt><dd data-sum="route">${esc(routeLabel(DEF))}</dd>
        <dt>Wanneer</dt><dd data-sum="wanneer">Zo snel mogelijk</dd>
        <dt>Auto</dt><dd data-sum="auto">Standaard</dd>
        <dt>Afstand</dt><dd data-sum="meta">${esc(metaLabel(DEF))}</dd>
      </dl>
      <div class="sum-price"><span class="small" style="color:var(--on-ink-subtle);max-width:150px" data-sum="note">Vaste prijs, incl. btw</span><output data-sum="price" aria-live="polite">${money(DEF.price)}</output></div>
      <ul class="sum-ticks"><li>Geen nachttoeslag</li><li>Geen toeslag voor file of omleiding</li><li>Betalen in de taxi of op rekening</li></ul>
    </aside>
  </div>
</div>
</section>`;
  return {
    path: '/boeken/',
    nav: 'boeken',
    map: true,
    title: 'Taxi boeken',
    description: `Boek je taxi in Utrecht online: kies je route en auto en zie direct de vaste prijs. Of bel ${site.phone}, 24/7.`,
    body,
    jsonld: [crumbsLd(trail)],
  };
}

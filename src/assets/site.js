/* Taxi Bestellen Utrecht — progressive enhancement. Every page works without this file. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var NB = '\u00a0';
  var money = function (n) { return '€' + NB + n; };
  var pct = function (f) { return Math.round((f - 1) * 100); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  };

  /** Same rule as the build: price × vehicle factor, rounded; null when no confirmed price. */
  function priceFor(price, from, factor) {
    if (price === '' || price == null || isNaN(+price)) return null;
    return (from ? 'v.a. ' : '') + (factor > 1 ? 'ca. ' : '') + money(Math.round(+price * factor));
  }
  function noteFor(p, factor) {
    if (!p) return 'Je hoort de vaste prijs vóór je boekt';
    return factor > 1 ? 'Taxibus · ca. ' + pct(factor) + '% boven standaard · per rit' : 'Vaste prijs · incl. btw · per rit';
  }

  /* ---------- menu ---------- */
  var menuBtn = $('[data-menu]');
  var menu = $('#menu');
  if (menuBtn && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    };
    menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
    });
  }

  /* ---------- fare widgets ---------- */
  $$('form[data-fare]').forEach(function (f) {
    var out = function (k) { return $('[data-out="' + k + '"]', f); };
    function update() {
      var r = $('input[name="naar"]:checked', f) || $('input[name="naar"][type="hidden"]', f);
      var v = $('input[name="auto"]:checked', f);
      if (!r) return;
      var factor = v ? +v.dataset.factor : 1;
      var p = priceFor(r.dataset.price, r.dataset.from, factor);
      if (out('name')) out('name').textContent = r.dataset.name;
      if (out('meta')) out('meta').textContent = r.dataset.meta || '';
      var po = out('price');
      if (po) { po.textContent = p || 'Prijs op aanvraag'; po.classList.toggle('quote__price--ask', !p); }
      if (out('note')) out('note').textContent = noteFor(p, factor);
    }
    f.addEventListener('change', update);
    f.addEventListener('submit', function () {
      var d = {};
      new FormData(f).forEach(function (v, k) { d[k] = v; });
      store.set('tbu-rit', d);
    });
    update();
  });

  /* ---------- generic mail/endpoint forms (contact, zakelijk) ---------- */
  function composeText(form, title) {
    var lines = [title, ''];
    new FormData(form).forEach(function (v, k) { if (String(v).trim()) lines.push(k + ': ' + v); });
    return lines.join('\n');
  }
  function mailto(email, subject, text) {
    return 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
  }
  function sendJSON(url, form, extra) {
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    for (var k in extra) data[k] = extra[k];
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); });
  }
  var email = (function () { var a = $('a[href^="mailto:"]'); return a ? a.getAttribute('href').replace(/^mailto:/, '').split('?')[0] : ''; })();
  var phone = (function () { var a = $('a.ftr__phone'); return a ? a.textContent.trim() : ''; })();

  $$('form[data-mailform]').forEach(function (form) {
    var fields = $('[data-form-fields]', form);
    var done = $('[data-form-done]', form);
    var err = $('[data-form-error]', form);
    var subject = form.dataset.subject || 'Bericht via de website';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = composeText(form, subject);
      $('[data-done-summary]', done).textContent = text;
      var finish = function (sent) {
        if (sent) {
          $('[data-done-title]', done).textContent = 'Bedankt, we hebben je bericht';
          $('[data-done-text]', done).textContent = 'We reageren zo snel mogelijk, meestal dezelfde werkdag.';
          $('[data-done-mail]', done).hidden = true;
        }
        fields.hidden = true;
        done.hidden = false;
        done.focus();
      };
      if (form.dataset.endpoint) {
        err.hidden = true;
        sendJSON(form.dataset.endpoint, form, { Onderwerp: subject })
          .then(function () { finish(true); })
          .catch(function () { err.textContent = 'Versturen lukte niet. Probeer het opnieuw of bel ' + phone + '.'; err.hidden = false; });
      } else {
        var href = mailto(email, subject, text);
        $('[data-done-mail]', done).setAttribute('href', href);
        finish(false);
        window.location.href = href;
      }
    });
  });

  /* ---------- booking ---------- */
  var bk = $('form[data-booking]');
  if (!bk) return;
  bk.noValidate = true;
  var steps = $$('[data-step]', bk);
  var progress = $$('[data-progress] li');
  var dest = $('[data-dest]', bk);
  var other = $('[data-other]', bk);
  var otherInput = $('#bk-naar-adres');
  var later = $('[data-later]', bk);
  var now = $('[data-now]', bk);
  var airField = $('[data-air-field]', bk);
  var busHint = $('[data-bus-hint]', bk);
  var err = $('[data-form-error]', bk);
  var nav = $('[data-nav]', bk);
  var done = $('[data-done]', bk);
  var nextBtn = $('[data-next]', bk);
  var backBtn = $('[data-back]', bk);
  var submitBtn = $('[data-submit]', bk);
  var date = $('#bk-datum');
  var time = $('#bk-tijd');
  var sum = function (k) { return $('[data-sum="' + k + '"]'); };
  var cur = 0;

  // Prefill from the fare widget (query string or this tab's session).
  var q = new URLSearchParams(window.location.search);
  var saved = store.get('tbu-rit') || {};
  var pick = function (k) { return q.get(k) || saved[k] || ''; };
  var esc = function (s) { return String(s).replace(/["\\]/g, '\\$&'); };
  if (pick('naar') && $('option[value="' + esc(pick('naar')) + '"]', dest)) dest.value = pick('naar');
  if (pick('van')) $('#bk-van').value = pick('van');
  if (pick('auto')) { var ra = $('input[name="auto"][value="' + esc(pick('auto')) + '"]', bk); if (ra) ra.checked = true; }
  if (pick('wanneer') === 'later') $('[data-when="later"]', bk).checked = true;
  if (pick('datum')) date.value = pick('datum');
  if (pick('tijd')) time.value = pick('tijd');
  var localNow = function () { return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString(); };
  try { date.min = localNow().slice(0, 10); } catch (e) { /* ignore */ }

  // Keep a half-filled booking when the visitor reloads or comes back in the same tab.
  var DRAFT = 'tbu-boeking';
  var fromWidget = q.has('naar') || q.has('van') || q.has('auto');
  var draft = store.get(DRAFT);
  if (draft && !fromWidget) {
    Object.keys(draft).forEach(function (name) {
      $$('[name="' + esc(name) + '"]', bk).forEach(function (el) {
        if (el.type === 'radio') el.checked = el.value === draft[name];
        else if (el.type !== 'checkbox') el.value = draft[name];
      });
    });
  }
  function saveDraft() {
    var d = {};
    new FormData(bk).forEach(function (v, k) { if (k !== 'Akkoord') d[k] = v; });
    store.set(DRAFT, d);
  }
  var tel = $('#bk-tel');

  function fmtDate(v) {
    if (!v) return '';
    try { return new Date(v + 'T12:00:00').toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }); } catch (e) { return v; }
  }

  function update() {
    var opt = dest.options[dest.selectedIndex];
    var veh = $('input[name="auto"]:checked', bk);
    var factor = +veh.dataset.factor;
    var isLater = $('[data-when="later"]', bk).checked;
    var isOther = dest.value === 'anders';
    other.hidden = !isOther;
    otherInput.required = isOther;
    later.hidden = !isLater;
    now.hidden = isLater;
    date.required = isLater;
    time.required = isLater;
    airField.hidden = !opt.dataset.air;
    // Field rules the browser can't express on its own.
    var stamp = localNow();
    time.setCustomValidity(isLater && date.value === stamp.slice(0, 10) && time.value && time.value <= stamp.slice(11, 16) ? 'Kies een ophaaltijd later dan nu.' : '');
    var nd = tel.value.replace(/\D/g, '').length;
    tel.setCustomValidity(tel.value.trim() && (nd < 10 || nd > 15) ? 'Vul een geldig telefoonnummer in, bijvoorbeeld 06 12345678.' : '');
    $$('[data-vprice]', bk).forEach(function (el) {
      var f = +$('input[name="auto"][value="' + el.dataset.vprice + '"]', bk).dataset.factor;
      el.textContent = isOther ? 'Op aanvraag' : priceFor(opt.dataset.price, opt.dataset.from, f) || 'Op aanvraag';
    });
    busHint.hidden = !(+$('#bk-pers').value > 4 && veh.value !== 'bus');
    sum('van').textContent = $('#bk-van').value.trim() || 'Je ophaaladres';
    sum('naar').textContent = isOther ? otherInput.value.trim() || 'Ander adres' : opt.textContent;
    sum('wanneer').textContent = isLater ? [fmtDate(date.value), time.value].filter(Boolean).join(' · ') || 'Op een tijdstip' : 'Zo snel mogelijk';
    sum('auto').textContent = veh.dataset.label;
    sum('meta').textContent = isOther ? '—' : opt.dataset.meta || '—';
    var p = isOther ? null : priceFor(opt.dataset.price, opt.dataset.from, factor);
    var out = sum('price');
    out.textContent = p || 'Bij bevestiging';
    out.classList.toggle('is-ask', !p);
    sum('note').textContent = p ? (factor > 1 ? 'Taxibus, ca. ' + pct(factor) + '% boven standaard' : 'Vaste prijs, incl. btw') : 'Je hoort de vaste prijs voordat je rit vastligt';
    return { price: p, dest: isOther ? otherInput.value.trim() : opt.textContent, veh: veh.dataset.label, isLater: isLater };
  }
  bk.addEventListener('input', function () { update(); saveDraft(); });
  bk.addEventListener('change', function () { update(); saveDraft(); });

  function show(i, focus) {
    cur = i;
    steps.forEach(function (st, j) { if (j === i) st.removeAttribute('data-hidden'); else st.setAttribute('data-hidden', ''); });
    progress.forEach(function (li, j) {
      li.classList.toggle('is-done', j < i);
      if (j === i) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      $('.n', li).textContent = j < i ? '✓' : String(j + 1);
    });
    backBtn.hidden = i === 0;
    nextBtn.hidden = i === steps.length - 1;
    submitBtn.hidden = i !== steps.length - 1;
    if (focus) {
      var first = $('input:not([type="hidden"]), select, textarea', steps[i]);
      bk.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      if (first) first.focus({ preventScroll: true });
    }
  }
  function firstInvalid(i) {
    var els = $$('input, select, textarea', steps[i]).filter(function (el) { return !el.closest('[hidden]'); });
    for (var k = 0; k < els.length; k++) if (!els[k].checkValidity()) return els[k];
    return null;
  }
  function check(i) {
    var bad = firstInvalid(i);
    if (bad) { bad.reportValidity(); return false; }
    return true;
  }
  nextBtn.addEventListener('click', function () { if (check(cur)) show(cur + 1, true); });
  backBtn.addEventListener('click', function () { show(cur - 1, true); });

  function summaryText(s) {
    var v = function (id) { var el = $(id); return el ? el.value.trim() : ''; };
    var radio = function (n) { var el = $('input[name="' + n + '"]:checked', bk); return el ? el.value : ''; };
    var rows = [
      ['Van', v('#bk-van')],
      ['Naar', s.dest],
      ['Wanneer', s.isLater ? [fmtDate(date.value), time.value].filter(Boolean).join(' om ') : 'Zo snel mogelijk'],
      ['Auto', s.veh],
      ['Personen', v('#bk-pers')],
      ['Koffers', v('#bk-koffers')],
      ['Vluchtnummer', airField.hidden ? '' : v('#bk-vlucht')],
      ['Prijs', s.price || 'graag een prijsopgave'],
      ['Naam', v('#bk-naam')],
      ['Telefoon', v('#bk-tel')],
      ['E-mail', v('#bk-mail')],
      ['Betalen', radio('Betaalwijze')],
      ['Bericht', v('#bk-msg')],
    ];
    return ['Taxi boeken via de website', ''].concat(rows.filter(function (r) { return r[1]; }).map(function (r) { return r[0] + ': ' + r[1]; })).join('\n');
  }

  function finish(sent, text, href) {
    store.set(DRAFT, null);
    steps.forEach(function (st) { st.setAttribute('data-hidden', ''); });
    nav.hidden = true;
    err.hidden = true;
    progress.forEach(function (li, j) {
      li.classList.toggle('is-done', j < 3);
      if (j === 3) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      $('.n', li).textContent = j < 3 ? '✓' : '4';
    });
    $('[data-done-summary]', done).textContent = text;
    if (sent) {
      $('[data-done-title]', done).textContent = 'Aanvraag ontvangen';
      $('[data-done-text]', done).textContent = 'We bevestigen je rit en de vaste prijs zo snel mogelijk per telefoon of e-mail.';
      $('[data-done-mail]', done).hidden = true;
    } else {
      $('[data-done-mail]', done).setAttribute('href', href);
    }
    var wa = $('[data-done-wa]', done);
    if (wa) wa.setAttribute('href', wa.getAttribute('href').split('?')[0] + '?text=' + encodeURIComponent(text));
    done.hidden = false;
    bk.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
    done.focus({ preventScroll: true });
  }

  bk.addEventListener('submit', function (e) {
    e.preventDefault();
    for (var i = 0; i < steps.length; i++) {
      var bad = firstInvalid(i);
      if (bad) { show(i, false); bad.reportValidity(); return; }
    }
    var s = update();
    var text = summaryText(s);
    var subject = 'Taxi boeken – ' + s.dest + (s.isLater && date.value ? ' – ' + fmtDate(date.value) : '');
    if (bk.dataset.endpoint) {
      submitBtn.disabled = true;
      err.hidden = true;
      sendJSON(bk.dataset.endpoint, bk, { Prijs: s.price || 'op aanvraag', Samenvatting: text })
        .then(function () { finish(true, text); })
        .catch(function () { err.textContent = 'Versturen lukte niet. Probeer het opnieuw of bel ' + phone + '.'; err.hidden = false; })
        .then(function () { submitBtn.disabled = false; });
    } else {
      var href = mailto(bk.dataset.email, subject, text);
      finish(false, text, href);
      window.location.href = href;
    }
  });

  $('[data-restart]', bk).addEventListener('click', function () {
    done.hidden = true;
    nav.hidden = false;
    show(0, true);
  });

  show(0, false);
  update();
})();

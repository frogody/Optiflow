/* Taxi Bestellen Utrecht — Mapbox layer (address suggestions, live route map, service-area map).
   Loaded only on pages that need it and only when a Mapbox public token is configured.
   Everything here is an enhancement: without it, the plain fields and lists still work. */
(function () {
  'use strict';
  var cfgEl = document.getElementById('tbu-map-config');
  if (!cfgEl) return;
  var CFG;
  try { CFG = JSON.parse(cfgEl.textContent); } catch (e) { return; }
  var TOKEN = CFG.token;
  var GL = 'https://api.mapbox.com/mapbox-gl-js/v' + CFG.glVersion + '/mapbox-gl';
  var API = 'https://api.mapbox.com';
  var UTRECHT = [5.1214, 52.0907];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var NB = ' ';
  var dark = function () {
    var t = document.documentElement.getAttribute('data-theme');
    return t ? t === 'dark' : !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  };

  /* ---------- Mapbox GL loader ---------- */
  var glPromise = null;
  function loadGL() {
    if (glPromise) return glPromise;
    glPromise = new Promise(function (resolve, reject) {
      if (window.mapboxgl) return resolve(window.mapboxgl);
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = GL + '.css';
      document.head.appendChild(css);
      var s = document.createElement('script');
      s.src = GL + '.js';
      s.async = true;
      s.onload = function () { window.mapboxgl ? resolve(window.mapboxgl) : reject(new Error('mapboxgl missing')); };
      s.onerror = function () { reject(new Error('Mapbox GL failed to load')); };
      document.head.appendChild(s);
    });
    return glPromise;
  }
  function makeMap(container, opts) {
    return loadGL().then(function (mapboxgl) {
      if (!mapboxgl.supported || (mapboxgl.supported && !mapboxgl.supported())) throw new Error('WebGL not supported');
      mapboxgl.accessToken = TOKEN;
      container.classList.add('is-live'); // visible before the map measures its container
      var map = new mapboxgl.Map(Object.assign({
        container: container,
        style: opts.style || 'mapbox://styles/mapbox/' + (opts.darkStyle || dark() ? 'dark-v11' : 'light-v11'),
        center: UTRECHT,
        zoom: 10,
        attributionControl: true,
        cooperativeGestures: true,
        locale: { 'ScrollZoomBlocker.CtrlMessage': 'Gebruik ctrl + scroll om te zoomen', 'ScrollZoomBlocker.CmdMessage': 'Gebruik ⌘ + scroll om te zoomen', 'TouchPanBlocker.Message': 'Gebruik twee vingers om de kaart te verplaatsen', 'NavigationControl.ZoomIn': 'Inzoomen', 'NavigationControl.ZoomOut': 'Uitzoomen' },
      }, opts.map || {}));
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
      map.once('load', function () { map.resize(); });
      container.tbuMap = map; // handy for debugging and browser QA
      return { map: map, mapboxgl: mapboxgl };
    });
  }

  /* ---------- Mapbox web services ---------- */
  function geocode(q, signal) {
    var url = API + '/search/geocode/v6/forward?q=' + encodeURIComponent(q) +
      '&autocomplete=true&country=nl,be,de&language=nl&limit=5&proximity=' + UTRECHT.join(',') +
      '&types=address,street,place,locality,neighborhood,postcode&access_token=' + TOKEN;
    return fetch(url, { signal: signal }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { return (d.features || []).map(toPlace); });
  }
  function reverse(lng, lat) {
    var url = API + '/search/geocode/v6/reverse?longitude=' + lng + '&latitude=' + lat + '&language=nl&limit=1&types=address,street,place&access_token=' + TOKEN;
    return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { return d.features && d.features[0] ? toPlace(d.features[0]) : null; });
  }
  function directions(a, b) {
    var url = API + '/directions/v5/mapbox/driving/' + a.join(',') + ';' + b.join(',') + '?geometries=geojson&overview=full&access_token=' + TOKEN;
    return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { return d.routes && d.routes[0] ? d.routes[0] : null; });
  }
  function toPlace(f) {
    var p = f.properties || {};
    var ctx = p.context || {};
    var town = (ctx.place && ctx.place.name) || (ctx.locality && ctx.locality.name) || (p.feature_type === 'place' ? p.name : '');
    var local = (ctx.locality && ctx.locality.name) || '';
    var label = p.full_address || [p.name_preferred || p.name, p.place_formatted].filter(Boolean).join(', ');
    return { label: label, primary: p.name_preferred || p.name || label, secondary: p.place_formatted || '', lng: f.geometry.coordinates[0], lat: f.geometry.coordinates[1], town: town, local: local };
  }

  /* ---------- accessible address combobox (WAI-ARIA 1.2 pattern) ---------- */
  var uid = 0;
  function combobox(input, onPick) {
    var id = 'ac-' + (++uid);
    var list = document.createElement('ul');
    list.id = id;
    list.className = 'ac';
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', 'Adressuggesties');
    list.hidden = true;
    (input.closest('.field-wrap') || input.parentNode).appendChild(list); // outside the <label>, so options never leak into its name
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', id);
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('autocomplete', 'off');
    var items = [];
    var active = -1;
    var timer = null;
    var ctrl = null;
    function close() {
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      active = -1;
    }
    function render() {
      list.innerHTML = '';
      items.forEach(function (it, i) {
        var li = document.createElement('li');
        li.id = id + '-' + i;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', i === active ? 'true' : 'false');
        var b = document.createElement('span');
        b.className = 'ac__p';
        b.textContent = it.primary;
        var s = document.createElement('span');
        s.className = 'ac__s';
        s.textContent = it.secondary;
        li.appendChild(b);
        li.appendChild(s);
        li.addEventListener('mousedown', function (e) { e.preventDefault(); pick(i); });
        list.appendChild(li);
      });
      list.hidden = !items.length;
      input.setAttribute('aria-expanded', items.length ? 'true' : 'false');
      if (active > -1) input.setAttribute('aria-activedescendant', id + '-' + active); else input.removeAttribute('aria-activedescendant');
    }
    function pick(i) {
      var it = items[i];
      if (!it) return;
      input.value = it.label;
      close();
      onPick(it);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    input.addEventListener('input', function (e) {
      if (e.isTrusted === false) return; // our own dispatch after a pick
      input.dataset.lng = '';
      input.dataset.lat = '';
      onPick(null);
      clearTimeout(timer);
      var q = input.value.trim();
      if (q.length < 3) { items = []; render(); return; }
      timer = setTimeout(function () {
        if (ctrl) ctrl.abort();
        ctrl = window.AbortController ? new AbortController() : null;
        geocode(q, ctrl && ctrl.signal).then(function (r) { items = r; active = -1; render(); }).catch(function () { /* offline or blocked: plain field */ });
      }, 220);
    });
    input.addEventListener('keydown', function (e) {
      if (list.hidden) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % items.length; render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + items.length) % items.length; render(); }
      else if (e.key === 'Enter' && active > -1) { e.preventDefault(); pick(active); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
    input.addEventListener('blur', function () { setTimeout(close, 120); });
  }

  /* ---------- booking: suggestions, live map, route, suggestion ---------- */
  var bk = document.querySelector('form[data-booking]');
  if (bk) booking();
  var area = document.querySelector('[data-area-map]');
  if (area) areaMap(area);

  function booking() {
    var van = $('#bk-van');
    var drop = $('#bk-naar-adres');
    var dest = $('#bk-naar');
    var hint = $('[data-route-hint]');
    var mapEl = $('[data-route-map]');
    var meta = $('[data-sum="meta"]');
    var ends = { a: null, b: null };
    var view = null;
    var markers = {};
    var seq = 0;

    combobox(van, function (p) { setEnd('a', p, false); });
    combobox(drop, function (p) { setEnd('b', p, false); });

    // "Gebruik mijn locatie" for the pickup address
    var locBtn = $('[data-locate]');
    if (locBtn && navigator.geolocation) {
      locBtn.hidden = false;
      locBtn.addEventListener('click', function () {
        locBtn.disabled = true;
        locBtn.textContent = 'Locatie zoeken…';
        navigator.geolocation.getCurrentPosition(function (pos) {
          reverse(pos.coords.longitude, pos.coords.latitude).then(function (p) {
            if (p) { van.value = p.label; setEnd('a', p, true); van.dispatchEvent(new Event('input', { bubbles: true })); }
          }).catch(function () {}).then(function () { locBtn.disabled = false; locBtn.textContent = 'Gebruik mijn locatie'; });
        }, function () { locBtn.disabled = false; locBtn.textContent = 'Locatie niet beschikbaar'; }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
      });
    }

    dest.addEventListener('change', function () { refresh(); });

    function setEnd(key, p, fromMap) {
      ends[key] = p;
      var input = key === 'a' ? van : drop;
      if (p) { input.dataset.lng = p.lng; input.dataset.lat = p.lat; }
      refresh(fromMap);
    }

    // The fixed-price route's own end point, used when no drop-off address is given (airports).
    function routeEnd() {
      var opt = dest.options[dest.selectedIndex];
      var a = CFG.airports[dest.value];
      return a && opt ? { lng: a.lng, lat: a.lat, label: a.name, town: a.name } : null;
    }

    // The map (and its ~1 MB library) only loads once someone starts filling in the form.
    var armed = false;
    bk.addEventListener('focusin', function () { if (!armed) { armed = true; refresh(); } });
    function refresh(fromMap) {
      var a = ends.a;
      var b = ends.b || (drop.value.trim() ? null : routeEnd());
      if (armed && mapEl && (a || b)) ensureMap().then(function () { draw(a, b, fromMap); }).catch(fallback);
      suggest(a, b);
    }

    // One map, shared by every caller; resolves only once its style has loaded.
    var viewP = null;
    function ensureMap() {
      if (!viewP) {
        viewP = makeMap(mapEl, { darkStyle: true }).then(function (v) {
          return new Promise(function (ok) {
            var done = function () { view = v; ok(v); };
            if (v.map.isStyleLoaded()) done(); else v.map.once('load', done);
          });
        });
      }
      return viewP;
    }

    function marker(key, p) {
      var gl = view.mapboxgl;
      if (!p) { if (markers[key]) { markers[key].remove(); delete markers[key]; } return; }
      if (!markers[key]) {
        var el = document.createElement('div');
        el.className = key === 'a' ? 'pin pin--a' : 'pin pin--b';
        el.setAttribute('aria-hidden', 'true');
        markers[key] = new gl.Marker({ element: el, draggable: true }).setLngLat([p.lng, p.lat]).addTo(view.map);
        markers[key].on('dragend', function () {
          var ll = markers[key].getLngLat();
          reverse(ll.lng, ll.lat).then(function (np) {
            if (!np) return;
            var input = key === 'a' ? van : drop;
            input.value = np.label;
            setEnd(key, np, true);
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }).catch(function () {});
        });
      } else {
        markers[key].setLngLat([p.lng, p.lat]);
      }
    }

    function draw(a, b, fromMap) {
      var map = view.map;
      marker('a', a);
      marker('b', b);
      var mine = ++seq;
      if (!(a && b)) {
        setLine(null);
        var only = a || b;
        if (only && !fromMap) map.easeTo({ center: [only.lng, only.lat], zoom: 13 });
        return;
      }
      directions([a.lng, a.lat], [b.lng, b.lat]).then(function (r) {
        if (mine !== seq || !r) return;
        setLine(r.geometry);
        if (meta) meta.textContent = (Math.round(r.distance / 100) / 10).toString().replace('.', ',') + NB + 'km · ±' + NB + Math.max(1, Math.round(r.duration / 60)) + NB + 'min';
        if (!fromMap) {
          var c = r.geometry.coordinates;
          var bounds = c.reduce(function (bb, p) { return bb.extend(p); }, new view.mapboxgl.LngLatBounds(c[0], c[0]));
          map.fitBounds(bounds, { padding: 40, duration: 600 });
        }
      }).catch(function () { setLine(null); });
    }

    function setLine(geom) {
      var map = view.map;
      var data = { type: 'Feature', geometry: geom || { type: 'LineString', coordinates: [] } };
      if (map.getSource('route')) { map.getSource('route').setData(data); return; }
      map.addSource('route', { type: 'geojson', data: data });
      map.addLayer({ id: 'route-casing', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#0E1726', 'line-width': 8 } });
      map.addLayer({ id: 'route', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#FFC629', 'line-width': 4 } });
    }

    // Which fixed-price route does this trip match? Offer it, never force it.
    function routeFor(a, b) {
      var town = function (p) { return p && (CFG.townOf[(p.local || '').toLowerCase()] || CFG.townOf[(p.town || '').toLowerCase()]); };
      var near = function (p) {
        if (!p) return null;
        for (var id in CFG.airports) {
          var ap = CFG.airports[id];
          if (Math.abs(ap.lat - p.lat) < 0.03 && Math.abs(ap.lng - p.lng) < 0.05) return id;
        }
        return null;
      };
      var air = near(a) || near(b);
      if (air) return air;
      var ta = town(a), tb = town(b);
      if (!ta || !tb) return a && b ? 'anders' : null;
      if (ta === 'utrecht' && tb === 'utrecht') return 'utrecht';
      if (ta === 'utrecht') return tb;
      if (tb === 'utrecht') return ta;
      return 'anders';
    }

    function suggest(a, b) {
      if (!hint) return;
      var id = a && (b || ends.b) ? routeFor(a, ends.b || b) : null;
      if (!id || id === dest.value) { hint.hidden = true; return; }
      var opt = $('option[value="' + id + '"]', dest);
      if (!opt) { hint.hidden = true; return; }
      $('[data-route-hint-text]', hint).textContent = 'Deze rit past bij: ' + opt.textContent + (opt.dataset.price ? ' (' + (opt.dataset.from ? 'v.a. ' : '') + '€' + NB + opt.dataset.price + ')' : ' (prijs op aanvraag)') + '.';
      var btn = $('[data-route-hint-use]', hint);
      btn.onclick = function () { dest.value = id; dest.dispatchEvent(new Event('change', { bubbles: true })); hint.hidden = true; };
      hint.hidden = false;
    }

    function fallback(e) { if (window.console) console.warn('Kaart niet beschikbaar:', e && e.message); if (mapEl) mapEl.hidden = true; }

  }

  /* ---------- service-area map ---------- */
  function areaMap(el) {
    var start = function () {
      makeMap(el, { map: { center: [5.12, 52.07], zoom: 10.2 } }).then(function (v) {
        var gl = v.mapboxgl;
        var bounds = new gl.LngLatBounds();
        CFG.places.forEach(function (p) {
          var node = document.createElement('a');
          node.className = 'town-pin' + (p.left ? ' town-pin--left' : '');
          node.href = p.href;
          node.setAttribute('aria-label', 'Taxi ' + p.name + (p.price ? ', ' + p.price : ''));
          var dot = document.createElement('span');
          dot.className = 'town-pin__dot';
          var label = document.createElement('span');
          label.className = 'town-pin__label';
          label.textContent = p.name + (p.price ? ' · ' + p.price : '');
          node.appendChild(dot);
          node.appendChild(label);
          new gl.Marker({ element: node, anchor: p.left ? 'right' : 'left', offset: [p.left ? 7 : -7, 0] }).setLngLat([p.lng, p.lat]).addTo(v.map);
          bounds.extend([p.lng, p.lat]);
        });
        v.map.fitBounds(bounds, { padding: { top: 40, bottom: 40, left: 30, right: 110 }, duration: 0 });
      }).catch(function () { el.hidden = true; });
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); start(); } }, { rootMargin: '300px' });
      io.observe(el);
    } else start();
  }
})();

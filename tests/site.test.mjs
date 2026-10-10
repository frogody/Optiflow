// Run with: npm test (Node's built-in test runner, no dependencies).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { site, fares, places, airports, routes, priceLabel, busPrice, metaLabel, linker, minifyCss, NB } from '../src/lib.mjs';
import { validateData } from '../src/validate.mjs';

const clone = (o) => JSON.parse(JSON.stringify(o));
const data = () => clone({ site, fares, places, airports });

test('the shipped data is consistent', () => {
  assert.deepEqual(validateData(data()), []);
});

test('validation catches broken references and bad values', () => {
  const d = data();
  d.places[0].route = 'nergens';
  d.places[1].nearby.push('atlantis');
  d.fares.routes[0].price = 12.5;
  d.site.phoneE164 = '+31000000000';
  const errors = validateData(d).join('\n');
  assert.match(errors, /unknown route "nergens"/);
  assert.match(errors, /unknown nearby place "atlantis"/);
  assert.match(errors, /price must be a whole number/);
  assert.match(errors, /phoneE164/);
});

test('price labels', () => {
  assert.equal(priceLabel({ price: 89 }), `€${NB}89`);
  assert.equal(priceLabel({ price: 10, from: true }), `v.a. €${NB}10`);
  assert.equal(priceLabel({ price: 89 }, { bus: true }), `ca. €${NB}${Math.round(89 * site.busFactor)}`);
  assert.equal(priceLabel({ price: null }), null);
  assert.equal(priceLabel(undefined), null);
});

test('taxibus price rounds to whole euros', () => {
  for (const r of fares.routes.filter((x) => x.price != null)) {
    assert.ok(Number.isInteger(busPrice(r.price)), `${r.id}: ${busPrice(r.price)}`);
  }
});

test('browser and build compute the same price for every route and vehicle', () => {
  // Pull priceFor out of the client script and run it against the build's rule.
  const js = readFileSync(new URL('../src/assets/site.js', import.meta.url), 'utf8');
  const fn = js.match(/function priceFor\(price, from, factor\) \{[\s\S]*?\n  \}/);
  assert.ok(fn, 'priceFor not found in site.js');
  const money = (n) => `€${NB}${n}`;
  const priceFor = new Function('money', `${fn[0]}; return priceFor;`)(money);
  for (const r of fares.routes) {
    for (const factor of [1, site.busFactor]) {
      const client = priceFor(r.price == null ? '' : String(r.price), r.from ? '1' : '', factor);
      const build = priceLabel(r, { bus: factor > 1 });
      assert.equal(client, build, `${r.id} × ${factor}`);
    }
  }
});

test('meta label joins distance and time', () => {
  assert.equal(metaLabel(routes.schiphol), `47${NB}km · ±${NB}45${NB}min`);
  assert.equal(metaLabel({ km: null, min: null }), '');
});

test('preview links are relative and point at index.html files', () => {
  assert.equal(linker('/', 'preview').link('/tarieven/'), 'tarieven/index.html');
  assert.equal(linker('/luchthavens/schiphol/', 'preview').link('/'), '../../index.html');
  assert.equal(linker('/404.html', 'preview').link('/boeken/'), 'boeken/index.html');
  assert.equal(linker('/a/', 'preview').link('/b/#x'), '../b/index.html#x');
  assert.equal(linker('/a/', 'production').link('/b/'), '/b/');
  assert.equal(linker('/a/', 'preview').link('tel:+31'), 'tel:+31');
});

test('CSS minifier keeps descendant pseudo-class selectors intact', () => {
  assert.equal(minifyCss('/* x */\n.a :focus-visible { color: red; }\n'), '.a :focus-visible{color: red}');
  assert.equal(minifyCss('a,\nb { x: 1 ; y: 2; }'), 'a,b{x: 1;y: 2}');
});

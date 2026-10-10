#!/usr/bin/env node
// Verifies a build: internal links and assets resolve, anchors exist, ids are unique, JSON-LD parses.
// Usage: node scripts/check.mjs [dist|dist-preview]
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const dir = resolve(process.argv[2] || 'dist');
const preview = dir.endsWith('preview');
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
})(dir);

const errors = [];
let links = 0;
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(dir, file);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) errors.push(`${rel}: duplicate id(s) ${[...new Set(dup)].join(', ')}`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { errors.push(`${rel}: invalid JSON-LD (${e.message})`); }
  }
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${rel}: missing <title>`);
  if (!/<h1[\s>]/.test(html)) errors.push(`${rel}: missing <h1>`);
  for (const m of html.matchAll(/\s(?:href|src|action)="([^"]+)"/g)) {
    const raw = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|tel:|mailto:|data:)/.test(raw)) continue;
    links++;
    const [pathq, hash] = raw.split('#');
    const path = pathq.split('?')[0];
    if (!path) {
      if (hash && !ids.includes(hash)) errors.push(`${rel}: anchor #${hash} not found`);
      continue;
    }
    let target;
    if (path.startsWith('/')) {
      if (preview) { errors.push(`${rel}: absolute link in preview build: ${raw}`); continue; }
      target = join(dir, path);
    } else {
      target = resolve(dirname(file), path);
    }
    if (target.endsWith('/') || (existsSync(target) && statSync(target).isDirectory())) target = join(target, 'index.html');
    if (!existsSync(target)) errors.push(`${rel}: broken link ${raw}`);
  }
}
// Vercel reads the repo-root vercel.json, so it must match what the build generates.
const genVercel = join(dir, 'vercel.json');
if (!preview && existsSync(genVercel)) {
  const want = JSON.parse(readFileSync(genVercel, 'utf8'));
  const have = JSON.parse(readFileSync(resolve('vercel.json'), 'utf8'));
  for (const k of ['headers', 'redirects']) {
    if (JSON.stringify(want[k]) !== JSON.stringify(have[k])) errors.push(`vercel.json: "${k}" differs from the generated ${relative(process.cwd(), genVercel)}; copy it over`);
  }
}
console.log(`${files.length} pages, ${links} internal links checked in ${relative(process.cwd(), dir) || '.'}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('✓ no broken links, duplicate ids or invalid JSON-LD');

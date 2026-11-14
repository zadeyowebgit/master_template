/**
 * Post-build on-page SEO checks (dist HTML).
 * Run: npm run build && node scripts/audit-on-page-seo.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { resolveDistDir } from './dist-dir.mjs';

const dist = resolveDistDir();

function walkHtml(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) out.push(...walkHtml(full));
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

function routeFromFile(file) {
  let route = '/' + path.relative(dist, file).replace(/\\/g, '/');
  if (route.endsWith('/index.html')) route = route.slice(0, -'index.html'.length);
  if (!route.endsWith('/')) route += '/';
  return route;
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMeta(html, name) {
  const tag = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => match[0]).find(value => new RegExp(`name=(["'])${name}\\1`, 'i').test(value));
  return tag?.match(/content=(["'])(.*?)\1/i)?.[2] ?? '';
}

function extractTitle(html) {
  return html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? '';
}

function extractLang(html) {
  return html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1] ?? '';
}

function extractH1s(html) {
  return [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
}

function extractLinks(html) {
  const links = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    let href = m[1];
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('{{')) continue;
    if (!href.startsWith('/')) continue;
    if (!href.endsWith('/')) href += '/';
    links.push({ href, text: stripTags(m[2]).slice(0, 120) });
  }
  return links;
}

const files = walkHtml(dist);
if (!files.length) {
  console.error('[audit-on-page] No HTML in dist — run astro build first.');
  process.exit(1);
}

const pages = new Map();
const inbound = new Map();

for (const file of files) {
  const route = routeFromFile(file);
  if (route.includes('/404')) continue;
  const html = fs.readFileSync(file, 'utf8');
  if (/noindex/i.test(extractMeta(html, 'robots'))) continue;
  if (/Redirecting/i.test(html) && html.includes('http-equiv="refresh"')) continue;
  const text = stripTags(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  pages.set(route, {
    route,
    title: extractTitle(html),
    description: extractMeta(html, 'description'),
    lang: extractLang(html),
    h1s: extractH1s(html),
    words,
    links: extractLinks(html),
  });
}

for (const page of pages.values()) {
  for (const { href } of page.links) {
    inbound.set(href, (inbound.get(href) ?? 0) + 1);
  }
}

const descGroups = new Map();
for (const page of pages.values()) {
  const d = page.description.trim();
  if (!d) continue;
  const list = descGroups.get(d) ?? [];
  list.push(page.route);
  descGroups.set(d, list);
}

const dupMeta = [...descGroups.entries()].filter(([, routes]) => routes.length > 1);
const thin = [...pages.values()].filter((p) => p.words < 500);
const multiH1 = [...pages.values()].filter((p) => p.h1s.length !== 1);
const orphans = [...pages.keys()].filter((r) => r !== '/' && !(inbound.get(r) ?? 0));

const anchorHist = new Map();
for (const page of pages.values()) {
  for (const { href, text } of page.links) {
    if (!text) continue;
    const key = text.toLowerCase();
    const entry = anchorHist.get(key) ?? { text, targets: new Set(), pages: new Set() };
    entry.targets.add(href);
    entry.pages.add(page.route);
    anchorHist.set(key, entry);
  }
}
const identicalAnchors = [...anchorHist.values()].filter(
  (e) => e.pages.size >= 3 && e.targets.size >= 2,
);

console.log(`[audit-on-page] ${pages.size} indexable HTML routes`);
if (dupMeta.length) {
  console.warn(`[audit-on-page] ${dupMeta.length} duplicate meta descriptions:`);
  for (const [desc, routes] of dupMeta.slice(0, 8)) {
    console.warn(`  (${routes.length}) ${desc.slice(0, 80)}… → ${routes.slice(0, 4).join(', ')}`);
  }
}
if (multiH1.length) {
  console.warn(`[audit-on-page] ${multiH1.length} pages with H1 count ≠ 1`);
}
if (thin.length) {
  console.warn(`[audit-on-page] ${thin.length} pages under 500 words`);
}
if (orphans.length) {
  console.warn(`[audit-on-page] ${orphans.length} orphan routes (no inbound internal links):`);
  for (const r of orphans.slice(0, 12)) console.warn(`  ${r}`);
}
if (identicalAnchors.length) {
  console.warn(`[audit-on-page] ${identicalAnchors.length} identical anchor texts across multiple targets`);
}

const failed = dupMeta.length + multiH1.length + orphans.length;
if (failed) {
  console.warn('[audit-on-page] Review warnings above (informational exit 0).');
} else {
  console.log('[audit-on-page] OK — no duplicate meta, single H1, no orphans.');
}

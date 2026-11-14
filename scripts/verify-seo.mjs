import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'parse5';
import { resolveDistDir } from './dist-dir.mjs';
import { LOCALES } from '../src/i18n/locales.ts';
import { blogPosts } from '../src/data/blog/posts.ts';
import { TEMPLATE_SITE_URL } from './template-site.mjs';

const dist = resolveDistDir();
const origin = TEMPLATE_SITE_URL;
const errors = [], warnings = [];
const pages = new Map();
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const content = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(content).join('');
function nodes(node, result = []) {
  if (node.tagName) result.push(node);
  for (const child of node.childNodes ?? []) nodes(child, result);
  return result;
}
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : e.name.endsWith('.html') ? [path.join(dir, e.name)] : []);
}
function check(ok, message) { if (!ok) errors.push(message); }
for (const file of files(dist)) {
  const relative = path.relative(dist, file).replaceAll('\\', '/');
  const route = relative === '404.html' ? '/404/' : '/' + (relative === 'index.html' ? '' : relative.replace(/index\.html$/, ''));
  const html = fs.readFileSync(file, 'utf8');
  const all = nodes(parse(html));
  if (all.some(n => n.tagName === 'meta' && attr(n, 'http-equiv')?.toLowerCase() === 'refresh')) continue;
  const expectedLocale = LOCALES.find(l => l.code === route.split('/')[1]) ?? LOCALES.find(l => l.code === 'en');
  const meta = name => all.find(n => n.tagName === 'meta' && (attr(n, 'name') === name || attr(n, 'property') === name));
  const title = content(all.find(n => n.tagName === 'title') ?? {});
  const description = attr(meta('description') ?? {}, 'content');
  const canonicals = all.filter(n => n.tagName === 'link' && attr(n, 'rel') === 'canonical');
  const noindex = /noindex/.test(attr(meta('robots') ?? {}, 'content') ?? '');
  const alternates = all.filter(n => n.tagName === 'link' && attr(n, 'hreflang')).map(n => ({ lang: attr(n, 'hreflang'), url: attr(n, 'href') }));
  check(Boolean(title), `${route}: missing title`);
  check(Boolean(description), `${route}: missing description`);
  check(canonicals.length === 1 && attr(canonicals[0], 'href') === origin + route, `${route}: incorrect canonical`);
  check(attr(all.find(n => n.tagName === 'html') ?? {}, 'lang') === expectedLocale.hreflang, `${route}: incorrect HTML language`);
  check(attr(meta('og:title') ?? {}, 'content') === title, `${route}: Open Graph title differs`);
  check(attr(meta('og:description') ?? {}, 'content') === description, `${route}: Open Graph description differs`);
  check(all.filter(n => n.tagName === 'h1').length === 1, `${route}: expected one H1`);
  const schemas = [];
  for (const n of all.filter(n => n.tagName === 'script' && attr(n, 'type') === 'application/ld+json')) {
    try { const data = JSON.parse(content(n)); schemas.push(...(data['@graph'] ?? [data])); }
    catch { errors.push(`${route}: malformed JSON-LD`); }
  }
  for (const schema of schemas) {
    if (schema.inLanguage) check(schema.inLanguage === expectedLocale.hreflang, `${route}: schema language ${schema.inLanguage}`);
    if (['WebPage', 'CollectionPage', 'Product', 'BlogPosting'].includes(schema['@type'])) check(schema.url === origin + route, `${route}: structured page URL differs from canonical`);
    if (schema['@type'] === 'BlogPosting') {
      check(schema.mainEntityOfPage?.['@id'] === origin + route, `${route}: article canonical mismatch`);
      check(Date.parse(schema.dateModified) >= Date.parse(schema.datePublished), `${route}: invalid article dates`);
      check(attr(meta('article:modified_time') ?? {}, 'content') === schema.dateModified, `${route}: modified time mismatch`);
    }
    if (schema['@type'] === 'Product') {
      check(!schema.aggregateRating, `${route}: unexpected aggregate review claim`);
      if (schema.offers) {
        const offers = Array.isArray(schema.offers) ? schema.offers : [schema.offers];
        check(offers.every(o => o && Number.isFinite(Number(o.price)) && o.priceCurrency === 'USD'), `${route}: product offer without a verified USD price`);
      }
    }
    check(schema['@type'] !== 'FAQPage', `${route}: commercial FAQPage JSON-LD is not allowed`);
  }
  if (title.length > 75) warnings.push(`${route}: title exceeds 75 characters`);
  const ids = new Set(all.map(n => attr(n, 'id')).filter(Boolean));
  const links = all.filter(n => n.tagName === 'a').map(n => attr(n, 'href')).filter(Boolean);
  pages.set(route, { title, description, noindex, alternates, links, ids });
}
const incoming = new Set();
for (const [route, page] of pages) {
  if (page.noindex || route === '/404.html') continue;
  check(page.alternates.length === (route === '/reviews/' ? 2 : LOCALES.length + 1), `${route}: incomplete language alternates`);
  for (const alt of page.alternates) {
    const target = new URL(alt.url).pathname;
    const peer = pages.get(target);
    check(new URL(alt.url).origin === origin && peer && !peer.noindex, `${route}: alternate is not an indexable canonical: ${alt.url}`);
    check(peer?.alternates.some(a => a.url === origin + route), `${route}: alternate lacks reciprocal link: ${alt.url}`);
  }
  for (const href of page.links) {
    const url = new URL(href, origin + route);
    if (url.origin !== origin || url.pathname.startsWith('/go/')) continue;
    const target = pages.get(url.pathname);
    if (target) {
      incoming.add(url.pathname);
      if (url.hash) check(target.ids.has(decodeURIComponent(url.hash.slice(1))), `${route}: broken fragment ${href}`);
    } else {
      check(fs.existsSync(path.join(dist, url.pathname)), `${route}: broken link ${href}`);
    }
  }
}
for (const post of blogPosts) {
  const words = post.body.reduce((sum, block) => {
    const text = 'text' in block ? block.text : block.type === 'ul' ? block.items.join(' ') : block.type === 'table' ? [block.headers, ...block.rows].flat().join(' ') : '';
    return sum + text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').split(/\s+/).filter(Boolean).length;
  }, 0);
  const minutes = Math.ceil(words / 200);
  if (minutes < 5 || minutes > 15) warnings.push(`${post.slug}: reading time outside 5–15 minutes`);
  check(post.readTime === `${minutes} min read`, `${post.slug}: reading time does not match article length`);
}
const titles = new Map(), descriptions = new Map();
for (const [route, page] of pages) {
  if (page.noindex) continue;
  check(route === '/' || incoming.has(route), `${route}: no inbound internal link`);
  for (const [map, value, name] of [[titles, page.title, 'title'], [descriptions, page.description, 'description']]) {
    check(!map.has(value), `${route}: duplicate ${name} with ${map.get(value)}`);
    map.set(value, route);
  }
}
const sitemap = fs.readFileSync(path.join(dist, 'sitemap-all.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const sitemapSet = new Set(sitemapUrls);
check(sitemapSet.size === sitemapUrls.length, 'Duplicate sitemap entries');
for (const url of sitemapUrls) {
  const page = pages.get(new URL(url).pathname);
  check(url.startsWith(origin + '/') && page && !page.noindex, `Sitemap includes noncanonical, missing or noindex URL: ${url}`);
}
for (const [route, page] of pages) if (!page.noindex) check(sitemapSet.has(origin + route), `${route}: indexable page missing from sitemap`);
for (const block of sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
  const route = new URL(block[1].match(/<loc>([^<]+)/)[1]).pathname;
  const date = block[1].match(/<lastmod>([^<]+)/)?.[1];
  if (/\/blog\/[^/]+\/$/.test(route)) {
    const slug = route.split('/').filter(Boolean).at(-1);
    const post = blogPosts.find(p => p.slug === slug);
    const expected = new Date(post.modifiedDate ?? post.date).toISOString().slice(0, 10);
    check(date === expected, `${route}: incorrect revision in sitemap`);
  }
  else if (/\/products\//.test(route)) {
    /* catalog lastmod is allowed */
  } else check(!date, `${route}: unsupported modification date`);
}
const robotsTxt = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
check(/User-agent:\s*\*\s*\nAllow:\s*\//.test(robotsTxt), 'robots.txt must allow crawling when the domain is attached');
check(!/^Disallow:\s*\/\s*$/m.test(robotsTxt), 'robots.txt must not Disallow: / on production');
check(robotsTxt.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt must list the production sitemap index');
check(fs.existsSync(path.join(dist, 'sitemap.xml')), 'sitemap.xml missing');
const sitemapIndex = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
check(sitemapIndex.includes('<sitemapindex'), 'sitemap.xml must be a sitemap index');
check(sitemapIndex.includes(`${origin}/sitemap-pages.xml`), 'sitemap index missing pages child');
const report = { checkedAt: new Date().toISOString(), pages: pages.size, indexablePages: [...pages.values()].filter(p => !p.noindex).length, sitemapUrls: sitemapUrls.length, locales: LOCALES.length, errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/seo-validation.json', JSON.stringify(report, null, 2) + '\n');
console.log(`SEO checks: ${report.pages} pages, ${report.indexablePages} indexable, ${report.sitemapUrls} sitemap URLs, ${report.locales} languages.`);
if (report.errors.length) console.error(report.errors.slice(0, 35).join('\n'));
console.log(`${report.errors.length} errors; ${report.warnings.length} editorial length warnings. See docs/seo-validation.json.`);
process.exitCode = report.errors.length ? 1 : 0;

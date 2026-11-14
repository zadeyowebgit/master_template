import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'parse5';
import { blogPosts } from '../src/data/blog/posts';
import { localizeBlogPost } from '../src/data/blog/localize';
import { articleRevision } from '../src/data/article-revision.mjs';
import { FORUM_CONSOLIDATIONS, CONTENT_LOCALE_PREFIXES } from '../src/data/forum-consolidations.mjs';
import { PATH_REDIRECTS, auditRedirectGraph } from './redirects.mjs';
import { PRIMARY_CHECKOUT } from '../src/config/checkout-redirects.mjs';
import { TEMPLATE_SITE_URL } from './template-site.mjs';
import translations from '../src/data/blog/translations.json';

const urls = [...fs.readFileSync('dist/sitemap-all.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const expectedConsolidations = Object.keys(FORUM_CONSOLIDATIONS).length * CONTENT_LOCALE_PREFIXES.length;
assert.equal(urls.length, 397 - expectedConsolidations);
assert.deepEqual(auditRedirectGraph(), []);
const attr = (n: any, key: string) => n.attrs?.find((a: any) => a.name === key)?.value;
function nodes(n: any, result: any[] = []) { if (n.tagName) result.push(n); for (const c of n.childNodes ?? []) nodes(c, result); return result; }
function text(n: any): string { return !n || ['script', 'style', 'svg', 'nav', 'footer', 'header'].includes(n.tagName) ? '' : n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(text).join(' ').replace(/\s+/g, ' ').trim(); }
const resourceErrors: string[] = [];
const pages: any[] = [];
let checkoutLinks = 0;
const assets = new Set<string>();
const titleSet = new Set<string>();
const descriptionSet = new Set<string>();
for (const url of urls) {
  const route = new URL(url).pathname;
  const html = fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8');
  const all = nodes(parse(html));
  const main = all.find(n => n.tagName === 'main');
  const copy = text(main);
  assert(!/300\+|<24h|Ranked Safe|Choose Lite, Pro or Elite/.test(copy), `${route}: retired or unsupported claim`);
  assert(!/\[[^\]]+\]\(\/[^)]+\)/.test(copy), `${route}: raw Markdown link`);
  assert(!/やり投げ|Kaufen Uber/.test(copy), `${route}: known mistranslation`);
  assert(all.filter(n => n.tagName === 'h1').length === 1, route);
  let previousHeading = 0;
  for (const heading of nodes(main).filter(n => /^h[1-6]$/.test(n.tagName))) {
    const level = Number(heading.tagName.slice(1));
    assert(!previousHeading || level <= previousHeading + 1, `${route}: skipped heading level`);
    previousHeading = level;
  }
  const title = all.find(n => n.tagName === 'title')?.childNodes[0]?.value;
  const description = attr(all.find(n => n.tagName === 'meta' && attr(n, 'name') === 'description'), 'content');
  assert(!titleSet.has(title), `${route}: duplicate title`); titleSet.add(title);
  assert(!descriptionSet.has(description), `${route}: duplicate description`); descriptionSet.add(description);
  for (const meta of all.filter(n => n.tagName === 'meta' && /^(?:og|twitter):(?:title|description)$/.test(attr(n, 'property') ?? attr(n, 'name') ?? ''))) {
    const key = attr(meta, 'property') ?? attr(meta, 'name');
    assert.equal(attr(meta, 'content'), key.endsWith('title') ? title : description, `${route}: social metadata`);
  }
  for (const n of all) {
    if (n.tagName === 'script' && attr(n, 'type') === 'application/ld+json') {
      function checkSchema(value: any, key = '') {
        if (typeof value === 'string' && key === 'url' && value.startsWith(`${TEMPLATE_SITE_URL}/`)) {
          const pathname = new URL(value).pathname;
          assert(!PATH_REDIRECTS.has(pathname), `${route}: structured link to redirect ${value}`);
          assert(fs.existsSync(path.join('dist', pathname, 'index.html')) || fs.existsSync(path.join('dist', pathname)), `${route}: structured URL has no destination: ${value}`);
        } else if (Array.isArray(value)) value.forEach(item => checkSchema(item, key));
        else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => checkSchema(v, k));
      }
      checkSchema(JSON.parse(n.childNodes.map((c: any) => c.value ?? '').join('')));
    }
    for (const name of ['src', 'poster', ...(n.tagName === 'link' && attr(n, 'rel') === 'stylesheet' ? ['href'] : [])]) {
      const value = attr(n, name);
      if (!value) continue;
      if (value.startsWith('http:')) resourceErrors.push(`${route}: mixed resource ${value}`);
      if (value.startsWith('/') && !value.startsWith('//')) assets.add(value.split(/[?#]/)[0]);
    }
    const set = attr(n, 'srcset');
    if (set) for (const candidate of set.split(',')) {
      const file = candidate.trim().split(/\s+/)[0];
      if (file.startsWith('/')) assets.add(file.split(/[?#]/)[0]);
    }
    if (n.tagName === 'img') {
      assert(attr(n, 'alt') !== undefined && (attr(n, 'alt').trim() || attr(n, 'class')?.includes('brand-logo__icon')), `${route}: missing alt`);
      assert(Number(attr(n, 'width')) > 0 && Number(attr(n, 'height')) > 0, `${route}: missing image dimensions`);
    }
    if (n.tagName === 'a') {
      const href = attr(n, 'href') ?? '';
      if (href.includes('/go/ZOBIA') || n.attrs?.some((a: any) => a.name === 'data-checkout-buy')) {
        assert.equal(href, PRIMARY_CHECKOUT, `${route}: exact checkout link`); checkoutLinks++;
      }
      if (href.startsWith('/') && !href.startsWith('//')) {
        const clean = href.split(/[?#]/)[0];
        assert(!PATH_REDIRECTS.has(clean), `${route}: link to redirect ${href}`);
      }
    }
  }
  const prefix = route.match(/^\/(de|es|fr|ja|pl|pt|ru|tr)(?=\/)/)?.[0] ?? '';
  const bare = route.slice(prefix.length);
  if (bare === '/' || bare === '/faq/' || bare === '/products/cheats/featured-package/') {
    const faq = all.filter(n => n.tagName === 'script' && attr(n, 'type') === 'application/ld+json').flatMap(n => { const v = JSON.parse(n.childNodes.map((c: any) => c.value ?? '').join('')); return v['@graph'] ?? [v]; }).find(s => s['@type'] === 'FAQPage');
    assert.equal(faq?.mainEntity.length, bare === '/' ? 6 : bare === '/faq/' ? 18 : 4, `${route}: distinct FAQ scope`);
  }
  pages.push({ url, title, titleChars: title.length, description, descriptionChars: description.length, h1: text(all.find(n => n.tagName === 'h1')) });
}
for (const asset of assets) if (!fs.existsSync(path.join('dist', asset))) resourceErrors.push(`Missing ${asset}`);
assert.deepEqual(resourceErrors, []);
const redirects: { from: string; to: string }[] = [];
for (const prefix of CONTENT_LOCALE_PREFIXES) for (const [slug, target] of Object.entries(FORUM_CONSOLIDATIONS)) {
  const from = `${prefix}/forum/${slug}/`, to = `${prefix}${target}`;
  assert.equal(PATH_REDIRECTS.get(from), to);
  assert(!urls.includes(TEMPLATE_SITE_URL + from));
  assert(urls.includes(TEMPLATE_SITE_URL + to));
  redirects.push({ from, to });
}
for (const [locale, posts] of Object.entries(translations)) for (const post of blogPosts) {
  assert.equal((posts as any)[post.slug].sourceRevision, articleRevision(post));
  const translated = localizeBlogPost(post, locale as any);
  assert.equal(translated.body.length, post.body.length);
}
assert.throws(() => localizeBlogPost({ ...blogPosts[0], body: [...blogPosts[0].body, { type: 'p', text: 'A source edit must invalidate the snapshot.' }] }, 'de'), /Stale de article/);
const report = { checkedAt: new Date().toISOString(), indexablePages: pages.length, sourceLinkedTranslations: 77, forumConsolidations: redirects, checkoutLinks, localAssets: assets.size, errors: [], pages };
fs.writeFileSync('docs/seo-implementation-verification.json', JSON.stringify(report, null, 2) + '\n');
console.log(`Implementation checks passed: ${pages.length} pages, 77 translations, ${redirects.length} consolidations, ${checkoutLinks} exact checkout links, ${assets.size} resources.`);

import fs from 'node:fs';
import { blogPosts } from '../src/data/blog/posts';
import { forumPosts } from '../src/data/forum';
import { purchaseFaqs } from '../src/data/purchaseFaqs';
import { productPages } from '../src/data/products';
import { PAGE_SEO } from '../src/config/pageSeo';
import { hasContentTranslation } from '../src/i18n/content';
import type { LocaleCode } from '../src/i18n/locales';

const strings = new Set<string>();
function walk(value: unknown, key = '') {
  if (/^(?:slug|id|href|url|src|icon|type|kind|date|modifiedDate|editorialRevision|author|sourceRevision|sourcePath|sourceTitle|readTime|parentPillar|relatedKeywords)$/.test(key) || /(?:Url|Slugs)$/.test(key)) return;
  if (typeof value === 'string' && /[a-z]{3}/i.test(value) && !/^(https?:|\/)/.test(value)) strings.add(value);
  else if (Array.isArray(value)) value.forEach(v => walk(v, key));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => walk(v, k));
}
walk(blogPosts); walk(forumPosts); walk(purchaseFaqs); walk(productPages); walk(PAGE_SEO);
const file = 'scripts/_tmp/language-source-gaps.json';
const gaps = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
for (const locale of ['de', 'es', 'fr', 'pl', 'pt', 'ru', 'tr', 'ja'] as LocaleCode[]) {
  gaps[locale] = [...new Set([...(gaps[locale] ?? []), ...[...strings].filter(s => !hasContentTranslation(s, locale))])];
}
fs.mkdirSync('scripts/_tmp', { recursive: true });
fs.writeFileSync(file, JSON.stringify(gaps, null, 2) + '\n');
console.log(Object.fromEntries(Object.entries(gaps).map(([l, s]) => [l, (s as string[]).length])));

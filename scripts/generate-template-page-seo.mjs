import fs from 'node:fs';
import { TEMPLATE_BLOG_SLUGS } from './lib/template-blog-slugs.mjs';

const blogSlugs = TEMPLATE_BLOG_SLUGS;

const base = {
  '/': {
    title: '[[SEO_HOME_TITLE]]',
    description: '[[SEO_HOME_DESCRIPTION]]',
  },
  '/products/cheats/': {
    title: '[[SEO_PRODUCTS_HUB_TITLE]]',
    description: '[[SEO_PRODUCTS_HUB_DESCRIPTION]]',
  },
  '/products/cheats/featured-package/': {
    title: '[[SEO_PRODUCT_DETAIL_TITLE]]',
    description: '[[SEO_PRODUCT_DETAIL_DESCRIPTION]]',
  },
  '/products/cheats/feature-comparison/': {
    title: '[[SEO_FEATURE_COMPARE_TITLE]]',
    description: '[[SEO_FEATURE_COMPARE_DESCRIPTION]]',
  },
  '/blog/': { title: '[[SEO_BLOG_INDEX_TITLE]]', description: '[[SEO_BLOG_INDEX_DESCRIPTION]]' },
  '/forum/': { title: '[[SEO_FORUM_TITLE]]', description: '[[SEO_FORUM_DESCRIPTION]]' },
  '/faq/': { title: '[[SEO_FAQ_TITLE]]', description: '[[SEO_FAQ_DESCRIPTION]]' },
  '/support/': { title: '[[SEO_SUPPORT_TITLE]]', description: '[[SEO_SUPPORT_DESCRIPTION]]' },
  '/about/': { title: '[[SEO_ABOUT_TITLE]]', description: '[[SEO_ABOUT_DESCRIPTION]]' },
  '/privacy/': { title: '[[SEO_PRIVACY_TITLE]]', description: '[[SEO_PRIVACY_DESCRIPTION]]' },
  '/terms/': { title: '[[SEO_TERMS_TITLE]]', description: '[[SEO_TERMS_DESCRIPTION]]' },
  '/reviews/': { title: '[[SEO_REVIEWS_TITLE]]', description: '[[SEO_REVIEWS_DESCRIPTION]]' },
};

for (const slug of blogSlugs) {
  const key = `/blog/${slug}/`;
  base[key] = {
    title: `[[SEO_BLOG_${slug.toUpperCase().replace(/-/g, '_')}_TITLE]]`,
    description: `[[SEO_BLOG_${slug.toUpperCase().replace(/-/g, '_')}_DESCRIPTION]]`,
  };
}

const out = `import { stripLocalePrefix } from '../i18n/utils';\n\nexport interface PageSeoEntry { title: string; description: string; }\n\nexport const PAGE_SEO: Record<string, PageSeoEntry> = ${JSON.stringify(base, null, 2)};\n\nfunction normalizeSeoPath(pathname: string): string {\n  const bare = stripLocalePrefix(pathname);\n  return bare.endsWith('/') || bare === '/' ? bare : bare + '/';\n}\n\nexport function getPageSeoEntry(pathname: string): PageSeoEntry | undefined {\n  return PAGE_SEO[normalizeSeoPath(pathname)];\n}\n`;
fs.writeFileSync('src/config/pageSeo.ts', out);
console.log('pageSeo.ts generated', Object.keys(base).length);

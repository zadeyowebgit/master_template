import fs from 'node:fs';

import { TEMPLATE_BLOG_SLUGS } from './lib/template-blog-slugs.mjs';

const routes = {
  '/': {
    keyword: '[[AUDIT_HOME_KEYWORD]]',
    title: '[[AUDIT_HOME_TITLE]]',
    description: '[[AUDIT_HOME_DESCRIPTION]]',
    h1: '[[AUDIT_HOME_H1]]',
    intro: '[[AUDIT_HOME_INTRO]]',
  },
  '/blog/': {
    keyword: '[[AUDIT_BLOG_KEYWORD]]',
    title: '[[AUDIT_BLOG_TITLE]]',
    description: '[[AUDIT_BLOG_DESCRIPTION]]',
    h1: '[[AUDIT_BLOG_H1]]',
  },
  '/products/cheats/': {
    keyword: '[[AUDIT_PRODUCTS_KEYWORD]]',
    title: '[[AUDIT_PRODUCTS_TITLE]]',
    description: '[[AUDIT_PRODUCTS_DESCRIPTION]]',
    h1: '[[AUDIT_PRODUCTS_H1]]',
  },
  '/products/cheats/featured-package/': {
    keyword: '[[AUDIT_PRODUCT_KEYWORD]]',
    title: '[[AUDIT_PRODUCT_TITLE]]',
    description: '[[AUDIT_PRODUCT_DESCRIPTION]]',
    h1: '[[AUDIT_PRODUCT_H1]]',
  },
  '/forum/': {
    keyword: '[[AUDIT_FORUM_KEYWORD]]',
    h1: '[[AUDIT_FORUM_H1]]',
  },
  '/faq/': {
    keyword: '[[AUDIT_FAQ_KEYWORD]]',
    title: '[[AUDIT_FAQ_TITLE]]',
    description: '[[AUDIT_FAQ_DESCRIPTION]]',
    h1: '[[AUDIT_FAQ_H1]]',
  },
  '/support/': {
    keyword: '[[AUDIT_SUPPORT_KEYWORD]]',
    h1: '[[AUDIT_SUPPORT_H1]]',
  },
  '/about/': {
    keyword: '[[AUDIT_ABOUT_KEYWORD]]',
    title: '[[AUDIT_ABOUT_TITLE]]',
    description: '[[AUDIT_ABOUT_DESCRIPTION]]',
    h1: '[[AUDIT_ABOUT_H1]]',
  },
  '/reviews/': {
    keyword: '[[AUDIT_REVIEWS_KEYWORD]]',
    title: '[[AUDIT_REVIEWS_TITLE]]',
    description: '[[AUDIT_REVIEWS_DESCRIPTION]]',
    h1: '[[AUDIT_REVIEWS_H1]]',
  },
};

for (const slug of TEMPLATE_BLOG_SLUGS) {
  const key = `/blog/${slug}/`;
  routes[key] = {
    keyword: `[[AUDIT_BLOG_${slug.toUpperCase().replace(/-/g, '_')}_KEYWORD]]`,
    h1: `[[AUDIT_BLOG_${slug.toUpperCase().replace(/-/g, '_')}_H1]]`,
  };
}

const out = `/** Route-specific search intent; default-language metadata is server rendered. */
export const AUDIT_SEO: Record<string, { keyword: string; title?: string; description?: string; h1?: string; intro?: string; h2?: string }> = ${JSON.stringify(routes, null, 2)};

export function auditSeo(path: string) {
  return AUDIT_SEO[path];
}
`;

fs.writeFileSync('src/config/auditSeo.ts', out);
console.log('auditSeo.ts generated');

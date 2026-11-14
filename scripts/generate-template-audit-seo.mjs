import fs from 'node:fs';

const routes = {
  '/': {
    keyword: '[[AUDIT_HOME_KEYWORD]]',
    title: '[[AUDIT_HOME_TITLE]]',
    description: '[[AUDIT_HOME_DESCRIPTION]]',
    h1: '[[AUDIT_HOME_H1]]',
  },
  '/blog/': { keyword: '[[AUDIT_BLOG_KEYWORD]]' },
  '/products/cheats/': {
    keyword: '[[AUDIT_PRODUCTS_KEYWORD]]',
    title: '[[AUDIT_PRODUCTS_TITLE]]',
    description: '[[AUDIT_PRODUCTS_DESCRIPTION]]',
  },
  '/about/': {
    keyword: '[[AUDIT_ABOUT_KEYWORD]]',
    title: '[[AUDIT_ABOUT_TITLE]]',
    description: '[[AUDIT_ABOUT_DESCRIPTION]]',
  },
  '/faq/': {
    keyword: '[[AUDIT_FAQ_KEYWORD]]',
    title: '[[AUDIT_FAQ_TITLE]]',
    description: '[[AUDIT_FAQ_DESCRIPTION]]',
  },
  '/reviews/': {
    keyword: '[[AUDIT_REVIEWS_KEYWORD]]',
    title: '[[AUDIT_REVIEWS_TITLE]]',
    description: '[[AUDIT_REVIEWS_DESCRIPTION]]',
  },
};

const out = `/** Route-specific search intent; default-language metadata is server rendered. */
export const AUDIT_SEO: Record<string, { keyword: string; title?: string; description?: string; h1?: string; intro?: string; h2?: string }> = ${JSON.stringify(routes, null, 2)};

export function auditSeo(path: string) {
  return AUDIT_SEO[path];
}
`;

fs.writeFileSync('src/config/auditSeo.ts', out);
console.log('auditSeo.ts generated');

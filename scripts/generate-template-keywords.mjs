import fs from 'node:fs';

const blogSlugs = [
  'best-cheats', 'aimbot', 'esp', 'anticheat', 'bans', 'buying', 'safety', 'features',
  'access', 'skins', 'external', 'automation', 'dma', 'recoil', 'windows', 'radar',
];

const forumSlugs = [
  'overlay-questions', 'fov-questions', 'aimbot-delay', 'launch-errors',
  'stream-proof', 'hardware-change', 'requirements-check',
];

function plan(primary, h1, intent = 'informational', secondary = []) {
  return { primary, secondary, intent, h1 };
}

const pages = {
  '/': plan('[[KW_HOME_PRIMARY]]', '[[KW_HOME_H1]]', 'transactional', ['[[KW_HOME_SEC_1]]', '[[KW_HOME_SEC_2]]']),
  '/products/cheats/': plan('[[KW_PRODUCTS_PRIMARY]]', '[[KW_PRODUCTS_H1]]', 'transactional'),
  '/products/cheats/featured-package/': plan('[[KW_PRODUCT_PRIMARY]]', '[[KW_PRODUCT_H1]]', 'transactional'),
  '/products/cheats/feature-comparison/': plan('[[KW_COMPARE_PRIMARY]]', '[[KW_COMPARE_H1]]', 'commercial'),
  '/blog/': plan('[[KW_BLOG_INDEX_PRIMARY]]', '[[KW_BLOG_INDEX_H1]]', 'informational'),
  '/forum/': plan('[[KW_FORUM_PRIMARY]]', '[[KW_FORUM_H1]]', 'informational'),
  '/faq/': plan('[[KW_FAQ_PRIMARY]]', '[[KW_FAQ_H1]]', 'informational'),
  '/support/': plan('[[KW_SUPPORT_PRIMARY]]', '[[KW_SUPPORT_H1]]', 'commercial'),
  '/about/': plan('[[KW_ABOUT_PRIMARY]]', '[[KW_ABOUT_H1]]', 'informational'),
  '/reviews/': plan('[[KW_REVIEWS_PRIMARY]]', '[[KW_REVIEWS_H1]]', 'informational'),
  '/privacy/': plan('[[KW_PRIVACY_PRIMARY]]', 'Privacy Policy', 'informational'),
  '/terms/': plan('[[KW_TERMS_PRIMARY]]', 'Terms of Service', 'informational'),
};

for (const slug of blogSlugs) {
  pages[`/blog/${slug}/`] = plan(
    `[[KW_BLOG_${slug.replace(/-/g, '_').toUpperCase()}_PRIMARY]]`,
    `[[KW_BLOG_${slug.replace(/-/g, '_').toUpperCase()}_H1]]`,
    'informational',
  );
}

for (const slug of forumSlugs) {
  pages[`/forum/${slug}/`] = plan(
    `[[KW_FORUM_${slug.replace(/-/g, '_').toUpperCase()}_PRIMARY]]`,
    `[[KW_FORUM_${slug.replace(/-/g, '_').toUpperCase()}_H1]]`,
    'informational',
  );
}

const out = `import { stripLocalePrefix } from '../i18n/utils';

export type KeywordIntent = 'transactional' | 'commercial' | 'informational';

export interface PageKeywordPlan {
  primary: string;
  secondary: string[];
  intent: KeywordIntent;
  h1: string;
  contextualFaqTitle?: string;
}

export const PAGE_KEYWORDS: Record<string, PageKeywordPlan> = ${JSON.stringify(pages, null, 2)};

export function getPageKeywords(pathname: string): PageKeywordPlan | undefined {
  let path = stripLocalePrefix(pathname || '/');
  if (!path.startsWith('/')) path = \`/\${path}\`;
  if (path !== '/' && !path.endsWith('/')) path = \`\${path}/\`;
  const exact = PAGE_KEYWORDS[path];
  if (exact) return exact;
  if (path.startsWith('/blog/') && path !== '/blog/') return PAGE_KEYWORDS['/blog/'];
  if (path.startsWith('/forum/') && path !== '/forum/') return PAGE_KEYWORDS['/forum/'];
  if (path.startsWith('/products/cheats/') && path !== '/products/cheats/') {
    return PAGE_KEYWORDS['/products/cheats/'];
  }
  return undefined;
}
`;

fs.writeFileSync('src/config/keywords.ts', out);
console.log('keywords.ts', Object.keys(pages).length);

/**
 * Page H1 placeholders — set per route in `src/config/keywords.ts` and `src/config/auditSeo.ts`.
 * During migration, write a unique, natural H1 per page. Do not append [[GAME_NAME]] to every H1.
 */
export const TEMPLATE_PAGE_H1_TOKENS = {
  home: '[[KW_HOME_H1]]',
  productsHub: '[[KW_PRODUCTS_H1]]',
  productDetail: '[[KW_PRODUCT_H1]]',
  featureCompare: '[[KW_COMPARE_H1]]',
  blogIndex: '[[KW_BLOG_INDEX_H1]]',
  forumIndex: '[[KW_FORUM_H1]]',
  faq: '[[KW_FAQ_H1]]',
  support: '[[KW_SUPPORT_H1]]',
  about: '[[KW_ABOUT_H1]]',
  reviews: '[[KW_REVIEWS_H1]]',
  blogArticle: (slug: string) =>
    `[[KW_BLOG_${slug.replace(/-/g, '_').toUpperCase()}_H1]]`,
} as const;
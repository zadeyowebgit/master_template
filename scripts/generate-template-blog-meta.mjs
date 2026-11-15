import fs from 'node:fs';
import { TEMPLATE_BLOG_SLUGS } from './lib/template-blog-slugs.mjs';

const blogSlugs = TEMPLATE_BLOG_SLUGS;

const footerDefault = {
  checkout: '[[BLOG_FOOTER_CHECKOUT_CTA]]',
  products: '[[BLOG_FOOTER_PRODUCTS_CTA]]',
  moreGuides: '[[BLOG_FOOTER_MORE_GUIDES_CTA]]',
};

const bySlug = Object.fromEntries(
  blogSlugs.map((slug) => [slug, { ...footerDefault }]),
);

const footerTs = `export interface BlogFooterCtas { checkout: string; products: string; moreGuides: string; }

const BY_SLUG: Record<string, BlogFooterCtas> = ${JSON.stringify(bySlug, null, 2)};

const DEFAULT_CTAS: BlogFooterCtas = ${JSON.stringify(footerDefault, null, 2)};

export function getBlogFooterCtas(slug: string): BlogFooterCtas {
  return BY_SLUG[slug] ?? DEFAULT_CTAS;
}
`;

const editorialFaqs = Object.fromEntries(
  blogSlugs.map((slug) => [
    slug,
    [
      {
        q: '[[EDITORIAL_FAQ_Q1 — replace with game-specific question]]',
        a: '[[EDITORIAL_FAQ_A1 — grounded answer with placeholders for verified product facts.]]',
      },
      {
        q: '[[EDITORIAL_FAQ_Q2 — replace with game-specific question]]',
        a: '[[EDITORIAL_FAQ_A2 — grounded answer with placeholders for verified product facts.]]',
      },
    ],
  ]),
);

const editorialTs = `/** Visible source-backed answers; no commercial FAQ rich-result claim. */
export const editorialFaqs: Record<string, { q: string; a: string }[]> = ${JSON.stringify(editorialFaqs, null, 2)};
`;

const intros = Object.fromEntries(
  blogSlugs.map((slug) => [
    slug,
    '[[BLOG_EDITORIAL_INTRO — opening paragraph placeholder for migration; explain scope, verified facts, and what this guide does not claim.]]',
  ]),
);

fs.writeFileSync('src/data/blog/footer-ctas.ts', footerTs);
fs.writeFileSync('src/data/blog/editorial-faq.ts', editorialTs);
fs.writeFileSync('src/data/blog/editorial-intros.json', JSON.stringify(intros, null, 2));
fs.writeFileSync(
  'src/data/blog/supplements.ts',
  `/** Optional per-article supplements — empty in master template. */\nexport const blogSupplements: Record<string, { heading: string; text: string }[]> = {};\n`,
);
console.log('blog meta generated for', blogSlugs.length, 'articles');

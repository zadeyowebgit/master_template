export interface BlogFooterCtas { checkout: string; products: string; moreGuides: string; }

const BY_SLUG: Record<string, BlogFooterCtas> = {
  "best-cheats": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "aimbot": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "esp": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "config": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "performance": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "buying": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "safety": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "features": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "access": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "skins": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "external": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "automation": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "dma": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "recoil": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "windows": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  },
  "radar": {
    "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
    "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
    "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
  }
};

const DEFAULT_CTAS: BlogFooterCtas = {
  "checkout": "[[BLOG_FOOTER_CHECKOUT_CTA]]",
  "products": "[[BLOG_FOOTER_PRODUCTS_CTA]]",
  "moreGuides": "[[BLOG_FOOTER_MORE_GUIDES_CTA]]"
};

export function getBlogFooterCtas(slug: string): BlogFooterCtas {
  return BY_SLUG[slug] ?? DEFAULT_CTAS;
}

import { stripLocalePrefix } from '../i18n/utils';

export interface PageSeoEntry { title: string; description: string; }

export const PAGE_SEO: Record<string, PageSeoEntry> = {
  "/": {
    "title": "[[SEO_HOME_TITLE]]",
    "description": "[[SEO_HOME_DESCRIPTION]]"
  },
  "/products/cheats/": {
    "title": "[[SEO_PRODUCTS_HUB_TITLE]]",
    "description": "[[SEO_PRODUCTS_HUB_DESCRIPTION]]"
  },
  "/products/cheats/featured-package/": {
    "title": "[[SEO_PRODUCT_DETAIL_TITLE]]",
    "description": "[[SEO_PRODUCT_DETAIL_DESCRIPTION]]"
  },
  "/products/cheats/feature-comparison/": {
    "title": "[[SEO_FEATURE_COMPARE_TITLE]]",
    "description": "[[SEO_FEATURE_COMPARE_DESCRIPTION]]"
  },
  "/blog/": {
    "title": "[[SEO_BLOG_INDEX_TITLE]]",
    "description": "[[SEO_BLOG_INDEX_DESCRIPTION]]"
  },
  "/forum/": {
    "title": "[[SEO_FORUM_TITLE]]",
    "description": "[[SEO_FORUM_DESCRIPTION]]"
  },
  "/faq/": {
    "title": "[[SEO_FAQ_TITLE]]",
    "description": "[[SEO_FAQ_DESCRIPTION]]"
  },
  "/support/": {
    "title": "[[SEO_SUPPORT_TITLE]]",
    "description": "[[SEO_SUPPORT_DESCRIPTION]]"
  },
  "/about/": {
    "title": "[[SEO_ABOUT_TITLE]]",
    "description": "[[SEO_ABOUT_DESCRIPTION]]"
  },
  "/privacy/": {
    "title": "[[SEO_PRIVACY_TITLE]]",
    "description": "[[SEO_PRIVACY_DESCRIPTION]]"
  },
  "/terms/": {
    "title": "[[SEO_TERMS_TITLE]]",
    "description": "[[SEO_TERMS_DESCRIPTION]]"
  },
  "/reviews/": {
    "title": "[[SEO_REVIEWS_TITLE]]",
    "description": "[[SEO_REVIEWS_DESCRIPTION]]"
  },
  "/blog/best-cheats/": {
    "title": "[[SEO_BLOG_BEST_CHEATS_TITLE]]",
    "description": "[[SEO_BLOG_BEST_CHEATS_DESCRIPTION]]"
  },
  "/blog/aimbot/": {
    "title": "[[SEO_BLOG_AIMBOT_TITLE]]",
    "description": "[[SEO_BLOG_AIMBOT_DESCRIPTION]]"
  },
  "/blog/esp/": {
    "title": "[[SEO_BLOG_ESP_TITLE]]",
    "description": "[[SEO_BLOG_ESP_DESCRIPTION]]"
  },
  "/blog/config/": {
    "title": "[[SEO_BLOG_CONFIG_TITLE]]",
    "description": "[[SEO_BLOG_CONFIG_DESCRIPTION]]"
  },
  "/blog/performance/": {
    "title": "[[SEO_BLOG_PERFORMANCE_TITLE]]",
    "description": "[[SEO_BLOG_PERFORMANCE_DESCRIPTION]]"
  },
  "/blog/buying/": {
    "title": "[[SEO_BLOG_BUYING_TITLE]]",
    "description": "[[SEO_BLOG_BUYING_DESCRIPTION]]"
  },
  "/blog/safety/": {
    "title": "[[SEO_BLOG_SAFETY_TITLE]]",
    "description": "[[SEO_BLOG_SAFETY_DESCRIPTION]]"
  },
  "/blog/features/": {
    "title": "[[SEO_BLOG_FEATURES_TITLE]]",
    "description": "[[SEO_BLOG_FEATURES_DESCRIPTION]]"
  },
  "/blog/access/": {
    "title": "[[SEO_BLOG_ACCESS_TITLE]]",
    "description": "[[SEO_BLOG_ACCESS_DESCRIPTION]]"
  },
  "/blog/skins/": {
    "title": "[[SEO_BLOG_SKINS_TITLE]]",
    "description": "[[SEO_BLOG_SKINS_DESCRIPTION]]"
  },
  "/blog/external/": {
    "title": "[[SEO_BLOG_EXTERNAL_TITLE]]",
    "description": "[[SEO_BLOG_EXTERNAL_DESCRIPTION]]"
  },
  "/blog/automation/": {
    "title": "[[SEO_BLOG_AUTOMATION_TITLE]]",
    "description": "[[SEO_BLOG_AUTOMATION_DESCRIPTION]]"
  },
  "/blog/dma/": {
    "title": "[[SEO_BLOG_DMA_TITLE]]",
    "description": "[[SEO_BLOG_DMA_DESCRIPTION]]"
  },
  "/blog/recoil/": {
    "title": "[[SEO_BLOG_RECOIL_TITLE]]",
    "description": "[[SEO_BLOG_RECOIL_DESCRIPTION]]"
  },
  "/blog/windows/": {
    "title": "[[SEO_BLOG_WINDOWS_TITLE]]",
    "description": "[[SEO_BLOG_WINDOWS_DESCRIPTION]]"
  },
  "/blog/radar/": {
    "title": "[[SEO_BLOG_RADAR_TITLE]]",
    "description": "[[SEO_BLOG_RADAR_DESCRIPTION]]"
  }
};

function normalizeSeoPath(pathname: string): string {
  const bare = stripLocalePrefix(pathname);
  return bare.endsWith('/') || bare === '/' ? bare : bare + '/';
}

export function getPageSeoEntry(pathname: string): PageSeoEntry | undefined {
  return PAGE_SEO[normalizeSeoPath(pathname)];
}

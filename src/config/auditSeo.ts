/** Route-specific search intent; default-language metadata is server rendered. */
export const AUDIT_SEO: Record<string, { keyword: string; title?: string; description?: string; h1?: string; intro?: string; h2?: string }> = {
  "/": {
    "keyword": "[[AUDIT_HOME_KEYWORD]]",
    "title": "[[AUDIT_HOME_TITLE]]",
    "description": "[[AUDIT_HOME_DESCRIPTION]]",
    "h1": "[[AUDIT_HOME_H1]]",
    "intro": "[[AUDIT_HOME_INTRO]]"
  },
  "/blog/": {
    "keyword": "[[AUDIT_BLOG_KEYWORD]]",
    "title": "[[AUDIT_BLOG_TITLE]]",
    "description": "[[AUDIT_BLOG_DESCRIPTION]]",
    "h1": "[[AUDIT_BLOG_H1]]"
  },
  "/products/cheats/": {
    "keyword": "[[AUDIT_PRODUCTS_KEYWORD]]",
    "title": "[[AUDIT_PRODUCTS_TITLE]]",
    "description": "[[AUDIT_PRODUCTS_DESCRIPTION]]",
    "h1": "[[AUDIT_PRODUCTS_H1]]"
  },
  "/products/cheats/featured-package/": {
    "keyword": "[[AUDIT_PRODUCT_KEYWORD]]",
    "title": "[[AUDIT_PRODUCT_TITLE]]",
    "description": "[[AUDIT_PRODUCT_DESCRIPTION]]",
    "h1": "[[AUDIT_PRODUCT_H1]]"
  },
  "/forum/": {
    "keyword": "[[AUDIT_FORUM_KEYWORD]]",
    "h1": "[[AUDIT_FORUM_H1]]"
  },
  "/faq/": {
    "keyword": "[[AUDIT_FAQ_KEYWORD]]",
    "title": "[[AUDIT_FAQ_TITLE]]",
    "description": "[[AUDIT_FAQ_DESCRIPTION]]",
    "h1": "[[AUDIT_FAQ_H1]]"
  },
  "/support/": {
    "keyword": "[[AUDIT_SUPPORT_KEYWORD]]",
    "h1": "[[AUDIT_SUPPORT_H1]]"
  },
  "/about/": {
    "keyword": "[[AUDIT_ABOUT_KEYWORD]]",
    "title": "[[AUDIT_ABOUT_TITLE]]",
    "description": "[[AUDIT_ABOUT_DESCRIPTION]]",
    "h1": "[[AUDIT_ABOUT_H1]]"
  },
  "/reviews/": {
    "keyword": "[[AUDIT_REVIEWS_KEYWORD]]",
    "title": "[[AUDIT_REVIEWS_TITLE]]",
    "description": "[[AUDIT_REVIEWS_DESCRIPTION]]",
    "h1": "[[AUDIT_REVIEWS_H1]]"
  },
  "/blog/best-cheats/": {
    "keyword": "[[AUDIT_BLOG_BEST_CHEATS_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_BEST_CHEATS_H1]]"
  },
  "/blog/aimbot/": {
    "keyword": "[[AUDIT_BLOG_AIMBOT_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_AIMBOT_H1]]"
  },
  "/blog/esp/": {
    "keyword": "[[AUDIT_BLOG_ESP_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_ESP_H1]]"
  },
  "/blog/config/": {
    "keyword": "[[AUDIT_BLOG_CONFIG_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_CONFIG_H1]]"
  },
  "/blog/performance/": {
    "keyword": "[[AUDIT_BLOG_PERFORMANCE_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_PERFORMANCE_H1]]"
  },
  "/blog/buying/": {
    "keyword": "[[AUDIT_BLOG_BUYING_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_BUYING_H1]]"
  },
  "/blog/safety/": {
    "keyword": "[[AUDIT_BLOG_SAFETY_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_SAFETY_H1]]"
  },
  "/blog/features/": {
    "keyword": "[[AUDIT_BLOG_FEATURES_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_FEATURES_H1]]"
  },
  "/blog/access/": {
    "keyword": "[[AUDIT_BLOG_ACCESS_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_ACCESS_H1]]"
  },
  "/blog/skins/": {
    "keyword": "[[AUDIT_BLOG_SKINS_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_SKINS_H1]]"
  },
  "/blog/external/": {
    "keyword": "[[AUDIT_BLOG_EXTERNAL_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_EXTERNAL_H1]]"
  },
  "/blog/automation/": {
    "keyword": "[[AUDIT_BLOG_AUTOMATION_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_AUTOMATION_H1]]"
  },
  "/blog/dma/": {
    "keyword": "[[AUDIT_BLOG_DMA_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_DMA_H1]]"
  },
  "/blog/recoil/": {
    "keyword": "[[AUDIT_BLOG_RECOIL_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_RECOIL_H1]]"
  },
  "/blog/windows/": {
    "keyword": "[[AUDIT_BLOG_WINDOWS_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_WINDOWS_H1]]"
  },
  "/blog/radar/": {
    "keyword": "[[AUDIT_BLOG_RADAR_KEYWORD]]",
    "h1": "[[AUDIT_BLOG_RADAR_H1]]"
  }
};

export function auditSeo(path: string) {
  return AUDIT_SEO[path];
}

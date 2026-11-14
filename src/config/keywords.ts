import { stripLocalePrefix } from '../i18n/utils';

export type KeywordIntent = 'transactional' | 'commercial' | 'informational';

export interface PageKeywordPlan {
  primary: string;
  secondary: string[];
  intent: KeywordIntent;
  h1: string;
  contextualFaqTitle?: string;
}

export const PAGE_KEYWORDS: Record<string, PageKeywordPlan> = {
  "/": {
    "primary": "[[KW_HOME_PRIMARY]]",
    "secondary": [
      "[[KW_HOME_SEC_1]]",
      "[[KW_HOME_SEC_2]]"
    ],
    "intent": "transactional",
    "h1": "[[KW_HOME_H1]]"
  },
  "/products/cheats/": {
    "primary": "[[KW_PRODUCTS_PRIMARY]]",
    "secondary": [],
    "intent": "transactional",
    "h1": "[[KW_PRODUCTS_H1]]"
  },
  "/products/cheats/featured-package/": {
    "primary": "[[KW_PRODUCT_PRIMARY]]",
    "secondary": [],
    "intent": "transactional",
    "h1": "[[KW_PRODUCT_H1]]"
  },
  "/products/cheats/feature-comparison/": {
    "primary": "[[KW_COMPARE_PRIMARY]]",
    "secondary": [],
    "intent": "commercial",
    "h1": "[[KW_COMPARE_H1]]"
  },
  "/blog/": {
    "primary": "[[KW_BLOG_INDEX_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_INDEX_H1]]"
  },
  "/forum/": {
    "primary": "[[KW_FORUM_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_FORUM_H1]]"
  },
  "/faq/": {
    "primary": "[[KW_FAQ_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_FAQ_H1]]"
  },
  "/support/": {
    "primary": "[[KW_SUPPORT_PRIMARY]]",
    "secondary": [],
    "intent": "commercial",
    "h1": "[[KW_SUPPORT_H1]]"
  },
  "/about/": {
    "primary": "[[KW_ABOUT_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_ABOUT_H1]]"
  },
  "/reviews/": {
    "primary": "[[KW_REVIEWS_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_REVIEWS_H1]]"
  },
  "/privacy/": {
    "primary": "[[KW_PRIVACY_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "Privacy Policy"
  },
  "/terms/": {
    "primary": "[[KW_TERMS_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "Terms of Service"
  },
  "/blog/best-cheats/": {
    "primary": "[[KW_BLOG_BEST_CHEATS_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_BEST_CHEATS_H1]]"
  },
  "/blog/aimbot/": {
    "primary": "[[KW_BLOG_AIMBOT_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_AIMBOT_H1]]"
  },
  "/blog/esp/": {
    "primary": "[[KW_BLOG_ESP_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_ESP_H1]]"
  },
  "/blog/anticheat/": {
    "primary": "[[KW_BLOG_ANTICHEAT_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_ANTICHEAT_H1]]"
  },
  "/blog/bans/": {
    "primary": "[[KW_BLOG_BANS_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_BANS_H1]]"
  },
  "/blog/buying/": {
    "primary": "[[KW_BLOG_BUYING_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_BUYING_H1]]"
  },
  "/blog/safety/": {
    "primary": "[[KW_BLOG_SAFETY_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_SAFETY_H1]]"
  },
  "/blog/features/": {
    "primary": "[[KW_BLOG_FEATURES_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_FEATURES_H1]]"
  },
  "/blog/access/": {
    "primary": "[[KW_BLOG_ACCESS_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_ACCESS_H1]]"
  },
  "/blog/skins/": {
    "primary": "[[KW_BLOG_SKINS_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_SKINS_H1]]"
  },
  "/blog/external/": {
    "primary": "[[KW_BLOG_EXTERNAL_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_EXTERNAL_H1]]"
  },
  "/blog/automation/": {
    "primary": "[[KW_BLOG_AUTOMATION_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_AUTOMATION_H1]]"
  },
  "/blog/dma/": {
    "primary": "[[KW_BLOG_DMA_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_DMA_H1]]"
  },
  "/blog/recoil/": {
    "primary": "[[KW_BLOG_RECOIL_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_RECOIL_H1]]"
  },
  "/blog/windows/": {
    "primary": "[[KW_BLOG_WINDOWS_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_WINDOWS_H1]]"
  },
  "/blog/radar/": {
    "primary": "[[KW_BLOG_RADAR_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_BLOG_RADAR_H1]]"
  },
  "/forum/overlay-questions/": {
    "primary": "[[KW_FORUM_OVERLAY_QUESTIONS_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_FORUM_OVERLAY_QUESTIONS_H1]]"
  },
  "/forum/fov-questions/": {
    "primary": "[[KW_FORUM_FOV_QUESTIONS_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_FORUM_FOV_QUESTIONS_H1]]"
  },
  "/forum/aimbot-delay/": {
    "primary": "[[KW_FORUM_AIMBOT_DELAY_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_FORUM_AIMBOT_DELAY_H1]]"
  },
  "/forum/launch-errors/": {
    "primary": "[[KW_FORUM_LAUNCH_ERRORS_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_FORUM_LAUNCH_ERRORS_H1]]"
  },
  "/forum/stream-proof/": {
    "primary": "[[KW_FORUM_STREAM_PROOF_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_FORUM_STREAM_PROOF_H1]]"
  },
  "/forum/hardware-change/": {
    "primary": "[[KW_FORUM_HARDWARE_CHANGE_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_FORUM_HARDWARE_CHANGE_H1]]"
  },
  "/forum/requirements-check/": {
    "primary": "[[KW_FORUM_REQUIREMENTS_CHECK_PRIMARY]]",
    "secondary": [],
    "intent": "informational",
    "h1": "[[KW_FORUM_REQUIREMENTS_CHECK_H1]]"
  }
};

export function getPageKeywords(pathname: string): PageKeywordPlan | undefined {
  let path = stripLocalePrefix(pathname || '/');
  if (!path.startsWith('/')) path = `/${path}`;
  if (path !== '/' && !path.endsWith('/')) path = `${path}/`;
  const exact = PAGE_KEYWORDS[path];
  if (exact) return exact;
  if (path.startsWith('/blog/') && path !== '/blog/') return PAGE_KEYWORDS['/blog/'];
  if (path.startsWith('/forum/') && path !== '/forum/') return PAGE_KEYWORDS['/forum/'];
  if (path.startsWith('/products/cheats/') && path !== '/products/cheats/') {
    return PAGE_KEYWORDS['/products/cheats/'];
  }
  return undefined;
}

/**
 * Fixed 16-article slug order for the master template. All content generators import this list.
 * Replaced legacy safety/ban cluster slugs: anticheat → config, bans → performance.
 */
export const TEMPLATE_BLOG_SLUGS = [
  'best-cheats',
  'aimbot',
  'esp',
  'config',
  'performance',
  'buying',
  'safety',
  'features',
  'access',
  'skins',
  'external',
  'automation',
  'dma',
  'recoil',
  'windows',
  'radar',
];

/** Topics that must not appear in auto-generated blogs, FAQs as primary SEO targets, or landing copy. */
export const FORBIDDEN_BLOG_TOPIC_REGEX =
  /\b(anti-?cheat|hwid\s+ban|ban\s+risk|avoiding\s+bans?|account\s+restrictions?\s+and\s+recovery)\b/i;
/** Replace these tokens when migrating to a new game. */
export const PH = {
  GAME_NAME: '[[GAME_NAME]]',
  GAME_NAME_DISPLAY: '[[GAME_NAME_DISPLAY]]',
  SITE_BRAND: '[[SITE_BRAND]]',
  CANONICAL_DOMAIN: '[[CANONICAL_DOMAIN]]',
  RIGHTS_HOLDER: '[[RIGHTS_HOLDER]]',
  PLATFORM_NAME: '[[PLATFORM_NAME]]',
  PRODUCT_NAME: '[[PRODUCT_NAME]]',
  CHECKOUT_URL: '[[CHECKOUT_URL]]',
  SUPPORT_EMAIL: '[[SUPPORT_EMAIL]]',
  DISCORD_URL: '[[DISCORD_URL]]',
} as const;

export type PlaceholderKey = keyof typeof PH;

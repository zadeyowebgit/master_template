/**
 * English-only site. Non-EN locale definitions removed; legacy /pt/, /de/, etc. 301 to EN.
 */

export type LocaleCode = 'en';

export type ConversionTier = 'full' | 'medium' | 'light' | 'default';

export interface LocaleDefinition {
  code: LocaleCode;
  /** BCP 47 language tag for <html lang> / hreflang */
  hreflang: string;
  /** og:locale */
  ogLocale: string;
  name: string;
  nativeName: string;
  /** Country this locale primarily targets */
  country: string;
  /** Strongest → weakest (1 = strongest non-EN market) */
  rank: number;
  tier: ConversionTier;
  /** URL path prefix; empty for default English */
  pathPrefix: string;
}

export const DEFAULT_LOCALE: LocaleCode = 'en';

export const LOCALES: LocaleDefinition[] = [
  {
    code: 'en',
    hreflang: 'en',
    ogLocale: 'en_US',
    name: 'English',
    nativeName: 'English',
    country: 'Canada / Australia',
    rank: 0,
    tier: 'default',
    pathPrefix: '',
  },
];

export const LOCALE_BY_CODE = Object.fromEntries(
  LOCALES.map((locale) => [locale.code, locale]),
) as Record<LocaleCode, LocaleDefinition>;

export const NON_DEFAULT_LOCALES: LocaleDefinition[] = [];

/** @deprecated English-only — always empty. */
export const FULL_LOCALES: LocaleCode[] = [];

/** @deprecated English-only — always empty. */
export const MEDIUM_LOCALES: LocaleCode[] = [];

/** @deprecated English-only — always empty. */
export const LIGHT_LOCALES: LocaleCode[] = [];

/** @deprecated Prefer full locale blog mirrors; kept for older imports. */
export const TOP_BLOG_SLUGS_FOR_MEDIUM = [
  'best-cheats',
  'aimbot',
  'esp',
  'buying',
  'anticheat',
  'bans',
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
] as const;

export function isLocaleCode(value: string): value is LocaleCode {
  return value === 'en';
}

export type { Translations } from './types';
export { en as t } from './en';
export {
  DEFAULT_LOCALE,
  FULL_LOCALES,
  LIGHT_LOCALES,
  LOCALES,
  LOCALE_BY_CODE,
  MEDIUM_LOCALES,
  NON_DEFAULT_LOCALES,
  TOP_BLOG_SLUGS_FOR_MEDIUM,
  isLocaleCode,
  type ConversionTier,
  type LocaleCode,
  type LocaleDefinition,
} from './locales';
export {
  getLocaleFromPathname,
  hreflangAlternates,
  isEnglishOnlyPath,
  localizeHref,
  localizedBlogCard,
  localizeProductShowcaseUrls,
  stripLocalePrefix,
  switchLocalePath,
  useTranslations,
  withLocalePrefix,
} from './utils';

export function avatarSrc(style: string, seed: string) {
  return '/images/placeholders/card.svg';
}

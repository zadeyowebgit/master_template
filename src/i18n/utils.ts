import type { Translations } from './types';
import { DEFAULT_LOCALE, LOCALE_BY_CODE, type LocaleCode } from './locales';
import { en } from './en';
import { buildFaqLandingEntries } from '../data/faq';
import { applyHomeSeoContent } from '../data/homeSeoContent';
import { finalizeDisplayCopy } from '../game/resolve-display';

export function formatTranslation(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
}

let cachedEnglish: Translations | undefined;

export function useTranslations(_locale: LocaleCode = DEFAULT_LOCALE): Translations {
  if (!cachedEnglish) {
    const source: Translations = {
      ...structuredClone(en),
      faq: { ...structuredClone(en.faq), landing: buildFaqLandingEntries() },
    };
    cachedEnglish = finalizeDisplayCopy(applyHomeSeoContent(source));
  }
  return cachedEnglish;
}

export function stripLocalePrefix(pathname: string): string {
  const normalized = pathname || '/';
  return normalized === '/' || normalized.endsWith('/') ? normalized : `${normalized}/`;
}

export function getLocaleFromPathname(_pathname: string): LocaleCode {
  return DEFAULT_LOCALE;
}

export function isEnglishOnlyPath(_pathname: string): boolean {
  return true;
}

export function withLocalePrefix(href: string, _locale: LocaleCode): string {
  if (!href.startsWith('/')) return href;
  const bare = stripLocalePrefix(href);
  return bare === '/' ? '/' : bare.endsWith('/') ? bare : `${bare}/`;
}

export function switchLocalePath(pathname: string, _nextLocale: LocaleCode): string {
  return withLocalePrefix(pathname, DEFAULT_LOCALE);
}

export function hreflangAlternates(pathname: string, siteOrigin: string): { hreflang: string; href: string }[] {
  const href = `${siteOrigin}${withLocalePrefix(pathname, DEFAULT_LOCALE)}`;
  return [
    { hreflang: LOCALE_BY_CODE[DEFAULT_LOCALE].hreflang, href },
    { hreflang: 'x-default', href },
  ];
}

export function localizeProductShowcaseUrls(
  buyUrl: string,
  detailsUrl: string,
  _locale: LocaleCode,
): { buyUrl: string; detailsUrl: string } {
  return { buyUrl, detailsUrl: withLocalePrefix(detailsUrl, DEFAULT_LOCALE) };
}

export function localizedBlogCard(
  _slug: string,
  _locale: LocaleCode,
): Pick<Translations['blog']['items'][number], 'title' | 'desc' | 'tag' | 'date' | 'readTime'> | undefined {
  return undefined;
}

export function localizeHref(href: string, _locale: LocaleCode): string {
  if (!href.startsWith('/') || href.startsWith('#')) return href;
  return withLocalePrefix(href, DEFAULT_LOCALE);
}

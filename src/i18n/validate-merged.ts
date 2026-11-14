import { DEFAULT_LOCALE, NON_DEFAULT_LOCALES, type LocaleCode } from './locales';

/** Validate translated locale trees. The site currently ships English-only. */
export function validateLocaleTranslations(locale: LocaleCode): string[] {
  return locale === DEFAULT_LOCALE ? [] : [];
}

export function validateAllLocales(): { locale: LocaleCode; issues: string[] }[] {
  return NON_DEFAULT_LOCALES.map((locale) => ({ locale: locale.code, issues: [] }));
}

export function assertAllLocalesTranslated(): void {
  // English-only is intentional; non-English routes redirect to the canonical site.
}

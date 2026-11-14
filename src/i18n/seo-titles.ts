import type { LocaleCode } from './locales';

export function localizedSeoTitle(_locale: LocaleCode, _pathname: string, fallback: string): string {
  return fallback;
}

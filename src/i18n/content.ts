import type { LocaleCode } from './locales';

export function translateText(text: string, _locale: LocaleCode): string {
  return text;
}

export function hasContentTranslation(_text: string, _locale: LocaleCode): boolean {
  return false;
}

/** Translate display data while preserving route keys, CSS and identifiers. */
export function translateDisplayData<T>(data: T, locale: LocaleCode, key = ''): T {
  if (typeof data === 'string') {
    if (/^(id|slug|href|url|src|icon|type|kind|variant|tone|categoryKey|bento|date|num|seed|author|username)$/i.test(key) || /(?:Url|Path|Href|Slugs)$/.test(key)) return data;
    return translateText(data, locale) as T;
  }
  if (Array.isArray(data)) return data.map(value => translateDisplayData(value,locale,key)) as T;
  if (data && typeof data === 'object') return Object.fromEntries(Object.entries(data).map(([k,v]) => [k,translateDisplayData(v,locale,k)])) as T;
  return data;
}

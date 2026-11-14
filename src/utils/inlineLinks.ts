import { normalizeInternalPath } from './path';
import { localizeHref } from '../i18n/utils';
import type { LocaleCode } from '../i18n/locales';

const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** Only the existing internal Markdown link syntax is accepted; no raw HTML. */
export function inlineLinks(text: string, locale: LocaleCode): string {
  return escape(text).replace(/\[([^\]]+)\]\((\/[^\s)]+)\)/g, (_match, label, href) => {
    if (href.startsWith('//')) return label;
    return `<a href="${escape(localizeHref(normalizeInternalPath(href), locale))}">${label}</a>`;
  });
}

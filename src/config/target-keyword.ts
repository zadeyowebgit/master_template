/** Primary EN SERP phrase placeholder — set per game in keywords.ts during migration. */
export const TARGET_KEYWORD = '[[TARGET_KEYWORD]]';

export function hasTargetKeyword(text: string): boolean {
 return text.toLowerCase().includes(TARGET_KEYWORD);
}

export function ensureEnSeoTitle(title: string): string {
 // Page-specific titles already describe their intent. Never prepend a shared
 // keyword or cut meaningful words simply to meet a character target.
 return title.trim();
}

export function ensureEnMetaDescription(desc: string): string {
 return desc.trim();
}

/** Use page-specific H1 from keywords.ts / auditSeo.ts — never auto-append the game name here. */
export function ensureEnH1(text: string): string {
  return text.trim();
}

export function ensureEnImageAlt(alt: string): string {
 return alt.trim();
}

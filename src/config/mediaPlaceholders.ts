export const PLACEHOLDER_HERO='/images/placeholders/hero.svg';
export const PLACEHOLDER_CARD='/images/placeholders/card.svg';
export const PLACEHOLDER_OG='/images/placeholders/og.svg';
export const PLACEHOLDER_ICON='/favicon.svg';
export function resolvePublicImageSrc(src: string | undefined, kind: 'card' | 'hero' | 'og' = 'card'): string {
  const trimmed = src?.trim();
  if (trimmed) return trimmed;
  return kind === 'hero' ? PLACEHOLDER_HERO : kind === 'og' ? PLACEHOLDER_OG : PLACEHOLDER_CARD;
}

import { game } from './index';
import { buildDisplayTokenMap, loadOwnerMigrationInput } from './migration-input';

const BRACKET = /\[\[(?:([A-Z0-9_]+)(?:\s+—\s+([^[\]]+))?|[^\]]+)\]\]/g;

/** Resolve [[tokens]] for migrated builds; never leave raw brackets when owner input exists. */
export function resolveDisplayText(text: string): string {
  if (!text.includes('[[')) return text;
  const owner = buildDisplayTokenMap();
  let out = text
    .replaceAll('[[GAME_NAME]]', owner['[[GAME_NAME]]'] || game.site.gameName)
    .replaceAll('[[GAME_NAME_DISPLAY]]', owner['[[GAME_NAME_DISPLAY]]'] || game.site.gameNameDisplay)
    .replaceAll('[[SITE_BRAND]]', owner['[[SITE_BRAND]]'] || game.site.brandName)
    .replaceAll('[[CANONICAL_DOMAIN]]', owner['[[CANONICAL_DOMAIN]]'] || game.site.canonicalDomain)
    .replaceAll('[[PLATFORM_NAME]]', owner['[[PLATFORM_NAME]]'] || 'PC')
    .replaceAll('[[CHECKOUT_URL]]', owner['[[CHECKOUT_URL]]'] || game.checkout.externalCheckoutUrl)
    .replaceAll('[[PRODUCT_NAME]]', owner['[[PRODUCT_NAME]]'] || game.site.defaultProductSlug);

  for (const [token, value] of Object.entries(owner)) {
    if (token.startsWith('[[') && value) out = out.replaceAll(token, value);
  }

  return out.replace(BRACKET, (_match, _key, hint) => {
    const h = hint?.trim();
    return h || 'Confirm with the seller before publishing';
  });
}

function mapStrings<T>(value: T): T {
  if (typeof value === 'string') return resolveDisplayText(value) as T;
  if (Array.isArray(value)) return value.map((item) => mapStrings(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, mapStrings(v)]),
    ) as T;
  }
  return value;
}

export function finalizeDisplayCopy<T>(value: T): T {
  return loadOwnerMigrationInput() ? mapStrings(value) : value;
}

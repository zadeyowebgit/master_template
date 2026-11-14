import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
export const MIGRATION_INPUT_PATH = path.join(ROOT, 'migration', 'game.input.json');

const BRACKET_HINT = /\[\[(?:[A-Z0-9_]+)(?:\s+—\s+([^[\]]+))?(?:\s+—\s+([^[\]]+))?|[^\]]+)\]\]/g;

/** @returns {Record<string, string>} */
export function loadMigrationInput() {
  if (!fs.existsSync(MIGRATION_INPUT_PATH)) return null;
  return JSON.parse(fs.readFileSync(MIGRATION_INPUT_PATH, 'utf8'));
}

/** Mechanical replacements from owner JSON (not creative writing). */
export function buildTokenMap(input) {
  if (!input) return {};
  const display = input.gameNameDisplay || input.gameName || '';
  const brand = input.siteBrand || `${display} Catalog`;
  const map = {
    '[[GAME_NAME]]': input.gameName || display,
    '[[GAME_NAME_DISPLAY]]': display,
    '[[SITE_BRAND]]': brand,
    '[[CANONICAL_DOMAIN]]': input.domain || '',
    '[[PLATFORM_NAME]]': input.platformName || 'PC',
    '[[CHECKOUT_URL]]': input.checkoutUrl || '',
    '[[PRODUCT_NAME]]':
      input.productLinks?.[0]?.title && !String(input.productLinks[0].title).includes('[[')
        ? input.productLinks[0].title
        : `${display} package`,
  };
  if (input.rightsHolder && !String(input.rightsHolder).includes('[[')) {
    map['[[RIGHTS_HOLDER]]'] = input.rightsHolder;
  }
  if (input.reviews?.verifiedOn && !String(input.reviews.verifiedOn).includes('[[')) {
    map['[[REVIEWS_VERIFIED_DATE]]'] = input.reviews.verifiedOn;
  }
  const extra = input.verifiedContent?.tokens;
  if (extra && typeof extra === 'object') {
    for (const [k, v] of Object.entries(extra)) {
      if (v && !String(v).includes('[[')) map[k] = String(v);
    }
  }
  const product = input.verifiedContent?.product;
  if (product && typeof product === 'object') {
    for (const [k, v] of Object.entries(product)) {
      if (v && !String(v).includes('[[')) map[`[[${k.toUpperCase()}]]`] = String(v);
      if (v && !String(v).includes('[[')) map[k] = String(v);
    }
  }
  return map;
}

export function resolvePlaceholdersInText(text, tokenMap) {
  if (!text || !text.includes('[[')) return text;
  let out = text;
  for (const [token, value] of Object.entries(tokenMap)) {
    if (value) out = out.replaceAll(token, value);
  }
  out = out.replace(BRACKET_HINT, (_match, hint1, hint2) => {
    const hint = (hint2 || hint1 || '').trim();
    return hint || 'Confirm with the seller before publishing';
  });
  return out;
}

import fs from 'node:fs';
import path from 'node:path';

export interface OwnerMigrationInput {
  gameName?: string;
  gameNameDisplay?: string;
  siteBrand?: string;
  domain?: string;
  checkoutUrl?: string;
  platformName?: string;
  rightsHolder?: string;
  verifiedContent?: {
    tokens?: Record<string, string>;
    product?: Record<string, string>;
  };
}

let cached: OwnerMigrationInput | null | undefined;

/** Owner migration JSON (build-time only). Absent in template-only mode. */
export function loadOwnerMigrationInput(): OwnerMigrationInput | null {
  if (cached !== undefined) return cached;
  const file = path.join(process.cwd(), 'migration', 'game.input.json');
  try {
    cached = JSON.parse(fs.readFileSync(file, 'utf8')) as OwnerMigrationInput;
  } catch {
    cached = null;
  }
  return cached;
}

export function buildDisplayTokenMap(): Record<string, string> {
  const input = loadOwnerMigrationInput();
  if (!input) return {};
  const display = input.gameNameDisplay || input.gameName || '';
  const brand = input.siteBrand || `${display} Catalog`;
  const map: Record<string, string> = {
    '[[GAME_NAME]]': input.gameName || display,
    '[[GAME_NAME_DISPLAY]]': display,
    '[[SITE_BRAND]]': brand,
    '[[CANONICAL_DOMAIN]]': input.domain || '',
    '[[PLATFORM_NAME]]': input.platformName || 'PC',
    '[[CHECKOUT_URL]]': input.checkoutUrl || '',
  };
  if (input.rightsHolder && !input.rightsHolder.includes('[[')) {
    map['[[RIGHTS_HOLDER]]'] = input.rightsHolder;
  }
  const extra = input.verifiedContent?.tokens;
  if (extra) Object.assign(map, extra);
  return map;
}

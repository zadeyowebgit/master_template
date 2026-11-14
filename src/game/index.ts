import type { GameInstance } from './types';
import { templateGame } from './instances/template';

/** Active game instance. Replace via migration/game.input.json + npm run template:generate */
export const game: GameInstance = templateGame;

export type { GameCheckoutConfig, GameInstance, GameProductManifest, GameRoutesConfig, GameSiteConfig } from './types';
export { PH } from './placeholders';

export function productHubPath(): string {
  return game.routes.productBase;
}

export function productImageBase(): string {
  return `/images/${game.site.mediaPathSegment}`;
}

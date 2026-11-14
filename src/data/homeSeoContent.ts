import type { Translations } from '../i18n/types';
import { game } from '../game';

/** Apply the active game’s verified marketing overlay onto base English chrome. */
export function applyHomeSeoContent(t: Translations): Translations {
  return game.applyMarketingOverlay(t);
}

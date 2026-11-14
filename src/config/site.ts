import { CANONICAL_DOMAIN, CANONICAL_ORIGIN } from './canonical';
import { game } from '../game';

export const SITE_DOMAIN = CANONICAL_DOMAIN;
export const SITE_URL = CANONICAL_ORIGIN;
export const PRODUCT_BASE = game.routes.productBase;
export const TITLE_PREFIX = game.site.titlePrefix;
export const SUPPORT_EMAIL = `${game.site.supportEmailLocalPart}@${SITE_DOMAIN}`;
export const DISCORD_URL = game.site.discordUrl;
export const SITE_BRAND = game.site.brandName;
export const GAME_NAME = game.site.gameName;

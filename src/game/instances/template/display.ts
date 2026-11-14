import { TEMPLATE_RUNTIME } from '../../runtime-defaults';

/** Human-readable defaults for the template instance (shown on the live site). */
export const TEMPLATE_DISPLAY = {
  gameNameDisplay: 'Your Game',
  brandName: 'Game Catalog',
  canonicalDomain: TEMPLATE_RUNTIME.canonicalDomain,
} as const;

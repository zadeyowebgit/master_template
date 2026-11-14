import { TEMPLATE_CHECKOUT_URL } from '../../scripts/template-site.mjs';

/** Owner-supplied checkout destination — replace during migration (see MASTER_INSTRUCTIONS.md). */
export const PRIMARY_CHECKOUT = TEMPLATE_CHECKOUT_URL;
export const CHECKOUT_URLS = { primary: PRIMARY_CHECKOUT };
export const CHECKOUT_PATH_REDIRECTS = new Map([
  ['/go/checkout', PRIMARY_CHECKOUT],
  ['/go/checkout/', PRIMARY_CHECKOUT],
]);
export function resolveCheckoutPathRedirect(pathname) {
  return CHECKOUT_PATH_REDIRECTS.get(pathname) ?? null;
}

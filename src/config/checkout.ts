import { CHECKOUT_URLS } from './checkout-redirects.mjs';

export const CHECKOUT = CHECKOUT_URLS;
export type CheckoutProduct = keyof typeof CHECKOUT;
export const CHECKOUT_SLUGS: Record<CheckoutProduct, string> = { primary: 'primary' };
export const CHECKOUT_SLUG_TO_PRODUCT = { primary: 'primary' } as const;
export function checkoutPath(_product = 'primary'): string {
  return CHECKOUT.primary;
}
export const PRIMARY_CHECKOUT_PATH = CHECKOUT.primary;
export function checkoutForSlug(_slug: string): string {
  return CHECKOUT.primary;
}
export function resolveCheckoutHref(href: string): string {
  if (href.startsWith('/go/')) return CHECKOUT.primary;
  return href.startsWith('http') || href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:')
    ? href
    : `/${href}`;
}

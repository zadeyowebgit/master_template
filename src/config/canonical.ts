import { game } from '../game';

/** Production indexable hostname — all canonicals, hreflang, and sitemaps use this origin. */
export const CANONICAL_DOMAIN = game.site.canonicalDomain;

export const CANONICAL_ORIGIN = `https://${CANONICAL_DOMAIN}`;

function hostnameOnly(hostname: string): string {
  return hostname.split(',')[0].trim().split(':')[0].toLowerCase().replace(/\.$/, '');
}

export function isLocalHostname(hostname: string): boolean {
  const host = hostnameOnly(hostname);
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.localhost');
}

export function isPreviewOrPlatformHost(hostname: string): boolean {
  const host = hostnameOnly(hostname);
  if (!host) return true;
  return (
    isLocalHostname(host) ||
    host.endsWith('.pages.dev') ||
    host.endsWith('.workers.dev') ||
    host.endsWith('.trycloudflare.com') ||
    host.endsWith('.cfargotunnel.com') ||
    host.endsWith('.cloudflarepreview.com') ||
    host.endsWith('.local')
  );
}

/**
 * Only the configured production host is indexable.
 * www, *.pages.dev, Workers, local/dev, and any other host must not be indexed.
 */
export function isCanonicalProductionHost(hostname: string): boolean {
  return hostnameOnly(hostname) === CANONICAL_DOMAIN;
}

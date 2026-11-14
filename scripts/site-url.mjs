import {
  TEMPLATE_CANONICAL_DOMAIN,
  TEMPLATE_SITE_URL,
} from './template-site.mjs';

/** Shared site origin for Node build/start scripts — indexable production domain only. */
export const DEFAULT_SITE_DOMAIN = TEMPLATE_CANONICAL_DOMAIN;
export const DEFAULT_SITE_URL = TEMPLATE_SITE_URL;

/**
 * Production URL for sitemaps, canonicals, and robots.txt.
 * Intentionally ignores preview hosts so they do not leak into indexable URLs.
 */
export function getSiteUrl() {
  return DEFAULT_SITE_URL;
}

export function getSiteHost() {
  return DEFAULT_SITE_DOMAIN;
}

/** Cloudflare Pages preview branch (not used for canonical output). */
export function isPreviewDeploy() {
  const branch = process.env.CF_PAGES_BRANCH?.trim();
  if (!branch) return false;
  const production = (process.env.CF_PAGES_PRODUCTION_BRANCH || 'main').trim();
  return branch !== production;
}

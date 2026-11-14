import { t } from '../i18n';
import { DISCORD_URL, SITE_BRAND, SITE_DOMAIN, SITE_DOMAIN as INDEXNOW_HOST_NAME, SITE_URL } from './site';
import { getPageSeoEntry } from './pageSeo';
import { ensureEnMetaDescription, ensureEnSeoTitle } from './target-keyword';

/** Production origin from game config — preview hosts must not be indexed. */
export const SITE_ORIGIN = SITE_URL;

export const DEFAULT_OG_IMAGE = '/images/placeholders/og.svg';

export const GA_MEASUREMENT_ID = import.meta.env.PUBLIC_GA_MEASUREMENT_ID as string | undefined;

/** @example @YourSiteHandle */
export const TWITTER_SITE = import.meta.env.PUBLIC_TWITTER_SITE as string | undefined;

export const TWITTER_CREATOR = import.meta.env.PUBLIC_TWITTER_CREATOR as string | undefined;

/** Comma-separated profile URLs (X, YouTube, etc.) for Organization sameAs. */
export function getOrganizationSameAs(): string[] {
 const raw = import.meta.env.PUBLIC_ORG_SAME_AS as string | undefined;
 if (!raw?.trim()) return [DISCORD_URL];
 const list = raw
 .split(',')
 .map((entry) => entry.trim())
 .filter(Boolean);
 return list.length ? list : [DISCORD_URL];
}

export const INDEXNOW_KEY = import.meta.env.INDEXNOW_KEY as string | undefined;

/**
 * Absolute canonical for trailingSlash: 'always'.
 * Strips host/query/hash if a full URL sneaks in; never emits www or pages.dev.
 */
export function canonicalUrl(pathname: string): string {
 let path = pathname || '/';
 try {
 if (/^https?:\/\//i.test(path)) {
 const u = new URL(path);
 path = u.pathname || '/';
 }
 } catch {
 /* keep path as-is */
 }
 // Drop accidental host prefixes like //preview.pages.dev/blog/
 path = path.replace(/^\/\/[^/]+/, '');
 path = path.split(/[?#]/, 1)[0] || '/';
 if (!path.startsWith('/')) path = `/${path}`;
 // Collapse duplicate slashes except root
 path = path.replace(/\/{2,}/g, '/');
 if (path !== '/' && !path.endsWith('/')) path = `${path}/`;
 // Force production origin (ignore preview hosts)
 return `https://${SITE_DOMAIN}${path}`;
}

export function absoluteAssetUrl(path: string): string {
 if (path.startsWith('http://') || path.startsWith('https://')) return path;
 const normalized = path.startsWith('/') ? path : `/${path}`;
 return `${SITE_ORIGIN}${normalized}`;
}

export function resolvePageSeo(pathname: string): { title: string; description: string } {
 const entry = getPageSeoEntry(pathname);
 const raw = entry ?? { title: t.site.title, description: t.site.description };
 return {
 title: ensureEnSeoTitle(raw.title),
 description: ensureEnMetaDescription(raw.description),
 };
}

export function pageTitle(keyword: string, brand = SITE_BRAND): string {
 const suffix = ` | ${brand}`;
 const base = keyword.trim();
 return base.endsWith(suffix) ? base : `${base}${suffix}`;
}

/** Meta descriptions for SERP snippets (target 120–155 characters when filled). */
export function cheatMetaDescription(text: string, locale: 'en' | string = 'en'): string {
 const trimmed = locale === 'en' ? ensureEnMetaDescription(text.trim()) : text.trim();
 if (trimmed.length <= 155) return trimmed;
 const sliced = trimmed.slice(0, 152);
 const lastSpace = sliced.lastIndexOf(' ');
 return (lastSpace > 120 ? sliced.slice(0, lastSpace) : sliced) + '...';
}

export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;

export const RSS_FEED_PATH = '/rss.xml';

/** Used by IndexNow postbuild script. */
export const INDEXNOW_HOST = INDEXNOW_HOST_NAME;

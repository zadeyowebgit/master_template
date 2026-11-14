import type { FaqItem } from '../i18n/types';
import { GAME_NAME, SITE_BRAND, SUPPORT_EMAIL } from '../config/site';
import { SITE_ORIGIN, absoluteAssetUrl, canonicalUrl, getOrganizationSameAs } from '../config/seo';
import { publicShareImagePath } from './responsiveImage';

export interface BreadcrumbItem {
 name: string;
 path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
 return {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: items.map((item, index) => ({
 '@type': 'ListItem',
 position: index + 1,
 name: item.name,
 item: canonicalUrl(item.path),
 })),
 };
}

export function websiteSchema() {
 return {
 '@context': 'https://schema.org',
 '@type': 'WebSite',
 name: SITE_BRAND,
 url: `${SITE_ORIGIN}/`,
 inLanguage: 'en-US',
 description:
 '[[SCHEMA_WEBSITE_DESCRIPTION — Compare [[GAME_NAME]] catalog tools, access plans, listed features, and setup support before purchase.]]',
 };
}

export function organizationSchema() {
 const sameAs = getOrganizationSameAs();

 return {
 '@context': 'https://schema.org',
 '@type': 'Organization',
 name: SITE_BRAND,
 url: `${SITE_ORIGIN}/`,
 logo: `${SITE_ORIGIN}/logo.svg`,
 email: SUPPORT_EMAIL,
 ...(sameAs.length > 0 ? { sameAs } : {}),
 contactPoint: [
 {
 '@type': 'ContactPoint',
 contactType: 'customer support',
 email: SUPPORT_EMAIL,
 url: canonicalUrl('/support/'),
 availableLanguage: ['English'],
 areaServed: 'Worldwide',
 },
 ],
 };
}

export function collectionPageSchema(input: { name: string; description: string; url: string }) {
 return {
 '@context': 'https://schema.org',
 '@type': 'CollectionPage',
 name: input.name,
 description: input.description,
 url: canonicalUrl(input.url),
 inLanguage: 'en-US',
 isPartOf: {
 '@type': 'WebSite',
 name: SITE_BRAND,
 url: `${SITE_ORIGIN}/`,
 },
 };
}

export function webPageSchema(input: { name: string; description: string; url: string }) {
 return {
 '@context': 'https://schema.org',
 '@type': 'WebPage',
 name: input.name,
 description: input.description,
 url: canonicalUrl(input.url),
 inLanguage: 'en-US',
 isPartOf: {
 '@type': 'WebSite',
 name: SITE_BRAND,
 url: `${SITE_ORIGIN}/`,
 },
 };
}

/** FAQPage JSON-LD is restricted to government/health sites. Do not emit on this commercial catalog. */
export function faqPageSchema(_items: FaqItem[]) {
  return null;
}

export function itemListSchema(items: { name: string; url: string }[]) {
 return {
 '@context': 'https://schema.org',
 '@type': 'ItemList',
 itemListElement: items.map((item, index) => ({
 '@type': 'ListItem',
 position: index + 1,
 name: item.name,
 url: offerUrl(item.url),
 })),
 };
}

export function discussionForumPostingSchema(input: {
 name: string;
 text: string;
 url: string;
 author: string;
 comments: number;
}) {
 return {
 '@context': 'https://schema.org',
 '@type': 'DiscussionForumPosting',
 headline: input.name,
 articleBody: input.text,
 url: canonicalUrl(input.url),
 author: { '@type': 'Person', name: input.author },
 commentCount: input.comments,
 isPartOf: {
 '@type': 'CollectionPage',
 name: `[[FORUM_COLLECTION_NAME — ${GAME_NAME} community forum]]`,
 url: canonicalUrl('/forum/'),
 },
 };
}

function offerUrl(path: string): string {
 if (path.startsWith('http://') || path.startsWith('https://')) return path;
 return canonicalUrl(path);
}

export function productSchema(input: {
 name: string;
 description: string;
 url: string;
 offerUrl: string;
 image?: string;
 sku?: string;
 plans?: { label: string; priceUsd: number | null }[];
}) {
 const verifiedPlans = input.plans?.filter((plan): plan is { label: string; priceUsd: number } => plan.priceUsd !== null && Number.isFinite(plan.priceUsd));
 return {
 '@context': 'https://schema.org',
 '@type': 'Product',
 name: input.name,
 description: input.description,
 url: canonicalUrl(input.url),
 sku: input.sku ?? input.url.replace(/\//g, '-'),
 brand: {
 '@type': 'Brand',
 name: 'External seller',
 },
 ...(input.image ? { image: absoluteAssetUrl(publicShareImagePath(input.image)) } : {}),
 // Only emit Offer.price when a verified USD amount is supplied. Do not invent prices.
 ...(verifiedPlans?.length ? { offers: verifiedPlans.map(plan => ({
 '@type': 'Offer',
 name: plan.label,
 url: offerUrl(input.offerUrl),
 priceCurrency: 'USD',
 price: plan.priceUsd,
 })) } : {}),
 };
}

/** @deprecated Prefer productSchema for product/cheat detail pages. */
export function softwareApplicationSchema(input: {
 name: string;
 description: string;
 url: string;
 image?: string;
 offerUrl?: string;
}) {
 return productSchema({
 name: input.name,
 description: input.description,
 url: input.url,
 offerUrl: input.offerUrl ?? input.url,
 image: input.image,
 });
}

export function articleSchema(input: {
 name: string;
 description: string;
 url: string;
 image: string;
 datePublished: string;
 dateModified?: string;
}) {
 return {
 '@context': 'https://schema.org',
 '@type': 'BlogPosting',
 headline: input.name,
 description: input.description,
 url: canonicalUrl(input.url),
 image: absoluteAssetUrl(publicShareImagePath(input.image)),
 datePublished: input.datePublished,
 dateModified: input.dateModified ?? input.datePublished,
 inLanguage: 'en-US',
 author: {
 '@type': 'Organization',
 name: `[[SCHEMA_EDITORIAL_TEAM — ${SITE_BRAND}]]`,
 url: canonicalUrl('/about/'),
 },
 publisher: {
 '@type': 'Organization',
 name: SITE_BRAND,
 logo: {
 '@type': 'ImageObject',
 url: `${SITE_ORIGIN}/logo.svg`,
 },
 },
 mainEntityOfPage: {
 '@type': 'WebPage',
 '@id': canonicalUrl(input.url),
 },
 };
}

export function parseBlogDate(date: string): string {
 const parsed = Date.parse(date);
 if (Number.isNaN(parsed)) throw new Error(`Invalid editorial date: ${date}`);
 return new Date(parsed).toISOString().slice(0, 10);
}

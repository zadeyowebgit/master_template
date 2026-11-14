import type { IconName } from '../components/icons/types';
import type { LocaleCode } from '../i18n/locales';
import { translateText } from '../i18n/content';
import { purchaseFaqs, MAIN_FAQ_IDS, HOME_FAQ_IDS } from './purchaseFaqs';
import { editorialFaqs } from './blog/editorial-faq';
import { blogTopicFaqs, defaultBlogFaqs } from './faq-blog-context';
import { normalizeInternalPath, ROUTES } from '../utils/path';

export type FaqTopic =
 | 'all'
 | 'plans'
 | 'esp'
 | 'scripts'
 | 'safety'
 | 'products'
 | 'blog'
 | 'setup';

export interface SiteFaqItem {
 id: string;
 topic: FaqTopic;
 icon: IconName;
 q: string;
 a: string;
 aHtml?: string;
 scopes?: string[];
}

function a(text: string): string {
 return text;
}

function link(text: string, href: string): string {
 return `<a href="${normalizeInternalPath(href)}">${text}</a>`;
}

const productsHub = link('[[FAQ_PRODUCTS_LINK_LABEL]]', ROUTES.products);

/** Ordered IDs shared by homepage FAQ section and /faq/. */
export const SHARED_FAQ_IDS = MAIN_FAQ_IDS;

export const siteFaqs: SiteFaqItem[] = purchaseFaqs;

function faqsByIds(ids: readonly string[]): SiteFaqItem[] {
 const byId = new Map(siteFaqs.map((f) => [f.id, f]));
 return ids.map((id) => byId.get(id)).filter((f): f is SiteFaqItem => Boolean(f));
}

/** Homepage FAQ section and /faq/ — identical catalog FAQ list. */
export function getLandingFaqs(): SiteFaqItem[] {
 return faqsByIds(SHARED_FAQ_IDS);
}

/** Alias of getLandingFaqs — keep home and FAQ landing in sync. */
export function getAllFaqs(): SiteFaqItem[] {
 return getLandingFaqs();
}

export interface FaqLandingEntry {
 id: string;
 q: string;
 a: string;
}

/** Plain-text/HTML answers for i18n landing overlays (28 SHARED_FAQ_IDS). */
export function buildFaqLandingEntries(): FaqLandingEntry[] {
 const byId = new Map(siteFaqs.map((f) => [f.id, f]));
 return SHARED_FAQ_IDS.map((id) => {
 const faq = byId.get(id);
 if (!faq) throw new Error(`Missing siteFaqs entry for landing id: ${id}`);
 return { id, q: faq.q, a: faq.aHtml ?? faq.a };
 });
}

/** Landing FAQ list with locale overlays on q/a from t.faq.landing (by id). */
function localizedFaqs(items: SiteFaqItem[], locale: LocaleCode): SiteFaqItem[] {
 return items.map(faq => ({ ...faq, q: translateText(faq.q, locale), a: translateText(faq.a, locale) }));
}

export function getLocalizedLandingFaqs(locale: LocaleCode): SiteFaqItem[] {
 return localizedFaqs(getLandingFaqs(), locale);
}

export function getHomeFaqs(locale: LocaleCode): SiteFaqItem[] {
 return localizedFaqs(faqsByIds(HOME_FAQ_IDS), locale);
}

/** Shared FAQ block copy + filters (home, /faq/, products, blog). */
export const SITE_FAQ_SECTION_COPY = {
  eyebrow: 'All topics',
  title: '[[FAQ_SECTION_TITLE]]',
  subtitle: '[[FAQ_SECTION_SUBTITLE]]',
} as const;

export const SITE_FAQ_FILTER_TOPICS: FaqTopic[] = [
 'all',
 'plans',
 'esp',
 'safety',
 'products',
 'setup',
];

/** Homepage + /faq/ chip bar — no ESP or Products topic buttons. */
export const LANDING_FAQ_FILTER_TOPICS: FaqTopic[] = ['all', 'plans', 'safety', 'setup'];

/** Section order for /faq/ topic headings (full landing list). */
export const FAQ_LANDING_TOPIC_ORDER: FaqTopic[] = [
 'plans',
 'safety',
 'setup',
 'esp',
 'products',
 'scripts',
 'blog',
];

export function groupFaqsByTopic(items: SiteFaqItem[]): { topic: FaqTopic; items: SiteFaqItem[] }[] {
 const byTopic = new Map<FaqTopic, SiteFaqItem[]>();
 for (const item of items) {
 const list = byTopic.get(item.topic) ?? [];
 list.push(item);
 byTopic.set(item.topic, list);
 }
 return FAQ_LANDING_TOPIC_ORDER.filter((topic) => byTopic.has(topic)).map((topic) => ({
 topic,
 items: byTopic.get(topic)!,
 }));
}

/** Section copy when FAQ list is scoped to the current page (not /faq/). */
export const CONTEXTUAL_FAQ_SECTION_COPY = {
  eyebrow: '[[CONTEXTUAL_FAQ_EYEBROW]]',
  title: '[[CONTEXTUAL_FAQ_TITLE]]',
  subtitle: '[[CONTEXTUAL_FAQ_SUBTITLE]]',
} as const;

export function faqFilterTopicsForItems(items: SiteFaqItem[]): FaqTopic[] {
 const present = new Set(items.map((item) => item.topic));
 const topics: FaqTopic[] = ['all'];
 for (const topic of SITE_FAQ_FILTER_TOPICS) {
 if (topic !== 'all' && present.has(topic)) topics.push(topic);
 }
 return topics;
}

export function getProductFaqs(slug: string, _kind: 'tier' | 'utility'): SiteFaqItem[] {
 return siteFaqs.filter(faq => faq.scopes?.includes(slug));
}

export function getBlogFaqs(tag: string, slug: string): SiteFaqItem[] {
 if (editorialFaqs[slug]) return editorialFaqs[slug].map((item, index) => ({
 ...item, id: `editorial-${slug}-${index}`, topic: 'blog', icon: 'faqBlogDefault1',
 }));
 const topicFaqs = blogTopicFaqs[tag] ?? [];
 return [...topicFaqs, ...defaultBlogFaqs].slice(0, 8);
}

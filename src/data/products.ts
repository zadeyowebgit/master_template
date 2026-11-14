import type { IconName } from '../components/icons/types';
import { game } from '../game';
import { gameCatalog } from './gameCatalog';
import { heroGallery } from './media';

export interface ProductSlide {
  src: string;
  alt: string;
  caption: string;
  captionDesc: string;
}

export interface ProductOverview {
  title: string;
  paragraphs: string[];
}

export interface AcquisitionStep {
  num: string;
  title: string;
  desc: string;
}

export interface ProductAcquisition {
  title: string;
  steps: AcquisitionStep[];
}

export interface SystemRequirement {
  icon: IconName;
  text: string;
}

export interface ProductAddOn {
  title: string;
  description: string;
}

export interface ProductPage {
  slug: string;
  kind: 'tier' | 'utility';
  badge: string;
  category?: string;
  tier?: string;
  gameLabel?: string;
  name: string;
  title: string;
  subtitle: string;
  desc: string;
  features: string[];
  more: number;
  variant?: 'essential' | 'popular' | 'limited';
  buyUrl: string;
  images: ProductSlide[];
  overview: ProductOverview;
  acquisition: ProductAcquisition;
  goodToKnow: string;
  limitations: string;
  fullFeatures: string[];
  systemRequirements: SystemRequirement[];
  addOns?: ProductAddOn[];
  about?: { type: 'h2' | 'p'; text: string }[];
  body: { type: 'h2' | 'p'; text: string }[];
  relatedBlogSlugs: string[];
}

const defaultSlug = game.site.defaultProductSlug;

const product: ProductPage = {
  slug: defaultSlug,
  kind: 'tier',
  badge: '[[PRODUCT_BADGE — seller listing]]',
  category: '[[PRODUCT_CATEGORY]]',
  tier: '[[PRODUCT_TIER_LABEL]]',
  gameLabel: game.site.gameName,
  name: game.site.titlePrefix,
  title: '[[PRODUCT_PAGE_TITLE]]',
  subtitle: gameCatalog.tagline,
  desc: gameCatalog.description,
  features: gameCatalog.features.slice(0, 6),
  more: Math.max(0, gameCatalog.features.length - 6),
  buyUrl: gameCatalog.buyUrl,
  images: [
    {
      src: '/images/placeholders/card.svg',
      alt: '[[PRODUCT_IMAGE_1_ALT]]',
      caption: '[[PRODUCT_IMAGE_1_CAPTION]]',
      captionDesc: '[[PRODUCT_IMAGE_1_DESC]]',
    },
    {
      src: '/images/placeholders/card.svg',
      alt: '[[PRODUCT_IMAGE_2_ALT]]',
      caption: '[[PRODUCT_IMAGE_2_CAPTION]]',
      captionDesc: '[[PRODUCT_IMAGE_2_DESC]]',
    },
    {
      src: '/images/placeholders/card.svg',
      alt: '[[PRODUCT_IMAGE_3_ALT]]',
      caption: '[[PRODUCT_IMAGE_3_CAPTION]]',
      captionDesc: '[[PRODUCT_IMAGE_3_DESC]]',
    },
  ],
  overview: {
    title: '[[PRODUCT_OVERVIEW_TITLE]]',
    paragraphs: [gameCatalog.description, gameCatalog.overview],
  },
  acquisition: {
    title: '[[PRODUCT_ACQUISITION_TITLE]]',
    steps: [
      { num: '01', title: '[[ACQ_STEP_1_TITLE]]', desc: '[[ACQ_STEP_1_DESC]]' },
      { num: '02', title: '[[ACQ_STEP_2_TITLE]]', desc: '[[ACQ_STEP_2_DESC]]' },
      { num: '03', title: '[[ACQ_STEP_3_TITLE]]', desc: '[[ACQ_STEP_3_DESC]]' },
      { num: '04', title: '[[ACQ_STEP_4_TITLE]]', desc: '[[ACQ_STEP_4_DESC]]' },
    ],
  },
  goodToKnow: '[[PRODUCT_GOOD_TO_KNOW]]',
  limitations: '[[PRODUCT_LIMITATIONS]]',
  fullFeatures: gameCatalog.features,
  systemRequirements: gameCatalog.requirements,
  addOns: [
    { title: gameCatalog.cloudDma.title, description: gameCatalog.cloudDma.description },
    { title: gameCatalog.awsOption.title, description: gameCatalog.awsOption.description },
  ],
  body: [
    { type: 'h2', text: '[[PRODUCT_BODY_H2_1]]' },
    { type: 'p', text: '[[PRODUCT_BODY_P1]]' },
    { type: 'h2', text: '[[PRODUCT_BODY_H2_2]]' },
    { type: 'p', text: '[[PRODUCT_BODY_P2]]' },
    { type: 'h2', text: '[[PRODUCT_BODY_H2_3]]' },
    { type: 'p', text: '[[PRODUCT_BODY_P3]]' },
  ],
  relatedBlogSlugs: ['best-cheats', 'aimbot', 'esp'],
};

export const productPages: ProductPage[] = [product];
export const cheatPages = productPages;
export const productRelatedBlogSlugs: Record<string, string[]> = {
  [defaultSlug]: product.relatedBlogSlugs,
};
export function getProductPage(slug: string) {
  return productPages.find((p) => p.slug === slug);
}
export const getCheatPage = getProductPage;
export function getAllProductSlugs() {
  return productPages.map((p) => p.slug);
}
export const getAllCheatSlugs = getAllProductSlugs;
export const heroSlides = heroGallery.map((image) => ({ ...image }));
export const productHub = {
  path: game.routes.productBase,
  title: '[[PRODUCTS_HUB_TITLE]]',
  subtitle: gameCatalog.tagline,
  description: gameCatalog.description,
  buyUrl: gameCatalog.buyUrl,
};

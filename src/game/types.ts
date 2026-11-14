import type { Translations } from '../i18n/types';

/** Checkout and external product destinations (owner-supplied URLs). */
export interface GameCheckoutConfig {
  primaryProductKey: string;
  externalCheckoutUrl: string;
  goPath: string;
}

export interface GameSiteConfig {
  id: string;
  gameName: string;
  gameNameDisplay: string;
  titlePrefix: string;
  brandName: string;
  canonicalDomain: string;
  supportEmailLocalPart: string;
  discordUrl: string;
  publisherShort: string;
  franchiseRightsHolder: string;
  communityName: string;
  mediaPathSegment: string;
  productRouteSegment: string;
  blogSlugPrefix: string;
  defaultProductSlug: string;
  reviewsVerifiedOn: string;
}

export interface GameRoutesConfig {
  productBase: string;
  productDetailPath: (slug: string) => string;
}

export interface GameProductManifest {
  checkoutUrl: string;
  verifiedOn: string;
  headline: string;
  tagline: string;
  description: string;
  overview: string;
  cloudDmaNote: string;
  featureGroups: Record<string, readonly string[]>;
  plans: readonly { id: 'monthly' | 'lifetime'; label: string; priceUsd: null; priceNote: string }[];
  systemRequirements: readonly string[];
}

export interface GameInstance {
  site: GameSiteConfig;
  routes: GameRoutesConfig;
  checkout: GameCheckoutConfig;
  product: GameProductManifest;
  applyMarketingOverlay: (t: Translations) => Translations;
}

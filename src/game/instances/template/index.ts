import type { GameInstance } from '../../types';
import { PH } from '../../placeholders';
import { TEMPLATE_RUNTIME } from '../../runtime-defaults';
import { applyTemplateMarketingOverlay } from './marketing';
import {
  TEMPLATE_CHECKOUT,
  templateCloudNote,
  templateDescription,
  templateFeatureGroups,
  templateHeadline,
  templateOverview,
  templatePlans,
  templateSystemRequirements,
  templateTagline,
} from './manifest';

const productRouteSegment = 'cheats';
const productBase = `/products/${productRouteSegment}/`;

export const templateGame: GameInstance = {
  site: {
    id: 'template',
    gameName: PH.GAME_NAME,
    gameNameDisplay: PH.GAME_NAME_DISPLAY,
    titlePrefix: `[[TITLE_PREFIX — ${PH.GAME_NAME}]]`,
    brandName: PH.SITE_BRAND,
    canonicalDomain: TEMPLATE_RUNTIME.canonicalDomain,
    supportEmailLocalPart: 'support',
    discordUrl: TEMPLATE_RUNTIME.discordUrl,
    publisherShort: PH.SITE_BRAND,
    franchiseRightsHolder: PH.RIGHTS_HOLDER,
    communityName: `[[COMMUNITY_NAME — ${PH.GAME_NAME}]]`,
    mediaPathSegment: 'game',
    productRouteSegment,
    blogSlugPrefix: '',
    defaultProductSlug: 'featured-package',
    reviewsVerifiedOn: '[[REVIEWS_VERIFIED_DATE]]',
  },
  routes: {
    productBase,
    productDetailPath: (slug) => `${productBase}${slug}/`,
  },
  checkout: {
    primaryProductKey: 'primary',
    externalCheckoutUrl: TEMPLATE_RUNTIME.checkoutUrl,
    goPath: '/go/checkout/',
  },
  product: {
    checkoutUrl: TEMPLATE_RUNTIME.checkoutUrl,
    verifiedOn: '[[PRODUCT_VERIFIED_DATE]]',
    headline: templateHeadline,
    tagline: templateTagline,
    description: templateDescription,
    overview: templateOverview,
    cloudDmaNote: templateCloudNote,
    featureGroups: templateFeatureGroups,
    plans: templatePlans,
    systemRequirements: templateSystemRequirements,
  },
  applyMarketingOverlay: applyTemplateMarketingOverlay,
};

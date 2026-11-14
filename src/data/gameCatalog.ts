import { checkoutPath } from '../config/checkout';
import type { SystemRequirement } from './products';
import { game } from '../game';
import {
  templateCloudNote,
  templateDescription,
  templateFeatureGroups,
  templateHeadline,
  templateOverview,
  templatePlans,
  templateSystemRequirements,
  templateTagline,
} from '../game/instances/template/manifest';

/** Neutral catalog shell — replace placeholders during game migration. */
export const gameCatalog = {
  source: game.checkout.externalCheckoutUrl,
  verifiedOn: game.product.verifiedOn,
  buyUrl: checkoutPath(),
  cloudBuyUrl: checkoutPath(),
  detailsUrl: game.routes.productDetailPath(game.site.defaultProductSlug),
  headline: templateHeadline,
  tagline: templateTagline,
  summary: '[[CATALOG_SUMMARY]]',
  description: templateDescription,
  overview: templateOverview,
  cardHighlights: [
    '[[CARD_HIGHLIGHT_1]]',
    '[[CARD_HIGHLIGHT_2]]',
    '[[CARD_HIGHLIGHT_3]]',
    '[[CARD_HIGHLIGHT_4]]',
  ],
  features: Object.values(templateFeatureGroups).flat(),
  plans: templatePlans,
  featureGroups: templateFeatureGroups,
  allFeatures: Object.values(templateFeatureGroups).flat(),
  requirements: [
    { icon: 'reqWindows', text: templateSystemRequirements[0] },
    { icon: 'reqSettings', text: templateSystemRequirements[1] },
    { icon: 'reqShieldGuide', text: templateSystemRequirements[2] },
  ] satisfies SystemRequirement[],
  cloudDma: {
    title: '[[CLOUD_OPTION_TITLE]]',
    description: templateCloudNote,
    buyUrl: checkoutPath(),
  },
  awsOption: {
    title: '[[AWS_OPTION_TITLE]]',
    description: '[[AWS_OPTION_DESCRIPTION]]',
    buyUrl: checkoutPath(),
  },
};

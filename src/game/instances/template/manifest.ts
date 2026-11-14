import { PH } from '../../placeholders';

/** Owner-supplied product facts — fill during migration. */
export const TEMPLATE_CHECKOUT = PH.CHECKOUT_URL;

export const templateFeatureGroups = {
  combatAwareness: ['[[FEATURE_1]]', '[[FEATURE_2]]'],
  worldInformation: ['[[FEATURE_3]]', '[[FEATURE_4]]'],
  objectiveInformation: ['[[FEATURE_5]]', '[[FEATURE_6]]'],
  assistanceAndGuidance: ['[[FEATURE_7]]', '[[FEATURE_8]]'],
  serviceOptions: ['[[SERVICE_OPTION_1]]', '[[SERVICE_OPTION_2]]'],
} as const;

export const templatePlans = [
  {
    id: 'monthly' as const,
    label: 'Monthly',
    priceUsd: null,
    priceNote: '[[PLAN_MONTHLY_NOTE]]',
  },
  {
    id: 'lifetime' as const,
    label: 'Lifetime',
    priceUsd: null,
    priceNote: '[[PLAN_LIFETIME_NOTE]]',
  },
];

export const templateSystemRequirements = [
  '[[REQUIREMENT_OS]]',
  '[[REQUIREMENT_SECURITY]]',
  '[[REQUIREMENT_EXTRA]]',
] as const;

export const templateHeadline = '[[PRODUCT_HEADLINE]]';
export const templateTagline = '[[PRODUCT_TAGLINE]]';
export const templateDescription = '[[PRODUCT_DESCRIPTION]]';
export const templateOverview = '[[PRODUCT_OVERVIEW]]';
export const templateCloudNote =
  '[[CLOUD_OR_DMA_NOTE — confirm prerequisites and inclusion with the seller before purchase.]]';

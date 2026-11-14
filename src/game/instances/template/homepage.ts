import type { Translations } from '../../../i18n/types';

export interface TemplateHomepageContext {
  productBase: string;
}

/** Configurable homepage sections (hero metrics, feature bento, why compare, workflow, hero badges). */
export const templateHomepageConfig = {
  heroMetrics: [
    { strong: 'Package', label: 'Scope in listing' },
    { strong: 'Access', label: 'Monthly or lifetime' },
    { strong: 'Windows', label: '10 / 11 setup checks' },
    { strong: 'Support', label: 'Seller contact path' },
  ],
  heroModes: ['Listed feature groups', 'Access and checkout terms', 'Windows setup notes', 'Separate services'],
  compatibilityBadges: [
    'Windows 10 & 11',
    'HVCI enabled',
    'Core Isolation enabled',
    'TPM enabled',
    'Secure Boot enabled',
    'Cloud DMA required',
    'Game build support',
    'Seller support',
  ],
  faqUrl: '/faq/',
  whyMetrics: [
    {
      value: '300+',
      title: 'Active users',
      desc: 'Players running R6 ESP, wallhack, and aimbot cheats with live product support.',
    },
    {
      value: '24/7',
      title: 'Support',
      desc: 'Help with delivery and access after you buy.',
    },
    {
      value: 'Windows',
      title: 'pc',
      desc: 'Check the supported edition and required security settings.',
    },
  ],
} as const;

/** Homepage-only overlay: hero, cheat features, why-our-cheats, how-it-works (+ hero badge marquee data). */
export function applyTemplateHomepage(t: Translations, ctx: TemplateHomepageContext): void {
  const { productBase } = ctx;
  const cfg = templateHomepageConfig;

  t.hero.status = '[[HERO_STATUS — product listing]]';
  t.hero.eyebrow = '[[HERO_EYEBROW — [[GAME_NAME_DISPLAY]] on supported platforms]]';
  t.hero.titleLine1 = '[[GAME_NAME_DISPLAY]] cheats for Windows PC';
  t.hero.titleLine2 = '[[HERO_TITLE_LINE_2 — feature and purchase information]]';
  t.hero.modesLabel = '[[HERO_MODES_LABEL — feature groups]]';
  t.hero.modes = [...cfg.heroModes];
  t.hero.subtitle =
    '[[HERO_SUBTITLE — compare the current [[GAME_NAME_DISPLAY]] package, access terms, and documented requirements before ordering.]]';
  t.hero.metrics = cfg.heroMetrics.map((m) => ({ ...m }));

  t.features.eyebrow = 'Cheat features';
  t.features.title = 'Understand the offer';
  t.features.subtitle =
    'Keep the package, its access duration, and its setup requirements separate when comparing an order.';
  t.features.items = [
    {
      title: 'Package scope',
      subtitle: 'Read the current listing',
      desc: '[[FEATURE_CARD_1_DESC — The package lists named modules and overlays. Confirm them on the product detail page.]]',
      bullets: ['Check the named package', 'Read supported options', 'Confirm required services'],
      tags: ['[[TAG_FEATURE_GROUPS]]', 'listing text', 'order scope'],
      bento: 'sm:col-span-2 lg:col-span-12 lg:col-start-1 lg:row-start-1',
    },
    {
      title: 'Access duration',
      subtitle: 'Monthly or Lifetime',
      desc: '[[FEATURE_CARD_2_DESC — Choose a duration after reviewing activation and service terms. A longer duration does not establish extra features.]]',
      bullets: [],
      tags: ['monthly', 'lifetime', 'access duration'],
      bento: 'sm:col-span-2 lg:col-span-8 lg:col-start-1 lg:row-start-2',
    },
    {
      title: 'Windows setup',
      subtitle: 'Requirements before purchase',
      desc: '[[FEATURE_CARD_3_DESC — Check Windows 10/11, HVCI, Core Isolation, TPM and Secure Boot against your actual PC.]]',
      bullets: ['Windows 10 & 11', 'HVCI', 'Core Isolation', 'TPM', 'Secure Boot'],
      tags: ['Windows 10/11', 'HVCI', 'TPM', 'Secure Boot'],
      bento: 'sm:col-span-2 lg:col-span-4 lg:col-start-9 lg:row-start-2',
    },
    {
      title: 'Separate services',
      subtitle: 'Check the complete order',
      desc: '[[FEATURE_CARD_4_DESC — Some services are invoiced separately from game access. Resolve the complete setup with the seller.]]',
      bullets: [],
      tags: ['[[TAG_DMA]]', 'add-ons', 'complete checkout'],
      bento: 'sm:col-span-2 lg:col-span-6 lg:col-start-1 lg:row-start-3',
    },
    {
      title: 'Product evidence',
      subtitle: 'Know what was verified',
      desc: '[[FEATURE_CARD_5_DESC — Screenshots illustrate listed feature categories. They are not an independent accuracy, performance or detection test.]]',
      bullets: [],
      tags: ['seller verified', 'screenshots', 'evidence disclaimer'],
      bento: 'sm:col-span-2 lg:col-span-6 lg:col-start-7 lg:row-start-3',
    },
    {
      title: 'Compatibility to confirm',
      subtitle: 'Ask after updates',
      desc: '[[FEATURE_CARD_6_DESC — Confirm the supported game and Windows build. No fixed patch turnaround or permanent compatibility is promised.]]',
      bullets: ['Current game build', 'Supported launcher', 'Update disclaimer'],
      tags: ['build check', 'launcher', 'compatibility'],
      bento: 'sm:col-span-2 lg:col-span-8 lg:col-start-1 lg:row-start-4',
    },
    {
      title: 'Purchase support',
      subtitle: 'Use the right contact',
      desc: '[[FEATURE_CARD_7_DESC — Seller support handles orders and installation. Use the right contact channel for your order.]]',
      bullets: [],
      tags: ['seller support', 'order email', 'Support page'],
      bento: 'sm:col-span-2 lg:col-span-4 lg:col-start-9 lg:row-start-4',
    },
  ];

  t.whyUs.eyebrow = 'Why our cheats';
  t.whyUs.title = 'What to check before choosing access';
  t.whyUs.subtitle =
    'A product listing describes an offer. Confirm that the supported environment matches your PC; a feature label is not a guarantee.';
  t.whyUs.usLabel = '[[WHY_US_LABEL — Listed]]';
  t.whyUs.otherLabel = '[[WHY_OTHER_LABEL — Guaranteed]]';
  t.whyUs.rows = [
    {
      title: 'Combat and awareness, together',
      desc: 'Find aimbot, ESP, and world ESP information in one catalog.',
      descMobile: 'Find aimbot, ESP, and world ESP information in one catalog.',
    },
    {
      title: 'Feature categories to compare',
      desc: 'Distinguish hero information, lane information and ability tracking.',
      descMobile: 'Distinguish hero information, lane information and ability tracking.',
    },
    {
      title: 'Readable overlays',
      desc: 'Confirm the controls documented for the supported build.',
      descMobile: 'Confirm the controls documented for the supported build.',
    },
    {
      title: 'Current build questions',
      desc: 'Confirm your launcher, input device, and game version with support.',
      descMobile: 'Confirm your launcher, input device, and game version with support.',
    },
    {
      title: 'Guides that connect',
      desc: '[[WHY_ROW_5_DESC — Move from a feature overview to a focused [[GAME_NAME_DISPLAY]] guide.]]',
      descMobile: '[[WHY_ROW_5_DESC — Move from a feature overview to a focused [[GAME_NAME_DISPLAY]] guide.]]',
    },
    {
      title: 'Access details up front',
      desc: 'Ask for current entitlements, activation, and terms before purchase.',
      descMobile: 'Ask for current entitlements, activation, and terms before purchase.',
    },
  ];
  t.whyUs.metrics = cfg.whyMetrics.map((metric) => ({ ...metric }));

  t.workflow.eyebrow = 'How it works';
  t.workflow.badge = '4 steps';
  t.workflow.titleBefore = 'From buy to';
  t.workflow.titleHighlight = 'in-game cheats.';
  t.workflow.titleAfter = '';
  t.workflow.subtitle =
    'Confirm requirements, select access, review the order and follow the seller installation guide.';
  t.workflow.ctaLabel = 'Buy cheats';
  t.workflow.ctaHref = productBase;
  t.workflow.ctaSecondary = 'See FAQ';
  t.workflow.ctaSecondaryHref = cfg.faqUrl;
  t.workflow.items = [
    {
      num: '01',
      phase: 'Before purchase',
      title: 'Confirm requirements',
      desc: 'Resolve Windows, security-setting and separate-service requirements with the seller.',
    },
    {
      num: '02',
      phase: 'Access',
      title: 'Choose access duration',
      desc: 'Monthly covers 31 days; Lifetime is unlimited access under seller terms. These are duration options, not Lite, Pro or Elite feature tiers.',
    },
    {
      num: '03',
      phase: 'Checkout',
      title: 'Review the order',
      desc: 'Check the exact items, entitlements, activation timing and seller terms before payment.',
    },
    {
      num: '04',
      phase: 'Setup',
      title: 'Follow current instructions',
      desc: 'Use the installation and activation documentation supplied for your actual order.',
    },
  ];

  t.compatibility.items = [...cfg.compatibilityBadges];
}

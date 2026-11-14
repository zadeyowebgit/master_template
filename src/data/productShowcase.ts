import type { IconName } from '../components/icons/types';
import { checkoutPath } from '../config/checkout';
import { game } from '../game';
import { gameCatalog } from './gameCatalog';
import type { LocaleCode } from '../i18n/locales';
import { useTranslations, withLocalePrefix } from '../i18n/utils';
import { productPath } from '../utils/path';

export interface ProductShowcaseFeature {
  id: string;
  title: string;
  badge: string;
  icon: IconName;
  items: string[];
  image: string;
  imageAlt: string;
}

const productShowcaseBase = {
  eyebrow: '[[SHOWCASE_EYEBROW]]',
  title: '[[SHOWCASE_TITLE]]',
  description: gameCatalog.description,
  statusLabel: '[[SHOWCASE_STATUS_LABEL]]',
  statusMeta: gameCatalog.summary,
  buyUrl: checkoutPath(),
  detailsUrl: productPath(game.site.defaultProductSlug),
  includedLabel: '[[SHOWCASE_INCLUDED_LABEL]]',
  features: [
    {
      id: 'visual',
      title: '[[SHOWCASE_FEATURE_1_TITLE]]',
      badge: '[[SHOWCASE_FEATURE_BADGE]]',
      icon: 'eye',
      items: ['[[SHOWCASE_FEATURE_1_ITEM_1]]', '[[SHOWCASE_FEATURE_1_ITEM_2]]', '[[SHOWCASE_FEATURE_1_ITEM_3]]', '[[SHOWCASE_FEATURE_1_ITEM_4]]'],
      image: '/images/placeholders/card.svg',
      imageAlt: '[[SHOWCASE_FEATURE_1_ALT]]',
    },
    {
      id: 'loot',
      title: '[[SHOWCASE_FEATURE_2_TITLE]]',
      badge: '[[SHOWCASE_FEATURE_BADGE]]',
      icon: 'lootEsp',
      items: ['[[SHOWCASE_FEATURE_2_ITEM_1]]', '[[SHOWCASE_FEATURE_2_ITEM_2]]', '[[SHOWCASE_FEATURE_2_ITEM_3]]', '[[SHOWCASE_FEATURE_2_ITEM_4]]'],
      image: '/images/placeholders/card.svg',
      imageAlt: '[[SHOWCASE_FEATURE_2_ALT]]',
    },
    {
      id: 'world',
      title: '[[SHOWCASE_FEATURE_3_TITLE]]',
      badge: '[[SHOWCASE_FEATURE_BADGE]]',
      icon: 'radar',
      items: ['[[SHOWCASE_FEATURE_3_ITEM_1]]', '[[SHOWCASE_FEATURE_3_ITEM_2]]', '[[SHOWCASE_FEATURE_3_ITEM_3]]', '[[SHOWCASE_FEATURE_3_ITEM_4]]'],
      image: '/images/placeholders/card.svg',
      imageAlt: '[[SHOWCASE_FEATURE_3_ALT]]',
    },
    {
      id: 'misc',
      title: '[[SHOWCASE_FEATURE_4_TITLE]]',
      badge: '[[SHOWCASE_FEATURE_BADGE]]',
      icon: 'settings',
      items: ['[[SHOWCASE_FEATURE_4_ITEM_1]]', '[[SHOWCASE_FEATURE_4_ITEM_2]]', '[[SHOWCASE_FEATURE_4_ITEM_3]]', '[[SHOWCASE_FEATURE_4_ITEM_4]]'],
      image: '/images/placeholders/card.svg',
      imageAlt: '[[SHOWCASE_FEATURE_4_ALT]]',
    },
  ] satisfies ProductShowcaseFeature[],
};

export function getProductShowcase(locale: LocaleCode = 'en') {
  const t = useTranslations(locale);
  return {
    ...productShowcaseBase,
    description: gameCatalog.description,
    statusMeta: gameCatalog.summary,
    title: locale === 'en' ? '[[SHOWCASE_TITLE]]' : productShowcaseBase.title,
    includedLabel: t.productShowcase?.includedLabel ?? productShowcaseBase.includedLabel,
    seoParagraphs: [
      '[[SHOWCASE_SEO_PARA_1]]',
      '[[SHOWCASE_SEO_PARA_2]]',
    ],
    buyUrl: productShowcaseBase.buyUrl,
    detailsUrl: withLocalePrefix(productShowcaseBase.detailsUrl, locale),
    features: productShowcaseBase.features,
  };
}

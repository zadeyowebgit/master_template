import { game } from '../game';

export const brandLogo = '/images/placeholders/og.svg';

/** Primary hero / LCP image path for above-the-fold rendering. */
export const heroLcpImage = '/images/placeholders/hero.svg';

export const heroGallery = [
  {
    src: '/images/placeholders/hero.svg',
    alt: '[[HERO_GALLERY_1_ALT]]',
    caption: '[[HERO_GALLERY_1_CAPTION]]',
    captionDesc: '[[HERO_GALLERY_1_DESC]]',
  },
  {
    src: '/images/placeholders/hero.svg',
    alt: '[[HERO_GALLERY_2_ALT]]',
    caption: '[[HERO_GALLERY_2_CAPTION]]',
    captionDesc: '[[HERO_GALLERY_2_DESC]]',
  },
  {
    src: '/images/placeholders/hero.svg',
    alt: '[[HERO_GALLERY_3_ALT]]',
    caption: '[[HERO_GALLERY_3_CAPTION]]',
    captionDesc: '[[HERO_GALLERY_3_DESC]]',
  },
  {
    src: '/images/placeholders/hero.svg',
    alt: '[[HERO_GALLERY_4_ALT]]',
    caption: '[[HERO_GALLERY_4_CAPTION]]',
    captionDesc: '[[HERO_GALLERY_4_DESC]]',
  },
  {
    src: '/images/placeholders/hero.svg',
    alt: '[[HERO_GALLERY_5_ALT]]',
    caption: '[[HERO_GALLERY_5_CAPTION]]',
    captionDesc: '[[HERO_GALLERY_5_DESC]]',
  },
] as const;

export const productGalleryImage = {
  primary: '/images/placeholders/card.svg',
} as const;

export const blogGalleryImage = {
  'best-cheats': '/images/placeholders/card.svg',
  aimbot: '/images/placeholders/card.svg',
  esp: '/images/placeholders/card.svg',
} as const;

export const allGameplayImages = [
  ...heroGallery.map((image) => image.src),
  ...Object.values(productGalleryImage),
  ...Object.values(blogGalleryImage),
];

export const mediaBase = `/images/${game.site.mediaPathSegment}`;

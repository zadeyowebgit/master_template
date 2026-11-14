import { heroLcpImage } from './media';

export const HERO_POSTER_SIZES = '(min-width: 1024px) 560px, 360px';

/** Hero LCP image set for the template hero. */
export async function buildHeroLcpImageSet() {
  const src = heroLcpImage;
  const stub = {
    src,
    attributes: { width: 1280, height: 720 },
  };
  return {
    poster720: stub,
    poster720Avif: stub,
    poster960: stub,
    posterWebpSrcset: `${src} 1280w`,
    posterAvifSrcset: `${src} 1280w`,
    posterSizes: HERO_POSTER_SIZES,
    bg960: stub,
    bg1280: stub,
    bgSmWebpSrcset: `${src} 1280w`,
    bgSmAvifSrcset: `${src} 1280w`,
    bgLgWebpSrcset: `${src} 1280w`,
    bgLgAvifSrcset: `${src} 1280w`,
  };
}

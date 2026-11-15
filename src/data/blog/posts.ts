import type { BlogPostFull } from './types';
import { templateBlogPosts } from './template-posts';

const suppliedBlogImages: Record<string, string> = {
  'best-cheats': '/images/placeholders/card.svg',
  aimbot: '/images/placeholders/card.svg',
  esp: '/images/placeholders/card.svg',
  config: '/images/placeholders/card.svg',
  performance: '/images/placeholders/card.svg',
  buying: '/images/placeholders/card.svg',
  safety: '/images/placeholders/card.svg',
  features: '/images/placeholders/card.svg',
  access: '/images/placeholders/card.svg',
  skins: '/images/placeholders/card.svg',
  external: '/images/placeholders/card.svg',
  automation: '/images/placeholders/card.svg',
  dma: '/images/placeholders/card.svg',
  recoil: '/images/placeholders/card.svg',
  windows: '/images/placeholders/card.svg',
  radar: '/images/placeholders/card.svg',
};

export const blogPosts: BlogPostFull[] = templateBlogPosts.map((post) => ({
  ...post,
  image: suppliedBlogImages[post.slug] ?? post.image,
}));

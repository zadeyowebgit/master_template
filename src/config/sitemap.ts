import type { SitemapItem } from '@astrojs/sitemap';
import { blogPosts } from '../data/blog';
import { parseBlogDate } from '../utils/schema';
import { stripLocalePrefix } from '../i18n/utils';
import { consolidatedForumPath } from '../data/forum-consolidations.mjs';

const blogLastmod = new Map(
  blogPosts.map((post) => [`/blog/${post.slug}/`, parseBlogDate(post.modifiedDate ?? post.date)] as const),
);

function pathnameFromUrl(url: string): string {
  const path = new URL(url).pathname;
  return path.endsWith('/') ? path : `${path}/`;
}

export function sitemapSerialize(item: SitemapItem): SitemapItem | undefined {
  const path = pathnameFromUrl(item.url);
  const bare = stripLocalePrefix(path);
  if (consolidatedForumPath(path) !== path) return undefined;

  if (bare.includes('/404') || bare.startsWith('/go/') || (bare === '/reviews/' && path !== '/reviews/') || bare.includes('/rss.xml') || bare.includes('/cheat-tools/')) {
    return undefined;
  }

  // Do not claim a content change on every build. Omit unknown modification dates.
  delete item.lastmod;

  if (bare === '/') {
    item.priority = path === '/' ? 1 : 0.95;
    item.changefreq = 'weekly';
    return item;
  }

  if (bare === '/blog/') {
    item.priority = 0.9;
    item.changefreq = 'weekly';
    return item;
  }

  if (bare === '/forum/') {
    item.priority = 0.8;
    item.changefreq = 'daily';
    return item;
  }

  if (bare.startsWith('/forum/')) {
    item.priority = 0.6;
    item.changefreq = 'weekly';
    return item;
  }

  if (bare.startsWith('/blog/')) {
    item.priority = 0.7;
    item.changefreq = 'monthly';
    item.lastmod = blogLastmod.get(bare);
    return item;
  }

  if (bare.startsWith('/guides/')) {
    item.priority = 0.65;
    item.changefreq = 'monthly';
    return item;
  }

  if (bare.startsWith('/products/')) {
    item.priority = 0.8;
    item.changefreq = 'weekly';
    item.lastmod = '2026-11-11';
    return item;
  }

  if (
    bare === '/about/' ||
    bare === '/support/' ||
    bare === '/privacy/' ||
    bare === '/terms/' ||
    bare === '/faq/'
  ) {
    item.priority = 0.5;
    item.changefreq = 'yearly';
    return item;
  }

  item.priority = 0.6;
  item.changefreq = 'monthly';
  return item;
}

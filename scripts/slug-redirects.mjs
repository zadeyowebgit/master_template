/** Legacy short slugs → current blog/forum slugs (customize per migrated game). */
export const BLOG_SLUG_REDIRECTS = {};
export const FORUM_SLUG_REDIRECTS = {};
export const PRODUCT_PATH_REDIRECTS = {};
export const blogRedirectEntries = () =>
  Object.fromEntries(
    Object.entries(BLOG_SLUG_REDIRECTS).map(([from, to]) => [`/blog/${from}/`, `/blog/${to}/`]),
  );
export const forumRedirectEntries = () =>
  Object.fromEntries(
    Object.entries(FORUM_SLUG_REDIRECTS).map(([from, to]) => [`/forum/${from}/`, `/forum/${to}/`]),
  );

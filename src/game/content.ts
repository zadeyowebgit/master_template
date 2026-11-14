/**
 * Single import surface for game-owned content during migrations.
 * UI components should prefer `game` for branding/routes and these exports for editorial data.
 */
export { blogPosts, getAllBlogSlugs, getBlogPost } from '../data/blog';
export { forumPosts, forumCategories } from '../data/forum';
export { purchaseFaqs as siteFaqsPool, MAIN_FAQ_IDS, HOME_FAQ_IDS } from '../data/purchaseFaqs';
export { customerReviews } from '../data/reviews';
export { productPages, productHub, getAllProductSlugs, getProductPage } from '../data/products';
export { gameCatalog as productCatalog } from '../data/gameCatalog';

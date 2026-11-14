export type { ForumComment, ForumPost } from './forum-types';
import type { ForumPost } from './forum-types';
import { forumPosts as generatedForumPosts } from './forum.generated';

export const forumPosts: ForumPost[] = generatedForumPosts as ForumPost[];

export const forumCategories = [
  { name: '[[FORUM_CAT_GENERAL]]', tone: 'purple', icon: 'users' },
  { name: '[[FORUM_CAT_GUIDES]]', tone: 'blue', icon: 'navBlog' },
  { name: '[[FORUM_CAT_PATCH]]', tone: 'orange', icon: 'refresh' },
  { name: '[[FORUM_CAT_COMMUNITY]]', tone: 'green', icon: 'messageCircle' },
] as const;

export function getForumPost(slug: string): ForumPost | undefined {
  return forumPosts.find((post) => post.slug === slug);
}

export function getAllForumSlugs(): string[] {
  return forumPosts.map((post) => post.slug);
}

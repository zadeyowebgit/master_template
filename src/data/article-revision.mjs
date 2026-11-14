import { createHash } from 'node:crypto';

/** A source edit invalidates every localized snapshot, even if dates are unchanged. */
export function articleRevision(post) {
  const { title, seoTitle, desc, body, relatedKeywords } = post;
  return createHash('sha256').update(JSON.stringify({ title, seoTitle, desc, body, relatedKeywords })).digest('hex');
}

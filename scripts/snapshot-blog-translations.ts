import fs from 'node:fs';
import { blogPosts } from '../src/data/blog/posts';
import { translateDisplayData } from '../src/i18n/content';
import { articleRevision } from '../src/data/article-revision.mjs';
import intros from '../src/data/blog/editorial-intros.json';

// Explicit editorial operation, deliberately NOT run by the production build.
// Never equate a source fingerprint or dictionary coverage with native review.
const result: Record<string, unknown> = {};
for (const locale of ['de', 'es', 'fr', 'pl', 'pt', 'ru', 'tr'] as const) {
  result[locale] = Object.fromEntries(blogPosts.map(post => {
    const translated = translateDisplayData({ title: post.title, seoTitle: post.seoTitle, desc: post.desc, body: post.body }, locale);
    const intro = intros[locale]?.[post.slug as keyof typeof intros[typeof locale]];
    if (!intro) throw new Error(`Missing editorial introduction: ${locale}/${post.slug}`);
    translated.body[0] = { type: 'p', text: intro };
    const citations = ((post.body[0] as { text: string }).text.match(/\[[^\]]+\]\([^)]+\)/g) ?? []);
    if (citations.length) translated.body[0].text += ' ' + citations.join(' ');
    return [post.slug, { sourceRevision: articleRevision(post), nativeReview: 'not-certified', content: translated }];
  }));
}
fs.writeFileSync('src/data/blog/translations.json', JSON.stringify(result, null, 2) + '\n');
console.log('Wrote 77 source-linked translations; native review is not certified.');

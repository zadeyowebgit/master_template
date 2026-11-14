import type { LocaleCode } from './locales';

const english = [
  'Reviews',
  'A closer look, from the other side.',
  '',
  'Rating',
  'All ratings',
  'No reviews at this rating.',
  'reviews',
  'Anonymous',
  'Community',
  'Filter by rating',
  'Previous',
  'Next',
  'Page {page} of {total}',
] as const;

export function reviewsCopy(_locale: LocaleCode) {
  const [title, subtitle, notice, rating, all, empty, count, entry, community, filter, prev, next, pageLabel] = english;
  return {
    title,
    subtitle,
    notice,
    rating,
    all,
    empty,
    count,
    entry,
    community,
    filter,
    prev,
    next,
    pageLabel,
    emptyRating: 'No {rating}-star reviews.',
  };
}

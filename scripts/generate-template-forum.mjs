import fs from 'node:fs';

const slugs = [
  'overlay-questions',
  'fov-questions',
  'aimbot-delay',
  'launch-errors',
  'stream-proof',
  'hardware-change',
  'requirements-check',
];

const posts = slugs.map((slug, i) => ({
  slug,
  category: '[[FORUM_CATEGORY]]',
  categoryTone: ['purple', 'blue', 'orange', 'green'][i % 4],
  title: `[[FORUM_${slug.toUpperCase().replace(/-/g, '_')}_TITLE]]`,
  upvotes: 0,
  excerpt: `[[FORUM_${slug.toUpperCase().replace(/-/g, '_')}_EXCERPT]]`,
  author: '[[FORUM_AUTHOR]]',
  age: '',
  commentsCount: 3,
  flair: 'Editorial answer',
  sourceTitle: '[[FORUM_SOURCE_TITLE]]',
  sourcePath: `[[FORUM_SOURCE_PATH_${i + 1}]]`,
  body: [
    `[[FORUM_${slug.toUpperCase().replace(/-/g, '_')}_BODY_1]]`,
    `[[FORUM_${slug.toUpperCase().replace(/-/g, '_')}_BODY_2]]`,
    `[[FORUM_${slug.toUpperCase().replace(/-/g, '_')}_BODY_3]]`,
    `[[FORUM_${slug.toUpperCase().replace(/-/g, '_')}_BODY_4]]`,
    `[[FORUM_${slug.toUpperCase().replace(/-/g, '_')}_BODY_5]]`,
  ],
  comments: [],
}));

const comments = Object.fromEntries(
  slugs.map((slug) => [
    slug,
    [
      `[[FORUM_${slug.toUpperCase().replace(/-/g, '_')}_REPLY_1]]`,
      `[[FORUM_${slug.toUpperCase().replace(/-/g, '_')}_REPLY_2]]`,
      `[[FORUM_${slug.toUpperCase().replace(/-/g, '_')}_REPLY_3]]`,
    ],
  ]),
);

fs.writeFileSync(
  'src/data/forum.generated.ts',
  `/** AUTO-GENERATED — 7 forum discussions with placeholders. */\nexport const forumPosts = ${JSON.stringify(posts, null, 2)} as const;\n`,
);
fs.writeFileSync(
  'src/data/forum-comments.generated.ts',
  `/** AUTO-GENERATED editorial replies. */\nexport const forumTeamComments: Record<string, string[]> = ${JSON.stringify(comments, null, 2)};\n`,
);
console.log('Forum template generated:', slugs.length);

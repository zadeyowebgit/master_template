import type { SiteFaqItem } from './faq';
import { ROUTES } from '../utils/path';

function a(text: string): string {
  return text;
}

function link(text: string, href: string): string {
  return `<a href="${href}">${text}</a>`;
}

const productsHub = link('[[FAQ_PRODUCTS_LINK_LABEL]]', ROUTES.products);

export const blogTopicFaqs: Record<string, SiteFaqItem[]> = {
  Guides: [
    {
      id: 'blog-guide-start',
      topic: 'blog',
      icon: 'faqBlogGuideStart',
      q: '[[BLOG_FAQ_GUIDE_Q1]]',
      a: a('[[BLOG_FAQ_GUIDE_A1]]'),
    },
    {
      id: 'blog-guide-tier',
      topic: 'blog',
      icon: 'faqBlogGuideTier',
      q: '[[BLOG_FAQ_GUIDE_Q2]]',
      a: `[[BLOG_FAQ_GUIDE_A2 — listing at ${productsHub}]]`,
    },
    {
      id: 'blog-guide-status',
      topic: 'blog',
      icon: 'faqBlogGuideStatus',
      q: '[[BLOG_FAQ_GUIDE_Q3]]',
      a: a('[[BLOG_FAQ_GUIDE_A3]]'),
    },
  ],
  Setup: [
    {
      id: 'blog-setup-loader',
      topic: 'blog',
      icon: 'faqBlogSetupLoader',
      q: '[[BLOG_FAQ_SETUP_Q1]]',
      a: a('[[BLOG_FAQ_SETUP_A1]]'),
    },
    {
      id: 'blog-setup-lobby',
      topic: 'blog',
      icon: 'faqBlogSetupLobby',
      q: '[[BLOG_FAQ_SETUP_Q2]]',
      a: a('[[BLOG_FAQ_SETUP_A2]]'),
    },
  ],
  Security: [
    {
      id: 'blog-sec-eac',
      topic: 'blog',
      icon: 'faqBlogSecEac',
      q: '[[BLOG_FAQ_SECURITY_Q1]]',
      a: a('[[BLOG_FAQ_SECURITY_A1]]'),
    },
  ],
};

export const defaultBlogFaqs: SiteFaqItem[] = [
  {
    id: 'blog-default-1',
    topic: 'blog',
    icon: 'faqBlogDefault1',
    q: '[[BLOG_FAQ_DEFAULT_Q1]]',
    a: `[[BLOG_FAQ_DEFAULT_A1 — see ${productsHub}]]`,
  },
  {
    id: 'blog-default-2',
    topic: 'blog',
    icon: 'faqBlogDefault2',
    q: '[[BLOG_FAQ_DEFAULT_Q2]]',
    a: a('[[BLOG_FAQ_DEFAULT_A2]]'),
  },
  {
    id: 'blog-default-3',
    topic: 'blog',
    icon: 'faqBlogDefault3',
    q: '[[BLOG_FAQ_DEFAULT_Q3]]',
    a: a('[[BLOG_FAQ_DEFAULT_A3]]'),
  },
];

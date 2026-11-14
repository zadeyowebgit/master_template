export interface SiteConfig {
  name: string;
  domain: string;
  title: string;
  description: string;
  discord: string;
}

export interface NavLink {
  href: string;
  label: string;
  ariaLabel?: string;
  /** When the target section exists on the current page, scroll instead of navigating. */
  scrollTarget?: string;
}

export interface FeatureItem {
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  bullets?: string[];
  /** Tailwind classes: sm:col-span-2 stack; lg: explicit col/row start + span */
  bento?: string;
}

export interface TierCard {
  badge: string;
  tier: string;
  name: string;
  title: string;
  desc: string;
  features: string[];
  more: number;
  href: string;
  variant: 'essential' | 'popular' | 'limited';
}

export interface ProductCard {
  badge: string;
  category: string;
  title: string;
  subtitle: string;
  desc: string;
  features: string[];
  more: number;
  href: string;
}

export interface BlogPost {
  tag: string;
  title: string;
  /** Shorter title tag (~50–60 chars). Falls back to title. */
  seoTitle?: string;
  slug: string;
  image: string;
  desc: string;
  date: string;
  readTime: string;
}

export interface FaqItem {
  num: string;
  id?: string;
  q: string;
  a: string;
}

export interface FaqLandingEntry {
  id: string;
  q: string;
  a: string;
}

export interface StepItem {
  step: string;
  title: string;
  desc: string;
}

export interface ToolkitItem {
  num: string;
  label: string;
  title: string;
  desc: string;
}

export interface WorkflowItem {
  num: string;
  phase: string;
  title: string;
  desc: string;
}

export interface WhyCompareRow {
  title: string;
  desc: string;
  /** Mobile-only copy when desktop grid also renders `desc` (avoids duplicate body text). */
  descMobile?: string;
}

export interface WhyMetric {
  value: string;
  title: string;
  desc: string;
}

export interface Translations {
  site: SiteConfig;
  nav: NavLink[];
  hero: {
    status: string;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaDiscord: string;
    modesLabel: string;
    modes: string[];
    metrics: { label: string; strong: string }[];
  };
  features: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: FeatureItem[];
  };
  whyUs: {
    eyebrow: string;
    title: string;
    subtitle: string;
    usLabel: string;
    otherLabel: string;
    rows: WhyCompareRow[];
    metrics: WhyMetric[];
  };
  setup: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaPrimaryHref: string;
    ctaSecondaryHref: string;
    steps: StepItem[];
  };
  compatibility: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: string[];
  };
  cheats: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewAll: string;
    explore: string;
    items: TierCard[];
  };
  products: {
    eyebrow: string;
    title: string;
    hubPageH1: string;
    subtitle: string;
    viewAll: string;
    get: string;
    explore: string;
    items: ProductCard[];
  };
  blog: {
    eyebrow: string;
    title: string;
    subtitle: string;
    latestTitle: string;
    latestSubtitle: string;
    indexSeoIntro?: string;
    /** Suffix for blog hero/card image alt text. */
    heroImageAlt?: string;
    filterAll: string;
    sortLabel: string;
    sortNewest: string;
    sortOldest: string;
    sortShortRead: string;
    sortLongRead: string;
    emptyFilter: string;
    viewAll: string;
    read: string;
    /** CTA with `{title}` placeholder — unique anchor text per card */
    readGuide: string;
    allArticles: string;
    inThisArticle: string;
    relatedGuides: string;
    ourProducts: string;
    buyGameCheats: string;
    items: BlogPost[];
  };
  forum: {
    breadcrumb: string;
    eyebrow: string;
    title: string;
    heroCopy: string;
    exploreGuides: string;
    postsAria: string;
    sortAria: string;
    sortPopular: string;
    sortLatest: string;
    sortDiscussed: string;
    filterTopicAria: string;
    allTopics: string;
    topicsAria: string;
    searchPlaceholder: string;
    searchAria: string;
    matchingAria: string;
    filterDiscussionsAria: string;
    guideDiscussions: string;
    voteAria: string;
    upvoteAria: string;
    downvoteUnavailableAria: string;
    guideTeam: string;
    guideQa: string;
    fromGuide: string;
    comments: string;
    readDiscussion: string;
    emptyResults: string;
    paginationAria: string;
    prevPage: string;
    nextPage: string;
    communityTitle: string;
    communityCopy: string;
    topics: string;
    exploreAllGuides: string;
    guidelinesTitle: string;
    guidelinesCopy: string;
    readRules: string;
    communitiesTitle: string;
    browseAll: string;
    relatedTitle: string;
    viewAllDiscussions: string;
    previewDiscussion: string;
    postingUnavailable: string;
    guideReplies: string;
    fromSourceArticle: string;
    guideAnswer: string;
    readSourceGuide: string;
    basedOn: string;
    moreDiscussions: string;
    discussionsCount: string;
  };
  toolkit: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: ToolkitItem[];
  };
  workflow: {
    eyebrow: string;
    badge: string;
    titleBefore: string;
    titleHighlight: string;
    titleAfter?: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    ctaSecondary: string;
    ctaSecondaryHref: string;
    items: WorkflowItem[];
  };
  fieldNotes: {
    eyebrow: string;
    title: string;
    items: { num: string; title: string; desc: string }[];
  };
  support: {
    eyebrow: string;
    title: string;
    subtitle: string;
    /** Visible intro on /support/ only (≥100 chars for crawlers). */
    pageIntro?: string;
    channels: {
      icon: string;
      title: string;
      desc: string;
      detail: string;
      linkLabel: string;
      href: string;
    }[];
    ticketTitle: string;
    ticketItems: { title: string; desc: string }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pageEyebrow: string;
    pageHeroDesc: string;
    seeMore: string;
    seeLess: string;
    filterTopics: Record<
      'all' | 'plans' | 'esp' | 'scripts' | 'safety' | 'products' | 'blog' | 'setup',
      string
    >;
    items: FaqItem[];
    landing: FaqLandingEntry[];
  };
  footer: {
    tagline: string;
    explore: string;
    exploreLinks: NavLink[];
    support: string;
    legal: string;
    privacy: string;
    terms: string;
    about: string;
  };
  legalPages: {
    about: {
      title: string;
      description: string;
      sections: { heading: string; paragraphs: string[] }[];
      faqsHeading?: string;
      faqs?: { q: string; a: string }[];
      resourceLinks?: {
        heading: string;
        items: { href: string; label: string; description: string }[];
      };
    };
    privacy: {
      title: string;
      description: string;
      sections: { heading: string; paragraphs: string[] }[];
    };
    terms: {
      title: string;
      description: string;
      sections: { heading: string; paragraphs: string[] }[];
    };
    support: {
      title: string;
      description: string;
    };
  };
  ui: {
    skipLink: string;
    browseCheats: string;
    browseCheatsMobile: string;
    buyNow: string;
    seeDetails: string;
    viewDetails: string;
    /** `{title}` = product or tier name */
    buyProduct: string;
    viewProductDetails: string;
    homeAria: string;
    checkoutAria: string;
    discordAria: string;
    menuOpen: string;
    menuClose: string;
    themeLight: string;
    themeDark: string;
    /** Breadcrumb root label */
    home: string;
    logoAlt: string;
    primaryNavAria: string;
    popular: string;
    brandMarkBefore: string;
    brandMarkAccent: string;
    heroMarqueeAria: string;
    whyCompareAria: string;
  };
  media: {
    heroPosterAlt: string;
  };
  /** Product hub page section chrome (headings only — layout unchanged). */
  productHub: {
    pricingEyebrow: string;
    plansTitle: string;
    plansDesc: string;
    modulesEyebrow: string;
    modulesTitle: string;
    modulesDesc: string;
    catalogEyebrow: string;
    catalogTitle: string;
    catalogDesc: string;
    stepsEyebrow: string;
    stepsTitle: string;
    stepsDesc: string;
    faqEyebrow: string;
    faqTitle: string;
    faqDesc: string;
  };
  productShowcase: {
    title: string;
    statusLabel: string;
    includedLabel: string;
    features: {
      title: string;
      badge: string;
      items: string[];
    }[];
  };
}

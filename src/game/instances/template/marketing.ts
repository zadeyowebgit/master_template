import type { Translations } from '../../../i18n/types';
import { PH } from '../../placeholders';
import { applyTemplateHomepage } from './homepage';

/** Neutral marketing overlay applied on top of base English chrome. */
export function applyTemplateMarketingOverlay(t: Translations): Translations {
  const g = PH.GAME_NAME;

  applyTemplateHomepage(t, { productBase: '/products/cheats/' });

  t.site.title = `[[SITE_TITLE — ${g} guides and product information]]`;
  t.site.description =
    `[[SITE_META_DESCRIPTION — factual product information, requirements, and buyer guides for ${g}.]]`;

  t.setup.titleLead = '[[SETUP_TITLE_LEAD]]';
  t.setup.titleHighlight = '[[SETUP_TITLE_HIGHLIGHT]]';
  t.setup.intro = '[[SETUP_INTRO]]';
  t.setup.steps = [
    { step: 'Step 1', title: '[[SETUP_STEP_1_TITLE]]', desc: '[[SETUP_STEP_1_DESC]]' },
    { step: 'Step 2', title: '[[SETUP_STEP_2_TITLE]]', desc: '[[SETUP_STEP_2_DESC]]' },
    { step: 'Step 3', title: '[[SETUP_STEP_3_TITLE]]', desc: '[[SETUP_STEP_3_DESC]]' },
  ];

  t.faq.subtitle = '[[FAQ_SECTION_SUBTITLE]]';
  t.faq.pageHeroDesc = '[[FAQ_PAGE_HERO_DESC]]';
  t.blog.subtitle = `[[BLOG_SECTION_SUBTITLE — guides for ${g}.]]`;
  t.blog.heroImageAlt = '[[BLOG_HERO_IMAGE_ALT]]';
  t.footer.tagline = `[[FOOTER_TAGLINE — ${g} guides and product information.]]`;
  t.footer.exploreLinks = [
    { href: '/', label: '[[FOOTER_LINK_FEATURES]]', ariaLabel: 'Features', scrollTarget: 'features' },
    { href: '/products/cheats/', label: '[[FOOTER_LINK_PRODUCTS]]', ariaLabel: 'Products' },
    { href: '/products/cheats/featured-package/', label: '[[FOOTER_LINK_PRODUCT_DETAIL]]', ariaLabel: 'Product detail' },
    { href: '/blog/aimbot/', label: '[[FOOTER_LINK_AIMBOT_GUIDE]]', ariaLabel: 'Aimbot guide' },
    { href: '/blog/esp/', label: '[[FOOTER_LINK_ESP_GUIDE]]', ariaLabel: 'ESP guide' },
    { href: '/blog/', label: '[[FOOTER_LINK_ALL_GUIDES]]', ariaLabel: 'Blog' },
    { href: '/forum/', label: '[[FOOTER_LINK_FORUM]]', ariaLabel: 'Forum' },
    { href: '/faq/', label: '[[FOOTER_LINK_FAQ]]', ariaLabel: 'FAQ' },
  ];
  const about = t.legalPages.about;
  about.title = `[[ABOUT_TITLE — ${PH.SITE_BRAND}]]`;
  about.description = `[[ABOUT_META — ${PH.SITE_BRAND} publishes ${g} product information and buyer guides.]]`;
  about.sections = [
    {
      heading: '[[ABOUT_SECTION_1_HEADING]]',
      paragraphs: ['[[ABOUT_SECTION_1_P1]]', '[[ABOUT_SECTION_1_P2]]'],
    },
    {
      heading: '[[ABOUT_SECTION_2_HEADING]]',
      paragraphs: ['[[ABOUT_SECTION_2_P1]]', '[[ABOUT_SECTION_2_P2]]'],
    },
    {
      heading: '[[ABOUT_SECTION_3_HEADING]]',
      paragraphs: ['[[ABOUT_SECTION_3_P1]]', '[[ABOUT_SECTION_3_P2]]'],
    },
    {
      heading: '[[ABOUT_SECTION_4_HEADING]]',
      paragraphs: ['[[ABOUT_SECTION_4_P1]]', '[[ABOUT_SECTION_4_P2]]'],
    },
  ];
  about.faqs = [
    { q: '[[ABOUT_FAQ_1_Q]]', a: '[[ABOUT_FAQ_1_A]]' },
    { q: '[[ABOUT_FAQ_2_Q]]', a: '[[ABOUT_FAQ_2_A]]' },
    { q: '[[ABOUT_FAQ_3_Q]]', a: '[[ABOUT_FAQ_3_A]]' },
  ];
  return t;
}

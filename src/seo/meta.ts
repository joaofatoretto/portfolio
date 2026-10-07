/* Metadata for search engines and link previews (WhatsApp, LinkedIn, Slack, X), one entry per URL.
   Crawlers and previewers read the HTML before (or without) running JavaScript, so the build prerenders every page in
   PAGES to its own HTML file with its own head (see vite-plugin-seo.ts). Every page shares the home preview image.
   The image is 1200x630, ~150 KB (WhatsApp skips large ones), made in Figma: file Frequency,
   page "Portfolio · Social previews", frame "og · home". */
import { CASES } from '../content/cases';
import type { CaseStudy } from '../content/cases/types';
import { PROFILE } from '../content/profile';

export const SITE = {
  origin: 'https://joaofatoretto.com',
  name: 'João Fatoretto',
  locale: 'en_US',
  title: 'João Fatoretto · Product Designer who ships code',
  description: 'Senior product designer with 7+ years in B2B and B2C. I start with real people and data, then design and build the solution myself, from Figma to production code.',
  image: '/og/home.png',
  imageAlt: 'Listen. João Fatoretto, Product Designer who ships code',
};

export type Page = {
  /** URL path, e.g. "/work/benefits-card-app". null for the not-found page, which has no URL of its own. */
  path: string | null;
  title: string;
  description: string;
  type: 'website' | 'article';
  /** prerendered but kept out of search results and the sitemap (no canonical, robots noindex) */
  noindex?: true;
  /** schema.org objects for <script type="application/ld+json"> */
  jsonLd: object[];
};

const person = {
  '@type': 'Person', name: SITE.name, url: SITE.origin,
  jobTitle: 'Senior Product Designer', sameAs: [PROFILE.linkedin],
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'UNICAMP' },
};

export const caseTitle = (c: CaseStudy) => `${c.title} · ${SITE.name}`;

function casePage(c: CaseStudy): Page {
  const url = `${SITE.origin}/work/${c.slug}`;
  return {
    path: `/work/${c.slug}`, title: caseTitle(c), description: c.summary, type: 'article',
    jsonLd: [
      { '@type': 'Article', headline: c.title, description: c.summary, url, image: SITE.origin + c.cover.src,
        author: { '@type': 'Person', name: SITE.name, url: SITE.origin } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE.name, item: `${SITE.origin}/` },
        { '@type': 'ListItem', position: 2, name: c.title, item: url },
      ] },
    ],
  };
}

/** The landing page for clients who want something built. Its title names what they search for (Google shows
 *  about 60 characters); the page itself opens with "Tell me your idea". Languages from career.md. */
const HIRE_DESCRIPTION = 'Websites and apps for small businesses and new founders, designed and built by me. Free first chat, nothing upfront: you pay after each piece is shipped.';
export const HIRE_PAGE: Page = {
  path: '/hire',
  title: `Websites and apps for small businesses · ${SITE.name}`,
  description: HIRE_DESCRIPTION,
  type: 'website',
  jsonLd: [
    {
      '@type': 'ProfessionalService', name: `${SITE.name}, websites and apps`, url: `${SITE.origin}/hire`,
      description: HIRE_DESCRIPTION, image: SITE.origin + SITE.image, founder: person,
      serviceType: ['Websites', 'Landing pages', 'Web and mobile apps', 'Product design'],
      areaServed: 'Worldwide', knowsLanguage: ['en', 'pt'],
    },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE.name, item: `${SITE.origin}/` },
      { '@type': 'ListItem', position: 2, name: 'Websites and apps', item: `${SITE.origin}/hire` },
    ] },
  ],
};

/** Every indexable page. Each becomes an HTML file at build time and a sitemap entry. */
export const PAGES: Page[] = [
  { path: '/', title: SITE.title, description: SITE.description, type: 'website',
    jsonLd: [person, { '@type': 'WebSite', name: SITE.name, url: SITE.origin }] },
  ...CASES.map(casePage),
  HIRE_PAGE,
];

/** Where the hire form lands once it has sent (also after a plain form post): the conversion URL for Google Ads.
 *  It has a URL of its own but stays out of search results. */
export const THANKS_PAGE: Page = {
  path: '/hire/thanks', noindex: true, title: `Thanks · ${SITE.name}`,
  description: 'Your idea is in my inbox. I reply within 1 business day.', type: 'website', jsonLd: [],
};

/** Prerendered like PAGES, but left out of the sitemap and the index. */
export const UNLISTED: Page[] = [THANKS_PAGE];

/** Served for any unknown address (dist/404.html), with a 404 status and kept out of the index. */
export const NOT_FOUND: Page = {
  path: null, title: `No signal · ${SITE.name}`, description: 'This page doesn’t exist. The case studies are on the home page.', type: 'website', jsonLd: [],
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** JSON for an inline <script>: "<" escaped so text can never close the tag. */
const ldJson = (o: object) => JSON.stringify({ '@context': 'https://schema.org', ...o }).replace(/</g, '\\u003c');

/** The page's <head> tags, as HTML. */
export function renderHead(page: Page): string {
  const url = page.path === null || page.noindex ? null : SITE.origin + page.path, image = SITE.origin + SITE.image;
  return [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="author" content="${esc(SITE.name)}" />`,
    url ? `<link rel="canonical" href="${url}" />` : `<meta name="robots" content="noindex" />`,
    `<meta property="og:type" content="${page.type}" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    url && `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:secure_url" content="${image}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(SITE.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${esc(SITE.imageAlt)}" />`,
    ...page.jsonLd.map(o => `<script type="application/ld+json">${ldJson(o)}</script>`),
  ].filter(Boolean).join('\n    ');
}

const SEO_SLOT = /<!--seo:start-->[\s\S]*?<!--seo:end-->/, ROOT_SLOT = '<div id="root"></div>';

/** Puts a page's head and the app's rendered HTML into the built index.html. */
export function fillTemplate(template: string, head: string, body: string): string {
  if (!SEO_SLOT.test(template)) throw new Error('index.html is missing the <!--seo:start--><!--seo:end--> block');
  if (!template.includes(ROOT_SLOT)) throw new Error(`index.html is missing ${ROOT_SLOT}`);
  return template.replace(SEO_SLOT, () => head).replace(ROOT_SLOT, () => `<div id="root">${body}</div>`);
}

export function renderSitemap(): string {
  const urls = PAGES.map(p => `  <url><loc>${SITE.origin}${p.path}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

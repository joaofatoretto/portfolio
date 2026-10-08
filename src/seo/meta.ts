/* Metadata for search engines and link previews (WhatsApp, LinkedIn, Slack, X), one entry per URL and language.
   Crawlers and previewers read the HTML before (or without) running JavaScript, so the build prerenders every page
   to its own HTML file with its own head (see vite-plugin-seo.ts). English is at the site's own paths, Portuguese
   under /pt-br (docs/i18n.md). Every page shares the home preview image.
   The image is 1200x630, ~150 KB (WhatsApp skips large ones), made in Figma: file Frequency,
   page "Portfolio · Social previews", frame "og · home".
   Build time only: this imports the Portuguese copy, so the browser never imports it (it reads `useCopy().seo`). */
import { en, type Copy } from '../content';
import type { CaseStudy } from '../content/cases/types';
import { pt } from '../content/pt';
import { PROFILE } from '../content/profile';
import { caseTitle } from '../content/seo';
import { LOCALES, localize, splitLocale, type Locale } from '../i18n/locales';

export const SITE = {
  origin: 'https://joaofatoretto.com',
  name: PROFILE.name,
  /** English; the Portuguese page heads are in `pt.seo` */
  title: en.seo.title,
  description: en.seo.description,
  image: '/og/home.png',
  imageAlt: en.seo.imageAlt,
};

export type Page = {
  /** URL path, e.g. "/work/benefits-card-app" or "/pt-br/work/benefits-card-app". null for the not-found page, which has no URL of its own. */
  path: string | null;
  /** the language of the page's text */
  locale: Locale;
  title: string;
  description: string;
  imageAlt: string;
  type: 'website' | 'article';
  /** prerendered but kept out of search results and the sitemap (no canonical, robots noindex) */
  noindex?: true;
  /** schema.org objects for <script type="application/ld+json"> */
  jsonLd: object[];
};

export const COPY: Record<Locale, Copy> = { en, pt };
export const LOCALE_LIST = Object.keys(LOCALES) as Locale[];

const absolute = (path: string) => SITE.origin + path;

function casePage(c: CaseStudy, locale: Locale): Page {
  const path = localize(`/work/${c.slug}`, locale), url = absolute(path), seo = COPY[locale].seo;
  return {
    path, locale, title: caseTitle(c), description: c.summary, imageAlt: seo.imageAlt, type: 'article',
    jsonLd: [
      { '@type': 'Article', headline: c.title, description: c.summary, url, image: SITE.origin + c.cover.src,
        author: { '@type': 'Person', name: SITE.name, url: SITE.origin }, inLanguage: LOCALES[locale].lang },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE.name, item: absolute(localize('/', locale)) },
        { '@type': 'ListItem', position: 2, name: c.title, item: url },
      ] },
    ],
  };
}

/** The indexable pages of one language: home, every case study and the hire page. Each becomes an HTML file at build
 *  time and a sitemap entry. The hire page is the landing page for clients who want something built. */
export function pagesFor(locale: Locale): Page[] {
  const copy = COPY[locale], seo = copy.seo, inLanguage = LOCALES[locale].lang;
  const home = localize('/', locale), hire = localize('/hire', locale);
  const person = {
    '@type': 'Person', name: SITE.name, url: SITE.origin,
    jobTitle: seo.jobTitle, sameAs: [PROFILE.linkedin],
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'UNICAMP' },
  };
  return [
    { path: home, locale, title: seo.title, description: seo.description, imageAlt: seo.imageAlt, type: 'website',
      jsonLd: [person, { '@type': 'WebSite', name: SITE.name, url: SITE.origin, inLanguage }] },
    ...copy.cases.map(c => casePage(c, locale)),
    {
      path: hire, locale, title: seo.hire.title, description: seo.hire.description, imageAlt: seo.imageAlt, type: 'website',
      jsonLd: [
        {
          '@type': 'ProfessionalService', name: seo.hire.name, url: absolute(hire),
          description: seo.hire.description, image: SITE.origin + SITE.image, founder: person,
          serviceType: seo.hire.serviceType,
          areaServed: 'Worldwide', knowsLanguage: ['en', 'pt'], inLanguage,
        },
        { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE.name, item: absolute(home) },
          { '@type': 'ListItem', position: 2, name: seo.hire.breadcrumb, item: absolute(hire) },
        ] },
      ],
    },
  ];
}

/** Where the hire form lands once it has sent (also after a plain form post): the conversion URL for Google Ads.
 *  It has a URL of its own but stays out of search results. */
function thanksPage(locale: Locale): Page {
  const seo = COPY[locale].seo;
  return { path: localize('/hire/thanks', locale), locale, noindex: true, title: seo.thanks.title, description: seo.thanks.description, imageAlt: seo.imageAlt, type: 'website', jsonLd: [] };
}

/** Prerendered like the indexable pages, but left out of the sitemap and the index. */
export const unlistedFor = (locale: Locale): Page[] => [thanksPage(locale)];

/** English pages: what `PAGES` and `UNLISTED` have always meant. */
export const PAGES: Page[] = pagesFor('en');
export const HIRE_PAGE: Page = PAGES[PAGES.length - 1];
export const THANKS_PAGE: Page = thanksPage('en');
export const UNLISTED: Page[] = [THANKS_PAGE];

/** Every indexable page in every language (the sitemap, the prerender). */
export const ALL_PAGES: Page[] = LOCALE_LIST.flatMap(pagesFor);
/** Every unlisted page in every language. */
export const ALL_UNLISTED: Page[] = LOCALE_LIST.flatMap(unlistedFor);

/** Served for any unknown address (dist/404.html), with a 404 status and kept out of the index. English only: an unknown
 *  address under /pt-br gets this page too. */
export const NOT_FOUND: Page = {
  path: null, locale: 'en', title: en.seo.notFound.title, description: en.seo.notFound.description, imageAlt: en.seo.imageAlt, type: 'website', jsonLd: [],
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** JSON for an inline <script>: "<" escaped so text can never close the tag. */
const ldJson = (o: object) => JSON.stringify({ '@context': 'https://schema.org', ...o }).replace(/</g, '\\u003c');

/** A page's URL in each language, from the page's own path (a page and its twin share everything after the prefix). */
const twinPaths = (path: string) => LOCALE_LIST.map(l => ({ locale: l, path: localize(splitLocale(path).path, l) }));

/** `<link rel="modulepreload">` for a built file, e.g. the Portuguese copy chunk on Portuguese pages. */
export const modulepreload = (href: string) => `<link rel="modulepreload" href="${href}" />`;

/** The page's <head> tags, as HTML. `extra` are more head tags, added last (the build passes the modulepreload links). */
export function renderHead(page: Page, extra: string[] = []): string {
  const url = page.path === null || page.noindex ? null : SITE.origin + page.path, image = SITE.origin + SITE.image;
  const twins = url ? twinPaths(page.path!) : [];
  const other = LOCALE_LIST.filter(l => l !== page.locale);
  return [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="author" content="${esc(SITE.name)}" />`,
    url ? `<link rel="canonical" href="${url}" />` : `<meta name="robots" content="noindex" />`,
    ...twins.map(t => `<link rel="alternate" hreflang="${LOCALES[t.locale].hreflang}" href="${absolute(t.path)}" />`),
    twins.length ? `<link rel="alternate" hreflang="x-default" href="${absolute(twins[0].path)}" />` : '',
    `<meta property="og:type" content="${page.type}" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:locale" content="${LOCALES[page.locale].og}" />`,
    ...(url ? other.map(l => `<meta property="og:locale:alternate" content="${LOCALES[l].og}" />`) : []),
    url && `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:secure_url" content="${image}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(page.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${esc(page.imageAlt)}" />`,
    ...page.jsonLd.map(o => `<script type="application/ld+json">${ldJson(o)}</script>`),
    ...extra,
  ].filter(Boolean).join('\n    ');
}

const SEO_SLOT = /<!--seo:start-->[\s\S]*?<!--seo:end-->/, ROOT_SLOT = '<div id="root"></div>', HTML_LANG = /<html lang="[^"]*"/;

/** Puts a page's head and the app's rendered HTML into the built index.html, and the page's language into `<html lang>`. */
export function fillTemplate(template: string, head: string, body: string, lang: string = LOCALES.en.lang): string {
  if (!SEO_SLOT.test(template)) throw new Error('index.html is missing the <!--seo:start--><!--seo:end--> block');
  if (!template.includes(ROOT_SLOT)) throw new Error(`index.html is missing ${ROOT_SLOT}`);
  if (!HTML_LANG.test(template)) throw new Error('index.html is missing <html lang="…">');
  return template.replace(HTML_LANG, () => `<html lang="${lang}"`).replace(SEO_SLOT, () => head).replace(ROOT_SLOT, () => `<div id="root">${body}</div>`);
}

/** Every indexable page in every language, each with its alternates (the same page in the other language, and x-default). */
export function renderSitemap(pages: Page[] = ALL_PAGES): string {
  const urls = pages.map(p => {
    const alt = twinPaths(p.path!);
    const links = [...alt.map(t => ({ hreflang: LOCALES[t.locale].hreflang, path: t.path })), { hreflang: 'x-default', path: alt[0].path }]
      .map(a => `<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${absolute(a.path)}"/>`).join('');
    return `  <url><loc>${absolute(p.path!)}</loc>${links}</url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}

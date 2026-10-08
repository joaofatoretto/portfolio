import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CASES } from '../content/cases';
import { ALL_PAGES, NOT_FOUND, PAGES, THANKS_PAGE, UNLISTED, fillTemplate, modulepreload, pagesFor, renderHead, renderSitemap, unlistedFor, SITE } from './meta';

const home = PAGES[0];
const casePage = (slug: string) => PAGES.find(p => p.path === `/work/${slug}`)!;

describe('site metadata for link previews', () => {
  it('has a 1200x630 preview image that exists', () => {
    expect(existsSync(join(process.cwd(), 'public', SITE.image))).toBe(true);
    const head = renderHead(home);
    expect(head).toContain('<meta property="og:image:width" content="1200" />');
    expect(head).toContain('<meta property="og:image:height" content="630" />');
  });

  it('renders absolute Open Graph and Twitter tags', () => {
    const head = renderHead(home);
    expect(head).toContain(`<meta property="og:image" content="${SITE.origin}/og/home.png" />`);
    expect(head).toContain(`<meta property="og:url" content="${SITE.origin}/" />`);
    expect(head).toContain(`<meta property="og:title" content="${SITE.title}" />`);
    expect(head).toContain('<meta name="twitter:card" content="summary_large_image" />');
  });

  it('escapes quotes and angle brackets in text', () => {
    const head = renderHead({ ...home, title: 'A "quoted" <title>' });
    expect(head).toContain('<title>A &quot;quoted&quot; &lt;title&gt;</title>');
  });
});

describe('one page per URL, for search engines', () => {
  it('has a page for home, every case study and hiring me for a project', () => {
    expect(PAGES.map(p => p.path)).toEqual(['/', ...CASES.map(c => `/work/${c.slug}`), '/hire']);
  });

  it('describes the hire page as a service', () => {
    const head = renderHead(PAGES.find(p => p.path === '/hire')!);
    expect(head).toContain('"@type":"ProfessionalService"');
    expect(head).toContain(`<link rel="canonical" href="${SITE.origin}/hire" />`);
  });

  it('names what clients search for in the hire page title, within what Google shows (~60 characters)', () => {
    const hire = PAGES.find(p => p.path === '/hire')!;
    expect(hire.title).toMatch(/websites?/i);
    expect(hire.title).toMatch(/apps?/i);
    expect(hire.title).toMatch(/small business/i);
    expect(hire.title.length).toBeLessThanOrEqual(60);
    expect(hire.description.length).toBeLessThanOrEqual(160);
  });

  it('tells search engines what the service is, in which languages, and where the page sits', () => {
    const head = renderHead(PAGES.find(p => p.path === '/hire')!);
    expect(head).toContain('"description":');
    expect(head).toContain('"knowsLanguage":["en","pt"]');
    expect(head).toContain('"@type":"BreadcrumbList"');
  });

  it('gives every page its own title and description', () => {
    expect(new Set(PAGES.map(p => p.title)).size).toBe(PAGES.length);
    expect(new Set(PAGES.map(p => p.description)).size).toBe(PAGES.length);
  });

  it('points each page’s canonical and og:url at its own URL', () => {
    for (const p of PAGES) {
      const head = renderHead(p);
      expect(head).toContain(`<link rel="canonical" href="${SITE.origin}${p.path}" />`);
      expect(head).toContain(`<meta property="og:url" content="${SITE.origin}${p.path}" />`);
      expect(head).not.toContain('noindex');
    }
  });

  it('describes a case study with its own title, summary and breadcrumb', () => {
    const c = CASES[0], head = renderHead(casePage(c.slug));
    expect(head).toContain(`<title>${c.title} · ${SITE.name}</title>`);
    expect(head).toContain(`<meta name="description" content="${c.summary}" />`);
    expect(head).toContain('<meta property="og:type" content="article" />');
    expect(head).toContain('"@type":"BreadcrumbList"');
    expect(head).toContain(`"item":"${SITE.origin}/work/${c.slug}"`);
  });

  it('keeps the not-found page out of the index', () => {
    const head = renderHead(NOT_FOUND);
    expect(head).toContain('<meta name="robots" content="noindex" />');
    expect(head).not.toContain('rel="canonical"');
    expect(head).not.toContain('og:url');
  });

  it('prerenders the hire thank-you page (the ads conversion URL) but keeps it out of the index and the sitemap', () => {
    expect(THANKS_PAGE.path).toBe('/hire/thanks');
    expect(UNLISTED).toContain(THANKS_PAGE);
    expect(PAGES).not.toContain(THANKS_PAGE);
    const head = renderHead(THANKS_PAGE);
    expect(head).toContain('<meta name="robots" content="noindex" />');
    expect(head).not.toContain('rel="canonical"');
    expect(renderSitemap()).not.toContain('/hire/thanks');
  });

  it('lists every page in both languages in the sitemap, and nothing else', () => {
    const xml = renderSitemap();
    for (const p of ALL_PAGES) expect(xml).toContain(`<loc>${SITE.origin}${p.path}</loc>`);
    expect(xml.match(/<loc>/g)).toHaveLength(PAGES.length * 2);
  });
});

const pt = pagesFor('pt');
const ptPage = (path: string) => pt.find(p => p.path === path)!;

describe('the same pages in Portuguese', () => {
  it('mirrors every English page under /pt-br', () => {
    expect(pt.map(p => p.path)).toEqual(['/pt-br', ...CASES.map(c => `/pt-br/work/${c.slug}`), '/pt-br/hire']);
    expect(pt.every(p => p.locale === 'pt')).toBe(true);
    expect(PAGES.every(p => p.locale === 'en')).toBe(true);
    expect(unlistedFor('pt').map(p => p.path)).toEqual(['/pt-br/hire/thanks']);
    expect(unlistedFor('pt')[0].noindex).toBe(true);
  });

  it('gives every page a canonical and og:url of its own language (never the other one)', () => {
    for (const p of pt) {
      const head = renderHead(p);
      expect(head).toContain(`<link rel="canonical" href="${SITE.origin}${p.path}" />`);
      expect(head).toContain(`<meta property="og:url" content="${SITE.origin}${p.path}" />`);
    }
  });

  it('points each page to its twins: English, Portuguese and x-default (English), from either side', () => {
    const pairs: [string, string][] = [['/', '/pt-br'], ['/hire', '/pt-br/hire'], [`/work/${CASES[0].slug}`, `/pt-br/work/${CASES[0].slug}`]];
    for (const [en, br] of pairs) {
      for (const head of [renderHead(PAGES.find(p => p.path === en)!), renderHead(ptPage(br))]) {
        expect(head).toContain(`<link rel="alternate" hreflang="en" href="${SITE.origin}${en}" />`);
        expect(head).toContain(`<link rel="alternate" hreflang="pt-BR" href="${SITE.origin}${br}" />`);
        expect(head).toContain(`<link rel="alternate" hreflang="x-default" href="${SITE.origin}${en}" />`);
      }
    }
  });

  it('says which language the page is in for link previews: og:locale and the other as an alternate', () => {
    expect(renderHead(home)).toContain('<meta property="og:locale" content="en_US" />');
    expect(renderHead(home)).toContain('<meta property="og:locale:alternate" content="pt_BR" />');
    expect(renderHead(ptPage('/pt-br'))).toContain('<meta property="og:locale" content="pt_BR" />');
    expect(renderHead(ptPage('/pt-br'))).toContain('<meta property="og:locale:alternate" content="en_US" />');
  });

  it('says which language the structured data is in', () => {
    expect(renderHead(home)).toContain('"inLanguage":"en"');
    expect(renderHead(ptPage('/pt-br'))).toContain('"inLanguage":"pt-BR"');
    expect(renderHead(ptPage('/pt-br/hire'))).toContain('"inLanguage":"pt-BR"');
    expect(renderHead(ptPage(`/pt-br/work/${CASES[0].slug}`))).toContain('"inLanguage":"pt-BR"');
    expect(renderHead(ptPage('/pt-br/hire'))).toContain(`"item":"${SITE.origin}/pt-br/hire"`);
    expect(renderHead(ptPage('/pt-br/hire'))).toContain(`"item":"${SITE.origin}/pt-br"`);
  });

  it('keeps the Portuguese thank-you page out of the index, like the English one', () => {
    const head = renderHead(unlistedFor('pt')[0]);
    expect(head).toContain('<meta name="robots" content="noindex" />');
    expect(head).not.toContain('rel="canonical"');
    expect(head).not.toContain('hreflang');
    expect(head).toContain('<meta property="og:locale" content="pt_BR" />');
    expect(renderSitemap()).not.toContain('/hire/thanks');
  });

  it('leaves hreflang and alternates off pages that aren’t indexed', () => {
    for (const p of [THANKS_PAGE, NOT_FOUND]) {
      const head = renderHead(p);
      expect(head).not.toContain('hreflang');
      expect(head).not.toContain('og:locale:alternate');
    }
  });

  it('lists each page in the sitemap with its alternates', () => {
    const xml = renderSitemap();
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    for (const [en, br] of [['/', '/pt-br'], ['/hire', '/pt-br/hire']]) {
      for (const loc of [en, br]) {
        const entry = xml.match(new RegExp(`<url><loc>${SITE.origin}${loc}</loc>.*?</url>`))![0];
        expect(entry).toContain(`<xhtml:link rel="alternate" hreflang="en" href="${SITE.origin}${en}"/>`);
        expect(entry).toContain(`<xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE.origin}${br}"/>`);
        expect(entry).toContain(`<xhtml:link rel="alternate" hreflang="x-default" href="${SITE.origin}${en}"/>`);
      }
    }
  });

  it('adds extra head tags last, such as the preload of the Portuguese copy', () => {
    const head = renderHead(ptPage('/pt-br'), [modulepreload('/assets/copy-pt-abc.js')]);
    expect(head.endsWith('<link rel="modulepreload" href="/assets/copy-pt-abc.js" />')).toBe(true);
    expect(renderHead(home)).not.toContain('modulepreload');
  });
});

describe('fillTemplate', () => {
  const template = '<html lang="en"><head><!--seo:start--><title>old</title><!--seo:end--></head><body><div id="root"></div></body></html>';

  it('puts the page head and the rendered app into the built index.html', () => {
    const html = fillTemplate(template, '<title>new</title>', '<main>Hi</main>');
    expect(html).toBe('<html lang="en"><head><title>new</title></head><body><div id="root"><main>Hi</main></div></body></html>');
  });

  it('sets the page’s language on <html>', () => {
    expect(fillTemplate(template, '', '', 'pt-BR')).toContain('<html lang="pt-BR">');
    expect(fillTemplate(template.replace('lang="en"', 'lang="pt-BR"'), '', '', 'en')).toContain('<html lang="en">');
  });

  it('fails loudly when the template is missing a slot', () => {
    expect(() => fillTemplate('<html lang="en"><div id="root"></div>', '', '')).toThrow(/seo/);
    expect(() => fillTemplate('<html lang="en"><!--seo:start--><!--seo:end-->', '', '')).toThrow(/root/);
    expect(() => fillTemplate('<!--seo:start--><!--seo:end--><div id="root"></div>', '', '')).toThrow(/html lang/);
  });
});

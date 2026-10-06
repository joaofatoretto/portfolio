import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CASES } from '../content/cases';
import { NOT_FOUND, PAGES, fillTemplate, renderHead, renderSitemap, SITE } from './meta';

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

  it('lists every page in the sitemap, and nothing else', () => {
    const xml = renderSitemap();
    for (const p of PAGES) expect(xml).toContain(`<loc>${SITE.origin}${p.path}</loc>`);
    expect(xml.match(/<loc>/g)).toHaveLength(PAGES.length);
  });
});

describe('fillTemplate', () => {
  const template = '<head><!--seo:start--><title>old</title><!--seo:end--></head><body><div id="root"></div></body>';

  it('puts the page head and the rendered app into the built index.html', () => {
    const html = fillTemplate(template, '<title>new</title>', '<main>Hi</main>');
    expect(html).toBe('<head><title>new</title></head><body><div id="root"><main>Hi</main></div></body>');
  });

  it('fails loudly when the template is missing a slot', () => {
    expect(() => fillTemplate('<div id="root"></div>', '', '')).toThrow(/seo/);
    expect(() => fillTemplate('<!--seo:start--><!--seo:end-->', '', '')).toThrow(/root/);
  });
});

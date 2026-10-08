// The language redirects in vercel.json (docs/i18n.md): a visitor who chose Portuguese (cookie lang=pt), or whose browser's
// first language is Portuguese and who hasn't chosen, is sent from each English page to its /pt-br twin.
// Every English page in PAGES needs both rules; the pages that must stay as they are (the thank-you page, the API,
// the Portuguese pages) need none.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PAGES } from './seo/meta';

type Cond = { type: string; key: string; value?: string };
type Rule = { source: string; has?: Cond[]; missing?: Cond[]; destination: string; permanent: boolean };
const rules = (JSON.parse(readFileSync(join(process.cwd(), 'vercel.json'), 'utf8')).redirects ?? []) as Rule[];

/** Vercel's path pattern, for the one kind this file uses: `:name` is one path segment. */
const pattern = (source: string) => new RegExp('^' + source.replace(/:\w+/g, '[^/]+') + '$');
const matches = (r: Rule, path: string) => pattern(r.source).test(path);
const isCookie = (r: Rule) => r.has?.length === 1 && r.has[0].type === 'cookie' && r.has[0].key === 'lang' && r.has[0].value === 'pt' && !r.missing;
const isHeader = (r: Rule) =>
  r.has?.length === 1 && r.has[0].type === 'header' && r.has[0].key === 'accept-language' && r.has[0].value === '^[pP][tT].*'
  && r.missing?.length === 1 && r.missing[0].type === 'cookie' && r.missing[0].key === 'lang';
/** Where the rule sends `path`: its destination with the `:name` parts filled from the path. */
function destination(r: Rule, path: string) {
  const names = [...r.source.matchAll(/:(\w+)/g)].map(m => m[1]);
  const found = new RegExp('^' + r.source.replace(/:\w+/g, '([^/]+)') + '$').exec(path)!.slice(1);
  return names.reduce((d, n, i) => d.replace(`:${n}`, found[i]), r.destination);
}

describe('language redirects (vercel.json)', () => {
  it('are temporary, so a visitor’s choice can always change', () => {
    expect(rules.length).toBeGreaterThan(0);
    for (const r of rules) expect(r.permanent).toBe(false);
  });

  it.each(PAGES.map(p => [p.path!] as const))('sends %s to its Portuguese twin for the cookie and for a Portuguese browser', path => {
    const twin = path === '/' ? '/pt-br' : '/pt-br' + path;
    const hits = rules.filter(r => matches(r, path));
    expect(hits).toHaveLength(2);
    const byCookie = hits.filter(isCookie), byHeader = hits.filter(isHeader);
    expect(byCookie).toHaveLength(1);
    expect(byHeader).toHaveLength(1);
    expect(destination(byCookie[0], path)).toBe(twin);
    expect(destination(byHeader[0], path)).toBe(twin);
  });

  it('leaves the thank-you page, the API and the Portuguese pages alone', () => {
    for (const path of ['/hire/thanks', '/api/lead', '/pt-br', '/pt-br/hire', '/pt-br/work/benefits-card-app', '/assets/index.js', '/sitemap.xml', '/cv/joao-fatoretto-cv.pdf'])
      expect(rules.filter(r => matches(r, path)), path).toEqual([]);
  });
});

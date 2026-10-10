// The Portuguese copy must have the same shape as the English one, and no English copy may show on a Portuguese page.
// (a) structure: same keys, same list lengths, same case-body blocks and images.
// (b) leaks: every English string that Portuguese translates must be absent from the rendered Portuguese pages.
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { en, type Copy } from '../content';
import { pt } from '../content/pt';
import { CASES } from '../content/cases';
import { LocaleProvider } from './copy';
import { localize } from './locales';

type Leaf = [path: string, value: string];
function leaves(v: unknown, path = ''): Leaf[] {
  if (typeof v === 'string') return [[path, v]];
  if (Array.isArray(v)) return v.flatMap((x, i) => leaves(x, `${path}[${i}]`));
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => leaves(x, path ? `${path}.${k}` : k));
  return [];
}
/** Walks both trees and reports where their shape differs. */
function shapeDiff(a: unknown, b: unknown, path = ''): string[] {
  if (Array.isArray(a)) return !Array.isArray(b) || a.length !== b.length ? [`${path}: list length`] : a.flatMap((x, i) => shapeDiff(x, b[i], `${path}[${i}]`));
  if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object' || Array.isArray(b)) return [`${path}: not an object`];
    const ka = Object.keys(a).sort(), kb = Object.keys(b).sort();
    if (ka.join() !== kb.join()) return [`${path}: keys ${ka.join()} vs ${kb.join()}`];
    return ka.flatMap(k => shapeDiff((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], path ? `${path}.${k}` : k));
  }
  return typeof a === typeof b ? [] : [`${path}: type`];
}

describe('Portuguese copy has the English copy’s structure', () => {
  it('has the same keys and list lengths', () => {
    expect(shapeDiff(en, pt)).toEqual([]);
  });

  it('has the same case-study blocks and images', () => {
    expect(pt.cases.map(c => c.slug)).toEqual(CASES.map(c => c.slug));
    pt.cases.forEach((c, i) => {
      const e = en.cases[i];
      expect(c.body.map(b => b.type), c.slug).toEqual(e.body.map(b => b.type));
      expect(c.card, c.slug).toEqual(e.card);
      expect(c.cover, c.slug).toEqual(e.cover);
      expect(c.model).toBe(e.model);
      expect(c.platforms).toEqual(e.platforms);
      c.body.forEach((b, j) => {
        const eb = e.body[j];
        if (b.type === 'img' && eb.type === 'img') expect([b.src, b.w, b.h], `${c.slug} #${j}`).toEqual([eb.src, eb.w, eb.h]);
        if (b.type === 'embed' && eb.type === 'embed') expect(b.src, `${c.slug} #${j}`).toBe(eb.src);
      });
    });
  });

  it('reuses the data that isn’t text: logos, links, numbers, slugs', () => {
    expect(pt.hire.trust.clients).toEqual(en.hire.trust.clients);
    // a number's unit is text ("< 3 mo" is "< 3 meses"); the number itself is the same
    const num = (n: string) => n.replace(/\p{L}+/gu, '').replace(/\u00a0/g, ' ').trim();
    expect(pt.hire.proof.cards.map(c => [num(c.n), 'slug' in c ? c.slug : null])).toEqual(en.hire.proof.cards.map(c => [num(c.n), 'slug' in c ? c.slug : null]));
    expect(pt.hire.trust.stats.map(s => num(s.n))).toEqual(en.hire.trust.stats.map(s => num(s.n)));
    expect(pt.profile.loop.map(l => l[0])).toEqual(en.profile.loop.map(l => l[0]));
    expect(pt.profile.channels).toHaveProperty('hire');
    expect(Object.keys(pt.ui.models)).toEqual(Object.keys(en.ui.models));
    expect(Object.keys(pt.ui.platforms)).toEqual(Object.keys(en.ui.platforms));
  });
});

/** Leaves that hold data, not copy: the same in both languages by design. */
const DATA = [
  /\.(slug|client|src|type|company|year|model|logo|color|clock)$/, /\.platforms\[\d+\]$/,
  /^hire\.trust\.clients\[\d+\]\.name$/, /^profile\.products\[\d+\]\.name$/,
  /^profile\.channels\.\w+\[0\]$/, /* channel numbers */ /^hire\.picture\.screens\.reach\.feed\[\d+\]\[0\]$/, /* initials */
];
/** Copy that reads the same in Portuguese, kept on purpose (brand and product words, names, the language names). */
const KEPT = new Set([
  'English', 'Português', 'Maria', 'CV (PDF)', '{label} (Figma)', 'Desktop', 'Design system', 'Just Ship It', 'Landing pages',
  'E-commerce', 'Fintech', 'Product Designer', 'UX/UI Designer',
  // the Sophia case: design terms João's Portuguese article keeps in English, and the team's names
  'Benchmarking', 'Crazy Eights', 'Branding', 'Naming', 'Logo', 'Persona 1', '**Sophia.**',
  'Paulo Ortega, Rodrigo Vicenzo', 'João Vitor Fatoretto', 'Paulo Ortega', 'Rodrigo Vicenzo',
  'LinkedIn João Vitor Fatoretto', 'LinkedIn Paulo Ortega', 'LinkedIn Rodrigo Vicenzo',
]);
/** A list item that is only a link (a name pointing to a profile) is judged by its text. */
const linkText = (v: string) => v.replace(/^\[([^\]]+)\]\(https?:[^)]+\)$/, '$1');

describe('Portuguese copy translates every English string', () => {
  it('leaves nothing in English except data and the words kept on purpose', () => {
    const mine = new Map(leaves(pt));
    const untranslated = leaves(en as Copy)
      .filter(([p, v]) => mine.get(p) === v && /\p{L}{2}/u.test(v) && !/^(\/|https?:)/.test(v))
      .filter(([p, v]) => !DATA.some(d => d.test(p)) && !KEPT.has(linkText(v)))
      .map(([p, v]) => `${p}: ${v}`);
    expect(untranslated).toEqual([]);
  });
});

/** English strings that Portuguese changed, long enough to be sure of (and not a brand, a number or a path). */
const translated = (): string[] => {
  const mine = new Map(leaves(pt));
  return [...new Set(leaves(en as Copy).filter(([p, v]) => v.length > 12 && mine.get(p) !== v && !/^(\/|https?:)/.test(v)).map(([, v]) => v))];
};

const PAGES_PT = ['/', '/hire', '/hire/thanks', ...CASES.map(c => `/work/${c.slug}`)];

describe('Portuguese pages show no English copy', () => {
  it.each(PAGES_PT)('/pt-br%s', path => {
    const { container } = render(
      <LocaleProvider locale="pt" copy={pt}>
        <MemoryRouter initialEntries={[localize(path, 'pt')]} basename="/pt-br"><App /></MemoryRouter>
      </LocaleProvider>,
    );
    const text = container.textContent ?? '', html = container.innerHTML;
    expect(html.length, 'the page rendered').toBeGreaterThan(1000);
    const leaked = translated().filter(s => text.includes(s) || html.includes(s.replace(/&/g, '&amp;')));
    expect(leaked).toEqual([]);
  });
});

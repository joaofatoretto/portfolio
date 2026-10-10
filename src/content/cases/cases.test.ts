import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CASES } from '.';
import { caseTags } from './types';

const pub = (src: string) => join(process.cwd(), 'public', src);

describe('case studies content', () => {
  it('has unique slugs', () => {
    const slugs = CASES.map(c => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(CASES.map(c => [c.slug, c] as const))('%s: every image exists in public/', (_, c) => {
    const images = [c.card.src, c.cover.src, ...c.body.flatMap(b => (b.type === 'img' ? [b.src] : []))];
    for (const src of images) expect(existsSync(pub(src)), src).toBe(true);
  });

  it.each(CASES.map(c => [c.slug, c] as const))('%s: has the 20-second summary and alt text', (_, c) => {
    expect(c.problem.length).toBeGreaterThan(20);
    expect(c.outcome.length).toBeGreaterThan(20);
    for (const b of c.body) if (b.type === 'img') expect(b.alt.trim()).not.toBe('');
  });

  it('shows chips in one order: industry, model, then platforms', () => {
    expect(CASES.map(caseTags)).toEqual([
      ['E-commerce', 'B2C', 'Native app', 'Web admin'],
      ['Fintech', 'B2B2C', 'Native app', 'Web · mobile + desktop'],
      ['Weddings', 'B2C', 'Web · mobile + desktop'],
      ['AI SaaS', 'B2B + B2C', 'Landing page · desktop'],
      ['Mental health', 'B2C', 'Web · mobile + desktop'],
    ]);
  });

  it('only embeds Figma prototypes', () => {
    for (const c of CASES) for (const b of c.body) if (b.type === 'embed') expect(b.src).toMatch(/^https:\/\/embed\.figma\.com\//);
  });

  it('ships the CV', () => {
    expect(existsSync(pub('/cv/joao-fatoretto-cv.pdf'))).toBe(true);
  });
});

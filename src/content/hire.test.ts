// /hire says "Designed and built by me", so every result under it must say what João's part was where it wasn't both.
// Transferência Segura and Foodpass: he designed and wrote no code (career.md), so their lines must credit the design.
import { describe, expect, it } from 'vitest';
import { en } from '.';
import { pt } from './pt';

const DESIGN = {
  'Transferência Segura': { en: /leading the design/, pt: /liderando o design/, lines: 2 },
  Foodpass: { en: /I designed/, pt: /que desenhei/, lines: 1 },
};

describe.each([['en', en], ['pt', pt]] as const)('/hire copy (%s)', (lang, copy) => {
  it.each(Object.entries(DESIGN))('credits the design, not the build, for %s', (client, { lines: n, ...re }) => {
    const lines = [
      ...copy.hire.trust.stats.filter(s => 'src' in s && s.src === client).map(s => s.what),
      ...copy.hire.proof.cards.filter(c => c.client === client).map(c => c.what),
    ];
    expect(lines).toHaveLength(n);
    for (const line of lines) expect(line).toMatch(re[lang]);
  });
});

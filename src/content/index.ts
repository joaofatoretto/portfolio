/* All the site's translatable copy, gathered. `en` is the source of truth for the shape: `Copy` is its type, and the
   Portuguese mirror (src/content/pt/) is typed `Copy`, so a missing or extra key fails `tsc`.
   Data that isn't text (slugs, image paths and sizes, logos, links, numbers) lives once, in the English modules;
   the Portuguese files reuse it. Components read this through useCopy() (src/i18n/copy.tsx), never by importing it.
   The English modules keep their own exports (PROFILE, CASES, HERO, ...) for data and for tests. */
import { CASES } from './cases';
import { CALL, HERO, PATH, PAY, PICTURE, PROOF as HIRE_PROOF, SEND, TEMPO, TRUST } from './hire';
import { CHANNELS, FACTS, HOME, LOOP, PRODUCTS, PROOF, STEPS } from './profile';
import { SEO } from './seo';
import { UI } from './ui';

export const en = {
  profile: { home: HOME, proof: PROOF, steps: STEPS, products: PRODUCTS, loop: LOOP, facts: FACTS, channels: CHANNELS },
  hire: { hero: HERO, trust: TRUST, path: PATH, picture: PICTURE, proof: HIRE_PROOF, pay: PAY, call: CALL, send: SEND, tempo: TEMPO },
  ui: UI,
  seo: SEO,
  cases: CASES,
};

export type Copy = typeof en;

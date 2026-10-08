/* The Portuguese (pt-BR) copy, gathered the same way as ../index.ts. Each mirror file (profile, hire, ui, seo,
   cases/...) is typed from its English twin, and this object is typed `Copy`, so a missing or extra key fails `tsc`.
   Data that isn't text (slugs, image paths and sizes, logos, links, numbers) is reused from the English modules.
   Only the browser loads this by dynamic import (src/main.tsx), so it is its own chunk and English pages never fetch it.
   The prerender (src/entry-server.tsx) imports it statically; that runs in Node and is not part of the browser bundle. */
import type { Copy } from '../index';
import { CASES } from './cases';
import { CALL, HERO, PATH, PAY, PICTURE, PROOF as HIRE_PROOF, SEND, TEMPO, TRUST } from './hire';
import { CHANNELS, FACTS, HOME, LOOP, PRODUCTS, PROOF, STEPS } from './profile';
import { SEO } from './seo';
import { UI } from './ui';

export const pt: Copy = {
  profile: { home: HOME, proof: PROOF, steps: STEPS, products: PRODUCTS, loop: LOOP, facts: FACTS, channels: CHANNELS },
  hire: { hero: HERO, trust: TRUST, path: PATH, picture: PICTURE, proof: HIRE_PROOF, pay: PAY, call: CALL, send: SEND, tempo: TEMPO },
  ui: UI,
  seo: SEO,
  cases: CASES,
};

/* Lab only (dev server, never built for production): five explorations of the /hire hero.
   Each variant lives in its own folder (Hero.tsx + hero.css, classes scoped under .hvN) and replaces HireHero. */
import { lazy } from 'react';

export const VARIANTS = [
  { n: 1, name: 'Channel corridor', load: lazy(() => import('./v1/Hero')) },
  { n: 2, name: 'Napkin to app', load: lazy(() => import('./v2/Hero')) },
  { n: 3, name: 'Anaglyph depth', load: lazy(() => import('./v3/Hero')) },
  { n: 4, name: 'Channel drum', load: lazy(() => import('./v4/Hero')) },
  { n: 5, name: 'Noise to signal', load: lazy(() => import('./v5/Hero')) },
];

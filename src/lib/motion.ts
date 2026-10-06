/* Motion switch and small math helpers. Everything that moves checks MOTION first. */
const hasMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';

export const REDUCE = hasMatchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const MOTION = !REDUCE && typeof window !== 'undefined' && 'IntersectionObserver' in window;
export const FINE_POINTER = hasMatchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Reveal-on-scroll CSS only hides things when this class is present, so the page is complete without JS or motion.
// index.html sets it before the first paint with the same test; keep the two in sync.
if (MOTION) document.documentElement.classList.add('motion');

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const ss = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
/** Close to design.md's ease-lock: snaps into place. */
export const easeLock = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Runs fn(t) with t from 0 to 1 over `dur` ms, after `delay` ms. Returns a cancel function: call it on unmount. */
export function animate(dur: number, fn: (t: number) => void, delay = 0): () => void {
  const start = performance.now() + delay;
  let raf = 0;
  const step = (now: number) => {
    const t = clamp01((now - start) / dur);
    if (now >= start) fn(t);
    if (t < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

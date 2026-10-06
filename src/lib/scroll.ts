/* Scroll-linked motion. Only runs with MOTION; without it the CSS shows every section in its finished state. */
import { useEffect, useRef, type RefObject } from 'react';
import { MOTION, clamp01 } from './motion';

/** Calls cb(p) as the page scrolls: p is how much of the element a line at `at` (0 top … 1 bottom of the viewport)
 *  has passed, from 0 (the line is above the element) to 1 (the line is past its end). */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, cb: (p: number) => void, at = 0.6) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    if (!MOTION) return;
    const el = ref.current!;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      cbRef.current(clamp01((window.innerHeight * at - r.top) / Math.max(1, r.height)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
}

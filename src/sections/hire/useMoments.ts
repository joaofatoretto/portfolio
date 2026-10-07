import { useEffect, useRef, useState, type RefObject } from 'react';
import { MOTION, animate, easeLock } from '../../lib/motion';
import { DWELL, LAST, advance, locate, reached, type Clock } from './moments';

type Opts = {
  /** ms a step stays before the next comes on by itself */
  dwell?: number;
  /** called once when the section first holds the screen (or, stacked, when the first step is reached). Default: add
   *  `.play` to the section, which starts the steps. A section with an intro adds `.play` itself when it's done. */
  onArrive?: () => void;
  /** stacked mode: the steps' elements, reached as their tops pass 62% of the viewport */
  items?: string;
};

/** ms after the reader last scrolled, touched or pressed a key before a step moves on by itself */
const IDLE = 1200;
/** stacked mode: the least time between one step and the next */
const STEP_GAP = 700;

/** Runs a section told in steps (moments.ts). Two modes, chosen by the CSS:
 *  - held: `stage` is sticky inside the taller `track`. The scroll through the track picks the step, and the step's
 *    `--f` (0–1, set on the section) fills with time and with forward scrolling; when it's full and the reader is
 *    idle, the page glides to the next step. The last step gets LAST of a stretch, then the section lets go.
 *  - stacked: the stage isn't sticky (phones, where the steps are stacked). A step is reached as its top passes
 *    62% of the screen, at most one every STEP_GAP ms; the reader's scroll is the pace.
 *  Without motion it does nothing: `active` stays 0 and `pick` just sets it. */
export function useMoments(n: number, section: RefObject<HTMLElement | null>, track: RefObject<HTMLElement | null>,
  stage: RefObject<HTMLElement | null>, { dwell = DWELL, onArrive, items }: Opts = {}) {
  const [active, setActive] = useState(0);
  const glideRef = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    if (!MOTION) return;
    const sec = section.current!, tr = track.current!, st = stage.current!;
    let held = false, top = 0;
    const measure = () => { held = getComputedStyle(st).position === 'sticky'; top = parseFloat(getComputedStyle(st).top) || 0; };
    measure();
    /** where the stage starts holding still (page px), and the scroll each step gets while it holds */
    const geo = () => ({
      start: tr.getBoundingClientRect().top + window.scrollY - top,
      seg: Math.max(1, tr.offsetHeight - st.offsetHeight) / (n - 1 + LAST),
    });
    let raf = 0, last = 0, shown = 0, lastStep = -Infinity, lastUser = -Infinity, clock: Clock = { i: 0, frac: 0, fill: 0 };
    let stopGlide: (() => void) | null = null;
    const show = (i: number) => { if (i !== shown) { shown = i; setActive(i); } };
    let arrived = false;
    const play = () => { if (arrived) return; arrived = true; if (onArrive) onArrive(); else sec.classList.add('play'); };

    /** scroll to the start of step i, as one smooth move the reader can interrupt */
    const glide = (i: number) => {
      stopGlide?.();
      const { start, seg } = geo(), from = window.scrollY, to = start + seg * i + 2;
      stopGlide = animate(Math.min(900, 300 + Math.abs(to - from) / 2), t => {
        window.scrollTo({ top: from + (to - from) * easeLock(t), behavior: 'instant' });
        if (t === 1) stopGlide = null;
      });
    };
    glideRef.current = i => {
      if (held) { glide(i); return; }
      const el = items ? sec.querySelectorAll(items)[i] : null;
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(100, now - (last || now)); last = now;
      if (!held) {
        if (!items) return;
        const r = reached([...sec.querySelectorAll(items)].map(el => el.getBoundingClientRect().top), window.innerHeight * 0.62);
        if (r >= 0) play();
        const i = Math.max(0, r);
        // forward one step at a time, STEP_GAP apart, so steps that arrive together (a row) still come in turn
        if (i < shown) show(i);
        else if (i > shown && now - lastStep >= STEP_GAP) { show(shown + 1); lastStep = now; }
        return;
      }
      const { start, seg } = geo(), y = window.scrollY - start;
      const holding = y >= -2 && y <= seg * (n - 1 + LAST) + 2 && !document.hidden;
      if (holding) play();
      clock = advance(clock, locate(y, n, seg), dt, holding && !stopGlide && sec.classList.contains('play'), dwell);
      show(clock.i);
      sec.style.setProperty('--f', clock.fill.toFixed(3));
      if (holding && clock.fill >= 1 && clock.i < n - 1 && !stopGlide && now - lastUser > IDLE) glide(clock.i + 1);
    };
    // only run while the section is near the screen
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf); raf = 0; last = 0;
      if (e.isIntersecting) raf = requestAnimationFrame(frame);
    }, { rootMargin: '100px 0px' });
    io.observe(tr);

    // the reader takes over: anything they do stops a glide and restarts the idle wait
    const user = () => { lastUser = performance.now(); stopGlide?.(); stopGlide = null; };
    const onScroll = () => { if (!stopGlide) lastUser = performance.now(); };
    const input = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    input.forEach(t => window.addEventListener(t, user, { passive: true }));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(raf); stopGlide?.(); io.disconnect();
      input.forEach(t => window.removeEventListener(t, user));
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const pick = (i: number) => (MOTION ? glideRef.current(i) : setActive(i));
  return { active, pick };
}

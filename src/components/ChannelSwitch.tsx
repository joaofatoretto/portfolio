import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CHANNELS } from '../content/profile';
import { caseBySlug, caseNumber } from '../content/cases';
import { MOTION, lerp, ss } from '../lib/motion';
import { makeStatic } from '../lib/tv';

function channelFor(path: string, hash: string): [string, string] | null {
  if (hash && hash !== 'top' && CHANNELS[hash]) return CHANNELS[hash];
  if (path === '/') return CHANNELS.top;
  if (path === '/hire') return CHANNELS.hire;
  if (path.startsWith('/work/')) {
    const c = caseBySlug(path.split('/')[2]);
    return c ? [`CH 02·${caseNumber(c)}`, c.client] : null;
  }
  return null;
}

const scrollPad = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

/** Scrolls to the hash (or the top) whenever the location changes, and moves focus for keyboard users. */
export function useScrollOnNavigate() {
  const loc = useLocation();
  const first = useRef(true);
  useLayoutEffect(() => {
    const isFirst = first.current;
    first.current = false;
    const id = loc.hash.slice(1);
    if (!id || id === 'top') {
      if (isFirst && !id) return; // keep the browser's own scroll restoration on reload
      window.scrollTo({ top: 0, behavior: 'instant' });
      const h1 = document.querySelector<HTMLElement>('main [data-focus]');
      if (h1 && !isFirst) h1.focus({ preventScroll: true });
      return;
    }
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const target = el.classList.contains('section') ? (el.firstElementChild as HTMLElement) : el;
      window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - scrollPad()), behavior: 'instant' });
      const focusEl = el.querySelector<HTMLElement>('h2[tabindex]') || el;
      if (!isFirst) focusEl.focus({ preventScroll: true });
    });
  }, [loc.key]);
}

/** Internal links change channel: a short burst of static covers the jump, then the channel shows in the corner. */
export function ChannelSwitch() {
  // useNavigate() returns a new function whenever the path changes. Keep it in a ref so the effect below
  // isn't torn down mid-burst by the very navigation it triggers (that froze the static over the page).
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const canvasRef = useRef<HTMLCanvasElement>(null), osdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!, ctx = canvas.getContext('2d'), draw = makeStatic();
    let raf = 0, osdTimer = 0;
    const showOsd = ([ch, name]: [string, string]) => {
      const o = osdRef.current!;
      o.textContent = `${ch}  ${name.toUpperCase()}`;
      o.classList.add('on');
      clearTimeout(osdTimer);
      osdTimer = window.setTimeout(() => o.classList.remove('on'), 1400);
    };
    const go = (to: string, ch: [string, string]) => {
      if (!MOTION || !ctx) { navigateRef.current(to); showOsd(ch); return; }
      cancelAnimationFrame(raf);
      canvas.width = Math.ceil(window.innerWidth / 3); canvas.height = Math.ceil(window.innerHeight / 3);
      const start = performance.now();
      let switched = false;
      const step = (now: number) => {
        const t = now - start;
        draw(ctx, canvas.width, canvas.height, { stretch: t < 140 ? 6 : 2, band: true }, t);
        canvas.style.opacity = (t < 140 ? lerp(0, 0.9, ss(0, 140, t)) : lerp(0.9, 0, ss(140, 440, t))).toFixed(3);
        if (!switched && t >= 140) { switched = true; navigateRef.current(to); showOsd(ch); }
        if (t < 440) raf = requestAnimationFrame(step); else canvas.style.opacity = '0';
      };
      raf = requestAnimationFrame(step);
    };
    // Capture phase, so this runs before React Router's own <Link> handling.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('/')) return;
      const url = new URL(href, window.location.origin);
      const ch = channelFor(url.pathname, url.hash.slice(1));
      if (!ch) return;
      e.preventDefault();
      e.stopPropagation();
      go(url.pathname + url.hash, ch);
    };
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      cancelAnimationFrame(raf);
      clearTimeout(osdTimer);
      canvas.style.opacity = '0'; // never leave static over the page
    };
  }, []);

  return (
    <>
      <canvas className="ch-static" ref={canvasRef} aria-hidden="true" />
      <div className="ch-osd" ref={osdRef} aria-hidden="true" />
    </>
  );
}

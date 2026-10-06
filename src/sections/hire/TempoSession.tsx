import { useEffect, useId, useRef, type ReactNode } from 'react';
import { MOTION } from '../../lib/motion';

/* Tempo's real landing page (exported from its Figma file: 1500 × 11488 px in four parts), scrolled section by section.
   Each stop frames one whole section; a section taller than the frame drifts slowly through it. Moves are a clean
   exponential ease-out with a little vertical motion blur while fast, a browser scrollbar that shows only while it
   moves, and a channel flick to loop back to the top. All positions are page pixels.
   Each part but the last carries OVERLAP extra rows of the next one and sits under it: parts that only touched left a
   hairline seam at fractional pixel positions (it showed mid-frame on "Design by hand"). */
const W = 1500, PAGE_H = 11488, PART_H = 2872, PARTS = 4, OVERLAP = 16;

/** [label, from, to]: where the frame sits (top of the viewport, 1000 page px tall). `to` differs when the section drifts. */
const STOPS: [string, number, number][] = [
  ['Hero', 0, 0],
  ['Product', 1035, 1035],
  ['Connect your codebase', 2020, 2020],
  ['Design system', 2840, 2840],
  ['Tasks and branches', 3780, 3780],
  ['Design by hand', 4860, 5130],
  ['Prototype with AI', 6170, 6170],
  ['Push to Git', 7760, 7760],
  ['Wall of love', 8865, 8865],
  ['Just Ship It', 10488, 10488],
];
const HOLD = 2300, HOLD_FIRST = 3000, DRIFT = 3400, FLICK = 700;
/** Longer jumps take a little longer, so speed stays readable. */
const moveMs = (d: number) => Math.min(1350, Math.max(780, 620 + d * 0.22));
/** Exponential ease-out: quick to leave, long quiet settle, no overshoot. */
const expoOut = (u: number) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u));
const sineInOut = (u: number) => -(Math.cos(Math.PI * u) - 1) / 2;

type Seg = { t0: number; t1: number; y0: number; y1: number; ease: (u: number) => number; stop: number };
const { SEGS, LOOP } = (() => {
  const segs: Seg[] = [];
  let t = 0, y = 0;
  STOPS.forEach(([, from, to], i) => {
    if (i > 0) { const d = moveMs(Math.abs(from - y)); segs.push({ t0: t, t1: t + d, y0: y, y1: from, ease: expoOut, stop: i }); t += d; }
    const hold = i === 0 ? HOLD_FIRST : to !== from ? DRIFT : HOLD;
    segs.push({ t0: t, t1: t + hold, y0: from, y1: to, ease: sineInOut, stop: i });
    t += hold; y = to;
  });
  return { SEGS: segs, LOOP: t + FLICK };
})();

/** Tempo's landing page in a browser frame, scrolled section by section. `live` runs it (the TV hero's tear copies
 *  stay still at the top); without motion it shows the top of the page. */
export function TempoSession({ live, alt, children }: { live: boolean; alt: string; children?: ReactNode }) {
  const fid = 'tp' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const viewRef = useRef<HTMLDivElement>(null), lensRef = useRef<HTMLDivElement>(null), pageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null), blurRef = useRef<SVGFEGaussianBlurElement>(null), labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!live || !MOTION) return;
    const view = viewRef.current!, lens = lensRef.current!, page = pageRef.current!, bar = barRef.current!, blur = blurRef.current!, label = labelRef.current!;
    view.classList.add('live');
    let raf = 0, start = performance.now() + 1200, pausedAt = 0, visible = true, lastY = 0, lastNow = 0, stop = 0, flicked = false, barTimer = 0;
    const setStop = (i: number) => {
      stop = i;
      view.classList.toggle('edges', i > 0);
      label.classList.remove('in'); void label.offsetWidth;
      label.textContent = STOPS[i][0]; label.classList.add('in');
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const t = Math.max(0, now - start) % LOOP;
      let seg = SEGS[SEGS.length - 1], y = seg.y1;
      for (const s of SEGS) if (t < s.t1) { seg = s; y = s.y0 + (s.y1 - s.y0) * s.ease((t - s.t0) / (s.t1 - s.t0)); break; }
      // the loop: a channel flick covers the jump back to the top
      const inFlick = t >= LOOP - FLICK;
      if (inFlick && !flicked) { flicked = true; view.classList.remove('flick'); void view.offsetWidth; view.classList.add('flick'); }
      if (!inFlick) flicked = false;
      if (inFlick && t >= LOOP - FLICK / 2) y = 0;
      const s = inFlick && y === 0 ? 0 : seg.stop;
      if (s !== stop) setStop(s);

      const k = lens.clientWidth / W;
      page.style.transform = `translate3d(0, ${(-y * k).toFixed(2)}px, 0)`;
      // vertical motion blur from speed (screen px per frame); off when slow so the page is sharp at rest
      const v = lastNow ? Math.abs(y - lastY) * k * (16.7 / Math.max(1, now - lastNow)) : 0;
      const b = inFlick ? 0 : Math.min(3.2, v * 0.1);
      if (b > 0.35) { blur.setAttribute('stdDeviation', `0 ${b.toFixed(2)}`); lens.style.filter = `url(#${fid})`; }
      else if (lens.style.filter) lens.style.filter = '';
      // the scrollbar shows while it moves and fades a moment after it stops
      bar.style.transform = `translate3d(0, ${((y / PAGE_H) * view.clientHeight).toFixed(2)}px, 0)`;
      if (Math.abs(y - lastY) > 0.5) { view.classList.add('scrolling'); clearTimeout(barTimer); barTimer = window.setTimeout(() => view.classList.remove('scrolling'), 650); }
      lastY = y; lastNow = now;
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) start += performance.now() - pausedAt;
      if (!e.isIntersecting && visible) pausedAt = performance.now();
      visible = e.isIntersecting;
    });
    io.observe(view);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); clearTimeout(barTimer); io.disconnect(); view.classList.remove('live', 'flick', 'edges', 'scrolling'); };
  }, [live]);

  return (
    <div className="tp">
      <div className="hh-browser">
        <div className="hh-chrome" aria-hidden="true"><i /><i /><i /></div>
        <div className="tp-view" ref={viewRef}>
          <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
            <filter id={fid} x="0" y="-5%" width="100%" height="110%"><feGaussianBlur ref={blurRef} stdDeviation="0 0" /></filter>
          </svg>
          <div className="tp-lens" ref={lensRef}>
            <div className="tp-page" ref={pageRef}>
              {Array.from({ length: PARTS }, (_, i) => (
                <img key={i} src={`/hire/tempo/page-${i + 1}.webp`} alt={i === 0 ? alt : ''} aria-hidden={i === 0 ? undefined : true}
                  width={W} height={i < PARTS - 1 ? PART_H + OVERLAP : PART_H} decoding="async" style={{ top: `${(i * PART_H * 100) / PAGE_H}%` }} />
              ))}
            </div>
          </div>
          <i className="tp-edge top" aria-hidden="true" /><i className="tp-edge bottom" aria-hidden="true" />
          <i className="tp-bar" aria-hidden="true"><b ref={barRef} /></i>
          <i className="tp-flick" aria-hidden="true" />
        </div>
      </div>
      <div className="hh-caption">
        <span className="caption">Tempo · <span className="tp-label" ref={labelRef}>{STOPS[0][0]}</span></span>
        {children}
      </div>
    </div>
  );
}

/* The TV engine: one static generator and timelines shared by every screen on the site (design.md §10). */
import { useEffect, useRef, type RefObject } from 'react';
import { MOTION, lerp, ss } from './motion';

export type StaticParams = { stretch: number; band: boolean };
export type TVState = StaticParams & { stat: number; content: number; flicker: number; split: number; jitter: number };
export type Timeline = { dur: number; at: (t: number) => TVState };

/** Draws one frame of TV snow into a canvas: smeared runs and a rolling bright band while searching. */
export function makeStatic() {
  let img: ImageData | null = null, buf: Uint32Array | null = null, seed = 1;
  const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
  return function draw(ctx: CanvasRenderingContext2D, w: number, h: number, p: StaticParams, t: number) {
    if (!img || img.width !== w || img.height !== h) { img = ctx.createImageData(w, h); buf = new Uint32Array(img.data.buffer); }
    const b = buf!;
    seed = (Math.random() * 4294967295) >>> 0 || 1;
    const bandH = h * 0.2, bandY = p.band ? ((t * 1.1) % (h + bandH * 2)) - bandH : -1e9;
    for (let y = 0; y < h; y++) {
      let boost = 0;
      const d = (y - bandY) / bandH; if (d > 0 && d < 1) boost = Math.sin(d * Math.PI) * 80;
      const smear = p.stretch > 1 && rnd() < 0.4 ? p.stretch * (1 + rnd() * 3) : 1;
      const gain = 0.72 + rnd() * 0.38, row = y * w;
      let x = 0;
      while (x < w) {
        let v = (rnd() * 255 * gain + boost) | 0; if (v > 255) v = 255;
        const px = (0xff000000 | (v << 16) | (v << 8) | v) >>> 0;
        const run = smear > 1 ? 1 + ((rnd() * smear) | 0) : 1;
        for (let k = 0; k < run && x < w; k++, x++) b[row + x] = px;
      }
    }
    ctx.putImageData(img, 0, 0);
  };
}

/** Timelines for small screens. Each returns the TV state at time t (ms). */
export const TL: Record<'tune' | 'flick' | 'power', Timeline> = {
  // a picture arriving: no signal, smear, the image splits in, locks
  tune: { dur: 1050, at: t => ({
    stat: t < 160 ? 0.95 : t < 480 ? lerp(0.85, 0.25, ss(160, 480, t)) : lerp(0.25, 0, ss(480, 900, t)),
    stretch: t < 160 ? 6 : t < 480 ? 2.5 : 1, band: t < 480,
    content: t < 160 ? 0 : t < 480 ? 0.35 + 0.65 * ss(160, 440, t) : 1,
    flicker: t >= 160 && t < 480 ? 0.3 : 0,
    split: t < 160 ? 0 : t < 480 ? lerp(12, 4, ss(160, 480, t)) : lerp(4, 0, ss(480, 820, t)),
    jitter: t >= 160 && t < 480 ? 6 : t < 620 ? 1.5 : 0 }) },
  // hover: a quick channel flick
  flick: { dur: 380, at: t => ({
    stat: t < 90 ? lerp(0, 0.55, ss(0, 90, t)) : lerp(0.55, 0, ss(90, 380, t)),
    stretch: 4, band: true, content: 1, flicker: t < 200 ? 0.22 : 0,
    split: lerp(8, 0, ss(0, 380, t)), jitter: t < 220 ? 4 : 0 }) },
  // a whole card powering on (contact)
  power: { dur: 1000, at: t => ({
    stat: t < 120 ? 0.85 : lerp(0.85, 0.05, ss(120, 820, t)),
    stretch: t < 120 ? 6 : t < 420 ? 2 : 1, band: t < 420,
    content: t < 120 ? 0 : 0.4 + 0.6 * ss(120, 460, t),
    flicker: t >= 120 && t < 460 ? 0.25 : 0,
    split: t < 120 ? 0 : lerp(14, 0, ss(120, 800, t)), jitter: t >= 120 && t < 460 ? 5 : 0 }) },
};

export type TVApi = { play: (tl: Timeline) => void; busy: () => boolean; tuned: boolean };

/** Drives one screen: a canvas of static over a content layer with its own anaglyph filter. */
export function useTV(
  rootRef: RefObject<HTMLElement | null>, canvasRef: RefObject<HTMLCanvasElement | null>, layerRef: RefObject<HTMLElement | null>,
  fid: string, { grain = false, startOff = false } = {},
) {
  const api = useRef<TVApi>({ play() {}, busy: () => false, tuned: !MOTION });
  useEffect(() => {
    const root = rootRef.current!, canvas = canvasRef.current!, layer = layerRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const draw = makeStatic();
    const rOff = document.getElementById(fid + 'R'), bOff = document.getElementById(fid + 'B');
    const REST: TVState = { stat: grain ? 0.05 : 0, content: 1, split: 0, jitter: 0, flicker: 0, stretch: 1, band: false };
    const OFF: TVState = { ...REST, stat: 0.9, content: 0 };
    let cur = MOTION && startOff && !api.current.tuned ? OFF : REST;
    let anim: { tl: Timeline; start: number } | null = null, raf = 0, visible = false, lastNoise = 0;

    const apply = (p: TVState, t: number, now: number, force = false) => {
      if (p.stat > 0.002 && (force || anim || now - lastNoise > 83)) { draw(ctx, canvas.width, canvas.height, p, t); lastNoise = now; }
      canvas.style.opacity = p.stat.toFixed(3);
      const flick = p.flicker && Math.random() < p.flicker ? 0.3 + Math.random() * 0.5 : 1;
      const ls = layer.style;
      ls.opacity = (p.content * flick).toFixed(3);
      ls.transform = p.jitter ? `translate3d(0, ${((Math.random() * 2 - 1) * p.jitter).toFixed(1)}px, 0)` : '';
      if (p.split > 0.4 && rOff && bOff) {
        rOff.setAttribute('dx', (-p.split * (0.7 + Math.random() * 0.6)).toFixed(1));
        bOff.setAttribute('dx', (p.split * (0.7 + Math.random() * 0.6)).toFixed(1));
        ls.filter = `url(#${fid})`;
      } else ls.filter = '';
    };
    const size = () => {
      canvas.width = Math.max(2, Math.ceil(root.clientWidth / 2)); canvas.height = Math.max(2, Math.ceil(root.clientHeight / 2));
      apply(cur, 0, performance.now(), true);
    };
    size();
    const ro = new ResizeObserver(size); ro.observe(root);

    const loop = (now: number) => {
      raf = 0;
      if (anim) {
        const t = now - anim.start;
        if (t >= anim.tl.dur) { anim = null; cur = REST; api.current.tuned = true; root.classList.remove('tuning'); apply(REST, 0, now, true); }
        else apply(anim.tl.at(t), t, now);
      } else if (grain && visible) apply(REST, 0, now);
      if (anim || (grain && visible)) raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); });
    io.observe(root);
    api.current.play = tl => { if (!MOTION) return; anim = { tl, start: performance.now() }; root.classList.add('tuning'); kick(); };
    api.current.busy = () => !!anim;
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);
  return api;
}

/** Per-screen anaglyph filter: rose copy left, cyan copy right, the original screened on top (design.md §5). */
export function SplitFilter({ id }: { id: string }) {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <filter id={id} x="-5%" y="-2%" width="110%" height="104%" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0.239 0 0 0 0  0.431 0 0 0 0  0 0 0 1 0" result="rose" />
        <feOffset id={id + 'R'} in="rose" dx="0" dy="0" result="rose2" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0.133 0 0  0 0 0.722 0 0  0 0 1 0 0  0 0 0 1 0" result="cyan" />
        <feOffset id={id + 'B'} in="cyan" dx="0" dy="0" result="cyan2" />
        <feBlend in="rose2" in2="cyan2" mode="screen" result="rc" />
        <feBlend in="SourceGraphic" in2="rc" mode="screen" />
      </filter>
    </svg>
  );
}

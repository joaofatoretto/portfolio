/* Dots gathering into a phrase: 1px dots spread over the whole screen fly in and condense into the text, fading
   from 0 to full as they land; then the real text takes over. Noise becoming a signal, in type (design.md §1). */
import { MOTION, clamp01, easeOut } from './motion';

type Pt = { x: number; y: number };

/** The phrase's drawn pixels (alpha > 50%) on a grid of `step` px, spread out until there are at most `max`. */
export function sample(alpha: Uint8ClampedArray, w: number, h: number, step: number, max: number): Pt[] {
  for (let s = step; ; s++) {
    const pts: Pt[] = [];
    for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) if (alpha[(y * w + x) * 4 + 3] > 128) pts.push({ x, y });
    if (pts.length <= max) return pts;
  }
}

/** Where a dot is at `t` (0–1) of its flight, and how opaque: it slows as it lands and fades in as it arrives. */
export function flight(from: Pt, to: Pt, t: number) {
  const e = easeOut(clamp01(t));
  return { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, a: e };
}

const STEP = 2, MAX = 5000, FLY = 1500, SPREAD = 600;

/** Gathers dots into the text of `el`, whose words are `.w` spans; calls `done` when they've landed. Returns a cancel.
 *  Without motion it calls `done` at once. */
export function gather(el: HTMLElement, done: () => void): () => void {
  if (!MOTION) { done(); return () => {}; }
  let raf = 0, cancelled = false, canvas: HTMLCanvasElement | null = null;
  const stop = () => { cancelled = true; cancelAnimationFrame(raf); canvas?.remove(); };

  document.fonts.ready.then(() => {
    if (cancelled) return;
    // draw the phrase where the page lays it out, word by word, and read back its pixels
    const box = el.getBoundingClientRect(), cs = getComputedStyle(el);
    const w = Math.ceil(box.width), h = Math.ceil(box.height);
    const off = document.createElement('canvas'); off.width = w; off.height = h;
    const o = off.getContext('2d', { willReadFrequently: true });
    if (!o || !w || !h) { done(); return; }
    o.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    (o as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = cs.letterSpacing;
    o.fillStyle = '#fff';
    el.querySelectorAll<HTMLElement>('.w').forEach(span => {
      const r = span.getBoundingClientRect(), m = o.measureText(span.textContent ?? '');
      o.fillText(span.textContent ?? '', r.left - box.left, r.top - box.top + m.fontBoundingBoxAscent);
    });
    const targets = sample(o.getImageData(0, 0, w, h).data, w, h, STEP, MAX);

    // the flight, on a canvas over the whole screen
    const vw = window.innerWidth, vh = window.innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas = document.createElement('canvas');
    canvas.className = 'gather-canvas';
    canvas.width = vw * dpr; canvas.height = vh * dpr;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr); ctx.fillStyle = cs.color;
    const dots = targets.map(to => ({ to, from: { x: Math.random() * vw, y: Math.random() * vh }, delay: Math.random() * SPREAD }));
    const start = performance.now();
    const frame = (now: number) => {
      const t0 = now - start, at = el.getBoundingClientRect();
      ctx.clearRect(0, 0, vw, vh);
      for (const d of dots) {
        const p = flight(d.from, { x: at.left + d.to.x, y: at.top + d.to.y }, (t0 - d.delay) / FLY);
        if (p.a <= 0) continue;
        ctx.globalAlpha = p.a;
        ctx.fillRect(p.x, p.y, 1, 1);
      }
      if (t0 < FLY + SPREAD) { raf = requestAnimationFrame(frame); return; }
      done();
      // the real text fades in over the dots, then the dots go
      canvas!.classList.add('out');
      window.setTimeout(() => canvas?.remove(), 600);
    };
    raf = requestAnimationFrame(frame);
  });
  return stop;
}

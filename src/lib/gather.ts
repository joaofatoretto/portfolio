/* A phrase gathered from light, like the old PlayStation boot logo: faint streaks glide in from a halo around the
   phrase, curve into the letters and vanish into them, and the phrase fills in, solid, with a soft glow that settles.
   Noise becoming a signal, in type (design.md §1). */
import { MOTION, clamp01, easeLock } from './motion';

type Pt = { x: number; y: number };

/** The phrase's drawn pixels (alpha > 50%) on a grid of `step` px, spread out until there are at most `max`. */
export function sample(alpha: Uint8ClampedArray, w: number, h: number, step: number, max: number): Pt[] {
  for (let s = step; ; s++) {
    const pts: Pt[] = [];
    for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) if (alpha[(y * w + x) * 4 + 3] > 128) pts.push({ x, y });
    if (pts.length <= max) return pts;
  }
}

/** Where a streak starts: in a halo around its landing point, 15–50% of the screen's shorter side away (`r1`, `r2`
 *  are random 0–1: the direction and the distance), so the light gathers from around the phrase, not from afar. */
export function origin(to: Pt, vmin: number, r1: number, r2: number): Pt {
  const angle = r1 * 2 * Math.PI, d = (0.15 + 0.35 * r2) * vmin;
  return { x: to.x + Math.cos(angle) * d, y: to.y + Math.sin(angle) * d };
}

/** Where a streak is at `t` (0–1) of its flight, and how bright. It moves smoothly (eases in and out), bending off
 *  the straight line on the way (an arc that closes as it arrives). Its brightness follows the way covered, easing
 *  out: invisible at the start, brightening fast and then slowly, full only right before it lands. */
export function flight(from: Pt, to: Pt, t: number) {
  const k = clamp01(t), e = easeLock(k), dx = to.x - from.x, dy = to.y - from.y, bend = Math.sin(Math.PI * e) * 0.15;
  return { x: from.x + dx * e - dy * bend + 0, y: from.y + dy * e + dx * bend + 0, a: 1 - (1 - clamp01(e / 0.95)) ** 2 };
}

/** streaks at most; ms each one flies; ms over which they set off; trail length (share of the flight); peak brightness */
const STEP = 2, MAX = 600, FLY = 1100, SPREAD = 500, TAIL = 0.05, PEAK = 0.6;

/** Gathers streaks of light into the text of `el` (its words are `.w` spans) and fills it in: sets `--landed` (0–1,
 *  how much has landed; not `--g`, which is the page gutter) on `el` as they arrive and calls `done` when all have. Returns a cancel. Without motion it calls
 *  `done` at once. */
export function gather(el: HTMLElement, done: () => void): () => void {
  if (!MOTION) { done(); return () => {}; }
  let raf = 0, cancelled = false, canvas: HTMLCanvasElement | null = null;
  const stop = () => { cancelled = true; cancelAnimationFrame(raf); canvas?.remove(); };

  document.fonts.ready.then(() => {
    if (cancelled) return;
    // draw the phrase where the page lays it out, word by word, and read back its pixels: the streaks' targets
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
    ctx.scale(dpr, dpr); ctx.strokeStyle = cs.color; ctx.lineWidth = 1; ctx.lineCap = 'butt';
    // each starts in a halo around its own landing point (fixed offsets, so the halo follows the phrase if the page scrolls)
    const vmin = Math.min(vw, vh);
    const dots = targets.map(to => ({ to, off: origin({ x: 0, y: 0 }, vmin, Math.random(), Math.random()), delay: Math.random() * SPREAD }));
    const start = performance.now();
    const frame = (now: number) => {
      const t0 = now - start, at = el.getBoundingClientRect();
      let landed = 0;
      ctx.clearRect(0, 0, vw, vh);
      for (const d of dots) {
        const t = (t0 - d.delay) / FLY;
        if (t >= 1) { landed++; continue; }
        if (t <= 0) continue;
        const to = { x: at.left + d.to.x, y: at.top + d.to.y }, from = { x: to.x + d.off.x, y: to.y + d.off.y };
        const p = flight(from, to, t), q = flight(from, to, t - TAIL);
        ctx.globalAlpha = p.a * PEAK;
        ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      el.style.setProperty('--landed', (landed / dots.length).toFixed(3));
      if (landed < dots.length) { raf = requestAnimationFrame(frame); return; }
      canvas!.remove(); canvas = null;
      done();
    };
    raf = requestAnimationFrame(frame);
  });
  return stop;
}

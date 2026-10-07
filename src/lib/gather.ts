/* A phrase gathered from light, like the old PlayStation boot logo: streaks rush in fast from all over the screen,
   curve into the letters and vanish into them, and the phrase fills in, solid, with a flare that settles.
   Noise becoming a signal, in type (design.md §1). */
import { MOTION, clamp01 } from './motion';

type Pt = { x: number; y: number };

/** The phrase's drawn pixels (alpha > 50%) on a grid of `step` px, spread out until there are at most `max`. */
export function sample(alpha: Uint8ClampedArray, w: number, h: number, step: number, max: number): Pt[] {
  for (let s = step; ; s++) {
    const pts: Pt[] = [];
    for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) if (alpha[(y * w + x) * 4 + 3] > 128) pts.push({ x, y });
    if (pts.length <= max) return pts;
  }
}

/** Where a streak is at `t` (0–1) of its flight, and how bright: it leaves slowly and rushes in, fastest as it lands,
 *  bending off the straight line on the way (an arc that closes as it arrives). Its brightness follows the way
 *  covered, not the time: invisible at the start, full from halfway on. */
export function flight(from: Pt, to: Pt, t: number) {
  const k = clamp01(t), e = k * k * k, dx = to.x - from.x, dy = to.y - from.y, bend = Math.sin(Math.PI * e) * 0.22;
  return { x: from.x + dx * e - dy * bend + 0, y: from.y + dy * e + dx * bend + 0, a: clamp01(e / 0.5) };
}

const STEP = 2, MAX = 900, FLY = 720, SPREAD = 380, TAIL = 0.07;

/** Gathers streaks of light into the text of `el` (its words are `.w` spans) and fills it in: sets `--g` (0–1, how
 *  much has landed) on `el` as they arrive and calls `done` when all have. Returns a cancel. Without motion it calls
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
    ctx.scale(dpr, dpr); ctx.strokeStyle = cs.color; ctx.lineWidth = 1.4; ctx.lineCap = 'butt';
    // they come from everywhere: start points are spread over the screen, a little past its edges
    const dots = targets.map(to => ({ to, from: { x: (Math.random() * 1.2 - 0.1) * vw, y: (Math.random() * 1.2 - 0.1) * vh }, delay: Math.random() * SPREAD }));
    const start = performance.now();
    const frame = (now: number) => {
      const t0 = now - start, at = el.getBoundingClientRect();
      let landed = 0;
      ctx.clearRect(0, 0, vw, vh);
      for (const d of dots) {
        const t = (t0 - d.delay) / FLY;
        if (t >= 1) { landed++; continue; }
        if (t <= 0) continue;
        const to = { x: at.left + d.to.x, y: at.top + d.to.y }, p = flight(d.from, to, t), q = flight(d.from, to, t - TAIL);
        ctx.globalAlpha = p.a;
        ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      el.style.setProperty('--g', (landed / dots.length).toFixed(3));
      if (landed < dots.length) { raf = requestAnimationFrame(frame); return; }
      canvas!.remove(); canvas = null;
      done();
    };
    raf = requestAnimationFrame(frame);
  });
  return stop;
}

/* Generated graphics (design.md §8): seeded noise and parametric curves, the same generator as the Figma SVGs. */
import { ss } from './motion';

export function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function makeNoise(seed: number, n = 512) {
  const r = mulberry32(seed);
  const v = Array.from({ length: n }, () => r() * 2 - 1);
  return (x: number) => {
    const i = Math.floor(x), f = x - i;
    const a = v[((i % n) + n) % n], b = v[(((i + 1) % n) + n) % n];
    const u = f * f * (3 - 2 * f);
    return a + (b - a) * u;
  };
}
export function fbm(noise: (x: number) => number, x: number, oct = 4) {
  let s = 0, a = 1, f = 1, nm = 0;
  for (let o = 0; o < oct; o++) { s += a * noise(x * f + o * 31.7); nm += a; a *= 0.5; f *= 2; }
  return s / nm;
}
export const path = (pts: [number, number][]) => 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');

/** The brand chord: the mark's two frequencies (3:2) as one wave. */
export const chord = (x: number, period: number, amp: number) => {
  const th = (2 * Math.PI * x) / period;
  return amp * (0.62 * Math.sin(3 * th + Math.PI / 2) + 0.38 * Math.sin(2 * th));
};

/** Many voices -> your frequency: 40 fibres converge into the brand chord. Canvas 1264x300. */
export const FIBRES = (() => {
  const W = 1264, cy = 150, endX = W - 32;
  const paths: string[] = [];
  for (let i = 0; i < 40; i++) {
    const n = makeNoise(600 + i), rw = mulberry32(700 + i), pts: [number, number][] = [];
    for (let x = 0; x <= endX; x += 3) {
      const m = ss(0.1, 0.8, x / (W - 32));
      const raw = 135 * 1.6 * fbm(n, x * 0.012 + i * 7) + (rw() * 2 - 1) * 5;
      pts.push([x, cy + (1 - m) * 128 * Math.tanh(raw / 128) + m * chord(x, 190, 50)]);
    }
    paths.push(path(pts));
  }
  const main: [number, number][] = [];
  for (let x = Math.round((W - 32) * 0.8); x <= endX; x += 2) main.push([x, cy + chord(x, 190, 50)]);
  return { paths, main: path(main) };
})();

/** The mark (design.md §3): a 3:2 Lissajous figure. 40px nav size. */
export const MARK = (() => {
  const c = 20, R = 16.8, pts: [number, number][] = [];
  for (let i = 0; i <= 240; i++) { const t = (i / 240) * Math.PI * 2; pts.push([c + R * Math.sin(3 * t + Math.PI / 2), c + R * Math.sin(2 * t)]); }
  return path(pts) + 'Z';
})();

/** The 300px hero mark. `phi` drifts the phase (the lock-in animation); noise makes a ghost trace. */
export function bigFigure(phi = 0, noise: ((x: number) => number) | null = null, g = 0) {
  const c = 150, R = 105, N = 480, pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2, tt = noise ? t + 0.35 * fbm(noise, t * 2.2 + g * 13) : t;
    pts.push([c + R * Math.sin(3 * tt + Math.PI / 2 + phi), c + R * Math.sin(2 * tt)]);
  }
  return path(pts);
}
export const BIG_GHOSTS = [0, 1, 2, 3].map(g => bigFigure(0, makeNoise(900 + g), g));
export const LOCK_PHI = 1.9;

import { flight, origin, sample } from './gather';

/** a w×h alpha mask (RGBA bytes) with the given pixels opaque */
function mask(w: number, h: number, on: [number, number][]) {
  const a = new Uint8ClampedArray(w * h * 4);
  for (const [x, y] of on) a[(y * w + x) * 4 + 3] = 255;
  return a;
}

describe('dots gathering into a phrase', () => {
  it('puts a dot on the drawn pixels of the phrase, on a grid of `step`', () => {
    const pts = sample(mask(6, 4, [[0, 0], [2, 0], [3, 1], [4, 2]]), 6, 4, 2, 1000);
    expect(pts).toEqual([{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 2 }]);
  });

  it('keeps to the dot budget by spreading the grid out', () => {
    const all: [number, number][] = [];
    for (let y = 0; y < 40; y++) for (let x = 0; x < 40; x++) all.push([x, y]);
    expect(sample(mask(40, 40, all), 40, 40, 1, 100).length).toBeLessThanOrEqual(100);
  });

  it('starts near the phrase, in a halo around where it lands, not from across the screen', () => {
    const to = { x: 500, y: 300 };
    for (const [r1, r2] of [[0, 0], [0.5, 0.5], [1, 0.99], [0.25, 0.1]]) {
      const p = origin(to, 800, r1, r2), d = Math.hypot(p.x - to.x, p.y - to.y);
      expect(d).toBeGreaterThanOrEqual(0.15 * 800 - 0.001);
      expect(d).toBeLessThanOrEqual(0.5 * 800 + 0.001);
    }
  });

  it('moves smoothly: eases in and out, fastest in the middle, on a curve', () => {
    const from = { x: 0, y: 0 }, to = { x: 100, y: 0 }, x = (t: number) => flight(from, to, t).x;
    const mid = x(0.55) - x(0.45);
    expect(x(0.1) - x(0)).toBeLessThan(mid);
    expect(x(1) - x(0.9)).toBeLessThan(mid);
    expect(Math.abs(flight(from, to, 0.5).y)).toBeGreaterThan(1);
  });

  it('starts invisible and only reaches full brightness right before it lands, easing out', () => {
    const from = { x: 0, y: 0 }, to = { x: 100, y: 0 };
    expect(flight(from, to, 0).a).toBe(0);
    expect(flight(from, to, 0.05).a).toBeLessThan(0.05);
    const pts: { c: number; a: number }[] = [];
    for (let t = 0; t <= 1.0001; t += 0.005) { const p = flight(from, to, t); pts.push({ c: p.x / 100, a: p.a }); }
    for (const p of pts) if (p.c < 0.9) expect(p.a).toBeLessThan(1);
    expect(flight(from, to, 1).a).toBe(1);
    // ease-out over the way covered: brighter than linear early on, and it slows down towards full
    const at = (c: number) => pts.find(p => p.c >= c)!.a;
    expect(at(0.25)).toBeGreaterThan(0.25);
    expect(at(0.5) - at(0.25)).toBeGreaterThan(at(0.9) - at(0.65));
  });

  it('flies each dot from its start to its place, fading in as it arrives', () => {
    const from = { x: 0, y: 0 }, to = { x: 100, y: 50 };
    expect(flight(from, to, 0)).toEqual({ x: 0, y: 0, a: 0 });
    const end = flight(from, to, 1);
    expect(end.x).toBeCloseTo(100); expect(end.y).toBeCloseTo(50); expect(end.a).toBe(1);
    const mid = flight(from, to, 0.5);
    expect(mid.a).toBeGreaterThan(0); expect(mid.a).toBeLessThan(1);
  });
});

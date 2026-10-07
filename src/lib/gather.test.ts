import { flight, sample } from './gather';

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

  it('rushes in: slow to leave, fastest as it lands, on a curve (not a straight line)', () => {
    const from = { x: 0, y: 0 }, to = { x: 100, y: 0 };
    const early = flight(from, to, 0.2), late = flight(from, to, 0.8), last = flight(from, to, 0.95);
    expect(early.x).toBeLessThan(20);
    expect(last.x - late.x).toBeGreaterThan(late.x - flight(from, to, 0.65).x);
    expect(Math.abs(flight(from, to, 0.5).y)).toBeGreaterThan(1);
  });

  it('starts invisible and is only fully bright once it has covered half the way', () => {
    const from = { x: 0, y: 0 }, to = { x: 100, y: 0 };
    let first = -1;
    for (let t = 0; t <= 1.0001; t += 0.01) {
      const p = flight(from, to, t), covered = p.x / 100;
      if (covered < 0.5) expect(p.a).toBeLessThan(1);
      if (p.a >= 1 && first < 0) first = covered;
    }
    expect(first).toBeGreaterThanOrEqual(0.5);
    expect(first).toBeLessThan(0.6);
    expect(flight(from, to, 0.3).a).toBeLessThan(0.1);
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

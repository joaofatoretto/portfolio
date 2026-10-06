import { edgeRate } from './marquee';

describe('carousel speed under the mouse', () => {
  it('holds still in the middle, so a logo can be looked at', () => {
    for (const x of [0.4, 0.5, 0.6]) expect(edgeRate(x)).toBe(0);
  });

  it('speeds up toward the right edge, and runs backwards toward the left', () => {
    expect(edgeRate(1)).toBeGreaterThanOrEqual(4);
    expect(edgeRate(0)).toBeLessThanOrEqual(-4);
    expect(edgeRate(0.9)).toBeGreaterThan(edgeRate(0.75));
    expect(edgeRate(0.75)).toBeGreaterThan(0);
    expect(edgeRate(0.1)).toBeCloseTo(-edgeRate(0.9));
  });

  it('stays within bounds past the edges', () => {
    expect(edgeRate(1.2)).toBe(edgeRate(1));
    expect(edgeRate(-0.2)).toBe(edgeRate(0));
  });
});

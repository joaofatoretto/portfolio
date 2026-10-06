import { DWELL, LAST, advance, locate, reached } from './moments';

describe('"Picture it working": where the scroll is', () => {
  // 4 moments, each 100 px of scroll; the last one is shorter (LAST of a moment), so the section lets go soon after it
  const at = (y: number) => locate(y, 4, 100);

  it('maps the scroll to a moment and how far into it you are', () => {
    expect(at(-50)).toEqual({ i: 0, frac: 0 });
    expect(at(0)).toEqual({ i: 0, frac: 0 });
    expect(at(50)).toEqual({ i: 0, frac: 0.5 });
    expect(at(150)).toEqual({ i: 1, frac: 0.5 });
    expect(at(300)).toEqual({ i: 3, frac: 0 });
  });

  it('gives the last moment a shorter stretch, and holds it at the end', () => {
    expect(at(300 + LAST * 50)).toEqual({ i: 3, frac: 0.5 });
    expect(at(300 + LAST * 100)).toEqual({ i: 3, frac: 1 });
    expect(at(9999)).toEqual({ i: 3, frac: 1 });
  });
});

describe('"Picture it working": the timer that moves it on by itself', () => {
  const still = { i: 0, frac: 0 };

  it('fills on its own over DWELL ms while the reader watches', () => {
    let s = { i: 0, frac: 0, fill: 0 };
    s = advance(s, still, DWELL / 2, true);
    expect(s.fill).toBeCloseTo(0.5);
    s = advance(s, still, DWELL, true);
    expect(s.fill).toBe(1);
  });

  it('waits while the section is not holding the screen', () => {
    const s = advance({ i: 0, frac: 0, fill: 0.2 }, still, 1000, false);
    expect(s.fill).toBeCloseTo(0.2);
  });

  it('goes faster when you scroll forward, on top of the time', () => {
    const s = advance({ i: 0, frac: 0.5, fill: 0.2 }, { i: 0, frac: 0.75 }, 0, true);
    expect(s.fill).toBeCloseTo(0.6);
  });

  it('is full exactly when your scroll reaches the next moment, never before (no dead scroll)', () => {
    expect(advance({ i: 0, frac: 0.5, fill: 0.8 }, { i: 0, frac: 0.99 }, 0, true).fill).toBeLessThan(1);
    expect(advance({ i: 0, frac: 0.5, fill: 0.8 }, { i: 0, frac: 1 }, 0, true).fill).toBe(1);
    expect(advance({ i: 0, frac: 0.2, fill: 0 }, { i: 0, frac: 1 }, 0, true).fill).toBe(1);
  });

  it('never goes back when you scroll up a little inside a moment', () => {
    const s = advance({ i: 0, frac: 0.6, fill: 0.7 }, { i: 0, frac: 0.4 }, 0, true);
    expect(s.fill).toBeCloseTo(0.7);
  });

  it('starts the next moment where your scroll landed in it', () => {
    const s = advance({ i: 0, frac: 0.9, fill: 0.95 }, { i: 1, frac: 0.2 }, 16, true);
    expect(s.i).toBe(1);
    expect(s.fill).toBeCloseTo(0.2, 1);
  });

  it('gives a moment you scrolled back to its full time again', () => {
    const s = advance({ i: 2, frac: 0.1, fill: 0.4 }, { i: 1, frac: 0.9 }, 16, true);
    expect(s.i).toBe(1);
    expect(s.fill).toBeLessThan(0.01);
  });
});

describe('the timer with its own pace', () => {
  it('fills over the dwell it is given', () => {
    const s = advance({ i: 0, frac: 0, fill: 0 }, { i: 0, frac: 0 }, 1000, true, 2000);
    expect(s.fill).toBeCloseTo(0.5);
  });
});

describe('stacked steps (phones): how far the reader has got', () => {
  it('reaches each step once its top passes the line, in order', () => {
    expect(reached([700, 1200, 1700], 500)).toBe(-1);
    expect(reached([400, 900, 1400], 500)).toBe(0);
    expect(reached([-300, 200, 700], 500)).toBe(1);
    expect(reached([-900, -400, 100], 500)).toBe(2);
  });
});

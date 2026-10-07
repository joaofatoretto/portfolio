/* Sections told in steps ("Picture it working", "You pay as I deliver"): how the steps move on. The scroll picks
   the step, and a timer moves to the next one by itself, so a reader who stops scrolling still sees them all;
   scrolling forward just gets there sooner. useMoments.ts runs it on the page. */

/** ms a moment stays on before the next one comes on by itself (its animation, then time to look); the default */
export const DWELL = 4500;
/** the last moment's stretch of scroll, as a share of a normal one: the section lets go soon after it */
export const LAST = 0.5;

export type Spot = { i: number; frac: number };
export type Clock = Spot & { fill: number };

/** Which moment a scroll of `y` px into the section shows, and how far into it (0–1); `seg` px per moment. */
export function locate(y: number, n: number, seg: number): Spot {
  const pos = Math.max(0, y) / seg;
  const i = Math.min(n - 1, Math.floor(pos));
  const frac = i < n - 1 ? pos - i : Math.min(1, (pos - i) / LAST);
  return { i, frac };
}

/** One frame of the timer. `fill` (0–1) is how close the next moment is. Time adds to it while `counting` (the
 *  section is holding the screen). Scrolling forward closes the rest of the gap in proportion, so the bar is full
 *  exactly when the scroll reaches the next moment: it always answers the scroll, and never sits full while you
 *  keep scrolling. Scrolling back never takes from it. A moment reached by scrolling forward starts where the
 *  scroll landed; one scrolled back to starts over. */
export function advance(prev: Clock, now: Spot, dt: number, counting: boolean, dwell = DWELL): Clock {
  const time = counting ? dt / dwell : 0;
  if (now.i !== prev.i) return { ...now, fill: Math.min(1, (now.i > prev.i ? now.frac : 0) + time) };
  const fill = Math.min(1, prev.fill + time);
  const scrolled = now.frac >= 1 ? 1 : Math.max(0, now.frac - prev.frac) / (1 - prev.frac);
  return { ...now, fill: fill + (1 - fill) * scrolled };
}

/** Stacked steps (phones, where the section doesn't hold the screen): the last step whose top (px from the top of
 *  the viewport) has passed `line`, or -1 before the first. The reader's own scroll is the pace. */
export function reached(tops: number[], line: number): number {
  let i = -1;
  tops.forEach((t, k) => { if (t < line) i = k; });
  return i;
}

export type Pace = { shown: number; last: number };

/** Stacked steps, one frame: move `shown` towards `target` (the last step on screen). Nothing moves on until the
 *  section `playing`; then the first step's beat starts and each next step comes `gap` ms after the one before, one
 *  at a time, never past what's on screen. Scrolling back goes straight back. */
export function stepTowards(p: Pace, target: number, now: number, gap: number, playing: boolean): Pace {
  if (target < p.shown) return { shown: target, last: now };
  if (!playing) return p;
  if (p.last === -Infinity) return { shown: p.shown, last: now };
  if (target > p.shown && now - p.last >= gap) return { shown: p.shown + 1, last: now };
  return p;
}

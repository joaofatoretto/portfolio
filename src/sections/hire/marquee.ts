import { useEffect, type RefObject } from 'react';
import { MOTION } from '../../lib/motion';

/* The logo carousel under a mouse: still in the middle so a logo can be looked at (it shows its colours), faster
   toward either edge, forwards on the right and backwards on the left, as if the pointer pulls the strip along. */
const STILL = 0.3, MAX = 5;

/** Playback rate for the pointer at x across the strip (0 = left edge, 1 = right edge). */
export function edgeRate(x: number) {
  const d = (Math.min(1, Math.max(0, x)) - 0.5) * 2, a = Math.abs(d);
  if (a <= STILL) return 0;
  const t = (a - STILL) / (1 - STILL);
  return Math.sign(d) * MAX * t * t;
}

/** Drives the CSS animation of `trackRef` from the mouse over its parent, easing between speeds. Touch is left alone. */
export function useEdgeSpeed(trackRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!MOTION) return;
    const track = trackRef.current!, strip = track.parentElement!;
    if (typeof track.getAnimations !== 'function') return; // no Web Animations: it keeps its CSS speed
    const anim = () => track.getAnimations()[0];
    // start far from time 0, so running backwards never reaches the beginning
    const a0 = anim();
    if (a0) a0.currentTime = Number(a0.effect?.getTiming().duration ?? 0) * 1000;
    let target = 1, rate = 1, raf = 0;
    const tick = () => {
      rate += (target - rate) * 0.1;
      if (Math.abs(target - rate) < 0.005) rate = target;
      const a = anim();
      if (a) a.playbackRate = rate;
      raf = rate === target ? 0 : requestAnimationFrame(tick);
    };
    const go = (t: number) => { target = t; if (!raf) raf = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = strip.getBoundingClientRect();
      go(edgeRate((e.clientX - r.left) / r.width));
    };
    const leave = () => go(1);
    strip.addEventListener('pointermove', move);
    strip.addEventListener('pointerleave', leave);
    return () => { cancelAnimationFrame(raf); strip.removeEventListener('pointermove', move); strip.removeEventListener('pointerleave', leave); };
  }, [trackRef]);
}

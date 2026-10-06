import { useLayoutEffect, useRef } from 'react';
import { MOTION } from '../lib/motion';
import { useInView } from '../lib/reveal';

const CHARS = '0123456789+%<×#';

/** Numbers settle like a TV's on-screen display: characters scramble, then lock left to right. */
export function Scramble({ text }: { text: string }) {
  const ref = useRef<HTMLElement>(null), liveRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => { if (MOTION) liveRef.current!.textContent = ''; }, []);
  useInView(ref, () => {
    if (!MOTION) return;
    const N = text.length, start = performance.now();
    let last = 0;
    const step = (now: number) => {
      const t = now - start;
      if (now - last > 45) {
        last = now;
        let s = '';
        for (let i = 0; i < N; i++) { const ch = text[i]; s += ch === ' ' || t >= 180 + i * 70 ? ch : CHARS[(Math.random() * CHARS.length) | 0]; }
        liveRef.current!.textContent = s;
      }
      if (t < 180 + N * 70) requestAnimationFrame(step); else liveRef.current!.textContent = text;
    };
    requestAnimationFrame(step);
  }, 0.6);
  return (
    <b className="num" ref={ref}>
      <span className="sr">{text}</span>
      <span className="ghost" aria-hidden="true">{text}</span>
      <span aria-hidden="true" ref={liveRef}>{text}</span>
    </b>
  );
}

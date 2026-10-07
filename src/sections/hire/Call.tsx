import { Fragment, useEffect, useRef } from 'react';
import { CALL } from '../../content/hire';
import { gather } from '../../lib/gather';
import { MOTION } from '../../lib/motion';
import { useInView } from '../../lib/reveal';

/** The last call before the form, in order: the nudge ("What are you waiting for?"); then the promise, gathered from
 *  streaks of light that rush in from the whole screen and fill it in (lib/gather.ts); then an arrow draws down to
 *  the form. Plays once. */
export function Call() {
  const ref = useRef<HTMLElement>(null), titleRef = useRef<HTMLHeadingElement>(null);
  const stop = useRef<() => void>(() => {});
  useEffect(() => () => stop.current(), []);
  useInView(ref, () => {
    if (!MOTION) return;
    const sec = ref.current!;
    sec.classList.add('asked');
    const t = window.setTimeout(() => { stop.current = gather(titleRef.current!, () => sec.classList.add('formed')); }, 450);
    stop.current = () => clearTimeout(t);
  }, 0.6);
  return (
    <section className="section call" ref={ref} aria-labelledby="call-h">
      <p className="call-ask">{CALL.ask}</p>
      <h2 className="call-title" id="call-h" ref={titleRef} tabIndex={-1}>
        {CALL.title.split(' ').map((w, i) => <Fragment key={i}>{i > 0 && ' '}<span className="w">{w}</span></Fragment>)}
      </h2>
      <a className="call-arrow" href="#contact" aria-label={CALL.to}>
        <svg viewBox="0 0 48 120" aria-hidden="true"><path className="call-line" d="M24 2 C 24 40, 12 62, 24 112 M12 100 L24 114 L36 100" /></svg>
      </a>
    </section>
  );
}

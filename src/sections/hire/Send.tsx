import { useEffect, useLayoutEffect, useRef } from 'react';
import { SEND } from '../../content/hire';
import { waLink } from '../../content/profile';
import { MOTION, animate, easeLock, lerp } from '../../lib/motion';
import { Seq, SeqItem, useInView } from '../../lib/reveal';
import { BIG_GHOSTS, LOCK_PHI, bigFigure } from '../../lib/signal';
import { LeadForm } from '../../components/LeadForm';
import { WaIcon } from './icons';

/** "Let's make it real.": the closing Stage card. The headline's fringe and the mark lock in as it arrives (like Contact). */
export function Send() {
  const rootRef = useRef<HTMLElement>(null), h2Ref = useRef<HTMLHeadingElement>(null), markRef = useRef<SVGPathElement>(null);
  const cancels = useRef<(() => void)[]>([]);
  useEffect(() => () => cancels.current.forEach(c => c()), []);
  useLayoutEffect(() => {
    if (!MOTION) return;
    markRef.current!.setAttribute('d', bigFigure(LOCK_PHI));
    h2Ref.current!.style.setProperty('--ag', '14px');
  }, []);
  useInView(rootRef, () => {
    if (!MOTION) return;
    const h2 = h2Ref.current!, final = Math.max(2, parseFloat(getComputedStyle(h2).fontSize) * 0.02);
    cancels.current.push(animate(1100, t => { h2.style.setProperty('--ag', lerp(14, final, easeLock(t)).toFixed(2) + 'px'); if (t >= 1) h2.style.removeProperty('--ag'); }, 150));
    const mark = markRef.current!, root = rootRef.current!;
    cancels.current.push(animate(1900, t => { mark.setAttribute('d', bigFigure(LOCK_PHI * (1 - easeLock(t)))); if (t >= 1) root.classList.add('locked'); }, 250));
  }, 0.3);

  return (
    <section className="send stage" id="contact" ref={rootRef} aria-labelledby="contact-h">
      <div className="send-text">
        <h2 className="display-l" id="contact-h" ref={h2Ref} tabIndex={-1}>{SEND.title}</h2>
        <Seq as="ul" className="chips" step={200}>{SEND.chips.map(c => <SeqItem as="li" kind="self" key={c}>{c}</SeqItem>)}</Seq>
        <svg className="bigmark" viewBox="0 0 300 300" aria-hidden="true">
          <g className="ghosts">{BIG_GHOSTS.map((d, i) => <path key={i} d={d} strokeWidth="1" strokeOpacity="0.18" />)}</g>
          <path ref={markRef} d={bigFigure(0)} strokeWidth="3" />
        </svg>
      </div>
      <div className="send-form">
        <LeadForm />
        <div className="send-alt">
          <span className="muted">or</span>
          <a className="btn ghost" href={waLink(SEND.wa)} target="_blank" rel="noopener noreferrer"><WaIcon />Chat on WhatsApp</a>
        </div>
        <span className="caption">{SEND.reply}</span>
      </div>
    </section>
  );
}

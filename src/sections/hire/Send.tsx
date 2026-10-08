import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import { useCopy } from '../../i18n/copy';
import { MOTION, animate, easeLock, lerp } from '../../lib/motion';
import { Seq, SeqItem, useInView } from '../../lib/reveal';
import { BIG_GHOSTS, LOCK_PHI, bigFigure } from '../../lib/signal';
import { SplitFilter, TL, useTV } from '../../lib/tv';
import { LeadForm } from '../../components/LeadForm';

/** "Your idea starts here.": the closing Stage card, a TV like Contact on home: it powers on as it arrives (static, the
 *  picture splits in and locks), then the headline's fringe and the mark lock in. Grain stays at rest. */
export function Send() {
  const { hire } = useCopy(), SEND = hire.send;
  const fid = useId();
  const rootRef = useRef<HTMLElement>(null), canvasRef = useRef<HTMLCanvasElement>(null), layerRef = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null), markRef = useRef<SVGPathElement>(null);
  const tv = useTV(rootRef, canvasRef, layerRef, fid, { grain: true, startOff: true });
  const cancels = useRef<(() => void)[]>([]);
  useEffect(() => () => cancels.current.forEach(c => c()), []);
  useLayoutEffect(() => {
    if (!MOTION) return;
    markRef.current!.setAttribute('d', bigFigure(LOCK_PHI));
    h2Ref.current!.style.setProperty('--ag', '14px');
  }, []);
  useInView(rootRef, () => {
    if (!MOTION) return;
    tv.current.play(TL.power);
    const h2 = h2Ref.current!, final = Math.max(2, parseFloat(getComputedStyle(h2).fontSize) * 0.02);
    cancels.current.push(animate(1100, t => { h2.style.setProperty('--ag', lerp(14, final, easeLock(t)).toFixed(2) + 'px'); if (t >= 1) h2.style.removeProperty('--ag'); }, 250));
    const mark = markRef.current!, root = rootRef.current!;
    cancels.current.push(animate(1900, t => { mark.setAttribute('d', bigFigure(LOCK_PHI * (1 - easeLock(t)))); if (t >= 1) root.classList.add('locked'); }, 350));
  }, 0.3);

  return (
    <section className="send stage" id="contact" ref={rootRef} aria-labelledby="contact-h">
      <SplitFilter id={fid} />
      <div className="send-layer" ref={layerRef}>
        <div className="send-inner">
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
            <span className="caption">{SEND.reply}</span>
          </div>
        </div>
      </div>
      <canvas className="static" ref={canvasRef} aria-hidden="true" />
    </section>
  );
}

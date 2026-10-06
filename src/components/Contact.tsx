import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { PROFILE } from '../content/profile';
import { MOTION, animate, easeLock, lerp } from '../lib/motion';
import { useInView } from '../lib/reveal';
import { BIG_GHOSTS, LOCK_PHI, bigFigure } from '../lib/signal';
import { SplitFilter, TL, useTV } from '../lib/tv';
import { ArrowIcon } from './Icons';

/** The closing Stage card. Powers on as it arrives; "Let's talk." locks its fringe and the mark locks in. */
export function Contact() {
  const fid = useId();
  const rootRef = useRef<HTMLElement>(null), canvasRef = useRef<HTMLCanvasElement>(null), layerRef = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null), markRef = useRef<SVGPathElement>(null), outRef = useRef<HTMLOutputElement>(null);
  const tv = useTV(rootRef, canvasRef, layerRef, fid, { grain: true, startOff: true });
  const [copied, setCopied] = useState(false);
  const cancels = useRef<(() => void)[]>([]);
  useEffect(() => () => cancels.current.forEach(cancel => cancel()), []);

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
  }, 0.35);

  const copy = () => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const select = () => { const r = document.createRange(); r.selectNodeContents(outRef.current!); const s = getSelection()!; s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText(PROFILE.email).then(done, select); } catch { select(); }
  };

  return (
    <section className="contact stage" id="contact" ref={rootRef} aria-labelledby="contact-h">
      <SplitFilter id={fid} />
      <div className="contact-layer" ref={layerRef}>
        <div className="contact-inner">
          <div className="contact-text">
            <h2 className="display-l" id="contact-h" ref={h2Ref} tabIndex={-1}>Let’s talk.</h2>
            <p className="body-l" style={{ maxWidth: '40ch' }}>Hiring for product design or design engineering? Email me about the role.</p>
            <div className="email"><output ref={outRef}>{PROFILE.email}</output></div>
            <div className="ctas">
              <button className="btn primary" type="button" onClick={copy} aria-live="polite">{copied ? 'Email copied' : 'Copy email'}</button>
              <a className="btn ghost" href={`mailto:${PROFILE.email}`}>Send an email</a>
              <a className="btn ghost" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn&nbsp;<ArrowIcon /></a>
            </div>
          </div>
          <svg className="bigmark" viewBox="0 0 300 300" aria-hidden="true">
            <g className="ghosts">{BIG_GHOSTS.map((d, i) => <path key={i} d={d} strokeWidth="1" strokeOpacity="0.18" />)}</g>
            <path ref={markRef} d={bigFigure(0)} strokeWidth="3" />
          </svg>
        </div>
      </div>
      <canvas className="static" ref={canvasRef} aria-hidden="true" />
    </section>
  );
}

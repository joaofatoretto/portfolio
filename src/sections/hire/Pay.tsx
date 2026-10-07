import { useEffect, useRef, type CSSProperties } from 'react';
import { PAY } from '../../content/hire';
import { MOTION } from '../../lib/motion';
import { Tick } from './icons';
import { useMoments } from './useMoments';

const N = PAY.pieces.length;
/** the intro, in ms after the section arrives: the pieces come in one by one, then the lanes draw, then the beat */
const PIECE_GAP = 280, LANES_AT = N * PIECE_GAP + 400, PLAY_AT = LANES_AT + 1000;
/** after the last payment lands, the terms are written out */
const TELL_AFTER = 1500;

/** "You pay as I deliver.": one timeline, two lanes. Time runs left to right; on the top lane I deliver each piece,
 *  and on the lane under it its payment lands a beat later, joined to it by an elbow (down, then on in time).
 *  It arrives in order, one thing at a time: the title alone; the pieces, one by one; the lanes; then the beat per
 *  piece (its circle gets a check, the elbow runs, the payment drops in) while the line travels on by itself,
 *  faster as you scroll (useMoments); and last, the terms are written out under the timeline. On phones time runs
 *  down the page and each piece lands as it reaches the middle of the screen. */
export function Pay() {
  const ref = useRef<HTMLElement>(null), trackRef = useRef<HTMLDivElement>(null), stageRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const later = (ms: number, cls: string) => timers.current.push(window.setTimeout(() => ref.current?.classList.add(cls), ms));
  const { active } = useMoments(N, ref, trackRef, stageRef, {
    dwell: 3400, items: '.piece', gap: 1800, // on phones: a piece's whole beat (~1.2s), then a breath
    onArrive: () => { ref.current!.classList.add('pieces-in'); later(LANES_AT, 'lanes-in'); later(PLAY_AT, 'play'); },
  });
  useEffect(() => { if (MOTION && active === N - 1) later(TELL_AFTER, 'told'); }, [active]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return (
    <section className="section pay" ref={ref} aria-labelledby="pay-h">
      <div className="pay-track" ref={trackRef} style={{ '--n': N } as CSSProperties}>
        <div className="pay-stage" ref={stageRef}>
          <h2 className="pay-title" id="pay-h" tabIndex={-1}>{PAY.title}</h2>
          <div className="ledger">
            <div className="lanes"><span className="caption">{PAY.lanes.deliver}</span><span className="caption">{PAY.lanes.pay}</span></div>
            <ol className="pieces">
              {PAY.pieces.map((pc, i) => (
                <li className={`piece${i <= active ? ' lit' : ''}${i < active ? ' past' : i === active ? ' on' : ''}`} key={pc.title} style={{ '--i': i } as CSSProperties}>
                  <div className="dl"><span className="caption">{pc.label}</span><b className="dl-title">{pc.title}</b></div>
                  <span className="lane-top" aria-hidden="true"><i className="node"><Tick size={12} /></i></span>
                  <span className="lane-bottom">
                    <i className="elbow" aria-hidden="true"><i /><i /></i>
                    <b className="chip">{PAY.receipt}</b>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          {/* written out letter by letter (CSS, one span per letter); screen readers get it once, whole */}
          <p className="lede body-l pay-terms">
            <span className="sr">{PAY.lede}</span>
            <span aria-hidden="true">{[...PAY.lede].map((ch, c) => <span key={c} className="ch" style={{ '--c': c } as CSSProperties}>{ch}</span>)}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

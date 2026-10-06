import { useRef, type CSSProperties } from 'react';
import { PAY } from '../../content/hire';
import { useMoments } from './useMoments';

const N = PAY.pieces.length;

/** "You pay as I deliver.": one timeline, two lanes. Time runs left to right; on the top lane I deliver each piece,
 *  and on the lane under it its payment lands a beat later, joined to it by an elbow (down, then on in time). The
 *  rhythm is the message: deliver, pay, deliver, pay. The payment lane stays empty until the first delivery
 *  (nothing upfront). On wide screens the section holds still while you scroll and the line runs on to the next
 *  piece by itself, faster as you scroll (useMoments); on phones time runs down the page and each piece lands as it
 *  reaches the middle of the screen. */
export function Pay() {
  const ref = useRef<HTMLElement>(null), trackRef = useRef<HTMLDivElement>(null), stageRef = useRef<HTMLDivElement>(null);
  const { active } = useMoments(N, ref, trackRef, stageRef, { dwell: 3400, items: '.piece' });
  return (
    <section className="section pay" ref={ref} aria-labelledby="pay-h">
      <div className="pay-track" ref={trackRef} style={{ '--n': N } as CSSProperties}>
        <div className="pay-stage" ref={stageRef}>
          <div className="pay-head">
            <h2 className="pay-title" id="pay-h" tabIndex={-1}>{PAY.title}</h2>
            <p className="lede body-l">{PAY.lede}</p>
          </div>
          <div className="ledger">
            <div className="lanes"><span className="caption">{PAY.lanes.deliver}</span><span className="caption">{PAY.lanes.pay}</span></div>
            <ol className="pieces">
              {PAY.pieces.map((pc, i) => (
                <li className={`piece${i <= active ? ' lit' : ''}${i < active ? ' past' : i === active ? ' on' : ''}`} key={pc.title}>
                  <div className="dl"><span className="caption">{pc.label}</span><b className="dl-title">{pc.title}</b></div>
                  <span className="lane-top" aria-hidden="true"><i className="node" /></span>
                  <span className="lane-bottom">
                    <i className="elbow" aria-hidden="true"><i /><i /></i>
                    <b className="chip">{PAY.receipt}</b>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

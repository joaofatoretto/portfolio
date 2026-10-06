import { useRef, type CSSProperties } from 'react';
import { PAY } from '../../content/hire';
import { Tick } from './icons';
import { useMoments } from './useMoments';

/* Each piece's little screen. Kept quiet on purpose (small, grey, no words): the payment message is what the
   section is about, so the drawings only say "a real thing was made" and step back. */
const Landing = () => (
  <svg viewBox="0 0 160 100" aria-hidden="true">
    <rect x="14" y="16" width="64" height="8" className="fill-4" /><rect x="14" y="29" width="48" height="5" className="fill-3" />
    <rect x="14" y="44" width="30" height="10" className="fill-5" />
    <rect x="92" y="14" width="54" height="44" className="fill-3" />
    {[14, 62, 110].map(x => <rect key={x} x={x} y="72" width="36" height="14" className="fill-2" />)}
  </svg>
);
const Ordering = () => (
  <svg viewBox="0 0 160 100" aria-hidden="true">
    {[16, 34, 52].map(y => <g key={y}><rect x="14" y={y} width="12" height="12" className="fill-3" /><rect x="32" y={y + 4} width="50" height="4" className="fill-4" /></g>)}
    <rect x="100" y="16" width="46" height="34" className="fill-2" />
    <rect x="100" y="58" width="46" height="10" className="fill-5" />
    <circle cx="123" cy="84" r="7" className="fill-5" /><path d="M119.5 84l2.5 2.5 4.5-5" className="st-bg w2" />
  </svg>
);
const Launched = () => (
  <svg viewBox="0 0 160 100" aria-hidden="true">
    <rect x="0" y="0" width="34" height="100" className="fill-2" />
    {[46, 82, 118].map(x => <rect key={x} x={x} y="14" width="30" height="16" className="fill-3" />)}
    <path d="M46 82 L66 76 L84 78 L102 64 L120 60 L146 44" className="st-mid w2" />
  </svg>
);
const Shots = [Landing, Ordering, Launched];
const N = PAY.pieces.length;

/** "You pay as I deliver.": the pieces ship one at a time, left to right, and each one's payment only comes after
 *  it. Every piece has a payment slot that waits empty ("Nothing to pay yet") until the piece is delivered, then
 *  fills: that slot is the loudest thing in the section. On wide screens the section holds still while you scroll
 *  and the line runs to the next piece by itself, faster as you scroll (useMoments); on phones the pieces are
 *  stacked and each ships as it reaches the middle of the screen. */
export function Pay() {
  const ref = useRef<HTMLElement>(null), trackRef = useRef<HTMLDivElement>(null), stageRef = useRef<HTMLDivElement>(null);
  const { active } = useMoments(N, ref, trackRef, stageRef, { dwell: 3600, items: '.piece' });
  return (
    <section className="section pay" ref={ref} aria-labelledby="pay-h">
      <div className="pay-track" ref={trackRef} style={{ '--n': N } as CSSProperties}>
        <div className="pay-stage" ref={stageRef}>
          <div className="pay-head">
            <h2 className="pay-title" id="pay-h" tabIndex={-1}>{PAY.title}</h2>
            <p className="lede body-l">{PAY.lede}</p>
          </div>
          <ol className="pieces">
            {PAY.pieces.map((pc, i) => {
              const Shot = Shots[i];
              return (
                <li className={`piece${i <= active ? ' lit' : ''}${i < active ? ' past' : i === active ? ' on' : ''}`} key={pc.title}>
                  <span className="node-row" aria-hidden="true"><span className="node" /></span>
                  <span className="caption">{pc.label}</span>
                  <div className="piece-screen" aria-hidden="true"><Shot /></div>
                  <b className="piece-title">{pc.title}</b>
                  <span className="delivered"><Tick /> {PAY.delivered}</span>
                  <span className="receipt"><span className="due" aria-hidden="true">{PAY.due}</span><span className="paid">{PAY.receipt}</span></span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

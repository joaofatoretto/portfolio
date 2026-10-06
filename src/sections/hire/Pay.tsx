import { useRef } from 'react';
import { PAY } from '../../content/hire';
import { useScrollProgress } from '../../lib/scroll';
import { Tick } from './icons';

/* What each shipped piece looks like on its little screen. */
const Shots = [
  () => <div className="shot shot-lp"><i /><i /><b /></div>,
  () => <div className="shot shot-order"><i /><i /><b /></div>,
  () => <div className="shot shot-live"><span>sweetcrumb.com</span><i /></div>,
];

/** "You pay as I deliver.": as you scroll, the line reaches each piece; it ships, then its payment drops in. */
export function Pay() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref, p => {
    const el = ref.current!;
    el.style.setProperty('--p', p.toFixed(4));
    const lit = (i: number) => p >= (i + 0.5) / PAY.pieces.length - 0.12;
    el.querySelectorAll<HTMLElement>('.piece').forEach((li, i) => { li.classList.toggle('lit', lit(i)); li.classList.toggle('flow', lit(i + 1)); });
  }, 0.7);
  return (
    <section className="section pay" aria-labelledby="pay-h">
      <div className="section-head">
        <div><h2 className="h-1" id="pay-h" tabIndex={-1}>{PAY.title}</h2></div>
        <p className="lede body-l">{PAY.lede}</p>
      </div>
      <div className="track" ref={ref}>
        <ol className="pieces">
          {PAY.pieces.map((pc, i) => {
            const Shot = Shots[i];
            return (
              <li className="piece" key={pc.title}>
                <span className="caption">{pc.label}</span>
                <div className="piece-screen" aria-hidden="true"><Shot /></div>
                <span className="node-row" aria-hidden="true"><span className="node" /></span>
                <b className="piece-title">{pc.title}</b>
                <span className="delivered"><Tick /> Delivered</span>
                <span className="receipt">You pay for this piece</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

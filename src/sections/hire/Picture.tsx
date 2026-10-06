import { useRef } from 'react';
import { PICTURE } from '../../content/hire';
import { MOTION } from '../../lib/motion';
import { Seq, SeqItem, useInView } from '../../lib/reveal';
import { TVFrame } from '../../components/TVFrame';
import { Tick } from './icons';

const SLOTS = ['8:00', '9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

/** A customer books on their own: a slot is tapped, then "Booked". */
const Booking = () => (
  <div className="pm pm-book">
    <div className="notch" />
    <b className="pm-h">Book a class · Saturday</b>
    <div className="slots">{SLOTS.map(s => <span key={s} className={s === '10:00' ? 'pick' : s === '12:00' ? 'gone' : ''}>{s}</span>)}</div>
    <div className="pm-photo" />
    <div className="toast"><b><Tick size={12} /> Booked · Sat 10:00</b><span>Reminder sent the day before</span></div>
  </div>
);

/** People find you: the business comes up first, with its pin on the map. */
const Search = () => (
  <div className="pm pm-search">
    <div className="notch" />
    <span className="search-bar">bakery near me</span>
    <div className="map"><i className="pin" /></div>
    <div className="result"><b>Sweet Crumb Bakery</b><span>★★★★★ 4.9 · Open now</span><span>Order online · Directions</span></div>
    <div className="result ghost"><i /><i /></div>
  </div>
);

/** You get paid: payments arrive on the lock screen. */
const Paid = () => (
  <div className="pm pm-paid">
    <div className="notch" />
    <span className="clock">9:41</span>
    <span className="day">Saturday</span>
    <div className="notes">
      <div className="toast"><b>+$120 received</b><span>Order #214 · 2 cakes, pickup Sat</span></div>
      <div className="toast"><b>+$38 received</b><span>Order #213 · 1 cake</span></div>
      <div className="toast"><b>+$64 received</b><span>Order #212</span></div>
    </div>
  </div>
);

const MOMENTS = [Booking, Search, Paid];

/** "Picture it working.": three phones, each looping one moment an owner wants. */
export function Picture() {
  const ref = useRef<HTMLElement>(null);
  useInView(ref, () => { if (MOTION) ref.current!.classList.add('play'); }, 0.25);
  return (
    <section className="section picture" ref={ref} aria-labelledby="picture-h">
      <h2 className="h-1" id="picture-h" tabIndex={-1}>{PICTURE.title}</h2>
      <Seq className="phones" step={320}>
        {MOMENTS.map((M, i) => (
          <SeqItem className="phone-col" key={i}>
            <TVFrame className="phone"><M /></TVFrame>
            <p className="h-3">{PICTURE.moments[i]}</p>
          </SeqItem>
        ))}
      </Seq>
    </section>
  );
}

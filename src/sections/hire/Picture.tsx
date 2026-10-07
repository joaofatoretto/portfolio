import { useEffect, useRef, type CSSProperties } from 'react';
import { PICTURE } from '../../content/hire';
import { MOTION } from '../../lib/motion';
import { useInView } from '../../lib/reveal';
import { TVFrame } from '../../components/TVFrame';
import { Tick } from './icons';
import { useMoments } from './useMoments';

/* The moments, one screen each, made of things any business or new product has (people, tasks, reviews,
   payments) rather than one kind of shop. Each plays once when it comes on (CSS, `.play .pic-screen.on`) and then
   holds its finished state, which is also what shows without motion. */
const k = (n: number) => ({ '--k': n }) as CSSProperties;

/** New customers find you: the week's line goes up and new people arrive, each from somewhere else. */
const Reach = () => (
  <div className="pm pm-reach">
    <div className="notch" />
    <div className="pm-head"><b className="pm-h">New customers</b><span>This week</span></div>
    <svg className="spark" viewBox="0 0 240 90" preserveAspectRatio="none" aria-hidden="true">
      <path className="spark-line" d="M2 80 C 40 78, 60 70, 90 66 S 140 52, 165 38 S 215 12, 238 6" />
    </svg>
    <div className="days" aria-hidden="true">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, n) => <span key={n}>{d}</span>)}</div>
    <ul className="feed">
      {[['AM', 'Ana M. signed up', 'Found you on Google'], ['LR', 'Leo R. signed up', 'Saw you on Instagram'], ['JS', 'Joy S. signed up', 'A friend sent your link'], ['MT', 'Max T. signed up', 'Came back from your email']].map(([who, what, from], n) => (
        <li key={who} style={k(n)}><i>{who}</i><span><b>{what}</b><span>{from}</span></span></li>
      ))}
    </ul>
  </div>
);

/** The busywork does itself: the day's chores tick themselves off. */
const Busywork = () => (
  <div className="pm pm-tasks">
    <div className="notch" />
    <div className="pm-head"><b className="pm-h">Today</b><span>Done for you</span></div>
    <ul className="tasks">
      {['Send this week’s invoices', 'Confirm new orders', 'Remind tomorrow’s clients', 'Update the sales sheet', 'Answer common questions'].map((t, n) => (
        <li key={t} style={k(n)}><i className="box"><Tick size={11} /></i>{t}</li>
      ))}
    </ul>
    <div className="toast"><b><Tick size={12} /> All done</b><span>Nothing left on your list</span></div>
  </div>
);

/** Customers leave happy: a new five-star review arrives on top of the others. */
const Happy = () => (
  <div className="pm pm-happy">
    <div className="notch" />
    <div className="pm-head"><b className="pm-h">Reviews</b><span>What customers say</span></div>
    <div className="review fresh">
      <span className="stars">{[0, 1, 2, 3, 4].map(n => <i key={n} style={k(n)}>★</i>)}</span>
      <p>“So easy. I sorted it out in two minutes.”</p><span>Ana M. · just now</span>
    </div>
    <div className="review"><span className="stars">★★★★★</span><p>“No more waiting on the phone.”</p><span>Leo R. · yesterday</span></div>
    <div className="review ghost"><i /><i /></div>
  </div>
);

/** The money comes in: payments land on the lock screen, one after another. */
const Money = () => (
  <div className="pm pm-paid">
    <div className="notch" />
    <span className="clock">9:41</span>
    <span className="day">Today</span>
    <div className="notes">
      {[['+$49 received', 'Monthly plan · Ana M.'], ['+$120 received', 'Order #1042'], ['+$80 received', 'Booking deposit · Leo R.']].map(([b, s], n) => (
        <div className="toast" key={s} style={k(n)}><b>{b}</b><span>{s}</span></div>
      ))}
    </div>
  </div>
);

const MOMENTS = [Reach, Busywork, Happy, Money];
const N = MOMENTS.length;

/** "Picture it working.": one phone, the moments in turn. While the section holds the screen, each moment's bar
 *  fills on its own and the next one comes on when it's full; scrolling fills it faster (useMoments), so scroll
 *  is the way forward without being the only way. The list says where you are and jumps to any moment. Without
 *  motion nothing holds or moves on: the list switches the screen. */
export function Picture() {
  const ref = useRef<HTMLElement>(null), trackRef = useRef<HTMLDivElement>(null), stageRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const { active, pick } = useMoments(N, ref, trackRef, stageRef, { onArrive: () => {} }); // plays when the phone tunes in, below
  // the first moment starts once the phone has tuned in (TVFrame tunes at the same point; TL.tune is ~1 s)
  useInView(stageRef, () => { if (MOTION) setTimeout(() => ref.current?.classList.add('play'), 600); }, 0.4);

  // on phones the title scrolls away under the nav (CSS uses --head there) and the moments hold
  useEffect(() => {
    const sec = ref.current!, head = headRef.current!, stage = stageRef.current!;
    const fit = () => sec.style.setProperty('--head', `${head.offsetHeight + (parseFloat(getComputedStyle(stage).rowGap) || 0)}px`);
    fit();
    const ro = new ResizeObserver(fit); ro.observe(head);
    return () => ro.disconnect();
  }, []);

  return (
    <section className="section picture" ref={ref} aria-labelledby="picture-h">
      <div className="pic-track" ref={trackRef} style={{ '--n': N } as CSSProperties}>
        <div className="pic-stage" ref={stageRef}>
          <div className="pic-head" ref={headRef}>
            <h2 className="pic-title" id="picture-h" tabIndex={-1}>{PICTURE.title}</h2>
            <p className="pic-lede">{PICTURE.lede}</p>
          </div>
          <ol className="pic-steps">
            {PICTURE.moments.map((m, i) => (
              <li key={m} className={i === active ? 'on' : i < active ? 'past' : ''}>
                <button type="button" aria-pressed={i === active} onClick={() => pick(i)}>
                  <span className="caption">0{i + 1}</span><span className="pic-step">{m}</span>
                </button>
                <i className="pic-bar" aria-hidden="true" />
              </li>
            ))}
          </ol>
          <TVFrame className="phone" channel={active}>
            {MOMENTS.map((M, i) => (
              <div key={i} className={`pic-screen${i === active ? ' on' : ''}`} aria-hidden={i !== active}><M /></div>
            ))}
          </TVFrame>
        </div>
      </div>
    </section>
  );
}

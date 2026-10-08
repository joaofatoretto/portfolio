import { useEffect, useRef, type CSSProperties } from 'react';
import { useCopy } from '../../i18n/copy';
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
const Reach = () => {
  const t = useCopy().hire.picture.screens.reach;
  return (
    <div className="pm pm-reach">
      <div className="notch" />
      <div className="pm-head"><b className="pm-h">{t.head}</b><span>{t.sub}</span></div>
      <svg className="spark" viewBox="0 0 240 90" preserveAspectRatio="none" aria-hidden="true">
        <path className="spark-line" d="M2 80 C 40 78, 60 70, 90 66 S 140 52, 165 38 S 215 12, 238 6" />
      </svg>
      <div className="days" aria-hidden="true">{t.days.map((d, n) => <span key={n}>{d}</span>)}</div>
      <ul className="feed">
        {t.feed.map(([who, what, from], n) => (
          <li key={who} style={k(n)}><i>{who}</i><span><b>{what}</b><span>{from}</span></span></li>
        ))}
      </ul>
    </div>
  );
};

/** The busywork does itself: the day's chores tick themselves off. */
const Busywork = () => {
  const t = useCopy().hire.picture.screens.busywork;
  return (
    <div className="pm pm-tasks">
      <div className="notch" />
      <div className="pm-head"><b className="pm-h">{t.head}</b><span>{t.sub}</span></div>
      <ul className="tasks">
        {t.tasks.map((task, n) => (
          <li key={task} style={k(n)}><i className="box"><Tick size={11} /></i>{task}</li>
        ))}
      </ul>
      <div className="toast"><b><Tick size={12} />{' ' + t.done}</b><span>{t.left}</span></div>
    </div>
  );
};

/** Customers leave happy: a new five-star review arrives on top of the others. */
const Happy = () => {
  const t = useCopy().hire.picture.screens.happy;
  return (
    <div className="pm pm-happy">
      <div className="notch" />
      <div className="pm-head"><b className="pm-h">{t.head}</b><span>{t.sub}</span></div>
      <div className="review fresh">
        <span className="stars">{[0, 1, 2, 3, 4].map(n => <i key={n} style={k(n)}>★</i>)}</span>
        <p>{t.fresh.text}</p><span>{t.fresh.who}</span>
      </div>
      <div className="review"><span className="stars">★★★★★</span><p>{t.old.text}</p><span>{t.old.who}</span></div>
      <div className="review ghost"><i /><i /></div>
    </div>
  );
};

/** The money comes in: payments land on the lock screen, one after another. */
const Money = () => {
  const t = useCopy().hire.picture.screens.paid;
  return (
    <div className="pm pm-paid">
      <div className="notch" />
      <span className="clock">{t.clock}</span>
      <span className="day">{t.day}</span>
      <div className="notes">
        {t.notes.map(([b, s], n) => (
          <div className="toast" key={s} style={k(n)}><b>{b}</b><span>{s}</span></div>
        ))}
      </div>
    </div>
  );
};

const MOMENTS = [Reach, Busywork, Happy, Money];
const N = MOMENTS.length;

/** "Picture it working.": one phone, the moments in turn. While the section holds the screen, each moment's bar
 *  fills on its own and the next one comes on when it's full; scrolling fills it faster (useMoments), so scroll
 *  is the way forward without being the only way. The list says where you are and jumps to any moment. Without
 *  motion nothing holds or moves on: the list switches the screen. */
export function Picture() {
  const PICTURE = useCopy().hire.picture;
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

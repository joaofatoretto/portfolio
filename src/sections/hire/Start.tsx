import { useRef, type CSSProperties } from 'react';
import { START } from '../../content/hire';
import { MOTION } from '../../lib/motion';
import { useInView } from '../../lib/reveal';

const GAP = 0.9; // seconds between chat bubbles
/* Which bubble lights each step: the first message, "can we talk", the plan. */
const STEP_AT = [0, 4, 5];
const WAVE = [4, 8, 16, 6, 12, 4, 18, 8, 14, 4, 10, 20, 6, 12, 2, 14, 8, 16, 4, 10, 6, 2, 8];

/** "Starting takes one message.": a chat plays one bubble at a time, and the three steps light up with it. */
export function Start() {
  const ref = useRef<HTMLElement>(null);
  useInView(ref, () => { if (MOTION) ref.current!.classList.add('play'); }, 0.35);
  return (
    <section className="section start" ref={ref} aria-labelledby="start-h">
      <div className="start-text">
        <h2 className="h-1" id="start-h" tabIndex={-1}>{START.title}</h2>
        <ol className="start-steps">
          {START.steps.map(([t, s], i) => (
            <li key={t} style={{ '--at': `${STEP_AT[i] * GAP}s` } as CSSProperties}>
              <span className="n" aria-hidden="true">{i + 1}</span>
              <span><b>{t}</b><span>{s}</span></span>
            </li>
          ))}
        </ol>
      </div>
      <div className="chat" aria-label="Example chat with a bakery owner" role="img">
        <div className="notch" />
        <div className="chat-head"><span className="avatar" /><span><b>João Fatoretto</b><span>online</span></span></div>
        <div className="chat-body">
          {START.chat.map((m, i) => (
            <div key={i} className={`bubble ${m.from}${m.kind ? ' ' + m.kind : ''}`} style={{ '--i': i } as CSSProperties} aria-hidden="true">
              {m.kind === 'voice'
                ? <><span className="play-btn" /><svg width="132" height="22" viewBox="0 0 132 22">{WAVE.map((h, k) => <line key={k} x1={3 + k * 5.6} x2={3 + k * 5.6} y1={11 - h / 2} y2={11 + h / 2} />)}</svg><span className="dur">{m.text}</span></>
                : m.kind === 'file'
                  ? <><span className="file-ic">PDF</span><span><b>{m.text}</b><span>Piece 1 of 3</span></span></>
                  : m.text}
            </div>
          ))}
          <div className="bubble them typing" style={{ '--i': START.chat.length } as CSSProperties} aria-hidden="true"><i /><i /><i /></div>
        </div>
        <div className="chat-input">Message</div>
      </div>
    </section>
  );
}

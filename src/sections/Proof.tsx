import { CLIENTS, PROOF } from '../content/profile';
import { R } from '../lib/reveal';
import { Scramble } from '../components/Scramble';

export function Proof() {
  return (
    <section className="proof" aria-label="Results">
      <div className="stats-wrap">
        <R kind="line" className="rule" />
        <div className="stats">
          {PROOF.map((s, i) => (
            <R className="stat" key={s.n} d={i * 90}>
              <Scramble text={s.n} />
              <p>{s.what}</p>
              <span className="caption">{s.src}</span>
            </R>
          ))}
        </div>
      </div>
      <R className="clients" d={360}>
        <span className="label">Teams and clients</span>
        {CLIENTS.map(c => <span key={c}>{c}</span>)}
      </R>
    </section>
  );
}

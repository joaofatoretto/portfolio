import { CLIENTS } from '../content/profile';
import { useCopy } from '../i18n/copy';
import { R } from '../lib/reveal';
import { Scramble } from '../components/Scramble';

export function Proof() {
  const { profile } = useCopy(), t = profile.home.proof;
  return (
    <section className="proof" aria-label={t.label}>
      <div className="stats-wrap">
        <R kind="line" className="rule" />
        <div className="stats">
          {profile.proof.map((s, i) => (
            <R className="stat" key={s.n} d={i * 90}>
              <Scramble text={s.n} />
              <p>{s.what}</p>
              <span className="caption">{s.src}</span>
            </R>
          ))}
        </div>
      </div>
      <R className="clients" d={360}>
        <span className="label">{t.clients}</span>
        {CLIENTS.map(c => <span key={c}>{c}</span>)}
      </R>
    </section>
  );
}

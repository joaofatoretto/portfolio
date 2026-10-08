import { PROFILE } from '../content/profile';
import { useCopy } from '../i18n/copy';
import { R } from '../lib/reveal';

export function About() {
  const { profile } = useCopy(), t = profile.home.about;
  return (
    <section className="section" id="about" aria-labelledby="about-h">
      <div className="about">
        <div className="about-text">
          <R><span className="label">{t.label}</span></R>
          <R kind="wipe" d={80}><h2 className="h-1" id="about-h" tabIndex={-1}>{t.title}</h2></R>
          <R kind="wipe" d={200} className="quote"><p className="h-2">{t.quote}</p></R>
          <R as="p" d={280}>{t.p1}</R>
          <R as="p" d={340}>{t.p2}</R>
          <R className="ctas" d={400} style={{ paddingInline: 0, marginTop: 8 }}>
            <a className="btn ghost" href={PROFILE.cv} download>{t.cv}</a>
          </R>
        </div>
        <dl className="facts">
          {profile.facts.map(([k, v], i) => (
            <R className="fact" key={k} d={i * 70}>
              <dt className="label">{k}</dt>
              <dd>{v}</dd>
            </R>
          ))}
        </dl>
      </div>
    </section>
  );
}

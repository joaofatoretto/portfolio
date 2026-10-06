import { FACTS, PROFILE } from '../content/profile';
import { R } from '../lib/reveal';

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-h">
      <div className="about">
        <div className="about-text">
          <R><span className="label">About</span></R>
          <R kind="wipe" d={80}><h2 className="h-1" id="about-h" tabIndex={-1}>Hi, I’m João</h2></R>
          <R kind="wipe" d={200} className="quote"><p className="h-2">I design and build the product, from research to production code.</p></R>
          <R as="p" d={280}>I started as a developer in 2017 and moved into UX/UI in 2018. Since then I’ve designed for startups, an AI company backed by Y Combinator, Fortune 500 clients and a global healthcare company, in B2B and B2C, on the web and in native mobile apps.</R>
          <R as="p" d={340}>I’ve led and mentored designers, built design systems that developers actually used, and worked day to day with data teams. I also taught 30+ students as a UX/UI tutor at Coderhouse.</R>
          <R className="ctas" d={400} style={{ paddingInline: 0, marginTop: 8 }}>
            <a className="btn ghost" href={PROFILE.cv} download>Download CV (PDF)</a>
          </R>
        </div>
        <dl className="facts">
          {FACTS.map(([k, v], i) => (
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

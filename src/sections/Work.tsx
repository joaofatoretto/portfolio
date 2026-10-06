import { useRef } from 'react';
import { CASES } from '../content/cases';
import { caseTags, type CaseStudy } from '../content/cases/types';
import { FINE_POINTER } from '../lib/motion';
import { R } from '../lib/reveal';
import { TL, type TVApi } from '../lib/tv';
import { ArrowIcon } from '../components/Icons';
import { Screen } from '../components/Screen';
import { SectionHead } from '../components/SectionHead';

export function CaseCard({ c, n }: { c: CaseStudy; n: number }) {
  const screen = useRef<TVApi | null>(null);
  const flick = () => { const s = screen.current; if (FINE_POINTER && s && s.tuned && !s.busy()) s.play(TL.flick); };
  return (
    <a className="case" href={`/work/${c.slug}`} onMouseEnter={flick} onFocus={flick}>
      <Screen className="thumb" image={c.card} channel={`CH 02·${n}`} client={c.client} n={n} apiOut={screen} />
      <div className="case-meta">
        <div className="case-text">
          <div className="tags">{caseTags(c).map(t => <span className="tag" key={t}>{t}</span>)}</div>
          <h3><span>{c.title}</span></h3>
          <p className="summary">{c.summary}</p>
          <p className="result">{c.role} · <b>{c.result}</b></p>
        </div>
        <span className="arrow" aria-hidden="true"><ArrowIcon /></span>
      </div>
    </a>
  );
}

export function Work() {
  return (
    <section className="section" id="work" aria-labelledby="work-h">
      <SectionHead label="Case studies" id="work-h" title="The problem, my part and what changed"
        lede="Each case opens with a short summary: the problem, my role, the team and the result. The full process comes after." />
      {/* An odd count features the first case full width, so no card sits alone. */}
      <div className={`cases${CASES.length % 2 ? ' odd' : ''}`}>
        {CASES.map((c, i) => <R key={c.slug} d={(i % 2) * 120}><CaseCard c={c} n={i + 1} /></R>)}
      </div>
    </section>
  );
}

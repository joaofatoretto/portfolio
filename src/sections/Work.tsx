import { useRef } from 'react';
import { caseChips, type CaseStudy } from '../content/cases/types';
import { useCopy, useLocalize } from '../i18n/copy';
import { FINE_POINTER } from '../lib/motion';
import { R } from '../lib/reveal';
import { TL, type TVApi } from '../lib/tv';
import { ArrowIcon } from '../components/Icons';
import { Screen } from '../components/Screen';
import { SectionHead } from '../components/SectionHead';

export function CaseCard({ c, n }: { c: CaseStudy; n: number }) {
  const { ui } = useCopy(), localize = useLocalize();
  const screen = useRef<TVApi | null>(null);
  const flick = () => { const s = screen.current; if (FINE_POINTER && s && s.tuned && !s.busy()) s.play(TL.flick); };
  return (
    <a className="case" href={localize(`/work/${c.slug}`)} onMouseEnter={flick} onFocus={flick}>
      <Screen className="thumb" image={c.card} channel={`CH 02·${n}`} client={c.client} n={n} apiOut={screen} />
      <div className="case-meta">
        <div className="case-text">
          <div className="tags">{caseChips(c, ui).map(t => <span className="tag" key={t}>{t}</span>)}</div>
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
  const { profile, cases } = useCopy(), t = profile.home.work;
  return (
    <section className="section" id="work" aria-labelledby="work-h">
      <SectionHead label={t.label} id="work-h" title={t.title} lede={t.lede} />
      {/* An odd count features the first case full width, so no card sits alone. */}
      <div className={`cases${cases.length % 2 ? ' odd' : ''}`}>
        {cases.map((c, i) => <R key={c.slug} d={(i % 2) * 120}><CaseCard c={c} n={i + 1} /></R>)}
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { caseBySlug, caseNumber } from '../../content/cases';
import type { Copy } from '../../content';
import { fmt, useCopy, useLocalize } from '../../i18n/copy';
import { FINE_POINTER } from '../../lib/motion';
import { R, Seq, SeqItem } from '../../lib/reveal';
import { TL, type TVApi } from '../../lib/tv';
import { ArrowIcon } from '../../components/Icons';
import { Scramble } from '../../components/Scramble';
import { Screen } from '../../components/Screen';

type Card = Copy['hire']['proof']['cards'][number];

function ProofCard({ c, n }: { c: Card; n: number }) {
  const { cases, hire } = useCopy(), localize = useLocalize();
  const screen = useRef<TVApi | null>(null);
  const cs = 'slug' in c ? caseBySlug(c.slug, cases) : undefined;
  const flick = () => { const s = screen.current; if (FINE_POINTER && s && s.tuned && !s.busy()) s.play(TL.flick); };
  const body = (
    <>
      <Screen className="proof-shot" image={cs?.card} channel={cs ? `CH 02·${caseNumber(cs, cases)}` : 'CH 02'} client={c.client} n={cs ? caseNumber(cs, cases) : n} apiOut={screen} />
      <Scramble text={c.n} />
      <p className="proof-what">{c.what}</p>
      <span className="proof-who"><span className="label">{c.client} · {c.kind}</span>{cs && <span className="arrow" aria-hidden="true"><ArrowIcon /></span>}</span>
    </>
  );
  return cs
    ? <SeqItem as="a" className="proof-card" href={localize(`/work/${cs.slug}`)} onMouseEnter={flick} onFocus={flick} aria-label={fmt(hire.proof.cardLabel, { n: c.n, what: c.what, client: c.client })}>{body}</SeqItem>
    : <SeqItem className="proof-card">{body}</SeqItem>;
}

/** "I've done this before.": three results, one glance each, plus a client quote when there is one. */
export function ProofCards() {
  const PROOF = useCopy().hire.proof, q = PROOF.quote;
  return (
    <section className="section" aria-labelledby="proof-h">
      <h2 className="h-1" id="proof-h" tabIndex={-1}>{PROOF.title}</h2>
      <Seq className="proof-cards" step={320}>
        {PROOF.cards.map((c, i) => <ProofCard key={c.client} c={c} n={i + 1} />)}
      </Seq>
      {q && <R as="figure" className="quote-card"><blockquote>“{q.text}”</blockquote><figcaption className="label">{q.who}</figcaption></R>}
    </section>
  );
}

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useParams } from 'react-router-dom';
import { caseBySlug, caseNumber } from '../content/cases';
import { caseChips, type Block, type CaseStudy as Case } from '../content/cases/types';
import { caseTitle } from '../content/seo';
import { fmt, useCopy, useLocalize } from '../i18n/copy';
import { FINE_POINTER, REDUCE } from '../lib/motion';
import { R } from '../lib/reveal';
import { TL, type TVApi } from '../lib/tv';
import { Contact } from '../components/Contact';
import { ArrowIcon } from '../components/Icons';
import { PrototypeEmbed } from '../components/PrototypeEmbed';
import { Rich } from '../components/Rich';
import { Screen } from '../components/Screen';
import { NotFound } from './NotFound';

export const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\*\*|_|\[|\]\([^)]*\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pad = (n: number) => String(n).padStart(2, '0');
/** A paragraph that is one quoted sentence becomes a pull quote. */
const isQuote = (t: string) => /^["“].+["”]$/.test(t.trim());

function BlockView({ b }: { b: Block }) {
  const { ui } = useCopy();
  switch (b.type) {
    case 'h2': return <R kind="wipe"><h2 className="h-2" id={slugify(b.text)} tabIndex={-1}><Rich text={b.text} /></h2></R>;
    case 'h3': return <R as="h3" className="h-3"><Rich text={b.text} /></R>;
    case 'p': return isQuote(b.text)
      ? <R as="blockquote" kind="wipe" className="pull"><p><Rich text={b.text.trim().replace(/^["“]|["”]$/g, '')} /></p></R>
      : <R as="p"><Rich text={b.text} /></R>;
    case 'ul': case 'ol': {
      const L = b.type;
      return <R as={L} className="list">{b.items.map((t, i) => <li key={i}><Rich text={t} /></li>)}</R>;
    }
    case 'img': return (
      <R as="figure" className="figure">
        <a className="figure-frame stage" href={b.src} target="_blank" rel="noopener noreferrer" aria-label={fmt(ui.case.open, { alt: b.alt })}>
          <img src={b.src} alt={b.alt} width={b.w ?? undefined} height={b.h ?? undefined} loading="lazy" decoding="async" />
        </a>
        {b.caption && <figcaption className="caption">{b.caption}</figcaption>}
      </R>
    );
    case 'embed': return <R><PrototypeEmbed src={b.src} label={b.label} tall={b.tall} /></R>;
  }
}

function Toc({ items }: { items: { id: string; text: string }[] }) {
  const { ui } = useCopy();
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-20% 0px -70% 0px' });
    items.forEach(t => { const el = document.getElementById(t.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [items]);
  const jump = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'start' });
    el.focus({ preventScroll: true });
    history.replaceState(history.state, '', `#${id}`);
  };
  return (
    <nav className="toc" aria-label={ui.case.toc}>
      <span className="label">{ui.case.tocLabel}</span>
      <ol>
        {items.map((t, i) => (
          <li key={t.id}>
            <a href={`#${t.id}`} onClick={e => jump(e, t.id)} aria-current={active === t.id ? 'true' : undefined}>
              <span className="caption">{pad(i + 1)}</span><Rich text={t.text} />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function NextCase({ c, n }: { c: Case; n: number }) {
  const { ui } = useCopy(), localize = useLocalize();
  const screen = useRef<TVApi | null>(null);
  const flick = () => { const s = screen.current; if (FINE_POINTER && s && s.tuned && !s.busy()) s.play(TL.flick); };
  return (
    <R as="section" className="next-case-wrap" aria-label={ui.case.next}>
      <a className="next-case" href={localize(`/work/${c.slug}`)} onMouseEnter={flick} onFocus={flick}>
        <div className="next-text">
          <span className="label">{fmt(ui.case.nextLabel, { n })}</span>
          <span className="h-1 next-title">{c.title}</span>
          <span className="muted">{c.client} · <b>{c.result}</b></span>
          <span className="arrow" aria-hidden="true"><ArrowIcon /></span>
        </div>
        <Screen className="next-thumb" image={c.card} channel={`CH 02·${n}`} client={c.client} n={n} apiOut={screen} />
      </a>
    </R>
  );
}

function CaseStudyPage({ c }: { c: Case }) {
  const { ui, cases } = useCopy(), localize = useLocalize();
  const n = caseNumber(c, cases);
  const next = cases[n % cases.length];
  const toc = c.body.flatMap(b => (b.type === 'h2' ? [{ id: slugify(b.text), text: b.text }] : []));
  useEffect(() => { document.title = caseTitle(c); }, [c]);
  const facts: [string, string][] = [[ui.case.company, c.meta.company], [ui.case.year, c.meta.year], [ui.case.role, c.meta.role], [ui.case.team, c.meta.team]];

  return (
    <main className="case-page">
      <div className="page">
        <header className="case-hero stage" id="top">
          <div className="case-hero-inner">
            <div className="case-hero-top">
              <a className="back" href={localize('/#work')}><ArrowIcon dir="left" /> {ui.case.all}</a>
              <span className="osd case-ch" aria-hidden="true">CH 02·{n}</span>
            </div>
            <span className="label">{fmt(ui.case.study, { n: pad(n), client: c.client })}</span>
            <h1 className="display-m" data-focus tabIndex={-1}>{c.title}</h1>
            <p className="body-l case-sub">{c.subtitle}</p>
            <dl className="case-facts">
              {facts.map(([k, v]) => <div key={k}><dt className="label">{k}</dt><dd>{v}</dd></div>)}
            </dl>
          </div>
          <Screen className="case-cover" image={c.cover} channel={`CH 02·${n}`} client={c.client} n={n} eager threshold={0.05} />
        </header>

        <section className="case-brief" aria-label={ui.case.summary}>
          <R className="brief-item"><span className="label">{ui.case.problem}</span><p className="brief-text">{c.problem}</p></R>
          <R className="brief-item" d={120}><span className="label">{ui.case.result}</span><p className="brief-text">{c.outcome}</p></R>
          <R className="brief-tags" d={200}>{caseChips(c, ui).map(t => <span className="tag" key={t}>{t}</span>)}</R>
        </section>

        <div className={`case-body${toc.length > 1 ? '' : ' no-toc'}`}>
          {toc.length > 1 && <Toc items={toc} />}
          <article className="prose">{c.body.map((b, i) => <BlockView key={i} b={b} />)}</article>
        </div>

        <NextCase c={next} n={caseNumber(next, cases)} />
        <Contact />
      </div>
    </main>
  );
}

export function CaseStudy() {
  const { slug } = useParams();
  const { cases } = useCopy();
  const c = caseBySlug(slug, cases);
  if (!c) return <NotFound />;
  return <CaseStudyPage key={c.slug} c={c} />;
}

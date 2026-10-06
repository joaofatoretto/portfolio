import { LOOP, PRODUCTS, STACK } from '../content/profile';
import { R } from '../lib/reveal';

export function Build() {
  return (
    <section className="section" id="build" aria-labelledby="build-h">
      <div className="build">
        <div className="build-left">
          <R><span className="label">How I build</span></R>
          <R kind="wipe" d={80}><h2 className="h-1" id="build-h" tabIndex={-1}>I build what I design</h2></R>
          <R as="p" className="muted" d={200}>I have a Computer Science degree and wrote code before I designed. Today I design and code my own AI products alone: front end, back end, agents, database, auth and billing. Claude Code is my main tool. The judgement stays with me.</R>
          <R className="stack" d={280}>{STACK.map(s => <span className="tag" key={s}>{s}</span>)}</R>
          <div className="loop" aria-label="How I keep AI-written code in check">
            {LOOP.map(([n, t], i) => <R className="loop-row" key={n} d={320 + i * 110}><span className="caption">{n}</span><span>{t}</span></R>)}
          </div>
        </div>
        <div className="products">
          <R kind="line" className="rule strong" />
          {PRODUCTS.map((p, i) => (
            <R as="article" className="product" key={p.name} d={120 + i * 120}>
              <h3>{p.name}</h3>
              <span className="tag">{p.status}</span>
              <p>{p.text}</p>
              <span className="caption">{p.stack}</span>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

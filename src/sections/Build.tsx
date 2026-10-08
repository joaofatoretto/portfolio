import { STACK } from '../content/profile';
import { useCopy } from '../i18n/copy';
import { R } from '../lib/reveal';

export function Build() {
  const { profile } = useCopy(), t = profile.home.build;
  return (
    <section className="section" id="build" aria-labelledby="build-h">
      <div className="build">
        <div className="build-left">
          <R><span className="label">{t.label}</span></R>
          <R kind="wipe" d={80}><h2 className="h-1" id="build-h" tabIndex={-1}>{t.title}</h2></R>
          <R as="p" className="muted" d={200}>{t.text}</R>
          <R className="stack" d={280}>{STACK.map(s => <span className="tag" key={s}>{s}</span>)}</R>
          <div className="loop" aria-label={t.loop}>
            {profile.loop.map(([n, t], i) => <R className="loop-row" key={n} d={320 + i * 110}><span className="caption">{n}</span><span>{t}</span></R>)}
          </div>
        </div>
        <div className="products">
          <R kind="line" className="rule strong" />
          {profile.products.map((p, i) => (
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

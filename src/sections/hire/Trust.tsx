import { useRef, type CSSProperties } from 'react';
import type { ClientLogo } from '../../content/hire';
import { useCopy } from '../../i18n/copy';
import { R, Seq, SeqItem } from '../../lib/reveal';
import { Scramble } from '../../components/Scramble';
import { useEdgeSpeed } from './marquee';

const Logos = ({ copy }: { copy?: boolean }) => {
  const TRUST = useCopy().hire.trust;
  return (
    <ul aria-hidden={copy || undefined}>
      {TRUST.clients.map((c: ClientLogo) => (
        <li key={c.name} style={c.h ? { '--h': c.h } as CSSProperties : undefined}>
          <img src={c.logo} alt={copy ? '' : c.name} decoding="async" />
          {c.color && <img className="logo-color" src={c.color} alt="" decoding="async" />}
        </li>
      ))}
    </ul>
  );
};

/** "Is he legit?" answered in three seconds: the companies drift past (in colour under the mouse, faster toward the edges), then four numbers, read one at a time. */
export function Trust() {
  const TRUST = useCopy().hire.trust;
  const trackRef = useRef<HTMLDivElement>(null);
  useEdgeSpeed(trackRef);
  return (
    <section className="trust" aria-labelledby="trust-h">
      <div className="page"><span className="label" id="trust-h">{TRUST.label}</span></div>
      {/* full width (outside .page); the second copy closes the loop, and without motion it's hidden and the logos wrap in rows */}
      <R className="marquee"><div className="marquee-track" ref={trackRef} style={{ '--n': TRUST.clients.length } as CSSProperties}><Logos /><Logos copy /></div></R>
      <div className="page"><Seq className="trust-stats" step={300}>
        {TRUST.stats.map(s => (
          <SeqItem className="stat" key={s.n}>
            <Scramble text={s.n} />
            <p>{s.what}</p>
            {s.src && <span className="caption">{s.src}</span>}
          </SeqItem>
        ))}
      </Seq></div>
    </section>
  );
}

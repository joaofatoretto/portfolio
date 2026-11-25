import { Scramble } from '../components/Scramble';
import type { EduItem } from '../content/profile';
import { useCopy } from '../i18n/copy';
import { R, Seq, SeqItem } from '../lib/reveal';

/** Education under About: a table, oldest first. Three columns, so each can be scanned on its own: when · what and
 *  where · the proof (UNICAMP's two #1s, who taught the MBA), each proof under a label that says what it is. The only
 *  large type is the #1s. Rows arrive one at a time (Seq), each row's columns in order. */
export function Education() {
  const { profile } = useCopy(), e = profile.education;
  return (
    <section className="edu" aria-labelledby="edu-label">
      <R><span className="label" id="edu-label">{e.label}</span></R>
      <Seq as="ol" className="edu-list">
        {e.items.map((item, i) => <Row item={item} id={`edu-proof-${i}`} key={item.years} />)}
      </Seq>
    </section>
  );
}

function Row({ item, id }: { item: EduItem; id: string }) {
  const proof = item.ranks ?? item.faculty;
  return (
    <SeqItem as="li" className="edu-item">
      <p className="edu-when">
        <span>{item.years}</span>
        {item.status && <span className="edu-status">{item.status}</span>}
      </p>
      <div className="edu-what">
        <h3 className="h-3">{item.title}</h3>
        <p className="edu-where"><b>{item.school}</b> · {item.note}</p>
      </div>
      {proof && (
        <div className="edu-proof">
          <span className="label" id={id}>{proof.label}</span>
          {item.ranks && (
            <ul className="edu-ranks" aria-labelledby={id}>
              {item.ranks.list.map(r => (
                <li key={r.href}>
                  <Scramble text={r.n} />
                  <p>{r.what}</p>
                  <a className="edu-src" href={r.href} target="_blank" rel="noopener noreferrer" aria-label={r.cite} title={r.cite}>
                    {r.source} · <span className="edu-yrs">{r.when}<span aria-hidden="true">{"\u00a0"}↗</span></span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          {item.faculty && (
            <ul className="edu-faculty" aria-labelledby={id}>
              {item.faculty.list.map(f => (
                <li key={f.name}><b>{f.name}</b> <span>{f.role}</span></li>
              ))}
            </ul>
          )}
        </div>
      )}
    </SeqItem>
  );
}

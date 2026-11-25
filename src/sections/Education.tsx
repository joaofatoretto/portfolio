import { Scramble } from '../components/Scramble';
import type { EduItem } from '../content/profile';
import { useCopy } from '../i18n/copy';
import { R, Seq, SeqItem } from '../lib/reveal';

/** Education under About: one timeline, oldest first. Every row reads the same way (years → what → where → proof),
 *  so the eye has one path; the only large type is UNICAMP's two #1s. A filled marker is done, a hollow one is in
 *  progress. Rows arrive one at a time (Seq), each row's parts in order. */
export function Education() {
  const { profile } = useCopy(), e = profile.education;
  return (
    <section className="edu" aria-labelledby="edu-label">
      <R><span className="label" id="edu-label">{e.label}</span></R>
      <Seq as="ol" className="edu-list">
        {e.items.map(item => <Row item={item} key={item.years} />)}
      </Seq>
    </section>
  );
}

function Row({ item }: { item: EduItem }) {
  return (
    <SeqItem as="li" className={item.status ? 'edu-item open' : 'edu-item'}>
      <p className="edu-when">
        <span>{item.years}</span>
        {item.status && <span className="edu-status">{item.status}</span>}
      </p>
      <div className="edu-what">
        <h3 className="h-3">{item.title}</h3>
        <p className="edu-where"><b>{item.school}</b> · {item.note}</p>
        {item.ranks && (
          <ul className="edu-ranks" aria-label={item.ranks.label}>
            {item.ranks.list.map(r => (
              <li key={r.href}>
                <Scramble text={r.n} />
                <p>{r.what}</p>
                <a className="edu-src" href={r.href} target="_blank" rel="noopener noreferrer" aria-label={r.cite} title={r.cite}>
                  {r.source} · {r.when}<span aria-hidden="true">{"\u00a0"}↗</span>
                </a>
              </li>
            ))}
          </ul>
        )}
        {item.faculty && (
          <div className="edu-faculty">
            <span className="label">{item.faculty.label}</span>
            <ul aria-label={item.faculty.label}>
              {item.faculty.list.map(f => (
                <li key={f.name}><b>{f.name}</b> <span>{f.role}</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SeqItem>
  );
}

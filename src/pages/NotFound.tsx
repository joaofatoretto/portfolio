import { useEffect } from 'react';
import { NOT_FOUND } from '../seo/meta';

export function NotFound() {
  useEffect(() => { document.title = NOT_FOUND.title; }, []);
  return (
    <main className="page">
      <section className="notfound stage" aria-labelledby="nf-h">
        <span className="osd notfound-osd" aria-hidden="true">NO SIGNAL</span>
        <h1 className="h-1" id="nf-h" data-focus tabIndex={-1}>This channel doesn’t exist.</h1>
        <p className="body-l">The page may have moved. The case studies are on the home page.</p>
        <div className="ctas"><a className="btn primary" href="/#work">View case studies&nbsp;&nbsp;→</a></div>
      </section>
    </main>
  );
}

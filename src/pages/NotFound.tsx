import { useEffect } from 'react';
import { useCopy, useLocalize } from '../i18n/copy';

export function NotFound() {
  const { ui, seo } = useCopy(), localize = useLocalize();
  useEffect(() => { document.title = seo.notFound.title; }, [seo]);
  return (
    <main className="page">
      <section className="notfound stage" aria-labelledby="nf-h">
        <span className="osd notfound-osd" aria-hidden="true">{ui.tv.noSignal}</span>
        <h1 className="h-1" id="nf-h" data-focus tabIndex={-1}>{ui.notFound.title}</h1>
        <p className="body-l">{ui.notFound.text}</p>
        <div className="ctas"><a className="btn primary" href={localize('/#work')}>{ui.notFound.cta}</a></div>
      </section>
    </main>
  );
}

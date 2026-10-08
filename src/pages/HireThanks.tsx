import { useEffect, useState } from 'react';
import { fmt, useCopy, useLocalize } from '../i18n/copy';
import { SENT_KEY, type Sent } from '../components/LeadForm';

/** /hire/thanks: where the hire form lands once it has sent. Google Ads counts a page load here as a conversion.
 *  The form leaves the name in sessionStorage; the first render leaves it out (the prerendered HTML can't
 *  know it), then an effect fills it in. Opened directly, it thanks without a name. */
export function HireThanks() {
  const { ui, seo } = useCopy(), t = ui.thanks, localize = useLocalize();
  const [sent, setSent] = useState<Sent | null>(null);
  useEffect(() => {
    document.title = seo.thanks.title;
    try { const s = JSON.parse(sessionStorage.getItem(SENT_KEY) ?? 'null') as Sent | null; if (s?.name) setSent(s); } catch { /* thank without a name */ }
  }, [seo]);

  const first = sent?.name.split(/\s+/)[0];
  return (
    <main className="page">
      <section className="thanks stage" id="contact" aria-labelledby="thanks-h">
        <span className="osd notfound-osd" aria-hidden="true">{ui.tv.sent}</span>
        <h1 className="h-1" id="thanks-h" data-focus tabIndex={-1}>{first ? fmt(t.titleNamed, { name: first }) : t.title}</h1>
        <p className="body-l">{t.text}</p>
        <div className="ctas">
          <a className="btn primary" href={localize('/#work')}>{t.work}</a>
        </div>
      </section>
    </main>
  );
}

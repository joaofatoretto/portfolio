import { useEffect, useState } from 'react';
import { SEND } from '../content/hire';
import { waLink } from '../content/profile';
import { SENT_KEY, type Sent } from '../components/LeadForm';
import { WaIcon } from '../sections/hire/icons';
import { THANKS_PAGE } from '../seo/meta';

/** /hire/thanks: where the hire form lands once it has sent. Google Ads counts a page load here as a conversion.
 *  The form leaves the name and idea in sessionStorage; the first render leaves them out (the prerendered HTML can't
 *  know them), then an effect fills them in. Opened directly, it thanks without a name. */
export function HireThanks() {
  const [sent, setSent] = useState<Sent | null>(null);
  useEffect(() => {
    document.title = THANKS_PAGE.title;
    try { const s = JSON.parse(sessionStorage.getItem(SENT_KEY) ?? 'null') as Sent | null; if (s?.name) setSent(s); } catch { /* thank without a name */ }
  }, []);

  const first = sent?.name.split(/\s+/)[0];
  const wa = sent ? `Hi João, I’m ${sent.name}. I just sent you my idea: ${sent.message}` : SEND.wa;
  return (
    <main className="page">
      <section className="thanks stage" id="contact" aria-labelledby="thanks-h">
        <span className="osd notfound-osd" aria-hidden="true">SENT</span>
        <h1 className="h-1" id="thanks-h" data-focus tabIndex={-1}>Got it{first && `, ${first}`}. Your idea is in my inbox.</h1>
        <p className="body-l">I’ll reply within 1 business day. Want to talk sooner?</p>
        <div className="ctas">
          <a className="btn primary" href={waLink(wa)} target="_blank" rel="noopener noreferrer"><WaIcon />Continue on WhatsApp</a>
          <a className="btn ghost" href="/#work">See my work</a>
        </div>
      </section>
    </main>
  );
}

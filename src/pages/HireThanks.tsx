import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SEND } from '../content/hire';
import { waLink } from '../content/profile';
import type { Sent } from '../components/LeadForm';
import { WaIcon } from '../sections/hire/icons';
import { THANKS_PAGE } from '../seo/meta';

/** /hire/thanks: where the hire form lands once it has sent. Google Ads counts a visit here as a conversion.
 *  The form passes the name and idea as router state; the first render leaves them out (the prerendered HTML has no
 *  state), then an effect fills them in. Opened directly, it thanks without a name. */
export function HireThanks() {
  const { state } = useLocation();
  const [sent, setSent] = useState<Sent | null>(null);
  useEffect(() => { document.title = THANKS_PAGE.title; }, []);
  useEffect(() => { if ((state as Sent | null)?.name) setSent(state as Sent); }, [state]);

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

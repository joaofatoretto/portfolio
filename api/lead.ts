/* Vercel Function: POST /api/lead. Validates a lead from the hire page and emails it to João through Resend.
   Env: RESEND_API_KEY and RESEND_EMAIL_DOMAIN (from the Resend integration), optional LEAD_TO and LEAD_FROM.
   Imports use .js extensions because Node loads them as ES modules at runtime. */
import { contactKind, leadEmail, validateLead } from '../src/lib/lead.js';
import { PROFILE } from '../src/content/profile.js';

const json = (status: number, body: object) => Response.json(body, { status });
/** LEAD_FROM, else an address on the domain the Resend integration set up (it must be verified in Resend),
 *  else Resend's test sender, which only delivers to the Resend account's own email. */
const sender = () => process.env.LEAD_FROM
  || (process.env.RESEND_EMAIL_DOMAIN ? `João’s site <leads@${process.env.RESEND_EMAIL_DOMAIN}>` : 'Portfolio leads <onboarding@resend.dev>');
/** For a plain form post (JavaScript off or not loaded yet): a minimal page instead of JSON. */
const page = (status: number, title: string, text: string) => new Response(
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>`
  + `<body style="font:18px/1.6 system-ui,sans-serif;background:#0A0A0B;color:#fff;max-width:36rem;margin:15vh auto;padding:0 24px">`
  + `<h1>${title}</h1><p>${text}</p><p><a style="color:#fff" href="/hire">Back to the site</a></p></body>`,
  { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

export async function POST(request: Request): Promise<Response> {
  const isForm = /application\/x-www-form-urlencoded|multipart\/form-data/.test(request.headers.get('content-type') ?? '');
  let body: unknown;
  try { body = isForm ? Object.fromEntries(await request.formData()) : await request.json(); } catch { return json(400, { error: 'invalid_json' }); }
  const reply = (status: number, data: object, title: string, text: string) => (isForm ? page(status, title, text) : json(status, data));

  const r = validateLead(body);
  if (!r.ok && r.spam) return reply(200, { ok: true }, 'Thanks', 'Your message is in my inbox.');
  if (!r.ok) return reply(400, { errors: r.errors }, 'Something’s missing', `${Object.values(r.errors).join(' ')} Go back and try again.`);

  const key = process.env.RESEND_API_KEY;
  const failed = (status: number, error: string) => reply(status, { error }, 'That didn’t send', `Please email me at ${PROFILE.email}.`);
  if (!key) { console.error('lead: RESEND_API_KEY is not set'); return failed(500, 'not_configured'); }

  const mail = leadEmail(r.lead);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: sender(),
      to: [process.env.LEAD_TO || PROFILE.email],
      ...(contactKind(r.lead.contact) === 'email' ? { reply_to: r.lead.contact } : {}),
      ...mail,
    }),
  });
  if (!res.ok) { console.error('lead: Resend refused the email', res.status, await res.text()); return failed(502, 'send_failed'); }
  // a plain form post lands on the same thank-you page as the browser's (the Google Ads conversion URL)
  return isForm ? Response.redirect(new URL('/hire/thanks', request.url), 303) : json(200, { ok: true });
}

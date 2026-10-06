/* A lead from the hire page form: a name, a way to reply (WhatsApp/phone or email) and the idea in a few words.
   The same checks run in the browser (instant feedback) and in api/lead.ts (the source of truth).
   No imports: api/lead.ts loads this file directly in Node. */

export const LIMITS = { name: 120, contact: 200, message: 2000, minMessage: 5 };

export type Lead = { name: string; contact: string; message: string };
export type LeadField = keyof Lead;
export type LeadErrors = Partial<Record<LeadField, string>>;
export type LeadResult = { ok: true; lead: Lead } | { ok: false; errors: LeadErrors; spam?: boolean };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s().-]{7,}$/;
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Whether the visitor left an email or a phone number (for WhatsApp), or neither. */
export function contactKind(c: string): 'email' | 'phone' | null {
  if (EMAIL.test(c)) return 'email';
  if (PHONE.test(c) && c.replace(/\D/g, '').length >= 7) return 'phone';
  return null;
}

export function validateLead(input: unknown): LeadResult {
  if (!input || typeof input !== 'object') return { ok: false, errors: {} };
  const o = input as Record<string, unknown>;
  // "website" is a hidden field people never see; only bots fill it in
  if (str(o.website)) return { ok: false, errors: {}, spam: true };

  const name = str(o.name), contact = str(o.contact), message = str(o.message);
  const errors: LeadErrors = {};
  if (!name) errors.name = 'Tell me your name.';
  else if (name.length > LIMITS.name) errors.name = `Keep your name under ${LIMITS.name} characters.`;
  if (!contactKind(contact) || contact.length > LIMITS.contact) errors.contact = 'Add a WhatsApp number or an email, so I can reply.';
  if (message.length < LIMITS.minMessage) errors.message = 'Tell me the idea in a few words.';
  else if (message.length > LIMITS.message) errors.message = `Keep it under ${LIMITS.message} characters. We can go deeper when we talk.`;

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, lead: { name, contact, message } };
}

const html = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const short = (s: string, n: number) => { const one = s.replace(/\s+/g, ' ').trim(); return one.length > n ? one.slice(0, n - 1).trimEnd() + '…' : one; };

/** The email João receives for each lead. */
export function leadEmail(l: Lead) {
  const kind = contactKind(l.contact);
  const reach = kind === 'phone'
    ? `<a href="https://wa.me/${l.contact.replace(/\D/g, '')}">${html(l.contact)} (WhatsApp)</a>`
    : `<a href="mailto:${html(l.contact)}">${html(l.contact)}</a>`;
  return {
    subject: `New idea from ${short(l.name, 40)}: ${short(l.message, 60)}`,
    text: `Name: ${l.name}\nReply to: ${l.contact}\n\n${l.message}\n`,
    html: `<p><b>${html(l.name)}</b> · ${reach}</p><p style="white-space:pre-wrap">${html(l.message)}</p>`,
  };
}

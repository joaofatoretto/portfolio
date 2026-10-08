/* A lead from the hire page form: a name, a way to reply (email or phone) and, optionally, the idea in a few words.
   The same checks run in the browser (instant feedback) and in api/lead.ts (the source of truth).
   No imports: api/lead.ts loads this file directly in Node. */

/** The languages of the form (the same two as src/i18n/locales.ts, repeated here because this file has no imports). */
export type LeadLocale = 'en' | 'pt';

/** What the visitor reads when a field is wrong, per language. */
export const MESSAGES = {
  en: {
    name: 'Tell me your name.',
    nameLong: (max: number) => `Keep your name under ${max} characters.`,
    contact: 'Add an email or a phone number, so I can reply.',
    messageLong: (max: number) => `Keep it under ${max} characters. We can go deeper when we talk.`,
  },
  pt: {
    name: 'Me conta seu nome.',
    nameLong: (max: number) => `Use menos de ${max} caracteres no nome.`,
    contact: 'Deixe um e-mail ou um telefone, para eu te responder.',
    messageLong: (max: number) => `Use menos de ${max} caracteres. A gente aprofunda quando conversar.`,
  },
};

export const LIMITS = { name: 120, contact: 200, message: 2000 };

export type Lead = { name: string; contact: string; message: string };
export type LeadField = keyof Lead;
export type LeadErrors = Partial<Record<LeadField, string>>;
export type LeadResult = { ok: true; lead: Lead } | { ok: false; errors: LeadErrors; spam?: boolean };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s().-]{7,}$/;
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Whether the visitor left an email or a phone number, or neither. */
export function contactKind(c: string): 'email' | 'phone' | null {
  if (EMAIL.test(c)) return 'email';
  if (PHONE.test(c) && c.replace(/\D/g, '').length >= 7) return 'phone';
  return null;
}

export function validateLead(input: unknown, locale: LeadLocale = 'en'): LeadResult {
  const say = MESSAGES[locale] ?? MESSAGES.en;
  if (!input || typeof input !== 'object') return { ok: false, errors: {} };
  const o = input as Record<string, unknown>;
  // "website" is a hidden field people never see; only bots fill it in
  if (str(o.website)) return { ok: false, errors: {}, spam: true };

  const name = str(o.name), contact = str(o.contact), message = str(o.message);
  const errors: LeadErrors = {};
  if (!name) errors.name = say.name;
  else if (name.length > LIMITS.name) errors.name = say.nameLong(LIMITS.name);
  if (!contactKind(contact) || contact.length > LIMITS.contact) errors.contact = say.contact;
  // the idea is optional: a name and a way to reply are enough to start talking
  if (message.length > LIMITS.message) errors.message = say.messageLong(LIMITS.message);

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
    subject: l.message ? `New idea from ${short(l.name, 40)}: ${short(l.message, 60)}` : `New lead from ${short(l.name, 40)}`,
    text: `Name: ${l.name}\nReply to: ${l.contact}\n\n${l.message}\n`,
    html: `<p><b>${html(l.name)}</b> · ${reach}</p><p style="white-space:pre-wrap">${html(l.message)}</p>`,
  };
}

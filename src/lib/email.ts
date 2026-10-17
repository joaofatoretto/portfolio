/* Emails João sends: one shared dark layout (table markup, inline styles, so mail clients keep it) and the receipt a lead gets
   after the /hire form. api/lead.ts uses receiptEmail and scripts/email-preview.ts previews it; the private sales repo's email-kit/build.ts uses the layout for the letter and signature files.
   No imports: api/lead.ts loads this file directly in Node (and scripts/email-preview.ts and the sales repo's email-kit/build.ts run it as TypeScript, which can't resolve `.js` names).
   The copy for both languages is inline below, like MESSAGES in lead.ts, for the same reason. */

export type EmailLocale = 'en' | 'pt';

/** Same number as LIMITS.message in lead.ts (repeated because this file has no imports; email.test.ts checks they match). */
export const MAX_MESSAGE = 2000;

const SITE = 'https://joaofatoretto.com';
const MARK = `${SITE}/email/mark.png`;
const SIGNAL = `${SITE}/email/signal.png`;
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = 'ui-monospace, Menlo, Consolas, monospace';

export type Block =
  | { type: 'heading'; text: string }
  | { type: 'p'; text: string }
  | { type: 'quote'; label: string; text: string }
  | { type: 'button'; label: string; href: string }
  /** `closing`: the sign-off line ("Talk soon,", or just "João" in the letter kit, where Gmail adds the signature). */
  | { type: 'signature'; closing: string; name?: string; line?: string; site?: string }
  | { type: 'footer'; text: string };

export type LayoutInput = {
  locale: EmailLocale;
  /** The document title (the subject). */
  title: string;
  /** The hidden line mail clients show after the subject. */
  preheader: string;
  blocks: Block[];
  /** The letter kit: João edits the content in a browser and pastes it into Gmail. */
  editable?: boolean;
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Escaped, with line breaks kept. */
const multi = (s: string) => esc(s.replace(/\r\n?/g, '\n')).replace(/\n/g, '<br>');

const COPY = {
  en: {
    lang: 'en',
    wrote: 'You wrote',
    role: 'Websites, apps, AI agents, automations and custom digital solutions, designed and built by me',
    closing: 'Talk soon,',
    footer: 'You’re getting this because you sent the form at joaofatoretto.com/hire. It’s a one-time receipt, not a newsletter.',
    withMessage: {
      subject: (n: string) => (n ? `Got it, ${n}. Your idea is in my inbox.` : 'Got it. Your idea is in my inbox.'),
      preheader: 'I’ll reply within 1 business day. Here’s what you sent.',
      intro: 'Thanks for getting in touch. Your message reached me, and I’ll reply within 1 business day to set up our first chat.',
      outro: 'Want to add something before we talk? Just reply to this email. A link to your website or app, a few photos, or a line about your customers all help. If you don’t have any of that yet, that’s fine: we’ll start from the idea.',
    },
    noMessage: {
      subject: (n: string) => (n ? `Got it, ${n}. I’ll be in touch.` : 'Got it. I’ll be in touch.'),
      preheader: 'I’ll reply within 1 business day to set up a first chat.',
      intro: 'Thanks for getting in touch. Your details reached me, and I’ll reply within 1 business day to set up our first chat.',
      outro: 'If you’d like, reply with a line or two about what you have in mind. A link to your website or app helps too. If it’s still just an idea, that’s fine: that’s what the first chat is for.',
    },
    hi: (n: string) => (n ? `Hi ${n},` : 'Hi,'),
  },
  pt: {
    lang: 'pt-BR',
    wrote: 'Você escreveu',
    role: 'Sites, aplicativos, agentes de IA, automações e soluções digitais sob medida, pensados e construídos por mim',
    closing: 'Até breve,',
    footer: 'Você está recebendo isto porque enviou o formulário em joaofatoretto.com/pt-br/hire. É um recibo único, não uma newsletter.',
    withMessage: {
      subject: (n: string) => (n ? `Pronto, ${n}. Sua ideia chegou até mim.` : 'Pronto. Sua ideia chegou até mim.'),
      preheader: 'Respondo em até 1 dia útil. Aqui está o que você mandou.',
      intro: 'Obrigado por entrar em contato. Sua mensagem chegou até mim, e respondo em até 1 dia útil para marcarmos a nossa primeira conversa.',
      outro: 'Quer acrescentar algo antes de a gente conversar? É só responder este e-mail. Um link do seu site ou aplicativo, algumas fotos ou uma linha sobre os seus clientes ajudam. Se você ainda não tem nada disso, sem problema: a gente começa pela ideia.',
    },
    noMessage: {
      subject: (n: string) => (n ? `Pronto, ${n}. Entro em contato.` : 'Pronto. Entro em contato.'),
      preheader: 'Respondo em até 1 dia útil para marcar a primeira conversa.',
      intro: 'Obrigado por entrar em contato. Seus dados chegaram até mim, e respondo em até 1 dia útil para marcarmos a nossa primeira conversa.',
      outro: 'Se quiser, responda com uma ou duas linhas sobre o que você tem em mente. Um link do seu site ou aplicativo também ajuda. Se ainda é só uma ideia, sem problema: é pra isso que serve a primeira conversa.',
    },
    hi: (n: string) => (n ? `Oi, ${n},` : 'Oi,'),
  },
};

const P = 'margin:0 0 16px;font:16px/26px ' + SANS + ';color:#E5E5E5;';

function blockHtml(b: Block): string {
  switch (b.type) {
    case 'heading':
      return `<h1 style="margin:0 0 16px;font:700 28px/34px ${SANS};color:#FFFFFF;">${esc(b.text)}</h1>`;
    case 'p':
      return `<p style="${P}">${multi(b.text)}</p>`;
    case 'quote':
      return `<p style="margin:0 0 4px;font:12px/18px ${MONO};color:#8A8A8E;">${esc(b.label)}</p>`
        + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;"><tr>`
        + `<td bgcolor="#3A3A3C" width="2" style="width:2px;background:#3A3A3C;font-size:0;line-height:0;">&nbsp;</td>`
        + `<td width="16" style="width:16px;font-size:0;line-height:0;">&nbsp;</td>`
        + `<td style="font:16px/26px ${SANS};color:#E5E5E5;">“${multi(b.text)}”</td></tr></table>`;
    case 'button':
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;"><tr>`
        + `<td bgcolor="#FF3D6E" width="3" style="width:3px;background:#FF3D6E;font-size:0;line-height:0;">&nbsp;</td>`
        + `<td bgcolor="#FFFFFF" height="48" style="height:48px;background:#FFFFFF;"><a href="${esc(b.href)}" style="display:inline-block;padding:0 24px;font:500 16px/48px ${SANS};color:#0A0A0B;text-decoration:none;">${esc(b.label)}</a></td>`
        + `<td bgcolor="#22B8FF" width="3" style="width:3px;background:#22B8FF;font-size:0;line-height:0;">&nbsp;</td></tr></table>`;
    case 'signature': {
      const rest = b.name
        ? `<p style="margin:24px 0 0;font:600 14px/20px ${SANS};color:#FFFFFF;">${esc(b.name)}</p>`
          + (b.line ? `<p style="margin:0;font:14px/20px ${SANS};color:#A3A3A3;">${esc(b.line)}</p>` : '')
          + (b.site ? `<p style="margin:0;font:14px/20px ${SANS};"><a href="${SITE}" style="color:#FFFFFF;text-decoration:underline;">${esc(b.site)}</a></p>` : '')
        : '';
      return `<p style="margin:8px 0 0;font:16px/26px ${SANS};color:#E5E5E5;">${esc(b.closing)}</p>${rest}`;
    }
    case 'footer':
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0;"><tr>`
        + `<td style="border-top:1px solid #2E2E30;padding-top:16px;font:12px/18px ${SANS};color:#8A8A8E;">${multi(b.text)}</td></tr></table>`;
  }
}

function blockText(b: Block): string {
  switch (b.type) {
    case 'heading': case 'p': case 'footer': return b.text;
    case 'quote': return `${b.label}:\n“${b.text.replace(/\r\n?/g, '\n')}”`;
    case 'button': return `${b.label}: ${b.href}`;
    case 'signature': return [b.closing, ...(b.name ? ['', b.name, b.line, b.site].filter((x) => x !== undefined) : [])].join('\n');
  }
}

/** The shared dark layout. Returns the HTML document and its plain-text twin. */
export function emailLayout(o: LayoutInput): { html: string; text: string } {
  const lang = COPY[o.locale].lang;
  const body = o.blocks.map(blockHtml).join('\n');
  const html = `<!doctype html>
<html lang="${lang}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(o.title)}</title>
<style>:root{color-scheme:dark;supported-color-schemes:dark}body{margin:0;padding:0;background:#0A0A0B}a{color:inherit}img{border:0}</style>
</head>
<body bgcolor="#0A0A0B" style="margin:0;padding:0;background:#0A0A0B;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#0A0A0B;font-size:1px;line-height:1px;">${esc(o.preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0A0A0B" style="background:#0A0A0B;"><tr><td align="center" bgcolor="#0A0A0B" style="background:#0A0A0B;padding:24px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0A0A0B" style="width:100%;max-width:600px;background:#0A0A0B;"><tr><td bgcolor="#0A0A0B" style="background:#0A0A0B;padding:0 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;"><tr>
<td width="40" valign="middle" style="width:40px;"><img src="${MARK}" width="40" height="40" alt="João Fatoretto" style="display:block;width:40px;height:40px;border:0;"></td>
<td width="12" style="width:12px;font-size:0;line-height:0;">&nbsp;</td>
<td valign="middle" style="font:600 16px/24px ${SANS};color:#FFFFFF;">João Fatoretto</td>
<td valign="middle" align="right" aria-hidden="true" style="font:12px/18px ${MONO};color:#8A8A8E;">CH 06</td>
</tr></table>
<img src="${SIGNAL}" width="552" alt="" role="presentation" style="display:block;width:100%;max-width:552px;height:auto;border:0;margin:0 0 24px;">
<div${o.editable ? ' contenteditable="true"' : ''}>
${body}
</div>
</td></tr></table>
</td></tr></table>
</body>
</html>
`;
  const text = o.blocks.map(blockText).join('\n\n') + '\n';
  return { html, text };
}

type ReceiptLead = { name: string; message: string };

/** The receipt a lead gets after the /hire form: { subject, html, text } in the language of the form. */
export function receiptEmail(lead: ReceiptLead, locale: EmailLocale) {
  const c = COPY[locale] ?? COPY.en;
  const first = lead.name.trim().split(/\s+/)[0] ?? '';
  const message = lead.message.trim().slice(0, MAX_MESSAGE);
  const v = message ? c.withMessage : c.noMessage;
  const subject = v.subject(first);
  const headline = subject.split(/(?<=\.)\s/)[0]; // the subject's first sentence
  const blocks: Block[] = [
    { type: 'heading', text: headline },
    { type: 'p', text: c.hi(first) },
    { type: 'p', text: v.intro },
    ...(message ? [{ type: 'quote', label: c.wrote, text: message } as Block] : []),
    { type: 'p', text: v.outro },
    { type: 'signature', closing: c.closing, name: 'João Fatoretto', line: c.role, site: 'joaofatoretto.com' },
    { type: 'footer', text: c.footer },
  ];
  return { subject, ...emailLayout({ locale, title: subject, preheader: v.preheader, blocks }) };
}

/** Just the signature, with the 40px mark, for Gmail's signature settings. Works on a white compose window: no dark background. */
export function signatureSnippet(locale: EmailLocale): string {
  const c = COPY[locale] ?? COPY.en;
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${SANS};"><tr>
<td valign="top" style="padding-right:12px;"><img src="${MARK}" width="40" height="40" alt="João Fatoretto" style="display:block;width:40px;height:40px;border:0;"></td>
<td valign="top" style="font:14px/20px ${SANS};color:#5A5A5E;"><span style="font-weight:600;color:#0A0A0B;">João Fatoretto</span><br>${esc(c.role)}<br><a href="${SITE}" style="color:#0A0A0B;text-decoration:underline;">joaofatoretto.com</a></td>
</tr></table>`;
}

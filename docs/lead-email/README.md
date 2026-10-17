# Lead confirmation email

The automatic email a lead gets after the /hire form, if they left an email address. Code: `receiptEmail` in `src/lib/email.ts`, sent by `api/lead.ts` through Resend. The words below are the approved copy; `email.ts` holds the same text, so change both together (English and Portuguese).

The emails João writes himself (first-chat replies, proposals, follow-ups, the signature) and cold outreach live in the private sales repo (`../sales/emails.md`).

## Status and how to turn it on

Without `RECEIPT_FROM`, `api/lead.ts` sends no receipt. Leads who only left a phone number never get one.

**Sender (João's decision, 2026-10-13):** it comes from an address on joaofatoretto.com (verified in Resend) and replies go to João's Gmail, jvitorfatto@gmail.com. It can't come from the Gmail address itself: Resend only sends from domains whose DNS you control, and Gmail would flag a gmail.com sender sent from another server as forged. Reply-To and CC are both `LEAD_TO` if set, else `PROFILE.email` (jvitorfatto@gmail.com); `LEAD_TO` is unset in Vercel. The CC puts the receipt in João's Gmail in the lead's thread: answer it with **Reply all** (plain Reply goes to the Reply-To, which is João himself).

The CC copy is João's notice of the lead: when the receipt goes out, `api/lead.ts` doesn't send his separate lead email. That email still goes out when there's no receipt (the lead left only a phone number, or `RECEIPT_FROM` is unset) or when the receipt fails, so no lead is lost. Nothing his lead email had is lost: the lead's full name is the display name in To (`"Tom Baker" <tom@…>`, so Gmail shows "to Tom Baker"), their address is in To, their message is quoted in full, and the language is the language of the receipt.

`RECEIPT_FROM` is set in Vercel (Production and Preview, 2026-10-13) to `João Fatoretto <hello@joaofatoretto.com>`. Test on a Vercel preview with `delivered@resend.dev` as the contact (Resend's test inbox), never by sending the live form.

Nothing receives mail at hello@joaofatoretto.com yet (the domain has no MX record), so an email typed to that address bounces. Replies to the receipt are fine: they go to the Gmail address.

## Previews

`npm run emails` writes `receipt.{en,pt}.html` and `receipt.{en,pt}.no-message.html` to this folder with a sample lead (nothing is sent). Open them in a browser. Images load from joaofatoretto.com/email/ (`public/email/`), so they show once the site is deployed.

## English

Sent by `api/lead.ts` to people who left an **email** on the /hire form, right after the lead reaches João. People who left only a phone number get no email.

**Rule: purely transactional.** It confirms the receipt and says what happens next. No case studies, no offer pitch, no newsletter. This keeps it a person's note and keeps it outside CAN-SPAM's commercial rules, which can apply when a message mixes in sales content (FTC guidance).

**Fields:** `{firstName}` (first word of the name they typed), `{message}` (their idea, may be empty).

### With a message

- **From:** `João Fatoretto <hello@joaofatoretto.com>` (`RECEIPT_FROM`)
- **CC and Reply-To:** `jvitorfatto@gmail.com`
- **Subject:** `Got it, {firstName}. Your idea is in my inbox.`
- **Preheader:** `I’ll reply within 1 business day. Here’s what you sent.`

Body:

```
Hi {firstName},

Thanks for getting in touch. Your message reached me, and I’ll reply within 1 business day to set up our first chat.

You wrote:
“{message}”

Want to add something before we talk? Just reply to this email. A link to your website or app, a few photos, or a line about your customers all help. If you don’t have any of that yet, that’s fine: we’ll start from the idea.

Talk soon,

João Fatoretto
Websites, apps, AI agents, automations and custom digital solutions, designed and built by me
joaofatoretto.com

You’re getting this because you sent the form at joaofatoretto.com/hire. It’s a one-time receipt, not a newsletter.
```

### Without a message

- **Subject:** `Got it, {firstName}. I’ll be in touch.`
- **Preheader:** `I’ll reply within 1 business day to set up a first chat.`

Body:

```
Hi {firstName},

Thanks for getting in touch. Your details reached me, and I’ll reply within 1 business day to set up our first chat.

If you’d like, reply with a line or two about what you have in mind. A link to your website or app helps too. If it’s still just an idea, that’s fine: that’s what the first chat is for.

Talk soon,

João Fatoretto
Websites, apps, AI agents, automations and custom digital solutions, designed and built by me
joaofatoretto.com

You’re getting this because you sent the form at joaofatoretto.com/hire. It’s a one-time receipt, not a newsletter.
```

**Why it's written this way**
- Subject mirrors the thank-you page (`thanks.titleNamed` in `ui.ts`), so the page and the email feel like one moment. The no-message subject drops "Your idea" because they didn't send one.
- "within 1 business day" is the exact /hire promise (`SEND.reply`). The reply-by-email route replaces WhatsApp (João's rule).
- Their message is quoted back so they can see it arrived intact and remember what they said.
- One link only (the site, in the signature). Nothing to click is required.
- It signs off with a closing line ("Talk soon," / "Até breve,"), then the full name, once: the header already shows the mark and the name, so a lone "João" above the signature repeated it. "Talk soon" matches the promise of a reply within a business day; "Looking forward to working with you" would assume the sale before the first chat.
- The footer explains why they got it and that there's no list, which answers "am I now on a mailing list?".
- "Thanks" once, no exclamation marks, no "We've received your submission".

**Build notes:** send a plain-text part alongside the HTML; 600 px wide; body 16 px live text; system font stack (`-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`), since Sora won't load in most clients; off-black background (not #000) and off-white text if it's dark, so auto-inverting clients (Gmail iOS, Outlook Windows) don't break it; the mark as a PNG with a faint outline, alt text `João Fatoretto`; `color-scheme` meta tags for Apple Mail. Test in Gmail iOS, Gmail Android, Apple Mail, Outlook for Windows and Outlook.com before choosing dark. `{message}` must be HTML-escaped and length-capped. If `{firstName}` is empty, fall back to `Hi,` and the subject `Got it. Your idea is in my inbox.`

**Sender:** see "Status and how to turn it on" above. Never send it from onboarding@resend.dev (Resend's test sender): it would look like spam.

---

## Português (pt-BR)

Enviada por `api/lead.ts` a quem deixou um **e-mail** no formulário da /hire, logo que o contato chega ao João. Quem deixou só telefone não recebe e-mail. Puramente transacional: confirma o recebimento e diz o que vem a seguir.

**Campos:** `{firstName}` (primeira palavra do nome), `{message}` (a ideia da pessoa, pode estar vazia).

### Com mensagem

- **De:** `João Fatoretto <hello@joaofatoretto.com>` (`RECEIPT_FROM`)
- **Cópia (CC) e Responder para:** `jvitorfatto@gmail.com`
- **Assunto:** `Pronto, {firstName}. Sua ideia chegou até mim.`
- **Pré-visualização:** `Respondo em até 1 dia útil. Aqui está o que você mandou.`

Corpo:

```
Oi, {firstName},

Obrigado por entrar em contato. Sua mensagem chegou até mim, e respondo em até 1 dia útil para marcarmos a nossa primeira conversa.

Você escreveu:
“{message}”

Quer acrescentar algo antes de a gente conversar? É só responder este e-mail. Um link do seu site ou aplicativo, algumas fotos ou uma linha sobre os seus clientes ajudam. Se você ainda não tem nada disso, sem problema: a gente começa pela ideia.

Até breve,

João Fatoretto
Sites, aplicativos, agentes de IA, automações e soluções digitais sob medida, pensados e construídos por mim
joaofatoretto.com

Você está recebendo isto porque enviou o formulário em joaofatoretto.com/pt-br/hire. É um recibo único, não uma newsletter.
```

### Sem mensagem

- **Assunto:** `Pronto, {firstName}. Entro em contato.`
- **Pré-visualização:** `Respondo em até 1 dia útil para marcar a primeira conversa.`

Corpo:

```
Oi, {firstName},

Obrigado por entrar em contato. Seus dados chegaram até mim, e respondo em até 1 dia útil para marcarmos a nossa primeira conversa.

Se quiser, responda com uma ou duas linhas sobre o que você tem em mente. Um link do seu site ou aplicativo também ajuda. Se ainda é só uma ideia, sem problema: é pra isso que serve a primeira conversa.

Até breve,

João Fatoretto
Sites, aplicativos, agentes de IA, automações e soluções digitais sob medida, pensados e construídos por mim
joaofatoretto.com

Você está recebendo isto porque enviou o formulário em joaofatoretto.com/pt-br/hire. É um recibo único, não uma newsletter.
```

Se `{firstName}` vier vazio: abertura `Oi,` e assunto `Pronto. Sua ideia chegou até mim.`

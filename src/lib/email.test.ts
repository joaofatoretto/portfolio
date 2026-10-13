// The shared email layout and the lead receipt (src/lib/email.ts).
import { emailLayout, receiptEmail, signatureSnippet, MAX_MESSAGE } from './email';
import { LIMITS } from './lead';

const tom = { name: 'Tom Baker', contact: 'tom@clinic.example', message: 'A site with online booking.\nFor my clinic.' };
const noMessage = { ...tom, message: '' };

describe('receiptEmail', () => {
  it('says the idea arrived, in English, with the first name', () => {
    const r = receiptEmail(tom, 'en');
    expect(r.subject).toBe('Got it, Tom. Your idea is in my inbox.');
    expect(r.html).toContain('Got it, Tom.');
    expect(r.html).toContain('Hi Tom,');
    expect(r.html).toContain('<html lang="en"');
  });

  it('has its own subject without a message', () => {
    const r = receiptEmail(noMessage, 'en');
    expect(r.subject).toBe('Got it, Tom. I’ll be in touch.');
    expect(r.html).not.toContain('You wrote');
    expect(r.html).toContain('Your details reached me');
  });

  it('is Portuguese for the Portuguese form', () => {
    const r = receiptEmail(tom, 'pt');
    expect(r.subject).toBe('Pronto, Tom. Sua ideia chegou até mim.');
    expect(r.html).toContain('<html lang="pt-BR"');
    expect(r.html).toContain('Oi, Tom,');
    expect(r.html).toContain('Você escreveu');
    expect(r.html).toContain('joaofatoretto.com/pt-br/hire');
    expect(receiptEmail(noMessage, 'pt').subject).toBe('Pronto, Tom. Entro em contato.');
  });

  it('signs off once: a closing line, then the full name (the header already shows it)', () => {
    const en = receiptEmail(tom, 'en');
    expect(en.text).toContain('Talk soon,\n\nJoão Fatoretto\n');
    expect(en.text).not.toMatch(/^João$/m);
    expect(en.html).toContain('Talk soon,</p>');
    expect(receiptEmail(tom, 'pt').text).toContain('Até breve,\n\nJoão Fatoretto\n');
  });

  it('falls back when the name is empty', () => {
    expect(receiptEmail({ ...tom, name: '  ' }, 'en').subject).toBe('Got it. Your idea is in my inbox.');
    expect(receiptEmail({ ...noMessage, name: '' }, 'en').subject).toBe('Got it. I’ll be in touch.');
    expect(receiptEmail({ ...tom, name: '' }, 'pt').subject).toBe('Pronto. Sua ideia chegou até mim.');
    const r = receiptEmail({ ...tom, name: '' }, 'en');
    expect(r.html).toContain('Hi,');
    expect(r.text).toContain('Hi,\n');
  });

  it('escapes the message, keeps its line breaks and caps its length', () => {
    const r = receiptEmail({ ...tom, message: '<script>alert(1)</script> & "x"\nline two' }, 'en');
    expect(r.html).not.toContain('<script');
    expect(r.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;x&quot;<br>line two');
    const long = receiptEmail({ ...tom, message: 'a'.repeat(LIMITS.message + 500) }, 'en');
    expect(long.html).toContain('a'.repeat(LIMITS.message));
    expect(long.html).not.toContain('a'.repeat(LIMITS.message + 1));
    expect(MAX_MESSAGE).toBe(LIMITS.message);
  });

  it('has a plain-text part with the same content and no HTML', () => {
    const r = receiptEmail(tom, 'en');
    expect(r.text).toContain('Got it, Tom.');
    expect(r.text).toContain('Hi Tom,');
    expect(r.text).toContain('A site with online booking.\nFor my clinic.');
    expect(r.text).toContain('joaofatoretto.com');
    expect(r.text).toContain('one-time receipt');
    expect(r.text).not.toMatch(/<[a-z/]/i);
  });

  it('has a hidden preheader, dark colour scheme, no script, and alt text on every image', () => {
    const { html } = receiptEmail(tom, 'en');
    expect(html).toContain('I’ll reply within 1 business day. Here’s what you sent.');
    expect(html).toMatch(/display:none[^>]*>I’ll reply/);
    expect(html).toContain('<meta name="color-scheme" content="dark">');
    expect(html).toContain('<meta name="supported-color-schemes" content="dark">');
    expect(html).not.toContain('<script');
    const imgs = html.match(/<img\b[^>]*>/g) ?? [];
    expect(imgs.length).toBe(2);
    for (const img of imgs) expect(img).toMatch(/\balt="/);
    expect(html).toContain('https://joaofatoretto.com/email/mark.png');
    expect(html).toContain('https://joaofatoretto.com/email/signal.png');
  });
});

describe('emailLayout', () => {
  it('renders the primary button as a table with the two anaglyph bars', () => {
    const { html, text } = emailLayout({ locale: 'en', title: 'T', preheader: 'P', blocks: [{ type: 'button', label: 'See the plan', href: 'https://x.example/p' }] });
    expect(html).toContain('#FF3D6E');
    expect(html).toContain('#22B8FF');
    expect(html).toContain('href="https://x.example/p"');
    expect(text).toContain('See the plan: https://x.example/p');
  });

  it('can make the content editable', () => {
    expect(emailLayout({ locale: 'en', title: 'T', preheader: '', blocks: [], editable: true }).html).toContain('contenteditable="true"');
    expect(emailLayout({ locale: 'en', title: 'T', preheader: '', blocks: [] }).html).not.toContain('contenteditable');
  });
});

describe('signatureSnippet', () => {
  it('has no dark background and shows the 40px mark', () => {
    const s = signatureSnippet('en');
    expect(s).not.toMatch(/background(-color)?:\s*#0A0A0B/i);
    expect(s).toContain('width="40"');
    expect(s).toContain('alt="João Fatoretto"');
  });
});

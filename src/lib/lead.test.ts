import { LIMITS, contactKind, leadEmail, validateLead } from './lead';

const valid = { name: '  Maria Souza ', contact: 'maria@example.com', message: 'A site where people order my cakes.', website: '' };

describe('validateLead', () => {
  it('accepts a name, a way to reply and the idea, trimmed', () => {
    const r = validateLead(valid);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.lead).toEqual({ name: 'Maria Souza', contact: 'maria@example.com', message: 'A site where people order my cakes.' });
  });

  it('accepts a phone number as the way to reply', () => {
    expect(validateLead({ ...valid, contact: '+1 (555) 010-0199' }).ok).toBe(true);
  });

  it('asks for each missing field in plain words', () => {
    const r = validateLead({ name: ' ', contact: 'maria@', message: '' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['contact', 'message', 'name']);
  });

  it('rejects text past the limits', () => {
    expect(validateLead({ ...valid, message: 'x'.repeat(LIMITS.message + 1) }).ok).toBe(false);
    expect(validateLead({ ...valid, name: 'x'.repeat(LIMITS.name + 1) }).ok).toBe(false);
  });

  it('flags bots that fill the hidden field', () => {
    const r = validateLead({ ...valid, website: 'http://spam.example' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.spam).toBe(true);
  });

  it('refuses anything that is not an object', () => {
    expect(validateLead(null).ok).toBe(false);
    expect(validateLead('name=x').ok).toBe(false);
  });
});

describe('contactKind', () => {
  it('tells an email from a phone number', () => {
    expect(contactKind('maria@example.com')).toBe('email');
    expect(contactKind('+55 19 99999-0000')).toBe('phone');
    expect(contactKind('call me')).toBeNull();
  });
});

describe('leadEmail', () => {
  it('puts the name and the start of the idea in the subject, and everything in the body', () => {
    const r = validateLead(valid);
    if (!r.ok) throw new Error('expected a valid lead');
    const m = leadEmail(r.lead);
    expect(m.subject).toBe('New idea from Maria Souza: A site where people order my cakes.');
    for (const v of ['Maria Souza', 'maria@example.com', 'order my cakes']) expect(m.text).toContain(v);
  });

  it('shortens a long idea in the subject', () => {
    const r = validateLead({ ...valid, message: 'word '.repeat(40) });
    if (!r.ok) throw new Error('expected a valid lead');
    expect(leadEmail(r.lead).subject.length).toBeLessThan(110);
  });

  it('links a phone number to WhatsApp', () => {
    const r = validateLead({ ...valid, contact: '+1 555 010 0199' });
    if (!r.ok) throw new Error('expected a valid lead');
    expect(leadEmail(r.lead).html).toContain('https://wa.me/15550100199');
  });

  it('escapes HTML that a visitor types', () => {
    const r = validateLead({ ...valid, name: '<b>Maria</b>', message: '<script>alert(1)</script> a real idea' });
    if (!r.ok) throw new Error('expected a valid lead');
    const m = leadEmail(r.lead);
    expect(m.html).not.toContain('<script>');
    expect(m.html).toContain('&lt;script&gt;');
  });
});

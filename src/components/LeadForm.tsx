import { useId, useRef, useState, type FormEvent } from 'react';
import { PROFILE, waLink } from '../content/profile';
import { validateLead, type LeadErrors, type LeadField } from '../lib/lead';

type Values = Record<LeadField | 'website', string>;
const EMPTY: Values = { name: '', contact: '', message: '', website: '' };
const ORDER: LeadField[] = ['name', 'contact', 'message'];
/** What the thank-you page gets from the form, in sessionStorage under SENT_KEY (none when opened directly). */
export type Sent = { name: string; message: string };
export const SENT_KEY = 'lead-sent';
/** A full page load (not a router change), so the Google tag on /hire/thanks runs. An object so tests can stub it. */
export const nav = { to: (url: string) => window.location.assign(url) };
const FALLBACK = 'Hi João, I tried to send the form on your site about an idea.';

/** The hire page's conversion point: three fields. Validates in the browser, posts to /api/lead, then loads
 *  /hire/thanks in full (a real page load, so the Google tag counts the conversion), leaving the name and idea in
 *  sessionStorage so that page can thank them and offer WhatsApp. */
export function LeadForm() {
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'failed'>('idle');
  const set = (f: keyof Values, value: string) => {
    setV(prev => ({ ...prev, [f]: value }));
    if (errors[f as LeadField]) setErrors(prev => ({ ...prev, [f]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    const r = validateLead(v);
    if (!r.ok && !r.spam) {
      setErrors(r.errors);
      formRef.current?.querySelector<HTMLElement>(`[name="${ORDER.find(f => r.errors[f])}"]`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) });
      if (res.ok) {
        try { sessionStorage.setItem(SENT_KEY, JSON.stringify({ name: v.name.trim(), message: v.message.trim() } satisfies Sent)); } catch { /* the page thanks without a name */ }
        nav.to('/hire/thanks');
        return;
      }
      if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        if (data.errors && Object.keys(data.errors).length) { setErrors(data.errors); setStatus('idle'); return; }
      }
      setStatus('failed');
    } catch {
      setStatus('failed');
    }
  };

  const field = (f: LeadField, label: string, props: Record<string, string>) => (
    <div className="field">
      <label htmlFor={id(f)}>{label}</label>
      <input id={id(f)} name={f} value={v[f]} onChange={e => set(f, e.target.value)} {...props}
        aria-invalid={errors[f] ? true : undefined} aria-describedby={errors[f] ? id(`${f}-err`) : undefined} />
      {errors[f] && <span className="field-err" id={id(`${f}-err`)}>{errors[f]}</span>}
    </div>
  );

  return (
    <form className="lead-form" ref={formRef} onSubmit={submit} noValidate aria-label="Tell me your idea" method="post" action="/api/lead">
      {field('name', 'Your name', { autoComplete: 'name', placeholder: 'Maria' })}
      {field('contact', 'WhatsApp or email', { autoComplete: 'email', placeholder: 'So I can reply' })}
      {field('message', 'Your idea, in one line', { placeholder: 'A site where people order my cakes' })}
      {/* hidden from people; bots fill it in */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={id('website')}>Website</label>
        <input id={id('website')} name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={e => set('website', e.target.value)} />
      </div>
      {status === 'failed' && (
        <p className="form-fail" role="alert">
          That didn’t send. Your answers are still here: try again, or email me at <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a> or <a href={waLink(FALLBACK)} target="_blank" rel="noopener noreferrer">message me on WhatsApp</a>.
        </p>
      )}
      <div className="form-actions">
        <button className="btn primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send my idea  →'}</button>
      </div>
    </form>
  );
}

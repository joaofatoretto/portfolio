// @vitest-environment node
// The Vercel Function behind the form (api/lead.ts): it validates the lead and emails it to João through Resend.
import { POST } from '../../api/lead';

const lead = { name: 'Tom', contact: 'tom@clinic.example', message: 'A site with online booking for my clinic.' };
const post = (body: unknown) => POST(new Request('https://joaofatoretto.com/api/lead', {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: typeof body === 'string' ? body : JSON.stringify(body),
}));
const sent = () => JSON.parse(fetchMock.mock.calls[0][1]!.body as string);

const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue(new Response('{"id":"1"}', { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('RESEND_API_KEY', 're_test');
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('POST /api/lead', () => {
  it('emails a valid lead to João, with the visitor as reply-to', async () => {
    const res = await post(lead);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect((init!.headers as Record<string, string>).Authorization).toBe('Bearer re_test');
    expect(sent().to).toEqual(['jvitorfatto@gmail.com']);
    expect(sent().reply_to).toBe('tom@clinic.example');
    expect(sent().subject).toContain('Tom');
  });

  it('sends from the domain the Resend integration set up', async () => {
    vi.stubEnv('RESEND_EMAIL_DOMAIN', 'joaofatoretto.com');
    await post(lead);
    expect(sent().from).toContain('<leads@joaofatoretto.com>');
  });

  it('leaves reply-to out when the visitor gave a phone number', async () => {
    await post({ ...lead, contact: '+1 555 010 0199' });
    expect(sent().reply_to).toBeUndefined();
  });

  it('returns the field errors for an incomplete lead and sends nothing', async () => {
    const res = await post({ ...lead, contact: 'tom' });
    expect(res.status).toBe(400);
    expect((await res.json()).errors.contact).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('accepts a plain form post (no JavaScript) and sends it to the thank-you page, like the browser form', async () => {
    const res = await POST(new Request('https://joaofatoretto.com/api/lead', {
      method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(lead).toString(),
    }));
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe('https://joaofatoretto.com/hire/thanks');
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('tells João the lead wrote from the Portuguese page, so he replies in Portuguese', async () => {
    await post({ ...lead, lang: 'pt' });
    expect(sent().subject).toMatch(/^\[PT\] New idea from Tom/);
  });

  it('leaves the subject alone for English leads, and for a language it doesn’t know', async () => {
    await post({ ...lead, lang: 'en' });
    await post({ ...lead, lang: 'fr' });
    await post(lead);
    for (const call of fetchMock.mock.calls) expect(JSON.parse(call[1]!.body as string).subject).toMatch(/^New idea from Tom/);
  });

  it('sends a Portuguese plain form post to the Portuguese thank-you page', async () => {
    const res = await POST(new Request('https://joaofatoretto.com/api/lead', {
      method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ ...lead, lang: 'pt' }).toString(),
    }));
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe('https://joaofatoretto.com/pt-br/hire/thanks');
    expect(sent().subject).toMatch(/^\[PT\] /);
  });

  it('rejects a body that is not JSON', async () => {
    expect((await post('name=Tom')).status).toBe(400);
  });

  it('pretends to accept bots, so they don’t retry, and sends nothing', async () => {
    const res = await post({ ...lead, website: 'spam' });
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fails clearly when the email service isn’t configured', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect((await post(lead)).status).toBe(500);
  });

  it('reports a failure when Resend refuses the email', async () => {
    fetchMock.mockResolvedValue(new Response('{"message":"bad"}', { status: 422 }));
    expect((await post(lead)).status).toBe(502);
  });

  describe('receipt to the lead', () => {
    const from = 'João Fatoretto <hello@joaofatoretto.com>';
    const second = () => JSON.parse(fetchMock.mock.calls[1][1]!.body as string);
    const fail = () => new Response('nope', { status: 500 });
    const okRes = () => new Response('{"id":"1"}', { status: 200 });

    it('sends none without RECEIPT_FROM', async () => {
      await post(lead);
      expect(fetchMock).toHaveBeenCalledOnce();
    });

    it('replaces João’s own email for a lead who left an email: one receipt, with João copied', async () => {
      vi.stubEnv('RECEIPT_FROM', from);
      expect((await post(lead)).status).toBe(200);
      expect(fetchMock).toHaveBeenCalledOnce();
      expect(fetchMock.mock.calls[0][0]).toBe('https://api.resend.com/emails');
      expect(sent().to).toEqual(['"Tom" <tom@clinic.example>']);
      expect(sent().from).toBe(from);
      // João gets the receipt in the same thread and answers it with Reply all
      expect(sent().cc).toEqual(['jvitorfatto@gmail.com']);
      expect(sent().reply_to).toBe('jvitorfatto@gmail.com');
      expect(sent().subject).toBe('Got it, Tom. Your idea is in my inbox.');
      expect(sent().html).toContain('Hi Tom,');
      expect(sent().text).toContain('Hi Tom,');
    });

    it('keeps the full name in the To line, so João’s copy loses nothing his own email had', async () => {
      vi.stubEnv('RECEIPT_FROM', from);
      await post({ ...lead, name: 'Tom Baker' });
      expect(sent().to).toEqual(['"Tom Baker" <tom@clinic.example>']);
      // characters that would break the address header are dropped
      fetchMock.mockClear();
      await post({ ...lead, name: 'Tom "T" <Baker>\\' });
      expect(sent().to).toEqual(['"Tom T Baker" <tom@clinic.example>']);
    });

    it('replies to and copies LEAD_TO when it is set', async () => {
      vi.stubEnv('RECEIPT_FROM', from);
      vi.stubEnv('LEAD_TO', 'inbox@joaofatoretto.com');
      await post(lead);
      expect(sent().reply_to).toBe('inbox@joaofatoretto.com');
      expect(sent().cc).toEqual(['inbox@joaofatoretto.com']);
    });

    it('is Portuguese for the Portuguese form', async () => {
      vi.stubEnv('RECEIPT_FROM', from);
      await post({ ...lead, lang: 'pt' });
      expect(sent().subject).toBe('Pronto, Tom. Sua ideia chegou até mim.');
    });

    it('sends João’s own email for a phone-only lead (there is no receipt to copy him on)', async () => {
      vi.stubEnv('RECEIPT_FROM', from);
      await post({ ...lead, contact: '+1 555 010 0199', lang: 'pt' });
      expect(fetchMock).toHaveBeenCalledOnce();
      expect(sent().to).toEqual(['jvitorfatto@gmail.com']);
      expect(sent().subject).toMatch(/^\[PT\] /);
    });

    it('falls back to João’s own email when the receipt fails, so no lead is lost', async () => {
      vi.stubEnv('RECEIPT_FROM', from);
      fetchMock.mockResolvedValueOnce(fail()).mockResolvedValueOnce(okRes());
      expect((await post(lead)).status).toBe(200);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(second().to).toEqual(['jvitorfatto@gmail.com']);
      expect(second().reply_to).toBe('tom@clinic.example');

      fetchMock.mockReset().mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(okRes());
      expect((await post(lead)).status).toBe(200);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('fails only when both the receipt and the fallback fail', async () => {
      vi.stubEnv('RECEIPT_FROM', from);
      fetchMock.mockResolvedValue(fail());
      expect((await post(lead)).status).toBe(502);
    });

    it('sends a plain form post to the thank-you page after the receipt', async () => {
      vi.stubEnv('RECEIPT_FROM', from);
      const res = await POST(new Request('https://joaofatoretto.com/api/lead', {
        method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(lead).toString(),
      }));
      expect(res.status).toBe(303);
      expect(fetchMock).toHaveBeenCalledOnce();
    });
  });
});

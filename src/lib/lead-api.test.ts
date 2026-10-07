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
});

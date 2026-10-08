import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { SENT_KEY, nav } from '../components/LeadForm';
import { CLIENTS } from '../content/profile';
import { CALL, PAY, PICTURE, TRUST } from '../content/hire';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const at = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
// the form's labels in either language (the Portuguese page is tested too)
const form = () => screen.getByRole('form', { name: /tell me your idea|me conta sua ideia/i });

function fill() {
  const f = within(form());
  fireEvent.change(f.getByLabelText(/your name|seu nome/i), { target: { value: 'Maria' } });
  fireEvent.change(f.getByLabelText(/email or phone|e-mail ou telefone/i), { target: { value: 'maria@bakery.example' } });
  fireEvent.change(f.getByLabelText(/your idea|sua ideia/i), { target: { value: 'A site where people order my cakes.' } });
}

const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => { fetchMock.mockReset(); vi.stubGlobal('fetch', fetchMock); sessionStorage.clear(); });
afterEach(() => vi.restoreAllMocks());
afterEach(() => vi.unstubAllGlobals());

describe('hire page: the story', () => {
  it('opens with the promise and a way to the form', () => {
    at('/hire');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Let’s make your idea real.');
    const start = screen.getAllByRole('link', { name: /get in touch/i })[0];
    expect(start).toHaveAttribute('href', '#contact');
    expect(document.getElementById('contact')).toContainElement(form());
  });

  it('shows who I’ve worked for and the numbers behind it', () => {
    at('/hire');
    const trust = screen.getByRole('region', { name: /companies i’ve designed for/i });
    // each company once for screen readers, as a logo named after it (the carousel's loop copy is hidden)
    const logos = within(trust).getAllByRole('img').map(img => img.getAttribute('alt'));
    expect(logos).toEqual(TRUST.clients.map(c => c.name));
    expect(logos.length).toBeGreaterThanOrEqual(12);
    for (const c of CLIENTS) expect(logos).toContain(c);
    expect(trust.textContent).toContain('30+');
  });

  it('has a logo file for every company, and a colour version for hover', () => {
    for (const c of TRUST.clients) for (const f of [c.logo, c.color ?? c.logo]) expect(existsSync(join(process.cwd(), 'public', f)), f).toBe(true);
  });

  it('walks from a conversation to a shipped product, in order', () => {
    at('/hire');
    const path = screen.getByRole('region', { name: /not sure what you need/i });
    const steps = within(path).getAllByRole('listitem').map(li => li.textContent);
    expect(steps).toHaveLength(4);
    expect(steps[0]).toMatch(/talk it through/i);
    expect(steps[3]).toMatch(/ship it/i);
  });

  it('shows one moment at a time on one phone, and lets you pick the moment', () => {
    at('/hire');
    const pic = screen.getByRole('region', { name: /picture it working/i });
    const moments = within(pic).getAllByRole('button');
    expect(moments.map(b => b.textContent)).toEqual(PICTURE.moments.map(m => expect.stringContaining(m)));
    // one phone; only the chosen moment's screen is shown
    const screens = [...pic.querySelectorAll('.pic-screen')];
    const shown = () => screens.filter(s => s.getAttribute('aria-hidden') !== 'true');
    expect(pic.querySelectorAll('.phone')).toHaveLength(1);
    expect(screens).toHaveLength(moments.length);
    expect(moments[0]).toHaveAttribute('aria-pressed', 'true');
    expect(shown()).toEqual([screens[0]]);
    fireEvent.click(moments[2]);
    expect(moments[2]).toHaveAttribute('aria-pressed', 'true');
    expect(moments[0]).toHaveAttribute('aria-pressed', 'false');
    expect(shown()).toEqual([screens[2]]);
  });

  it('pictures outcomes any business or new product could want, not one kind of shop', () => {
    at('/hire');
    const pic = screen.getByRole('region', { name: /picture it working/i });
    expect(PICTURE.moments.length).toBeGreaterThanOrEqual(3);
    expect(pic.textContent).not.toMatch(/bak(e|ery)|cake|class/i);
  });

  it('says payment only comes after each shipped piece, with no prices', () => {
    at('/hire');
    const pay = screen.getByRole('region', { name: /you pay as i deliver/i });
    expect(pay.textContent).toMatch(/nothing upfront/i);
    expect(pay.textContent).not.toMatch(/[$€£]\s?\d/);
  });

  it('shows two lanes in time, delivery then payment, for any business', () => {
    at('/hire');
    const pay = screen.getByRole('region', { name: /you pay as i deliver/i });
    expect(pay.textContent).toContain(PAY.lanes.deliver);
    expect(pay.textContent).toContain(PAY.lanes.pay);
    expect(pay.textContent).not.toMatch(/bak(e|ery)|cake|sweet ?crumb/i);
  });

  it('marks each delivery with a check, and says the terms after the timeline, once for screen readers', () => {
    at('/hire');
    const pay = screen.getByRole('region', { name: /you pay as i deliver/i });
    const pieces = within(pay).getAllByRole('listitem');
    for (const li of pieces) expect(li.querySelector('.node svg')).not.toBeNull();
    const lede = within(pay).getByText(PAY.lede);
    const list = within(pay).getByRole('list');
    expect(list.compareDocumentPosition(lede) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('names the pieces as numbered sprints with short plain names, and bills each sprint', () => {
    PAY.pieces.forEach((pc, i) => {
      expect(pc.label).toBe(`Sprint ${i + 1}`);
      expect(pc.title.split(' ').length).toBeLessThanOrEqual(4);
    });
    expect(PAY.receipt).toBe('You pay this sprint');
  });

  it('ends with a short last call that points to the form', () => {
    at('/hire');
    const call = screen.getByRole('region', { name: CALL.title });
    expect(call.textContent).toContain(CALL.ask);
    expect(within(call).getByRole('link')).toHaveAttribute('href', '#contact');
    // the call comes right before the form
    expect(call.compareDocumentPosition(document.getElementById('contact')!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('puts every payment after its delivery, one piece at a time', () => {
    at('/hire');
    const pay = screen.getByRole('region', { name: /you pay as i deliver/i });
    const pieces = within(pay).getAllByRole('listitem');
    expect(pieces).toHaveLength(PAY.pieces.length);
    pieces.forEach((li, i) => {
      const text = li.textContent!;
      expect(text).toContain(PAY.pieces[i].title);
      expect(text.indexOf(PAY.pieces[i].title)).toBeLessThan(text.indexOf(PAY.receipt));
    });
  });

  it('shows the form card as a TV that powers on, like the contact card on home', () => {
    at('/hire');
    const card = document.getElementById('contact')!;
    expect(card.querySelector('canvas.static')).not.toBeNull();
    expect(card.querySelector('.send-layer')).toContainElement(form());
  });

  it('shows no client quote, not even a placeholder, until a real one is confirmed', () => {
    at('/hire');
    expect(document.querySelector('.quote-card')).toBeNull();
    expect(document.body.textContent).not.toMatch(/client quote/i);
  });

  it('makes the form the only way in: no WhatsApp anywhere on the page', () => {
    at('/hire');
    expect(document.querySelector('a[href*="wa.me"]')).toBeNull();
    expect(document.getElementById('root') ?? document.body).not.toHaveTextContent(/whatsapp/i);
  });

  it('closes with the idea, not the promise the hero already made', () => {
    at('/hire');
    expect(screen.getByRole('heading', { level: 2, name: 'Your idea starts here.' })).toBeInTheDocument();
  });

  it('asks for an email or a phone, with no placeholder text in the fields', () => {
    at('/hire');
    const f = within(form());
    expect(f.getByLabelText('Email or phone')).toBeInTheDocument();
    for (const input of form().querySelectorAll('input:not([type="hidden"])')) expect(input).not.toHaveAttribute('placeholder');
  });

  it('frames the hero and the trust strip on Paper, like home, and puts the rest on the dark Stage', () => {
    at('/hire');
    const room = document.querySelector('main .paper');
    expect(room).toContainElement(document.getElementById('top'));
    expect(room).toContainElement(screen.getByRole('region', { name: /companies i’ve designed for/i }));
    expect(room).not.toContainElement(screen.getByRole('region', { name: /not sure what you need/i }));
    expect(room).not.toContainElement(document.getElementById('contact'));
  });

  it('tunes in like the home hero, on its own channel', () => {
    at('/hire');
    const hero = screen.getByRole('region', { name: /let’s make your idea real/i });
    expect(hero.querySelector('.hero-ch')).toHaveTextContent('CH 06');
  });

  it('shows real work in the hero, linked to its case study', () => {
    at('/hire');
    const hero = screen.getByRole('region', { name: /let’s make your idea real/i });
    const shot = within(hero).getByRole('img', { name: /tempo’s landing page/i });
    expect(shot).toHaveAttribute('src', '/hire/tempo/page-1.webp');
    expect(within(hero).getByRole('link', { name: /see the case/i })).toHaveAttribute('href', '/work/tempo-landing-page');
  });

  it('has no availability chip', () => {
    at('/hire');
    expect(screen.queryByText(/taking new projects/i)).toBeNull();
  });
});

describe('hire page: the form', () => {
  it('explains what is missing and sends nothing', () => {
    at('/hire');
    fireEvent.submit(form());
    expect(within(form()).getByText(/tell me your name/i)).toBeInTheDocument();
    expect(within(form()).getByLabelText(/your name/i)).toHaveAttribute('aria-invalid', 'true');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends the idea, then loads the thank-you page in full (so the Google tag counts the conversion)', async () => {
    fetchMock.mockResolvedValue(new Response('{"ok":true}', { status: 200 }));
    const go = vi.spyOn(nav, 'to').mockImplementation(() => {});
    at('/hire');
    fill();
    fireEvent.submit(form());
    await waitFor(() => expect(go).toHaveBeenCalledWith('/hire/thanks'));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/lead');
    expect(JSON.parse(init!.body as string)).toMatchObject({ name: 'Maria', contact: 'maria@bakery.example' });
    expect(JSON.parse(sessionStorage.getItem(SENT_KEY)!)).toEqual({ name: 'Maria' });
  });

  it('sends the page’s language with the form, and loads the Portuguese thank-you page from a Portuguese page', async () => {
    fetchMock.mockResolvedValue(new Response('{"ok":true}', { status: 200 }));
    const go = vi.spyOn(nav, 'to').mockImplementation(() => {});
    const { pt } = await import('../content/pt');
    const { LocaleProvider } = await import('../i18n/copy');
    render(<LocaleProvider locale="pt" copy={pt}><MemoryRouter initialEntries={['/pt-br/hire']} basename="/pt-br"><App /></MemoryRouter></LocaleProvider>);
    expect(form().querySelector('input[name="lang"]')).toHaveValue('pt');
    fill();
    fireEvent.submit(form());
    await waitFor(() => expect(go).toHaveBeenCalledWith('/pt-br/hire/thanks'));
    expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string)).toMatchObject({ name: 'Maria', lang: 'pt' });
  });

  it('sends lang "en" from the English page', async () => {
    fetchMock.mockResolvedValue(new Response('{"ok":true}', { status: 200 }));
    vi.spyOn(nav, 'to').mockImplementation(() => {});
    at('/hire');
    fill();
    fireEvent.submit(form());
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string).lang).toBe('en');
  });

  it('thanks the person by name on the thank-you page, and points to the work, with no WhatsApp', async () => {
    sessionStorage.setItem(SENT_KEY, JSON.stringify({ name: 'Maria Silva' }));
    at('/hire/thanks');
    expect(await screen.findByRole('heading', { level: 1, name: /got it, maria\./i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /see my work/i })).toHaveAttribute('href', '/#work');
    expect(document.querySelector('a[href*="wa.me"]')).toBeNull();
    expect(document.querySelector('main')).not.toHaveTextContent(/whatsapp|sooner/i);
  });

  it('marks the idea as optional', () => {
    at('/hire');
    expect(within(form()).getByLabelText(/your idea, in one line \(optional\)/i)).toBeInTheDocument();
  });

  it('keeps what they typed and offers email when sending fails', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 502 }));
    at('/hire');
    fill();
    fireEvent.submit(form());
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('jvitorfatto@gmail.com');
    expect(alert).not.toHaveTextContent(/whatsapp/i);
    expect(within(form()).getByLabelText(/your name/i)).toHaveValue('Maria');
  });
});

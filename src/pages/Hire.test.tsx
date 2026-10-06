import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { CLIENTS } from '../content/profile';
import { PAY, PICTURE, TRUST } from '../content/hire';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const at = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
const form = () => screen.getByRole('form', { name: /tell me your idea/i });

function fill() {
  const f = within(form());
  fireEvent.change(f.getByLabelText(/your name/i), { target: { value: 'Maria' } });
  fireEvent.change(f.getByLabelText(/whatsapp or email/i), { target: { value: 'maria@bakery.example' } });
  fireEvent.change(f.getByLabelText(/your idea/i), { target: { value: 'A site where people order my cakes.' } });
}

const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => { fetchMock.mockReset(); vi.stubGlobal('fetch', fetchMock); });
afterEach(() => vi.unstubAllGlobals());

describe('hire page: the story', () => {
  it('opens with the promise and a way to the form', () => {
    at('/hire');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tell me your idea. I’ll make it real.');
    const start = screen.getAllByRole('link', { name: /tell me your idea/i })[0];
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

  it('offers WhatsApp with a ready message', () => {
    at('/hire');
    const wa = screen.getAllByRole('link', { name: /whatsapp/i });
    expect(wa.length).toBeGreaterThan(0);
    for (const a of wa) {
      expect(a.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/5519993229283\?text=/);
      expect(a).toHaveAttribute('target', '_blank');
    }
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
    const hero = screen.getByRole('region', { name: /tell me your idea/i });
    expect(hero.querySelector('.hero-ch')).toHaveTextContent('CH 06');
  });

  it('shows real work in the hero, linked to its case study', () => {
    at('/hire');
    const hero = screen.getByRole('region', { name: /tell me your idea/i });
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

  it('sends the idea and thanks the person by name', async () => {
    fetchMock.mockResolvedValue(new Response('{"ok":true}', { status: 200 }));
    at('/hire');
    fill();
    fireEvent.submit(form());
    expect(await screen.findByText(/got it, maria/i)).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/lead');
    expect(JSON.parse(init!.body as string)).toMatchObject({ name: 'Maria', contact: 'maria@bakery.example' });
    expect(screen.getByRole('link', { name: /continue on whatsapp/i }).getAttribute('href')).toMatch(/^https:\/\/wa\.me\//);
  });

  it('keeps what they typed and offers email and WhatsApp when sending fails', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 502 }));
    at('/hire');
    fill();
    fireEvent.submit(form());
    expect(await screen.findByRole('alert')).toHaveTextContent('jvitorfatto@gmail.com');
    expect(within(form()).getByLabelText(/your name/i)).toHaveValue('Maria');
  });
});

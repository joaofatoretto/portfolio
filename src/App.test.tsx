import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { CASES } from './content/cases';
import { pt } from './content/pt';
import { LocaleProvider } from './i18n/copy';
import { localize } from './i18n/locales';

const at = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);

describe('home', () => {
  it('links every case study to its page', () => {
    at('/');
    const work = document.getElementById('work')!;
    for (const c of CASES) {
      const card = within(work).getByRole('link', { name: new RegExp(c.title) });
      expect(card).toHaveAttribute('href', `/work/${c.slug}`);
    }
  });

  it('offers the CV as a download', () => {
    at('/');
    const links = screen.getAllByRole('link', { name: /download cv/i });
    expect(links[0]).toHaveAttribute('href', '/cv/joao-fatoretto-cv.pdf');
    expect(links[0]).toHaveAttribute('download');
  });
});

describe('theme', () => {
  it('frames the hero and the results on Paper, and puts everything after them on the dark Stage', () => {
    at('/');
    const room = document.querySelector('main .paper');
    expect(room).toContainElement(document.getElementById('top'));
    expect(room).toContainElement(screen.getByRole('region', { name: 'Results' }));
    for (const id of ['work', 'process', 'build', 'about', 'contact']) expect(room).not.toContainElement(document.getElementById(id));
  });

  it('keeps case studies fully on the dark Stage', () => {
    at(`/work/${CASES[0].slug}`);
    expect(document.querySelector('.paper')).toBeNull();
  });
});

describe('case study page', () => {
  it('opens with the title, facts and the 20-second summary', () => {
    const c = CASES[0];
    at(`/work/${c.slug}`);
    expect(screen.getByRole('heading', { level: 1, name: c.title })).toBeInTheDocument();
    expect(screen.getByText(c.meta.company)).toBeInTheDocument();
    expect(screen.getByText(c.problem)).toBeInTheDocument();
    expect(screen.getByText(c.outcome)).toBeInTheDocument();
  });

  it('points to the next case', () => {
    at(`/work/${CASES[0].slug}`);
    const next = screen.getByRole('region', { name: /next case study/i });
    expect(within(next).getByRole('link')).toHaveAttribute('href', `/work/${CASES[1].slug}`);
  });

  it('shows no signal for an unknown case', () => {
    at('/work/not-a-case');
    expect(screen.getByRole('heading', { level: 1, name: /doesn’t exist/i })).toBeInTheDocument();
  });
});


const atPt = (path: string) => render(<LocaleProvider locale="pt" copy={pt}><MemoryRouter initialEntries={[localize(path, 'pt')]} basename="/pt-br"><App /></MemoryRouter></LocaleProvider>);

describe('nav: start a project', () => {
  it('links to the hire page from every page, and marks it current there and on its thank-you page', () => {
    at('/');
    const link = () => within(document.getElementById('navwrap')!).getByRole('link', { name: 'Start a project' });
    expect(link()).toHaveAttribute('href', '/hire');
    expect(link()).not.toHaveAttribute('aria-current');
    for (const path of ['/hire', '/hire/thanks']) {
      cleanup(); at(path);
      expect(link()).toHaveAttribute('aria-current', 'page');
    }
  });

  it('stays in Portuguese on a Portuguese page', () => {
    atPt('/');
    expect(within(document.getElementById('navwrap')!).getByRole('link', { name: 'Comece um projeto' })).toHaveAttribute('href', '/pt-br/hire');
  });
});

describe('language switch', () => {
  // jsdom can't load another page: stop the click's navigation after the handlers have run
  const noNavigation = () => document.addEventListener('click', e => e.preventDefault(), { once: true });
  afterEach(() => { document.cookie = 'lang=; path=/; max-age=0'; });

  it('links to the Portuguese twin of the page and remembers the choice when clicked', () => {
    at('/hire');
    const nav = document.getElementById('navwrap')!;
    const sw = within(nav).getByRole('group', { name: 'Language' });
    expect(within(sw).getByText('EN')).toHaveAttribute('aria-current', 'true');
    const to = within(sw).getByRole('link', { name: /português/i });
    expect(to).toHaveAttribute('href', '/pt-br/hire');
    expect(to).toHaveAttribute('hreflang', 'pt-BR');
    expect(to).toHaveAttribute('lang', 'pt-BR');
    noNavigation();
    fireEvent.click(to);
    expect(document.cookie).toContain('lang=pt');
  });

  // Loading the other thank-you page would count a second Google Ads conversion; a 404 has no twin.
  it.each([['/hire/thanks', '/pt-br/hire'], ['/not-a-page', '/pt-br'], ['/work/not-a-case', '/pt-br']])('from %s goes to %s', (path, href) => {
    at(path);
    const nav = document.getElementById('navwrap')!;
    expect(within(nav).getByRole('link', { name: /português/i })).toHaveAttribute('href', href);
  });

  it('is in the footer too, and goes back to English from a Portuguese page', () => {
    atPt('/work/' + CASES[0].slug);
    const footer = document.querySelector('footer')!;
    const to = within(footer).getByRole('link', { name: /english/i });
    expect(to).toHaveAttribute('href', `/work/${CASES[0].slug}`);
    noNavigation();
    fireEvent.click(to);
    expect(document.cookie).toContain('lang=en');
  });

  it('does not let the channel switch take over a link to the other language (the browser loads it)', () => {
    at('/');
    const to = within(document.getElementById('navwrap')!).getByRole('link', { name: /português/i });
    let seen: boolean | undefined;
    document.addEventListener('click', e => { seen = e.defaultPrevented; e.preventDefault(); }, { once: true });
    fireEvent.click(to);
    expect(seen).toBe(false); // nothing before this point (the channel switch listens first) had claimed the click
    expect(document.querySelector('.ch-osd')).not.toHaveClass('on');
  });

  it('still changes channel inside a language, with the prefix stripped for the router', () => {
    atPt('/');
    const card = within(document.getElementById('work')!).getAllByRole('link')[0];
    expect(card).toHaveAttribute('href', expect.stringMatching(/^\/pt-br\/work\//));
    fireEvent.click(card);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(document.querySelector('.case-page')).not.toBeNull();
  });

  it('keeps the nav and footer links inside the language', () => {
    atPt('/');
    expect(within(document.getElementById('navwrap')!).getByRole('link', { name: pt.ui.nav.talk })).toHaveAttribute('href', '/pt-br#contact');
    expect(within(document.querySelector('footer')!).getByRole('link', { name: pt.ui.footer.top })).toHaveAttribute('href', '/pt-br/#top'.replace('/#', '#'));
  });
});

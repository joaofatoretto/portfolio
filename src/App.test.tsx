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
    expect(screen.getByRole('link', { name: /product designer cv/i })).toHaveAttribute('href', '/cv/joao-fatoretto-cv.pdf');
    expect(screen.getByRole('link', { name: /design engineer cv/i })).toHaveAttribute('href', '/cv/joao-fatoretto-cv-design-engineer.pdf');
    expect(links[0]).toHaveAttribute('download');
  });

  it('lists education in time order, oldest first, each with its years, what and where', () => {
    at('/');
    const edu = within(document.getElementById('about')!).getByRole('region', { name: 'Education' });
    const items = within(edu).getAllByRole('listitem').filter(li => li.parentElement!.classList.contains('edu-list'));
    expect(items.map(li => li.textContent)).toEqual([
      expect.stringMatching(/^2017–2022.*BSc Computer Science.*UNICAMP.*University of Campinas, Brazil/),
      expect.stringMatching(/^2020–2021.*User Experience Design.*UX Unicórnio/),
      expect.stringMatching(/^2023–2025.*MBA in UX Research and Design Leadership.*UNIFATEC/),
      expect.stringMatching(/^2024–2027.*In progress.*Product Master.*PM3/),
    ]);
    expect(items.map(li => within(li).getByRole('heading').textContent)).toEqual([
      'BSc Computer Science', 'User Experience Design', 'MBA in UX Research and Design Leadership', 'Product Master',
    ]);
  });

  it('backs UNICAMP with its two #1 rankings from João\'s years there, each linked to its source', () => {
    at('/');
    const ranks = within(document.getElementById('about')!).getByRole('list', { name: /unicamp rankings while i studied there/i });
    const items = within(ranks).getAllByRole('listitem');
    expect(items.map(li => li.textContent)).toEqual([
      expect.stringMatching(/#1.*University in Latin America.*Times Higher Education · 2017 & 2018/),
      expect.stringMatching(/#1.*Computing program in Brazil.*Folha University Ranking · 2018 & 2019/),
    ]);
    const the = within(items[0]).getByRole('link', { name: /times higher education/i });
    expect(the).toHaveAttribute('href', expect.stringContaining('agenciabrasil.ebc.com.br'));
    const ruf = within(items[1]).getByRole('link', { name: /folha university ranking/i });
    expect(ruf).toHaveAttribute('href', expect.stringContaining('unicamp.br'));
    for (const a of [ruf, the]) expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('backs the MBA with who taught it', () => {
    at('/');
    const faculty = within(document.getElementById('about')!).getByRole('list', { name: /taught by/i });
    expect(within(faculty).getAllByRole('listitem').map(li => li.textContent)).toEqual([
      expect.stringMatching(/Leandro Rezende.*Nielsen Norman Group/),
      expect.stringMatching(/Lucas Hirata.*Google/),
      expect.stringMatching(/Bernard De Luna.*Thoughtworks/),
    ]);
  });

  it('shows the same education in Portuguese on the Portuguese home', () => {
    atPt('/');
    const edu = within(document.getElementById('about')!).getByRole('region', { name: 'Formação' });
    const items = within(edu).getAllByRole('listitem').filter(li => li.parentElement!.classList.contains('edu-list'));
    expect(items.map(li => li.textContent)).toEqual([
      expect.stringMatching(/^2017–2022.*Bacharelado em Ciência da Computação.*UNICAMP/),
      expect.stringMatching(/^2020–2021.*Design de Experiência do Usuário.*UX Unicórnio/),
      expect.stringMatching(/^2023–2025.*MBA em UX Research e Liderança em Design/),
      expect.stringMatching(/^2024–2027.*Em andamento.*Product Master.*PM3/),
    ]);
    const ranks = within(edu).getByRole('list', { name: /rankings da unicamp enquanto eu estudava lá/i });
    expect(within(ranks).getAllByRole('listitem')[1]).toHaveTextContent(/Curso de Computação do Brasil.*Ranking Universitário Folha · 2018 e 2019/);
    expect(within(within(edu).getByRole('list', { name: /com aulas de/i })).getAllByRole('listitem')[1]).toHaveTextContent('Design Lead no Google');
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

  it('shows an image’s caption under it', () => {
    const c = CASES.find(x => x.body.some(b => b.type === 'img' && b.caption))!;
    const img = c.body.find(b => b.type === 'img' && b.caption) as { alt: string; caption: string };
    at(`/work/${c.slug}`);
    const figure = screen.getByRole('img', { name: img.alt }).closest('figure')!;
    expect(within(figure).getByText(img.caption)).toBeInTheDocument();
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

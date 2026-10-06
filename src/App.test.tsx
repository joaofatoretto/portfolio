import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { CASES } from './content/cases';

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

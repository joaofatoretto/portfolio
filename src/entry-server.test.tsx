// @vitest-environment node
// Renders like the build does: no window, no document. Anything that touches the browser while rendering fails here.
import { CASES } from './content/cases';
import { render } from './entry-server';

/** Text as React writes it into HTML. */
const html = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

describe('prerendered HTML (what search engines read before any JavaScript runs)', () => {
  it('has the home page copy and links to every case study', () => {
    const out = render('/');
    expect(out).toContain('Listen.');
    expect(out).toContain('I’m a senior product designer');
    for (const c of CASES) expect(out).toContain(`href="/work/${c.slug}"`);
  });

  it('has each case study’s title, summary and body text', () => {
    for (const c of CASES) {
      const out = render(`/work/${c.slug}`);
      expect(out).toMatch(new RegExp(`<h1[^>]*>${html(c.title)}</h1>`));
      expect(out).toContain(html(c.problem));
      const p = c.body.find(b => b.type === 'p');
      if (p?.type === 'p') expect(out).toContain(html(p.text.split(/[*_[]/)[0].slice(0, 40)));
    }
  });

  it('has the hire page story and the whole form, so it works before JavaScript loads', () => {
    const out = render('/hire');
    expect(out).toMatch(/<h1[^>]*>Tell me your idea\. I’ll make it real\.<\/h1>/);
    const text = out.replace(/<[^>]+>/g, '');
    for (const t of ['Not sure what you need?', 'Picture it working.', 'You pay as I deliver.', 'What are you waiting for?', 'Starting takes one message.', 'Let’s make it real.'])
      expect(text).toContain(t);
    expect(out).toContain('aria-label="Tell me your idea"');
    expect(out).toContain('href="https://wa.me/5519993229283?text=');
  });

  it('shows no signal for an unknown address', () => {
    expect(render('/not-a-page')).toContain('This channel doesn’t exist.');
    expect(render('/work/not-a-case')).toContain('This channel doesn’t exist.');
  });

  it('keeps the home page light: the decorative signal band draws in the browser', () => {
    const out = render('/');
    expect(out).toContain('aria-label="Many voices');
    expect(out.length).toBeLessThan(150_000);
  });

  it('starts home with the nav on the dark Stage, like the top of the scroll', () => {
    expect(render('/')).toContain('class="nav-wrap stage"');
    expect(render(`/work/${CASES[0].slug}`)).toContain('class="nav-wrap"');
    expect(render('/hire')).toContain('class="nav-wrap stage"');
  });

  it('leaves starting states to CSS, so the HTML is the same with or without motion', () => {
    const out = render('/') + render(`/work/${CASES[0].slug}`) + render('/hire');
    expect(out).not.toMatch(/class="(layer|screen-layer|contact-layer)"[^>]*style=/);
  });
});

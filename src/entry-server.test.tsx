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
    expect(out).toMatch(/<h1[^>]*>Let’s make your idea real\.<\/h1>/);
    expect(out).toMatch(/>Get in touch</);
    const text = out.replace(/<[^>]+>/g, '');
    for (const t of ['Not sure what you need?', 'Picture it working.', 'You pay as I deliver.', 'What are you waiting for?', 'Starting takes one message.', 'Your idea starts here.'])
      expect(text).toContain(t);
    expect(out).toContain('aria-label="Let’s make your idea real"');
    expect(out).not.toContain('wa.me');
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

const link = (out: string, href: string) => new RegExp(`<a [^>]*href="${href.replace(/[/#?]/g, m => '\\' + m)}"[^>]*>`, 'i').exec(out)?.[0];

describe('the language switch in the prerendered HTML', () => {
  // a thank-you page links to the other language's hire page: loading the other thank-you page would count a second Ads conversion
  it('links each English page to its Portuguese twin, as a link in Portuguese', () => {
    for (const [path, twin] of [['/', '/pt-br'], ['/hire', '/pt-br/hire'], [`/work/${CASES[0].slug}`, `/pt-br/work/${CASES[0].slug}`], ['/hire/thanks', '/pt-br/hire']]) {
      const out = render(path);
      const a = link(out, twin)!;
      expect(a, `${path} → ${twin}`).toBeDefined();
      expect(a).toMatch(/hreflang="pt-BR"/i);
      expect(a).toMatch(/lang="pt-BR"/);
      expect(out).toMatch(/<span lang="en" aria-current="true">EN<\/span>/);
      expect(out).toContain('role="group" aria-label="Language"');
    }
  });

  it('links each Portuguese page to its English twin and marks Portuguese as the current language', () => {
    for (const [path, twin] of [['/pt-br', '/'], ['/pt-br/hire', '/hire'], [`/pt-br/work/${CASES[0].slug}`, `/work/${CASES[0].slug}`], ['/pt-br/hire/thanks', '/hire']]) {
      const out = render(path, 'pt');
      const a = link(out, twin)!;
      expect(a, `${path} → ${twin}`).toBeDefined();
      expect(a).toMatch(/hreflang="en"/i);
      expect(out).toMatch(/<span lang="pt-BR" aria-current="true">PT<\/span>/);
    }
  });

  it('is in the nav and in the footer', () => {
    expect(render('/').match(/class="lang"/g)).toHaveLength(2);
  });
});

describe('prerendered Portuguese pages', () => {
  it('keep every internal link inside /pt-br', () => {
    const home = render('/pt-br', 'pt');
    for (const c of CASES) expect(home).toContain(`href="/pt-br/work/${c.slug}"`);
    expect(home).toContain('href="/pt-br#work"');
    expect(home).toContain('href="/pt-br#contact"');
    expect(home).toContain('class="lockup" href="/pt-br"');
    expect(home).not.toMatch(/href="\/work\//);
    const hire = render('/pt-br/hire', 'pt');
    expect(hire).toContain(`href="/pt-br/work/tempo-landing-page"`);
    expect(hire).toContain('href="/pt-br/hire#contact"');
    const caseOut = render(`/pt-br/work/${CASES[0].slug}`, 'pt');
    expect(caseOut).toContain(`href="/pt-br/work/${CASES[1].slug}"`);
    expect(caseOut).toContain('href="/pt-br#work"');
    expect(caseOut).toContain('href="/pt-br/work/' + CASES[0].slug + '#top"');
    const thanks = render('/pt-br/hire/thanks', 'pt');
    expect(thanks).toContain('href="/pt-br#work"');
  });

  it('send the form with the page’s language', () => {
    expect(render('/pt-br/hire', 'pt')).toContain('<input type="hidden" name="lang" value="pt"/>');
    expect(render('/hire')).toContain('<input type="hidden" name="lang" value="en"/>');
  });

  it('render every page in Node without a window', () => {
    for (const path of ['/pt-br', '/pt-br/hire', '/pt-br/hire/thanks', ...CASES.map(c => `/pt-br/work/${c.slug}`)]) expect(render(path, 'pt').length).toBeGreaterThan(1000);
  });
});

// The Contentsquare tag in index.html: it records how visitors use the site. Like the Google tag, it loads only on
// the live domain, so local runs and Vercel previews never send sessions.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
const tag = html.match(/<script>([^<]*9fb99e292e649[^<]*)<\/script>/)?.[1];

describe('Contentsquare tag', () => {
  it('is in the page head', () => {
    expect(tag).toBeTruthy();
    expect(html.indexOf(tag!)).toBeLessThan(html.indexOf('</head>'));
  });

  it('loads only on joaofatoretto.com', () => {
    const run = (host: string) => {
      document.head.querySelectorAll('script[src*="contentsquare"]').forEach(s => s.remove());
      new Function('location', tag!)({ hostname: host });
      return document.head.querySelector<HTMLScriptElement>('script[src*="contentsquare"]');
    };
    expect(run('localhost')).toBeNull();
    expect(run('portfolio-git-x.vercel.app')).toBeNull();
    const s = run('joaofatoretto.com');
    expect(s?.src).toBe('https://t.contentsquare.net/uxa/9fb99e292e649.js');
    expect(s?.async).toBe(true);
  });
});

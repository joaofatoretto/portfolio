// The Google Ads tag (gtag.js) in index.html: it counts visits to /hire/thanks as conversions. It loads only on the
// live domain, so local runs and Vercel previews never send hits to the Ads account.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
const tag = html.match(/<script>([^<]*AW-18498833833[^<]*)<\/script>/)?.[1];

describe('Google tag', () => {
  it('is in the page head with the Ads account id', () => {
    expect(tag).toBeTruthy();
    expect(html.indexOf(tag!)).toBeLessThan(html.indexOf('</head>'));
    expect(tag).toContain("gtag('config','AW-18498833833')");
  });

  it('loads gtag.js only on joaofatoretto.com', () => {
    const run = (host: string) => {
      document.head.querySelectorAll('script[src*="googletagmanager"]').forEach(s => s.remove());
      new Function('location', tag!)({ hostname: host });
      return document.head.querySelector<HTMLScriptElement>('script[src*="googletagmanager"]');
    };
    expect(run('localhost')).toBeNull();
    expect(run('portfolio-git-x.vercel.app')).toBeNull();
    const s = run('joaofatoretto.com');
    expect(s?.src).toBe('https://www.googletagmanager.com/gtag/js?id=AW-18498833833');
    expect(s?.async).toBe(true);
  });
});

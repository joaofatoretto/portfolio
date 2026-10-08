/* Prerenders the site at build time, so search engines and link previewers get real HTML without running JavaScript.
   After the browser build, it builds src/entry-server.tsx for Node and writes, from the built index.html:
   one HTML file per page in each language (ALL_PAGES and ALL_UNLISTED in seo/meta.ts: its own head, `<html lang>` and
   rendered app), 404.html for unknown addresses (English), and sitemap.xml. Portuguese pages live under pt-br/ and
   preload the Portuguese copy chunk (src/content/pt/index.ts), which main.tsx loads before it hydrates them.
   In dev, index.html gets the home head and the app renders in the browser as usual. */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, type Plugin, type ResolvedConfig } from 'vite';
import { ALL_PAGES, ALL_UNLISTED, NOT_FOUND, PAGES, fillTemplate, modulepreload, renderHead, renderSitemap } from './src/seo/meta';
import { LOCALES, type Locale } from './src/i18n/locales';

const BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;

/** "/" → index.html, "/work/x" → work/x.html, "/pt-br" → pt-br.html, "/pt-br/hire" → pt-br/hire.html (Vercel's cleanUrls serves them without the extension). */
export const fileFor = (path: string) => (path === '/' ? 'index.html' : path.slice(1) + '.html');

/** The Portuguese copy's source file: its own chunk in the browser build. */
const PT_COPY = 'src/content/pt/index.ts';
const isPtCopy = (id: string | null | undefined) => !!id && id.replace(/\\/g, '/').endsWith('/' + PT_COPY);

/** Output file names: the Portuguese copy chunk gets a readable name (otherwise it would be another "index-<hash>.js"). */
export const chunkName = (facadeModuleId: string | null | undefined) => (isPtCopy(facadeModuleId) ? 'assets/copy-pt-[hash].js' : 'assets/[name]-[hash].js');

export function seo(): Plugin {
  let config: ResolvedConfig, ptChunk: string | undefined;
  return {
    name: 'portfolio-seo',
    configResolved(c) { config = c; },
    transformIndexHtml(html) {
      if (!BLOCK.test(html)) throw new Error('index.html is missing the <!--seo:start--><!--seo:end--> block');
      // keep the markers: the prerender replaces this block with each page's own head
      return html.replace(BLOCK, () => `<!--seo:start-->${renderHead(PAGES[0])}<!--seo:end-->`);
    },
    generateBundle(_, bundle) {
      if (config.command !== 'build' || config.build.ssr) return;
      const chunk = Object.values(bundle).find(o => o.type === 'chunk' && isPtCopy(o.facadeModuleId));
      if (!chunk) throw new Error(`the Portuguese copy (${PT_COPY}) is not its own chunk in the build: it must be loaded only by a dynamic import in src/main.tsx`);
      ptChunk = '/' + chunk.fileName;
    },
    async closeBundle() {
      if (config.command !== 'build' || config.build.ssr) return;
      if (!ptChunk) throw new Error('the Portuguese copy chunk was not found, so the Portuguese pages cannot preload it');
      const outDir = join(config.root, config.build.outDir), serverDir = join(config.root, 'node_modules/.prerender');
      await build({
        configFile: config.configFile, root: config.root, mode: config.mode, logLevel: 'warn',
        build: { ssr: 'src/entry-server.tsx', outDir: serverDir, emptyOutDir: true, copyPublicDir: false, minify: false },
      });
      try {
        const { render } = await import(pathToFileURL(join(serverDir, 'entry-server.js')).href) as { render: (path: string, locale?: Locale) => string };
        const template = readFileSync(join(outDir, 'index.html'), 'utf8');
        const write = (file: string, html: string) => { mkdirSync(dirname(join(outDir, file)), { recursive: true }); writeFileSync(join(outDir, file), html); };
        const pages = [...ALL_PAGES, ...ALL_UNLISTED];
        for (const page of pages) {
          // only Portuguese pages preload the Portuguese copy: English pages load nothing new
          const extra = page.locale === 'pt' ? [modulepreload(ptChunk)] : [];
          write(fileFor(page.path!), fillTemplate(template, renderHead(page, extra), render(page.path!, page.locale), LOCALES[page.locale].lang));
        }
        write('404.html', fillTemplate(template, renderHead(NOT_FOUND), render('/404'), LOCALES.en.lang));
        writeFileSync(join(outDir, 'sitemap.xml'), renderSitemap());
        config.logger.info(`prerendered ${pages.length} pages + 404.html`);
      } finally {
        rmSync(serverDir, { recursive: true, force: true });
      }
    },
  };
}

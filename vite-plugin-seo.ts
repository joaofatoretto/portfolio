/* Prerenders the site at build time, so search engines and link previewers get real HTML without running JavaScript.
   After the browser build, it builds src/entry-server.tsx for Node and writes, from the built index.html:
   one HTML file per page in PAGES and UNLISTED (own head + rendered app), 404.html for unknown addresses, and sitemap.xml.
   In dev, index.html gets the home head and the app renders in the browser as usual. */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, type Plugin, type ResolvedConfig } from 'vite';
import { NOT_FOUND, PAGES, UNLISTED, fillTemplate, renderHead, renderSitemap } from './src/seo/meta';

const BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;

/** "/" → index.html, "/work/x" → work/x.html (served at /work/x by Vercel's cleanUrls). */
export const fileFor = (path: string) => (path === '/' ? 'index.html' : path.slice(1) + '.html');

export function seo(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'portfolio-seo',
    configResolved(c) { config = c; },
    transformIndexHtml(html) {
      if (!BLOCK.test(html)) throw new Error('index.html is missing the <!--seo:start--><!--seo:end--> block');
      // keep the markers: the prerender replaces this block with each page's own head
      return html.replace(BLOCK, () => `<!--seo:start-->${renderHead(PAGES[0])}<!--seo:end-->`);
    },
    async closeBundle() {
      if (config.command !== 'build' || config.build.ssr) return;
      const outDir = join(config.root, config.build.outDir), serverDir = join(config.root, 'node_modules/.prerender');
      await build({
        configFile: config.configFile, root: config.root, mode: config.mode, logLevel: 'warn',
        build: { ssr: 'src/entry-server.tsx', outDir: serverDir, emptyOutDir: true, copyPublicDir: false, minify: false },
      });
      try {
        const { render } = await import(pathToFileURL(join(serverDir, 'entry-server.js')).href) as { render: (path: string) => string };
        const template = readFileSync(join(outDir, 'index.html'), 'utf8');
        const write = (file: string, html: string) => { mkdirSync(dirname(join(outDir, file)), { recursive: true }); writeFileSync(join(outDir, file), html); };
        for (const page of [...PAGES, ...UNLISTED]) write(fileFor(page.path!), fillTemplate(template, renderHead(page), render(page.path!)));
        write('404.html', fillTemplate(template, renderHead(NOT_FOUND), render('/404')));
        writeFileSync(join(outDir, 'sitemap.xml'), renderSitemap());
        config.logger.info(`prerendered ${PAGES.length + UNLISTED.length} pages + 404.html`);
      } finally {
        rmSync(serverDir, { recursive: true, force: true });
      }
    },
  };
}

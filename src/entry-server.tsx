/* Build-time render: vite-plugin-seo.ts builds this for Node and writes one HTML file per page and language in seo/meta.ts.
   Node can import both languages' copy statically; the browser loads the Portuguese copy only on Portuguese pages (main.tsx). */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { en } from './content';
import { pt } from './content/pt';
import { LocaleProvider } from './i18n/copy';
import { LOCALES, type Locale } from './i18n/locales';

const COPY = { en, pt };

/** The app's HTML at `path` (the full URL path, e.g. "/pt-br/hire") in a language: the same tree main.tsx hydrates. */
export function render(path: string, locale: Locale = 'en'): string {
  return renderToString(
    <StrictMode>
      <LocaleProvider locale={locale} copy={COPY[locale]}>
        <StaticRouter location={path} basename={LOCALES[locale].prefix || undefined}>
          <App />
        </StaticRouter>
      </LocaleProvider>
    </StrictMode>,
  );
}

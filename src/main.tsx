import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { en, type Copy } from './content';
import { LocaleProvider } from './i18n/copy';
import { LANG_COOKIE, LOCALES, englishFallback, localeFromLang, splitLocale, type Locale } from './i18n/locales';
import './styles/tokens.css';
import './styles/base.css';
import './styles/home.css';
import './styles/case.css';
import './styles/hire.css';

// The build prerenders every page in both languages (vite-plugin-seo.ts), so the browser takes over that HTML. In dev the root is empty.
// A document has one language for its whole life: the prerendered <html lang> says which (in dev, the address does).
// The tree must match src/entry-server.tsx.
const root = document.getElementById('root')!;
const prerendered = root.hasChildNodes();
const locale: Locale = prerendered ? localeFromLang(document.documentElement.lang) : splitLocale(location.pathname).locale;

/** Set once a Portuguese page has fallen back to English in this session. */
const FALLBACK_KEY = 'lang-fallback';

function start(copy: Copy) {
  if (!prerendered) document.documentElement.lang = LOCALES[locale].lang;
  const app = (
    <StrictMode>
      <LocaleProvider locale={locale} copy={copy}>
        <BrowserRouter basename={LOCALES[locale].prefix || undefined}>
          <App />
        </BrowserRouter>
      </LocaleProvider>
    </StrictMode>
  );
  if (prerendered) hydrateRoot(root, app);
  else createRoot(root).render(app);
}

if (locale === 'en') {
  start(en);
} else {
  // The Portuguese copy is its own chunk, preloaded by the Portuguese pages' <head>. If it can't load, the visitor gets
  // the English twin of the page (a session cookie keeps the redirect rules from sending them straight back). If that
  // already happened this session (cookies blocked, so the rules did send them back), there's no redirect loop: the
  // prerendered Portuguese page stays, static but readable (no motion class, so nothing waits hidden for a reveal).
  import('./content/pt').then(m => m.pt, () => null).then(copy => {
    if (copy) { start(copy); return; }
    let tried = false;
    try { tried = sessionStorage.getItem(FALLBACK_KEY) === '1'; sessionStorage.setItem(FALLBACK_KEY, '1'); } catch { tried = true; }
    if (tried) { document.documentElement.classList.remove('motion'); return; }
    document.cookie = `${LANG_COOKIE}=en; path=/; samesite=lax`;
    location.replace(englishFallback(location.pathname + location.search + location.hash));
  });
}

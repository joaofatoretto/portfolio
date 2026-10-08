import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCopy, useLocale } from '../i18n/copy';
import { LANG_COOKIE, LOCALES, localize, splitLocale, type Locale } from '../i18n/locales';

const ORDER: Locale[] = ['en', 'pt'];
/** The cookie the redirect rules in vercel.json read (docs/i18n.md): a choice always beats the browser's language. */
export const rememberLanguage = (to: Locale) => { document.cookie = `${LANG_COOKIE}=${to}; path=/; max-age=31536000; samesite=lax`; };

/** The page to open in the other language. The thank-you page's twin is the hire page, because loading the other
 *  thank-you page would count a second Google Ads conversion; an unknown address has no twin, so it's home. */
function twin(page: string, slugs: string[]) {
  if (page === '/hire/thanks') return '/hire';
  const known = page === '/' || page === '/hire' || slugs.some(s => page === `/work/${s}`);
  return known ? page : '/';
}

/** "EN / PT" in the nav and the footer: the current language, and a plain link to this page in the other one. A language
 *  is a whole document, so the link is a full page load (the router never switches it); it sets the `lang` cookie first.
 *  The search and hash join the link after the first render, so the prerendered HTML and the first render match. */
export function LangSwitch() {
  const here = useLocale(), { ui, cases } = useCopy();
  const { pathname, search, hash } = useLocation();
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  // a 404 under /pt-br/... is an English document with the prefix still in the address
  const page = twin(splitLocale(pathname).path, cases.map(c => c.slug));
  const same = page === splitLocale(pathname).path; // a different page drops the search and hash
  return (
    <div className="lang" role="group" aria-label={ui.lang.label}>
      {ORDER.map((l, i) => (
        <span className="lang-item" key={l}>
          {i > 0 && <span className="lang-sep" aria-hidden="true">/</span>}
          {l === here
            ? <span lang={LOCALES[l].lang} aria-current="true">{l.toUpperCase()}</span>
            : <a href={localize(page, l) + (live && same ? search + hash : '')} hrefLang={LOCALES[l].hreflang} lang={LOCALES[l].lang}
                aria-label={`${ui.lang[l]} (${l.toUpperCase()})`} onClick={() => rememberLanguage(l)}>{l.toUpperCase()}</a>}
        </span>
      ))}
    </div>
  );
}

/* The site's languages and how they map to URLs. English is the site at its own paths; Portuguese (pt-BR) is a mirror
   under /pt-br. No imports and no React, so Node (the prerender, the Vercel Function) can load it as is. See docs/i18n.md. */

export type Locale = 'en' | 'pt';

export const LOCALES: Record<Locale, { lang: string; hreflang: string; og: string; prefix: string }> = {
  en: { lang: 'en', hreflang: 'en', og: 'en_US', prefix: '' },
  pt: { lang: 'pt-BR', hreflang: 'pt-BR', og: 'pt_BR', prefix: '/pt-br' },
};
export const DEFAULT_LOCALE: Locale = 'en';
/** The cookie that remembers the visitor's choice: `lang=en` or `lang=pt` (see vercel.json). */
export const LANG_COOKIE = 'lang';

const PT = LOCALES.pt.prefix;
/** The path part of "/x?y#z" and the rest ("?y#z"). */
const cut = (s: string): [string, string] => { const i = s.search(/[?#]/); return i < 0 ? [s, ''] : [s.slice(0, i), s.slice(i)]; };

/** A site path in a language: '/' → '/pt-br', '/hire' → '/pt-br/hire', '/#work' → '/pt-br#work'. English is unchanged,
 *  and so is anything that isn't a site path (a hash, a mailto, another site). */
export function localize(path: string, locale: Locale): string {
  if (locale === 'en' || !path.startsWith('/')) return path;
  const [base, rest] = cut(path);
  if (base === PT || base.startsWith(PT + '/')) return path;
  return (base === '/' ? PT : PT + base) + rest;
}

/** The inverse of localize: which language a path is in, and the path without its prefix. */
export function splitLocale(path: string): { locale: Locale; path: string } {
  const [base, rest] = cut(path);
  if (base === PT || base.startsWith(PT + '/')) return { locale: 'pt', path: (base.slice(PT.length) || '/') + rest };
  return { locale: 'en', path };
}

/** The language of an `<html lang>` value: Portuguese for pt and pt-BR, English for everything else. */
export function localeFromLang(lang: string | null | undefined): Locale {
  return /^pt(?![a-z])/i.test(lang ?? '') ? 'pt' : 'en';
}

/** Where a Portuguese page sends the visitor when its copy can't load (src/main.tsx): its English twin, with the search
 *  and hash. The thank-you page's twin is the hire page, because the Google tag already counted the lead on
 *  /pt-br/hire/thanks and another load of /hire/thanks would count it twice. */
export function englishFallback(url: string): string {
  const { path } = splitLocale(url);
  return cut(path)[0] === '/hire/thanks' ? '/hire' : path;
}

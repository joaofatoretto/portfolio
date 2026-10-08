/* The page's language and copy, for every component. Each document has one language for its whole life (docs/i18n.md),
   so the provider is set once, in main.tsx (the browser) and entry-server.tsx (the prerender).
   Without a provider everything is English, so tests and tools that render <App /> alone still work. */
import { Fragment, createContext, useContext, type ReactNode } from 'react';
import { en, type Copy } from '../content';
import { localize, type Locale } from './locales';

type Value = { locale: Locale; copy: Copy };
const Ctx = createContext<Value>({ locale: 'en', copy: en });

export function LocaleProvider({ locale, copy, children }: { locale: Locale; copy: Copy; children: ReactNode }) {
  return <Ctx.Provider value={{ locale, copy }}>{children}</Ctx.Provider>;
}

export const useLocale = () => useContext(Ctx).locale;
export const useCopy = () => useContext(Ctx).copy;
/** A site path in this page's language, for raw `<a href>`s (router `<Link>`s add the prefix themselves). */
export function useLocalize() {
  const locale = useLocale();
  return (path: string) => localize(path, locale);
}

/** Fills `{name}`-style tokens in a copy string with text. */
export const fmt = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (token, key: string) => (key in values ? String(values[key]) : token));

/** Like fmt, but a token can become an element (a link inside a sentence). */
export function fmtNodes(template: string, nodes: Record<string, ReactNode>): ReactNode[] {
  return template.split(/(\{\w+\})/).filter(Boolean).map((part, i) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    return <Fragment key={i}>{key && key in nodes ? nodes[key] : part}</Fragment>;
  });
}

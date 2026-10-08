// The browser takes over the prerendered HTML (hydration). React doesn't fix attributes that differ between the
// server's HTML and the browser's first render, so a mismatch leaves wrong styles on screen (an invisible hero, say).
// The server renders with MOTION off; visitors arrive with motion on or with reduced motion.
// Portuguese pages hydrate the way main.tsx does it: the Portuguese copy in a LocaleProvider, the router on the /pt-br basename.
import { CASES } from './content/cases';
import type { Locale } from './i18n/locales';

async function serverHtml(path: string, locale: Locale) {
  vi.resetModules();
  const io = window.IntersectionObserver;
  // Without IntersectionObserver, MOTION and REDUCE are both false: the same values the server sees.
  delete (window as { IntersectionObserver?: unknown }).IntersectionObserver;
  try {
    const { render } = await import('./entry-server');
    return render(path, locale);
  } finally {
    window.IntersectionObserver = io;
  }
}

async function hydrate(path: string, markup: string, reduce: boolean, locale: Locale) {
  vi.resetModules();
  const matchMedia = window.matchMedia;
  window.matchMedia = (q => ({ ...matchMedia(q), matches: reduce && q.includes('prefers-reduced-motion') })) as typeof window.matchMedia;
  const errors: unknown[] = [];
  const spy = vi.spyOn(console, 'error').mockImplementation((...args) => { errors.push(args.join(' ')); });
  const container = document.createElement('div');
  container.innerHTML = markup;
  document.body.appendChild(container);
  try {
    const { act, createElement, StrictMode } = await import('react');
    const { hydrateRoot } = await import('react-dom/client');
    const { MemoryRouter } = await import('react-router-dom');
    const { default: App } = await import('./App');
    const { LocaleProvider } = await import('./i18n/copy');
    const { LOCALES } = await import('./i18n/locales');
    const { en } = await import('./content');
    const { pt } = await import('./content/pt');
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      const router = createElement(MemoryRouter, { initialEntries: [path], basename: LOCALES[locale].prefix || undefined }, createElement(App));
      root = hydrateRoot(container, createElement(StrictMode, null, createElement(LocaleProvider, { locale, copy: locale === 'pt' ? pt : en, children: router })),
        { onRecoverableError: e => { errors.push(e); } });
    });
    await act(async () => root!.unmount());
    return errors;
  } finally {
    spy.mockRestore();
    window.matchMedia = matchMedia;
    container.remove();
  }
}

describe.each([
  ['/', 'en'], [`/work/${CASES[0].slug}`, 'en'], ['/hire', 'en'], ['/hire/thanks', 'en'], ['/not-a-page', 'en'],
  ['/pt-br', 'pt'], [`/pt-br/work/${CASES[0].slug}`, 'pt'], ['/pt-br/hire', 'pt'], ['/pt-br/hire/thanks', 'pt'],
] as [string, Locale][])('hydrating %s (%s)', (path, locale) => {
  it.each([['motion on', false], ['reduced motion', true]])('matches the prerendered HTML with %s', async (_, reduce) => {
    const markup = await serverHtml(path, locale);
    expect(await hydrate(path, markup, reduce, locale)).toEqual([]);
  });
});

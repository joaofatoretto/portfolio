import { DEFAULT_LOCALE, LANG_COOKIE, LOCALES, englishFallback, localeFromLang, localize, splitLocale } from './locales';

describe('locales', () => {
  it('describes both languages', () => {
    expect(LOCALES.en).toEqual({ lang: 'en', hreflang: 'en', og: 'en_US', prefix: '' });
    expect(LOCALES.pt).toEqual({ lang: 'pt-BR', hreflang: 'pt-BR', og: 'pt_BR', prefix: '/pt-br' });
    expect(DEFAULT_LOCALE).toBe('en');
    expect(LANG_COOKIE).toBe('lang');
  });
});

describe('localize', () => {
  it('prefixes Portuguese paths and keeps hashes and queries', () => {
    expect(localize('/', 'pt')).toBe('/pt-br');
    expect(localize('/hire', 'pt')).toBe('/pt-br/hire');
    expect(localize('/work/benefits-card-app', 'pt')).toBe('/pt-br/work/benefits-card-app');
    expect(localize('/#work', 'pt')).toBe('/pt-br#work');
    expect(localize('/hire#contact', 'pt')).toBe('/pt-br/hire#contact');
    expect(localize('/?gclid=1', 'pt')).toBe('/pt-br?gclid=1');
    expect(localize('/hire?a=1#contact', 'pt')).toBe('/pt-br/hire?a=1#contact');
  });

  it('leaves English paths exactly as they are', () => {
    for (const p of ['/', '/hire', '/#work', '/hire#contact', '/work/x?y=1#z', '#contact', 'mailto:a@b.c']) expect(localize(p, 'en')).toBe(p);
  });

  it('leaves anything that is not a site path alone', () => {
    for (const p of ['#contact', 'mailto:a@b.c', 'https://example.com/hire', '']) expect(localize(p, 'pt')).toBe(p);
  });

  it('does not prefix twice', () => {
    expect(localize('/pt-br/hire', 'pt')).toBe('/pt-br/hire');
    expect(localize('/pt-br', 'pt')).toBe('/pt-br');
  });
});

describe('splitLocale', () => {
  it('is the inverse of localize', () => {
    for (const p of ['/', '/hire', '/work/x', '/#work', '/hire#contact', '/?a=1', '/hire/thanks']) {
      expect(splitLocale(localize(p, 'pt'))).toEqual({ locale: 'pt', path: p });
      expect(splitLocale(p)).toEqual({ locale: 'en', path: p });
    }
  });

  it('only treats /pt-br as a whole path segment', () => {
    expect(splitLocale('/pt-brazil')).toEqual({ locale: 'en', path: '/pt-brazil' });
    expect(splitLocale('/pt-br')).toEqual({ locale: 'pt', path: '/' });
    expect(splitLocale('/pt-br/')).toEqual({ locale: 'pt', path: '/' });
  });
});

describe('localeFromLang', () => {
  it('reads the html lang attribute', () => {
    expect(localeFromLang('pt-BR')).toBe('pt');
    expect(localeFromLang('pt')).toBe('pt');
    expect(localeFromLang('PT-br')).toBe('pt');
    expect(localeFromLang('en')).toBe('en');
    expect(localeFromLang('es')).toBe('en');
    expect(localeFromLang('')).toBe('en');
    expect(localeFromLang(null)).toBe('en');
    expect(localeFromLang(undefined)).toBe('en');
  });
});

describe('englishFallback', () => {
  it('is the English twin of a Portuguese address, keeping the search and hash', () => {
    expect(englishFallback('/pt-br/hire?gclid=x#contact')).toBe('/hire?gclid=x#contact');
    expect(englishFallback('/pt-br')).toBe('/');
    expect(englishFallback('/pt-br/work/photo-editing')).toBe('/work/photo-editing');
  });

  it('never loads the English thank-you page: the Google tag already counted this lead on the Portuguese one', () => {
    expect(englishFallback('/pt-br/hire/thanks')).toBe('/hire');
    expect(englishFallback('/pt-br/hire/thanks?x=1')).toBe('/hire');
  });
});

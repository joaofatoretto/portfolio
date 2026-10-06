import '@testing-library/jest-dom/vitest';

// jsdom gaps. Reduced motion is on, so the site renders its calm, static version under test.
// Files marked `@vitest-environment node` (the prerender tests) have no window and skip this.
if (typeof window !== 'undefined') {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('prefers-reduced-motion'), media: query, onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  class Observer { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
  window.IntersectionObserver = Observer as unknown as typeof IntersectionObserver;
  window.ResizeObserver = Observer as unknown as typeof ResizeObserver;
  HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  window.scrollTo = (() => {}) as typeof window.scrollTo;
}

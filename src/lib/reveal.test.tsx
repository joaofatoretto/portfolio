import { useRef } from 'react';
import { act, render } from '@testing-library/react';
import { Seq, SeqItem, useInView } from './reveal';

/* Motion on, with an IntersectionObserver the test drives by hand. */
const io = vi.hoisted(() => {
  const observers: { cb: IntersectionObserverCallback; targets: Set<Element> }[] = [];
  class FakeIO {
    targets = new Set<Element>();
    cb: IntersectionObserverCallback;
    constructor(cb: IntersectionObserverCallback) { this.cb = cb; observers.push(this); }
    observe(el: Element) { this.targets.add(el); }
    unobserve(el: Element) { this.targets.delete(el); }
    disconnect() { this.targets.clear(); }
  }
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = FakeIO;
  /** Reports these elements to whichever observer watches them: on screen, or scrolled past (above the viewport). */
  const show = (els: Element[], state: 'on' | 'past' = 'on') => {
    for (const o of observers) {
      const mine = els.filter(el => o.targets.has(el));
      if (mine.length) o.cb(mine.map(target => ({
        target, isIntersecting: state === 'on',
        boundingClientRect: { top: state === 'on' ? 100 : -400, bottom: state === 'on' ? 300 : -200 } as DOMRect,
      }) as IntersectionObserverEntry), o as unknown as IntersectionObserver);
    }
  };
  return { show };
});
vi.mock('./motion', async orig => ({ ...(await orig<typeof import('./motion')>()), MOTION: true }));

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const four = () => {
  const { container } = render(
    <Seq step={300}>{['a', 'b', 'c', 'd'].map(t => <SeqItem key={t}><b>{t}</b><p>{t}</p></SeqItem>)}</Seq>,
  );
  return [...container.querySelectorAll<HTMLElement>('[data-seq]')];
};
const shown = (items: HTMLElement[]) => items.map(el => el.classList.contains('in'));
const wait = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

describe('guided sequences', () => {
  it('reveals items one at a time, in reading order, a step apart', () => {
    const items = four();
    expect(shown(items)).toEqual([false, false, false, false]);
    act(() => io.show([items[2], items[0], items[3], items[1]]));
    wait(0);
    expect(shown(items)).toEqual([true, false, false, false]);
    wait(299);
    expect(shown(items)).toEqual([true, false, false, false]);
    wait(1);
    expect(shown(items)).toEqual([true, true, false, false]);
    wait(600);
    expect(shown(items)).toEqual([true, true, true, true]);
  });

  it('waits for an item to be on screen, and keeps the ones after it waiting too', () => {
    const items = four();
    act(() => io.show([items[0], items[1], items[3]]));
    wait(2000);
    expect(shown(items)).toEqual([true, true, false, false]);
    act(() => io.show([items[2]]));
    wait(0);
    expect(shown(items)).toEqual([true, true, true, false]);
    wait(300);
    expect(shown(items)).toEqual([true, true, true, true]);
  });

  it('doesn’t hold the rest back for an item already scrolled past', () => {
    const items = four();
    act(() => io.show([items[0], items[1]], 'past'));
    act(() => io.show([items[2], items[3]]));
    wait(0);
    expect(shown(items).slice(0, 3)).toEqual([true, true, true]);
    wait(300);
    expect(shown(items)).toEqual([true, true, true, true]);
  });

  it('tells the item it has been revealed, so its parts can start (e.g. a number scrambling)', () => {
    const items = four();
    const heard = vi.fn();
    items[0].addEventListener('reveal', heard);
    act(() => io.show([items[0]]));
    wait(0);
    expect(heard).toHaveBeenCalledOnce();
  });

  it('holds a part’s own motion (useInView) until its item is revealed', () => {
    const started = vi.fn();
    function Part() { const ref = useRef<HTMLElement>(null); useInView(ref, started); return <b ref={ref}>7+</b>; }
    const { container } = render(<Seq step={300}><SeqItem><span>first</span></SeqItem><SeqItem><Part /></SeqItem></Seq>);
    const [first, second] = container.querySelectorAll('[data-seq]');
    act(() => io.show([first, second, container.querySelector('b')!]));
    expect(started).not.toHaveBeenCalled();
    wait(300);
    expect(second.classList.contains('in')).toBe(true);
    expect(started).toHaveBeenCalledOnce();
  });
});

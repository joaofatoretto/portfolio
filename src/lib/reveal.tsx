/* Reveal on scroll. Hidden states only apply under html.motion, so nothing waits on JS to be readable. */
import { createContext, useContext, useEffect, useMemo, useRef, type CSSProperties, type ElementType, type ReactNode, type RefObject } from 'react';
import { MOTION } from './motion';

const revealIO = MOTION
  ? new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIO!.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
  : null;

type RProps = {
  as?: ElementType;
  /** up: fade up · wipe: clip left to right (applies to the child) · line: hairline draws across */
  kind?: 'up' | 'wipe' | 'line';
  /** delay in ms, for staggers */
  d?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [attr: string]: unknown;
};

export function R({ as: T = 'div', kind = 'up', d = 0, style, children, ...rest }: RProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (!revealIO) { el.classList.add('in'); return; }
    revealIO.observe(el);
    return () => revealIO.unobserve(el);
  }, []);
  return <T ref={ref} data-reveal={kind} style={{ ...style, '--d': `${d}ms` } as CSSProperties} {...rest}>{children}</T>;
}

/* ---------- guided sequences ----------
   A group whose items reveal one at a time so the eye is led through them: in reading order, each once it is on
   screen, never before the item before it, and at least `step` ms after it. An item already scrolled past reveals at
   once and holds nothing back. Inside an item, its direct children follow each other (CSS, `[data-seq]`), and the
   item gets a "reveal" event so parts with their own motion (a number scrambling) start with it. */
type Register = (el: HTMLElement) => () => void;
const SeqContext = createContext<Register | null>(null);

function sequence(step: number): Register {
  const items = new Set<HTMLElement>(), ready = new WeakSet<Element>();
  let last = -Infinity, timer = 0;
  const reveal = (el: HTMLElement) => { el.classList.add('in'); el.dispatchEvent(new Event('reveal')); };
  const pump = () => {
    if (timer) return;
    const next = [...items].filter(el => !el.classList.contains('in'))
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))[0];
    if (!next || !ready.has(next)) return;
    timer = window.setTimeout(() => { timer = 0; reveal(next); last = performance.now(); pump(); }, Math.max(0, last + step - performance.now()));
  };
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) ready.add(e.target);
      else if (e.boundingClientRect.bottom < 0 && !e.target.classList.contains('in')) reveal(e.target as HTMLElement);
    }
    pump();
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  return el => {
    items.add(el); io.observe(el);
    return () => { items.delete(el); io.unobserve(el); };
  };
}

type SeqProps = { as?: ElementType; /** ms between items */ step?: number; className?: string; style?: CSSProperties; children?: ReactNode; [attr: string]: unknown };

/** A guided sequence's container. Its items are the SeqItems inside it, at any depth. */
export function Seq({ as: T = 'div', step = 280, children, ...rest }: SeqProps) {
  const register = useMemo(() => (MOTION ? sequence(step) : null), [step]);
  return <SeqContext.Provider value={register}><T {...rest}>{children}</T></SeqContext.Provider>;
}

/** One item of a Seq. kind "parts" (default): its direct children rise in one after another; "self": it rises as one. */
type SeqItemProps = { as?: ElementType; kind?: 'parts' | 'self'; className?: string; style?: CSSProperties; children?: ReactNode; [attr: string]: unknown };

export function SeqItem({ as: T = 'div', kind = 'parts', children, ...rest }: SeqItemProps) {
  const ref = useRef<HTMLElement>(null), register = useContext(SeqContext);
  useEffect(() => {
    const el = ref.current!;
    if (!register) { el.classList.add('in'); return; }
    return register(el);
  }, [register]);
  return <T ref={ref} data-seq={kind} {...rest}>{children}</T>;
}

/** Calls cb once, the first time the element is at least `threshold` visible (inside a guided sequence: and its item
 *  has been revealed, so a number scrambles or a screen tunes in when it actually appears).
 *  Observe an unclipped element: a target hidden by its own clip-path never intersects. */
export function useInView(ref: RefObject<Element | null>, cb: () => void, threshold = 0.3) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    const el = ref.current!;
    if (!('IntersectionObserver' in window)) { cbRef.current(); return; }
    const item = el.closest('[data-seq]');
    const go = () => (item && !item.classList.contains('in') ? item.addEventListener('reveal', () => cbRef.current(), { once: true }) : cbRef.current());
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); go(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, []);
}

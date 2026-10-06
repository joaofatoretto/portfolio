import { Link } from 'react-router-dom';
import { MARK } from '../lib/signal';

export const ArrowIcon = ({ dir = 'up-right' }: { dir?: 'up-right' | 'left' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    {dir === 'left'
      ? <path d="M13 8 H3 M7 4 L3 8 L7 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
      : <path d="M4 12 L12 4 M5.5 4 H12 V10.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />}
  </svg>
);

/** Mark (40px) + name. design.md §3 "Lockup". */
export const Lockup = () => (
  <Link className="lockup" to="/">
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><path d={MARK} fill="none" strokeWidth="2.2" strokeLinejoin="round" /></svg>
    João Fatoretto
  </Link>
);

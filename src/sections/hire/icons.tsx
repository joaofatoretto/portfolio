/* Small stroke icons for the hire page. */
export const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12.5" cy="11" r="8" /><path d="M7 17.2 4 21l4.6-1.4" />
  </svg>
);

export const Tick = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M2 7.5l3.2 3.2L12 3.5" /></svg>
);

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { useInView } from '../lib/reveal';
import { SplitFilter, TL, useTV } from '../lib/tv';

type Props = {
  children: ReactNode;
  className?: string;
  /** tune in this many ms after the page loads, instead of when it scrolls into view */
  onLoad?: number;
  threshold?: number;
  /** a quick channel flick each time this changes (one screen showing several things in turn) */
  channel?: unknown;
};

/** Any content shown as a TV: off until it arrives (or the page loads), then it tunes in. Screen.tsx is the image version. */
export function TVFrame({ children, className = '', onLoad, threshold = 0.4, channel }: Props) {
  const fid = useId();
  const rootRef = useRef<HTMLDivElement>(null), canvasRef = useRef<HTMLCanvasElement>(null), layerRef = useRef<HTMLDivElement>(null);
  const tv = useTV(rootRef, canvasRef, layerRef, fid, { startOff: true });
  useEffect(() => {
    if (onLoad === undefined) return;
    const t = setTimeout(() => tv.current.play(TL.tune), onLoad);
    return () => clearTimeout(t);
  }, []);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (tv.current.tuned) tv.current.play(TL.flick);
  }, [channel]);
  useInView(rootRef, () => { if (onLoad === undefined) tv.current.play(TL.tune); }, threshold);
  return (
    <div className={`screen stage ${className}`} ref={rootRef}>
      <SplitFilter id={fid} />
      <div className="screen-layer" ref={layerRef}>{children}</div>
      <canvas className="static" ref={canvasRef} aria-hidden="true" />
      <div className="scan" aria-hidden="true" />
      <div className="vig" aria-hidden="true" />
    </div>
  );
}

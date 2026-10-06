import { useId, useRef, type RefObject } from 'react';
import { useInView } from '../lib/reveal';
import { SplitFilter, TL, useTV, type TVApi } from '../lib/tv';
import type { Image } from '../content/cases/types';
import { TestCard } from './TestCard';

type Props = {
  image?: Image;
  /** shown in the corner while tuning and on hover, e.g. "CH 02·1" */
  channel: string;
  /** used by the test card when there is no image yet */
  client: string;
  n: number;
  className?: string;
  apiOut?: RefObject<TVApi | null>;
  eager?: boolean;
  /** how much must be visible before it tunes in (covers above the fold use a small value) */
  threshold?: number;
};

/** A picture that behaves like a TV: static until it arrives, then it tunes in. */
export function Screen({ image, channel, client, n, className = '', apiOut, eager, threshold = 0.4 }: Props) {
  const fid = useId();
  const rootRef = useRef<HTMLDivElement>(null), canvasRef = useRef<HTMLCanvasElement>(null), layerRef = useRef<HTMLDivElement>(null);
  const tv = useTV(rootRef, canvasRef, layerRef, fid, { startOff: true });
  if (apiOut) apiOut.current = tv.current;
  useInView(rootRef, () => tv.current.play(TL.tune), threshold);
  return (
    <div className={`screen stage ${className}`} ref={rootRef} style={image ? { aspectRatio: `${image.w} / ${image.h}` } : undefined}>
      <SplitFilter id={fid} />
      <div className="screen-layer" ref={layerRef}>
        {image
          ? <img src={image.src} width={image.w} height={image.h} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" />
          : <TestCard client={client} n={n} />}
      </div>
      <canvas className="static" ref={canvasRef} aria-hidden="true" />
      <div className="scan" aria-hidden="true" />
      <div className="vig" aria-hidden="true" />
      <span className="osd screen-ch" aria-hidden="true">{channel}</span>
    </div>
  );
}

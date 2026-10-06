import { useId, useRef, useState } from 'react';
import { SplitFilter, TL, useTV } from '../lib/tv';

/** A Figma prototype behind a TV that's off until you tune in. Nothing third-party loads before the click. */
export function PrototypeEmbed({ src, label }: { src: string; label: string }) {
  const fid = useId();
  const [on, setOn] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null), canvasRef = useRef<HTMLCanvasElement>(null), layerRef = useRef<HTMLDivElement>(null);
  const tv = useTV(rootRef, canvasRef, layerRef, fid);
  const tuneIn = () => { setOn(true); tv.current.play(TL.tune); };
  const mobile = /mobile/i.test(label) || /node-id=113-847/.test(src);
  return (
    <figure className={`embed${mobile ? ' embed-tall' : ''}`}>
      <div className="embed-screen stage" ref={rootRef}>
        <SplitFilter id={fid} />
        <div className="screen-layer" ref={layerRef}>
          {on
            ? <iframe src={src} title={`${label} (Figma)`} allowFullScreen loading="lazy" />
            : (
              <div className="embed-off">
                <span className="osd embed-osd">NO SIGNAL</span>
                <button type="button" className="btn ghost" onClick={tuneIn}>Tune in to the prototype</button>
                <span className="caption">Loads an interactive Figma prototype</span>
              </div>
            )}
        </div>
        <canvas className="static" ref={canvasRef} aria-hidden="true" />
      </div>
      <figcaption className="caption">{label}</figcaption>
    </figure>
  );
}

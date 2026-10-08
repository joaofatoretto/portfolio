import { useId, useRef, useState } from 'react';
import { fmt, useCopy } from '../i18n/copy';
import { SplitFilter, TL, useTV } from '../lib/tv';

/** A Figma prototype behind a TV that's off until you tune in. Nothing third-party loads before the click.
 *  `tall` frames a phone prototype; it comes from the case block's data, since the label is translated. */
export function PrototypeEmbed({ src, label, tall = false }: { src: string; label: string; tall?: boolean }) {
  const fid = useId();
  const { ui } = useCopy();
  const [on, setOn] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null), canvasRef = useRef<HTMLCanvasElement>(null), layerRef = useRef<HTMLDivElement>(null);
  const tv = useTV(rootRef, canvasRef, layerRef, fid);
  const tuneIn = () => { setOn(true); tv.current.play(TL.tune); };
  return (
    <figure className={`embed${tall ? ' embed-tall' : ''}`}>
      <div className="embed-screen stage" ref={rootRef}>
        <SplitFilter id={fid} />
        <div className="screen-layer" ref={layerRef}>
          {on
            ? <iframe src={src} title={fmt(ui.embed.title, { label })} allowFullScreen loading="lazy" />
            : (
              <div className="embed-off">
                <span className="osd embed-osd">{ui.tv.noSignal}</span>
                <button type="button" className="btn ghost" onClick={tuneIn}>{ui.embed.tune}</button>
                <span className="caption">{ui.embed.loads}</span>
              </div>
            )}
        </div>
        <canvas className="static" ref={canvasRef} aria-hidden="true" />
      </div>
      <figcaption className="caption">{label}</figcaption>
    </figure>
  );
}

import { useEffect, useRef, type CSSProperties } from 'react';
import { useCopy } from '../../i18n/copy';
import { useScrollProgress } from '../../lib/scroll';

/* One drawing per stop. Parts with class "d" draw themselves (pathLength 1), "p" pop in, "f" fill in, in that order. */
const TalkArt = () => (
  <svg viewBox="0 0 220 200" fill="none" aria-hidden="true">
    <g className="p" style={{ '--k': 0 } as CSSProperties}><path d="M20 30h120a10 10 0 0 1 10 10v40a10 10 0 0 1-10 10H50l-20 18V90H20a10 10 0 0 1-10-10V40a10 10 0 0 1 10-10z" className="st-mid" /></g>
    <path className="d st-dim w5" style={{ '--k': 1 } as CSSProperties} d="M36 52h70M36 68h96" pathLength={1} />
    <g className="p" style={{ '--k': 2 } as CSSProperties}><path d="M200 100H80a10 10 0 0 0-10 10v40a10 10 0 0 0 10 10h90l20 18v-18h10a10 10 0 0 0 10-10v-40a10 10 0 0 0-10-10z" className="st-hi fill-bg" /></g>
    <path className="d st-hi w5" style={{ '--k': 3 } as CSSProperties} d="M88 122h96M88 138h60" pathLength={1} />
  </svg>
);

const SketchArt = () => (
  <svg viewBox="0 0 220 240" fill="none" aria-hidden="true">
    <rect className="d st-mid dash" x="60" y="14" width="100" height="200" rx="16" pathLength={1} style={{ '--k': 0 } as CSSProperties} />
    <path className="d st-mid" d="M74 40h46M74 54h72v50H74zM74 118h72M74 130h50M74 148h72v22H74zM74 184h30M114 184h32" pathLength={1} style={{ '--k': 1 } as CSSProperties} />
    <path className="d st-dim thin" d="M74 54l72 50M146 54l-72 50" pathLength={1} style={{ '--k': 2 } as CSSProperties} />
    <g className="pencil"><path d="M176 196l26-60 8 4-26 60-10 6z" className="st-hi" /></g>
  </svg>
);

const DesignArt = () => (
  <svg viewBox="0 0 220 240" fill="none" aria-hidden="true">
    <rect x="60" y="14" width="100" height="200" rx="16" className="st-hi fill-bg w2" />
    <path className="f st-hi w3 round" d="M74 40h40" style={{ '--k': 0 } as CSSProperties} />
    <g className="f" style={{ '--k': 1 } as CSSProperties}><rect x="74" y="54" width="72" height="50" className="fill-3" /><circle cx="94" cy="72" r="8" className="fill-5" /><path d="M74 104l22-18 16 12 14-10 20 16z" className="fill-4" /></g>
    <path className="f st-hi w6 round" d="M74 120h72" style={{ '--k': 2 } as CSSProperties} />
    <path className="f st-mid w3 round" d="M74 134h50" style={{ '--k': 2 } as CSSProperties} />
    <rect className="f fill-hi" x="74" y="148" width="72" height="22" style={{ '--k': 3 } as CSSProperties} />
    <g className="f" style={{ '--k': 3 } as CSSProperties}><rect x="30" y="60" width="16" height="16" className="fill-paper" /><rect x="30" y="82" width="16" height="16" className="fill-6" /><rect x="30" y="104" width="16" height="16" className="fill-4" /></g>
  </svg>
);

const ShipArt = () => (
  <svg viewBox="0 0 240 200" fill="none" aria-hidden="true">
    <rect x="10" y="20" width="220" height="150" rx="6" className="st-hi fill-bg w2" />
    <path d="M10 44h220" className="st-line" />
    <circle cx="24" cy="32" r="3" className="fill-4" /><circle cx="36" cy="32" r="3" className="fill-4" /><circle cx="48" cy="32" r="3" className="fill-4" />
    <rect x="64" y="26" width="120" height="12" rx="6" className="fill-2" />
    <text x="74" y="35" className="url">sweetcrumb.com</text>
    {['M26 62h40', 'M26 76h60', 'M38 90h44', 'M38 104h30', 'M26 118h52'].map((d, i) => (
      <path key={d} className="d st-dim w4 round" d={d} pathLength={1} style={{ '--k': i * 0.5 } as CSSProperties} />
    ))}
    <g className="f" style={{ '--k': 3 } as CSSProperties}><rect x="110" y="58" width="104" height="96" className="fill-2" /><path d="M122 76h60" className="st-hi w5 round" /><rect x="122" y="124" width="48" height="16" className="fill-hi" /></g>
    <g className="p tick" style={{ '--k': 4 } as CSSProperties}><circle cx="206" cy="166" r="20" className="fill-hi" /><path d="M196 166l7 7 13-14" className="st-bg w3" /></g>
  </svg>
);

const ART = [TalkArt, SketchArt, DesignArt, ShipArt];
const STOPS = ART.length;
/* The path, in px, for a section `w` wide and STOPS × ROW tall; nodes sit at 36% and 64% of the width.
   The prerendered HTML uses the widest layout; the browser redraws it for the real width. */
const ROW = 380, TOP = 40, H = TOP + STOPS * ROW + 80, WIDE = 1392;
const Y = (i: number) => TOP + ROW * i + ROW / 2;
const pathD = (w: number) => {
  const X = (i: number) => w * (i % 2 ? 0.64 : 0.36), mid = w / 2;
  let d = `M${mid} 0 C ${mid} ${TOP + 60}, ${X(0)} ${Y(0) - 120}, ${X(0)} ${Y(0)}`;
  for (let i = 1; i < STOPS; i++) d += ` C ${X(i - 1)} ${Y(i - 1) + ROW / 2}, ${X(i)} ${Y(i) - ROW / 2}, ${X(i)} ${Y(i)}`;
  return d + ` C ${X(STOPS - 1)} ${H - 120}, ${mid} ${H - 100}, ${mid} ${H - 20}`;
};

/** "Not sure what you need? That's my job.": one path winds down through four stops and draws itself as you scroll. */
export function PathSection() {
  const PATH = useCopy().hire.path;
  const ref = useRef<HTMLDivElement>(null), svgRef = useRef<SVGSVGElement>(null), drawRef = useRef<SVGPathElement>(null), stopsRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = ref.current!, svg = svgRef.current!;
    const fit = () => {
      const w = el.clientWidth;
      if (!w) return;
      svg.setAttribute('viewBox', `0 0 ${w} ${H}`);
      svg.querySelectorAll('path').forEach(p => p.setAttribute('d', pathD(w)));
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useScrollProgress(ref, p => {
    drawRef.current!.style.strokeDashoffset = String(1 - p);
    ref.current!.style.setProperty('--p', p.toFixed(4));
    stopsRef.current!.querySelectorAll<HTMLElement>('.stop').forEach((li, i) => li.classList.toggle('lit', p * H >= Y(i) - 30));
    ref.current!.classList.toggle('done', p > 0.97);
  });
  return (
    <section className="section path-sec" aria-labelledby="path-h">
      <h2 className="h-1 path-title" id="path-h" tabIndex={-1}>{PATH.title}</h2>
      <div className="path" ref={ref} style={{ '--h': `${H}px` } as CSSProperties}>
        <svg className="path-svg" ref={svgRef} viewBox={`0 0 ${WIDE} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <path className="path-track" d={pathD(WIDE)} />
          <path className="path-draw" d={pathD(WIDE)} ref={drawRef} pathLength={1} />
        </svg>
        <i className="path-rail" aria-hidden="true"><b /></i>
        <ol className="stops" ref={stopsRef}>
          {PATH.steps.map((s, i) => {
            const Art = ART[i];
            return (
              <li className={`stop ${i % 2 ? 'right' : 'left'}`} key={s} style={{ '--y': `${Y(i)}px` } as CSSProperties}>
                <span className="node" aria-hidden="true" />
                <div className="art"><Art /></div>
                <div className="stop-label"><span className="caption">0{i + 1}</span><span className="stop-name">{s}</span></div>
              </li>
            );
          })}
        </ol>
        <p className="path-end"><span className="node" aria-hidden="true" />{PATH.end}</p>
      </div>
    </section>
  );
}

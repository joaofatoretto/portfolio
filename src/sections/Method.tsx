import { useEffect, useLayoutEffect, useRef } from 'react';
import { fmt, useCopy } from '../i18n/copy';
import { MOTION, animate, easeOut, ss } from '../lib/motion';
import { R, useInView } from '../lib/reveal';
import { chord, fbm, makeNoise } from '../lib/signal';
import { SectionHead } from '../components/SectionHead';

/* Each step's fibres converge a little more: noise, then signal. */
const W = 280, H = 88;
const MIX: ((u: number) => number)[] = [() => 0, u => 0.6 * ss(0.3, 1, u), u => ss(0.05, 0.6, u), () => 1];
const DATA = MIX.map(mix => {
  const xs: number[] = []; for (let x = 0; x <= W; x += 2) xs.push(x);
  return {
    xs,
    chord: xs.map(x => chord(x, 70, 15)),
    mix: xs.map(x => mix(x / W)),
    fibres: Array.from({ length: 12 }, (_, i) => { const n = makeNoise(600 + i); return xs.map(x => 32 * Math.tanh((34 * 1.6 * fbm(n, x * 0.03 + i * 7)) / 32)); }),
  };
});
type StepData = (typeof DATA)[number];
const stepPath = (d: StepData, f: number, k: number) => {
  let s = '';
  for (let j = 0; j < d.xs.length; j++) { const m = d.mix[j] * k; s += (j ? 'L' : 'M') + d.xs[j] + ' ' + (H / 2 + (1 - m) * d.fibres[f][j] + m * d.chord[j]).toFixed(1); }
  return s;
};

function StepGraphic({ i }: { i: number }) {
  const d = DATA[i];
  const wrapRef = useRef<HTMLDivElement>(null), svgRef = useRef<SVGSVGElement>(null), mainRef = useRef<SVGPathElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const cancel = useRef<() => void>(() => {});
  useEffect(() => () => cancel.current(), []);
  const set = (k: number) => {
    if (!svgRef.current) return;
    pathRefs.current.forEach((p, f) => p?.setAttribute('d', stepPath(d, f, k)));
    if (mainRef.current) mainRef.current.style.opacity = Math.pow(k, 4).toFixed(3);
    svgRef.current!.style.clipPath = `inset(-20% ${((1 - Math.min(1, k * 1.6)) * 100).toFixed(1)}% -20% 0)`;
  };
  useLayoutEffect(() => set(MOTION ? 0 : 1), []);
  // observe the wrapper: the clipped svg itself never counts as visible
  useInView(wrapRef, () => { if (MOTION) cancel.current = animate(1700, t => set(easeOut(t)), 160 + i * 140); }, 0.6);
  return (
    <div ref={wrapRef}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {d.fibres.map((_, f) => <path key={f} ref={el => { pathRefs.current[f] = el; }} fill="none" strokeOpacity={i === 3 ? 0.22 : 0.35} strokeWidth="0.8" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--fg-primary)' }} />)}
        {i === 3 && <path ref={mainRef} d={stepPath(d, 0, 1)} fill="none" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" style={{ stroke: 'var(--fg-primary)' }} />}
      </svg>
    </div>
  );
}

export function Method() {
  const { profile } = useCopy(), t = profile.home.method;
  return (
    <section className="section" id="process" aria-labelledby="process-h">
      <SectionHead label={t.label} id="process-h" title={t.title} lede={t.lede} />
      <div className="steps-wrap">
        <R kind="line" className="rule strong" />
        <ol className="steps">
          {profile.steps.map((s, i) => (
            <R as="li" className="step" key={s.name} d={i * 110}>
              <span className="label">{fmt(t.step, { n: i + 1 })}</span>
              <StepGraphic i={i} />
              <h3 className="h-3">{s.name}</h3>
              <p>{s.text}</p>
            </R>
          ))}
        </ol>
      </div>
    </section>
  );
}

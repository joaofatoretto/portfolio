/* Lab variant 2 of the /hire hero: "Napkin to app". One phone in 3D whose layers come apart (sketch, research,
   wireframe, design, the shipped device) and go back together, then fan out with other finished screens.
   CSS variables on the root carry the whole state (css 3D does the drawing); one rAF loop, only while the hero is on
   screen, turns scroll + pointer into those variables and places the leader lines from the layers' real projected
   corners. Without motion the CSS defaults show the exploded still. */
import { useEffect, useRef, type CSSProperties } from 'react';
import { useCopy } from '../../../i18n/copy';
import { MOTION, FINE_POINTER, clamp01, lerp, ss } from '../../../lib/motion';
import { makeStatic, TL } from '../../../lib/tv';
import './hero.css';

const SOPHIA = '/cases/sophia-mental-health/';
type Box = [number, number, number, number];
const v = (o: Record<string, string | number>) => o as CSSProperties;

/** A crop of a case image, scaled to fill its box exactly (the crop box has the box's proportions). */
function Crop({ src, nat, box, alt, className }: { src: string; nat: [number, number]; box: Box; alt: string; className?: string }) {
  const [nw] = nat, [bx, by, bw, bh] = box;
  return (
    <span className={`hv2-crop${className ? ' ' + className : ''}`}>
      <img src={src} alt={alt} draggable={false} decoding="async"
        style={{ width: `${(nw / bw) * 100}%`, left: `${(-bx / bw) * 100}%`, top: `${(-by / bh) * 100}%` }} />
    </span>
  );
}

/** The device's metal edge is a stack of thin rounded rings: real thickness, rounded corners and all. */
const T = 10;
const RINGS = Array.from({ length: T + 1 }, (_, k) => k);
function rim(k: number): CSSProperties {
  const f = (k === 0 ? 1.3 : 1.02) - 0.6 * (k / T);
  const c = (r: number, g: number, b: number) => `rgb(${Math.min(255, r * f) | 0} ${Math.min(255, g * f) | 0} ${Math.min(255, b * f) | 0})`;
  return v({ '--hv2-k': k, borderColor: [c(204, 209, 220), c(128, 134, 146), c(58, 60, 67), c(158, 164, 176)].join(' ') });
}

/** A glass phone: metal edge, black bezel, the screen as `children` (a flat plane just behind the glass). */
function Device({ className, anchor, children }: { className?: string; anchor?: boolean; children?: React.ReactNode }) {
  return (
    <div className={`hv2-dev${className ? ' ' + className : ''}`}>
      <i className="hv2-dshadow" />
      <i className="hv2-sbtn hv2-sbtn-a" /><i className="hv2-sbtn hv2-sbtn-b" /><i className="hv2-sbtn hv2-sbtn-c" />
      {RINGS.map(k => <i key={k} className="hv2-ring" style={rim(k)} />)}
      {children}
      <i className="hv2-bezel" />
      <span className="hv2-glass"><i className="hv2-sheen" /><i className="hv2-island" /></span>
      {anchor && <i className="hv2-anchor" data-a />}
    </div>
  );
}

const LABELS = ['Sketch', 'Research', 'Wireframe', 'Design', 'Shipped'];

export default function Hero() {
  const { ui, hire } = useCopy();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const scene = root.querySelector<HTMLElement>('.hv2-scene')!;
    const anchors = Array.from(root.querySelectorAll<HTMLElement>('[data-a]'));
    const groups = root.querySelectorAll<SVGGElement>('.hv2-pin');
    const lines = root.querySelectorAll<SVGLineElement>('.hv2-pin line');
    const labs = root.querySelectorAll<HTMLElement>('.hv2-lab');
    const snow = root.querySelector<HTMLCanvasElement>('.hv2-snow')!;
    const ctx = snow.getContext('2d')!;
    const draw = makeStatic();
    const set = (k: string, val: string | number) => root.style.setProperty(k, String(val));

    let compact = false, fit = 1, fitCol = 1, fitEnd = 1, W = 0, H = 0, gapPx = 130;
    const measure = () => {
      const r = scene.getBoundingClientRect();
      W = r.width; H = r.height;
      compact = window.matchMedia('(max-width: 640px)').matches;
      gapPx = parseFloat(getComputedStyle(root).getPropertyValue('--hv2-gap')) || 130;
      fit = compact ? Math.min((W - 150) / 380, H / 730) : Math.min((W - 130) / 880, H / 960);
      fitCol = compact ? Math.min((W - 60) / 330, H / 770) : fit * 1.08;
      fitEnd = compact ? Math.min((W - 24) / 500, H / 760) : fit * 0.9;
      set('--hv2-fit', fit.toFixed(4));
    };

    // camera poses: [rotateY, rotateX, rotateZ]
    const cam0 = [-26, 12, 5], cam2 = [7, 8, -2];
    const camExploded = () => (compact ? [0, 64, -7] : [0, 58, -35]);
    const mix = (a: number[], b: number[], t: number) => a.map((x, i) => lerp(x, b[i], t));

    const state = { p: 0, nx: 0, ny: 0, tx: 0, ty: 0, intro: MOTION ? 0 : 1 };
    let content = MOTION ? 0 : 1, snowOn = MOTION ? 1 : 0, snowT = -1;
    let alive = true, onScreen = true, raf = 0, last = 0;

    const apply = (p: number, now: number) => {
      const a = ss(0.04, 0.42, p), b = ss(0.58, 0.84, p), orbit = ss(0.34, 0.62, p);
      const e = ss(0.06, 0.4, p) * (1 - ss(0.6, 0.8, p));
      const pose = mix(cam0, camExploded(), a); pose[2] += (compact ? -3 : -9) * orbit;
      const cam = mix(pose, cam2, b);
      const intro = state.intro, rise = 1 - intro;
      const sc = lerp(lerp(fitCol, fit, a), fitEnd, b);
      const bob = MOTION ? Math.sin(now / 1500) * 2 : 0;
      set('--hv2-e', e.toFixed(4));
      set('--hv2-ry', (cam[0] - rise * 32).toFixed(2) + 'deg');
      set('--hv2-rx', (cam[1] + rise * 8).toFixed(2) + 'deg');
      set('--hv2-rz', cam[2].toFixed(2) + 'deg');
      set('--hv2-tx', state.tx.toFixed(2) + 'deg');
      set('--hv2-ty', state.ty.toFixed(2) + 'deg');
      set('--hv2-scale', sc.toFixed(4));
      set('--hv2-shift', ((compact ? -34 : -50) * e).toFixed(1) + 'px');
      set('--hv2-lift', (bob + e * fit * gapPx * (compact ? 1.55 : 1.5) + rise * 40 * (1 - ss(0, 1, p * 8))).toFixed(2) + 'px');
      set('--hv2-ghost', (ss(0.07, 0.18, p) * (1 - ss(0.7, 0.8, p))).toFixed(3));
      set('--hv2-fan', ss(0.74, 0.93, p).toFixed(4));
      set('--hv2-fanvis', p > 0.7 ? 'visible' : 'hidden');
      set('--hv2-lit', (ss(0.7, 0.92, p) * 0.9 + 0.1 * (1 - ss(0, 0.1, p))).toFixed(3));
      set('--hv2-hl', (lerp(-90, 330, p) + state.nx * 120).toFixed(1));
      set('--hv2-px', (state.nx * 90).toFixed(1));
      set('--hv2-py', (state.ny * 120).toFixed(1));
      set('--hv2-content', content.toFixed(3));
      set('--hv2-snow', snowOn.toFixed(3));
      set('--hv2-cap1', (1 - ss(0.62, 0.74, p)).toFixed(3));
      set('--hv2-cap2', ss(0.82, 0.94, p).toFixed(3));
      place(p);
    };

    /* leader lines: from each layer's bottom-right corner (measured from the real projected anchor) to a label column */
    const place = (p: number) => {
      const sr = scene.getBoundingClientRect();
      const pts = anchors.map(el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2 - sr.left, r.top + r.height / 2 - sr.top]; });
      const edge = Math.max(...pts.map(q => q[0])) + (compact ? 18 : 40);
      const lx = Math.max(Math.min(edge, W - (compact ? 80 : 112)), Math.max(...pts.map(q => q[0])) + 22);
      pts.forEach(([x, y], i) => {
        const on = MOTION ? ss(0.3 + i * 0.03, 0.4 + i * 0.03, p) * (1 - ss(0.58, 0.64, p)) : 1;
        groups[i].style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        lines[i].setAttribute('x2', Math.max(0, lx - x).toFixed(1));
        groups[i].style.opacity = on.toFixed(3);
        labs[i].style.transform = `translate(${(lx + 10).toFixed(1)}px, ${(y - 10).toFixed(1)}px)`;
        labs[i].style.opacity = on.toFixed(3);
      });
    };

    const progress = () => {
      const r = root.getBoundingClientRect();
      return clamp01(-r.top / Math.max(1, r.height - window.innerHeight));
    };

    const frame = (now: number) => {
      raf = 0;
      if (!alive) return;
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      if (MOTION) state.intro = 1 - Math.pow(1 - clamp01((now - t0) / 1500), 3);
      state.p += (progress() - state.p) * (1 - Math.exp(-dt * 8));
      state.tx += ((FINE_POINTER ? -state.ny * 6 : 0) - state.tx) * (1 - Math.exp(-dt * 6));
      state.ty += ((FINE_POINTER ? state.nx * 8 : 0) - state.ty) * (1 - Math.exp(-dt * 6));
      if (snowT >= 0) {
        const t = now - snowT;
        if (t >= 0) {
          const s = TL.tune.at(Math.min(t, TL.tune.dur));
          content = s.content; snowOn = s.stat;
          if (t < TL.tune.dur) draw(ctx, snow.width, snow.height, { stretch: s.stretch, band: s.band }, t);
          else { content = 1; snowOn = 0; snowT = -1; }
        }
      }
      apply(state.p, now);
      if (onScreen) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && alive && MOTION) { last = 0; raf = requestAnimationFrame(frame); } };

    const onPointer = (ev: PointerEvent) => {
      if (ev.pointerType !== 'mouse') return;
      const r = scene.getBoundingClientRect();
      state.nx = Math.max(-1, Math.min(1, ((ev.clientX - r.left) / r.width - 0.5) * 2));
      state.ny = Math.max(-1, Math.min(1, ((ev.clientY - r.top) / r.height - 0.5) * 2));
    };
    const onResize = () => { measure(); if (!MOTION) apply(0.5, 0); else apply(state.p, performance.now()); };

    measure();
    const t0 = performance.now() + 150;
    if (MOTION) {
      state.p = progress();
      snowT = performance.now() + 250;
      apply(state.p, performance.now());
      kick();
      if (FINE_POINTER) window.addEventListener('pointermove', onPointer, { passive: true });
    } else {
      apply(0.5, 0);
    }
    const io = new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; if (onScreen) kick(); });
    io.observe(root);
    window.addEventListener('resize', onResize);
    return () => {
      alive = false; cancelAnimationFrame(raf); io.disconnect();
      window.removeEventListener('resize', onResize); window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  const HERO = hire.hero;
  return (
    <section className="hv2" ref={rootRef}>
      <div className="hv2-stage">
        <div className="hv2-text">
          <p className="eyebrow hv2-eyebrow">{ui.eyebrow}</p>
          <h1 className="hv2-title" data-focus tabIndex={-1}>{HERO.title}</h1>
          <p className="body-l hv2-lede">{HERO.lede}</p>
          <div className="ctas">
            <a className="btn primary" href="#contact">{HERO.cta}&nbsp;&nbsp;→</a>
          </div>
        </div>

        <div className="hv2-scene" role="group" aria-label="Sophia, a mental health app, as an exploded view: a paper sketch, research notes, a wireframe and the final design, under a glass phone">
          <div className="hv2-world">
            <div className="hv2-obj">
              <i className="hv2-floor" />
              <i className="hv2-fshadow" />
              <i className="hv2-glow" />
              {[[-1, 'a'], [1, 'b']].map(([dir, k]) => (
                <div key={k} className={`hv2-fancard hv2-fan-${k}`} style={v({ '--hv2-dir': dir })}>
                  <Device>
                    {k === 'a'
                      ? <span className="hv2-screen"><Crop src="/cases/benefits-card-app/01.png" nat={[1546, 809]} box={[343, 105, 325, 704]} alt="Foodpass app: card and basket balances on the home screen" /></span>
                      : <span className="hv2-screen"><Crop src="/cases/photo-editing/12.png" nat={[2048, 1738]} box={[566, 646, 164, 355]} alt="Casar.com wedding site on a phone: a couple on a beach and the countdown" /></span>}
                  </Device>
                </div>
              ))}

              {['a', 'b', 'c', 'd'].map(k => <i key={k} className={`hv2-vline hv2-vline-${k}`} />)}

              <div className="hv2-layer hv2-sheet" style={v({ '--hv2-i': 0 })}>
                <Crop src={`${SOPHIA}17.jpg`} nat={[1279, 892]} box={[310, 22, 316, 430]} alt="Pencil sketch of Sophia’s home screen: moments, the next appointment, tasks and achievements" />
                <i className="hv2-anchor" data-a />
              </div>
              <div className="hv2-layer hv2-notes" style={v({ '--hv2-i': 1 })}>
                <Crop src={`${SOPHIA}11.jpg`} nat={[2000, 1722]} box={[578, 0, 844, 1722]} alt="Research sticky notes: the questions the team wanted to answer, grouped by priority" />
                <i className="hv2-anchor" data-a />
              </div>
              <div className="hv2-layer hv2-wire" style={v({ '--hv2-i': 2 })}>
                <Crop src={`${SOPHIA}25.png`} nat={[1080, 1144]} box={[57, 125, 440, 895]} alt="Grey wireframe of the home screen on a phone outline" />
                <i className="hv2-anchor" data-a />
              </div>
              <div className="hv2-layer hv2-design" style={v({ '--hv2-i': 3 })}>
                <Crop className="hv2-ui" src={`${SOPHIA}25.png`} nat={[1080, 1144]} box={[618, 172, 373, 805]} alt="Sophia’s final home screen: next appointment, mood check-in, tasks and the bottom tab bar" />
                <canvas className="hv2-snow" width={74} height={160} aria-hidden="true" />
                <i className="hv2-anchor" data-a />
              </div>
              <Device className="hv2-main" anchor />
            </div>
          </div>

          <svg className="hv2-lines" aria-hidden="true">
            {LABELS.map(n => (
              <g key={n} className="hv2-pin"><line x1="0" y1="0" x2="0" y2="0" /><circle r="7" className="hv2-ring-dot" /><circle r="2.6" /></g>
            ))}
          </svg>
          {LABELS.map((n, i) => <span key={n} className="hv2-lab"><b>{String(i + 1).padStart(2, '0')}</b>{n}</span>)}
          <p className="hv2-cap hv2-cap1">Sophia · study project</p>
          <p className="hv2-cap hv2-cap2">Foodpass · Casar.com · and many more like this</p>
        </div>
      </div>
    </section>
  );
}

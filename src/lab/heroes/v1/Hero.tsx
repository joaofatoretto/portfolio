/* Lab variant 1 of the /hire hero: the channel corridor.
   A pinned track holds a sticky stage; the stage is a CSS 3D scene (a tunnel of grid sections with João's work hung
   on its walls). Scrolling flies the camera down it; each screen tunes in once, the first time it comes within range.
   The last screen, Tempo's cover, ends up filling the view like a TV. No state per frame: one loop writes transforms. */
import { useEffect, useRef, type CSSProperties } from 'react';
import { useCopy } from '../../../i18n/copy';
import { MOTION, FINE_POINTER, clamp01, lerp, ss, easeOut } from '../../../lib/motion';
import { makeStatic } from '../../../lib/tv';
import { FINAL, SCREENS, SECTION, SECTIONS, TRAVEL, type Screen } from './screens';
import './hero.css';

const RANGE = 3300;     // a screen tunes in once it is this close (px of depth)
const INTRO_MS = 2200;
const INTRO_DOLLY = 1100;

const crop = (s: { size: [number, number]; crop?: [number, number, number, number] }) => {
  const [W, H] = s.size, [cx, cy, cw, ch] = s.crop ?? [0, 0, W, H];
  return { ar: cw / ch, w: cw / W, h: ch / H, x: cx / W, y: cy / H };
};

function Pic({ s }: { s: Screen }) {
  const c = crop(s);
  const style = { width: `${100 / c.w}%`, left: `${-(c.x / c.w) * 100}%`, top: `${-(c.y / c.h) * 100}%` };
  return <img className="hv1-img" src={s.src} alt={s.alt} style={style} decoding="async" draggable={false} />;
}

const at = (s: Screen): CSSProperties => ({
  '--hv1-z': `${s.z}px`, '--hv1-pz': `${s.pz ?? s.z}px`,
  transform: `translate3d(calc(var(--hv1-ux) * ${s.x}px), calc(var(--hv1-uy) * ${s.y}px), var(--hv1-sz)) rotateY(${s.ry}deg) rotateX(${s.rx}deg)`,
} as CSSProperties);
const plane = (s: Screen): CSSProperties => ({ width: `calc(var(--hv1-u) * ${s.w}px)`, aspectRatio: String(crop(s).ar) });

export default function Hero() {
  const { hire } = useCopy();
  const H = hire.hero;
  const trackRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!MOTION) return;
    const track = trackRef.current!, cam = camRef.current!, world = worldRef.current!;
    const text = textRef.current!, glow = glowRef.current!, cue = cueRef.current!;
    const root = track.parentElement!;

    // every element that depends on depth, with its z (near edge for tunnel sections)
    type Item = { el: HTMLElement; z: number; kind: 'screen' | 'sec'; on: boolean; i: number; draw?: () => void; op?: string; vis?: string };
    const items: Item[] = [];
    const phone = window.matchMedia('(max-width: 640px)');
    world.querySelectorAll<HTMLElement>('[data-z]').forEach((el, i) => {
      items.push({ el, z: Number(phone.matches && el.dataset.pz ? el.dataset.pz : el.dataset.z), kind: el.dataset.kind === 'sec' ? 'sec' : 'screen', on: false, i });
    });

    // static for the "off" glass and for the tune-in burst
    const draw = makeStatic();
    const noiseOf = (el: HTMLElement) => el.querySelector<HTMLCanvasElement>('.hv1-noise');
    items.forEach(it => {
      const cv = noiseOf(it.el); if (!cv) return;
      const ctx = cv.getContext('2d'); if (!ctx) return;
      it.draw = () => draw(ctx, cv.width, cv.height, { stretch: 2 + Math.random() * 4, band: Math.random() < 0.5 }, Math.random() * 900);
      it.draw();
    });

    const tuneIn = (it: Item, delay: number) => {
      it.on = true;
      window.setTimeout(() => {
        it.el.classList.add('hv1-burst');
        let n = 0; const flick = window.setInterval(() => { it.draw?.(); if (++n > 4) window.clearInterval(flick); }, 70);
        window.setTimeout(() => { it.el.dataset.on = '1'; it.el.classList.remove('hv1-burst'); }, 430);
      }, delay);
    };

    // state
    let target = 0, cur = 0, yawT = 0, pitchT = 0, yaw = 0, pitch = 0, raf = 0, visible = true, run = false;
    const introStart = performance.now() + 150;
    let introDone = window.scrollY > window.innerHeight * 0.5; // arrived mid-page: no intro
    const fly = (p: number) => 1 - Math.pow(1 - p, 1.3);       // quick start, long settle into the last screen

    const measure = () => {
      const r = track.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      target = clamp01(-r.top / span);
    };

    const paint = (o: Item, el: HTMLElement, op: number, near: number) => {
      const a = op.toFixed(3), v = near <= 0 ? 'hidden' : 'visible';
      if (o.op !== a) { el.style.opacity = a; o.op = a; }
      if (o.vis !== v) { el.style.visibility = v; o.vis = v; }
    };

    const apply = (now: number) => {
      const it = introDone ? 1 : easeOut(clamp01((now - introStart) / INTRO_MS));
      const camZ = TRAVEL * fly(cur) - INTRO_DOLLY * (1 - it);
      world.style.transform = `translate3d(0,0,${camZ.toFixed(1)}px)`;
      cam.style.transform = `rotateX(${pitch.toFixed(3)}deg) rotateY(${yaw.toFixed(3)}deg)`;
      let n = 0;
      for (const o of items) {
        const tz = o.z + camZ;
        const dist = -tz;
        const tgt = o.kind === 'screen' ? (o.el.firstElementChild as HTMLElement) : o.el;
        if (o.kind === 'screen') {
          const fog = dist > 0 ? lerp(1, o.el.classList.contains('hv1-final') ? 0.55 : 0.28, clamp01(dist / 6200)) : 1;
          const near = tz > 300 ? clamp01(1 - (tz - 300) / 520) : 1;
          const op = fog * near;
          paint(o, tgt, op, near);
          if (!o.on && dist < RANGE && dist > -200) tuneIn(o, 80 + (n++) * 170);
        } else {
          const nearEdge = tz; // z passed in is the near edge
          const fog = lerp(1, 0.04, clamp01(dist / 6600));
          const near = nearEdge > 300 ? clamp01(1 - (nearEdge - 300) / 560) : 1;
          paint(o, o.el, fog * near, near);
        }
      }
      // the headline drifts back and out; the vanishing point grows into the last screen
      const t = ss(0.0, 0.14, cur);
      const intro = easeOut(clamp01((now - introStart - 250) / 1100));
      const textOp = introDone ? 1 - ss(0.015, 0.2, cur) : (1 - ss(0.01, 0.1, cur)) * intro;
      // flat 2D drift (no 3D layer for the words, so the browser never re-composites them with the corridor)
      const tOp = textOp.toFixed(3), tTr = `translateY(${(-t * 40).toFixed(1)}px) scale(${(1 - t * 0.35).toFixed(4)})`;
      if (text.style.opacity !== tOp) text.style.opacity = tOp;
      if (text.style.transform !== tTr) text.style.transform = tTr;
      const tVis = textOp < 0.02 ? 'hidden' : 'visible';
      if (text.style.visibility !== tVis) text.style.visibility = tVis;
      cue.style.opacity = (1 - ss(0, 0.06, cur)).toFixed(3);
      glow.style.opacity = ((0.55 + 0.45 * ss(0.1, 0.9, cur)) * (1 - ss(0.82, 1, cur))).toFixed(3);
      glow.style.transform = `scale(${(1 + 0.8 * ss(0.3, 1, cur)).toFixed(3)})`;
    };

    const loop = (now: number) => {
      raf = 0;
      cur += (target - cur) * 0.12;
      yaw += (yawT - yaw) * 0.08; pitch += (pitchT - pitch) * 0.08;
      if (Math.abs(target - cur) < 0.0003) cur = target;
      if (!introDone && now - introStart > INTRO_MS + 100) introDone = true;
      apply(now);
      const settled = cur === target && Math.abs(yawT - yaw) < 0.01 && Math.abs(pitchT - pitch) < 0.01 && introDone;
      if (!settled && visible) raf = requestAnimationFrame(loop); else run = false;
    };
    const kick = () => { if (!run && visible) { run = true; raf = requestAnimationFrame(loop); } };

    const onScroll = () => { measure(); kick(); };
    const onPointer = (e: PointerEvent) => {
      yawT = (e.clientX / window.innerWidth - 0.5) * 7;
      pitchT = -(e.clientY / window.innerHeight - 0.5) * 4;
      kick();
    };
    measure(); cur = introDone ? target : 0; if (introDone) cur = target;
    apply(performance.now()); world.style.opacity = '1'; kick();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    if (FINE_POINTER) window.addEventListener('pointermove', onPointer, { passive: true });
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { measure(); kick(); } });
    io.observe(root);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onPointer);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const sections = Array.from({ length: SECTIONS }, (_, k) => k);
  const fc = crop(FINAL);

  return (
    <section className="hv1" aria-label={H.label}>
      <div className="hv1-track" ref={trackRef}>
        <div className="hv1-stage">
          <div className="hv1-view">
            <div className="hv1-glow" ref={glowRef} aria-hidden="true" />
            <div className="hv1-cam" ref={camRef}>
              <div className="hv1-world" ref={worldRef}>
                {sections.map(k => {
                  const near = -k * SECTION, mid = near - SECTION / 2;
                  return ['floor', 'ceil', 'wl', 'wr'].map(side => (
                    <div key={side + k} className={`hv1-sec hv1-${side}`} data-kind="sec" data-z={near}
                      style={{ '--hv1-zmid': `${mid}px` } as CSSProperties} aria-hidden="true" />
                  ));
                })}
                {SCREENS.map(s => (
                  <figure key={s.id} className={`hv1-sc${s.tall ? ' hv1-tall' : ''}`} data-z={s.z} data-pz={s.pz} data-more={s.more ? '' : undefined}
                    style={at(s)}>
                    <div className="hv1-plane" style={plane(s)}>
                      <div className="hv1-glass"><Pic s={s} /><canvas className="hv1-noise" width={96} height={Math.round(96 / crop(s).ar)} aria-hidden="true" /></div>
                      <figcaption className="hv1-cap">{s.cap}</figcaption>
                    </div>
                  </figure>
                ))}
                <figure className="hv1-sc hv1-final" data-z={FINAL.z}
                  style={{ transform: `translate3d(0, 0, ${FINAL.z}px)` }}>
                  <div className="hv1-plane">
                  <div className="hv1-bezel">
                    <div className="hv1-glass">
                      <img className="hv1-img" src={FINAL.src} alt={H.shot.alt} style={{ width: '100%', left: 0, top: 0 }} decoding="async" draggable={false} />
                      <canvas className="hv1-noise" width={128} height={Math.round(128 / fc.ar)} aria-hidden="true" />
                      <div className="hv1-scan" aria-hidden="true" />
                      <figcaption className="hv1-osd"><span>CH 06</span>{FINAL.cap}</figcaption>
                    </div>
                  </div>
                  </div>
                </figure>
              </div>
            </div>
          </div>

          <div className="hv1-textwrap">
            <div className="hv1-text" ref={textRef}>
              <h1 className="hv1-title" data-focus tabIndex={-1}>{H.title}</h1>
              <p className="body-l hv1-lede">{H.lede}</p>
              <div className="ctas hv1-ctas">
                <a className="btn primary" href="#contact">{H.cta}&nbsp;&nbsp;→</a>
              </div>
            </div>
          </div>
          <div className="hv1-cue" ref={cueRef} aria-hidden="true"><i /><span>Scroll</span></div>
        </div>
      </div>
    </section>
  );
}

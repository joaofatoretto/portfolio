/* Lab variant 5 of the /hire hero: noise to signal.
   The brand's core sentence performed on João's work. Thousands of points start as TV static and gather into a real case
   cover; scroll, and they break out into the noise field and lock into the next one, a wave of lock-in sweeping across.
   WebGL points (canvas 2D if there's no WebGL; add ?nogl to force it). The headline, lede and CTA are plain 2D HTML over
   the canvas. No React state per frame: one rAF loop that sleeps when nothing is moving or the hero is off screen. */
import { useEffect, useRef } from 'react';
import { useCopy } from '../../../i18n/copy';
import { FINE_POINTER, MOTION, clamp01 } from '../../../lib/motion';
import { SCENE_COUNT, createCanvas2D, createGL, fillScene, makeData, sampleImage, type Data, type Renderer, type State } from './particles';
import './hero.css';

type Scene = {
  src: string; alt: string; client: string; work: string; result: string;
  /** where the cover is cropped to the frame (0..1 along the slack) */
  fx: number; fy: number;
};

// Names, titles and results are from src/content/cases/index.ts.
const SCENES: Scene[] = [
  { src: '/cases/tempo-landing-page/cover.png', alt: 'Tempo’s landing page, a dark site with a purple glow: “Where Craft meets Code”', client: 'TEMPO LABS', work: 'Tempo New Landing Page', result: 'Market repositioning', fx: 0.5, fy: 0.5 },
  { src: '/cases/benefits-card-app/cover.png', alt: 'Foodpass’s benefits card app: phone screens in purple, with the app’s mascots', client: 'FOODPASS', work: 'Benefits Card App', result: 'Opened sales to companies with 500+ employees', fx: 0.5, fy: 0.5 },
  { src: '/cases/photo-editing/cover.png', alt: 'Casar.com’s new photo editor on tilted phones: uploading, cropping and the “updated” confirmation, on pink', client: 'CASAR.COM', work: 'New Experience of Photo Editing', result: 'Redesigned the #1 pain point, felt by ~16% of users', fx: 0.1, fy: 0.5 },
  { src: '/cases/promotions-discoverability/cover.png', alt: 'Superopa’s promotions admin screens beside “+15% on add to cart”', client: 'SUPEROPA', work: 'Enhancing Promotions Discoverability', result: '+15% add-to-cart · 90% search success', fx: 0.5, fy: 0.5 },
];
if (SCENES.length !== SCENE_COUNT) throw new Error('SCENES and SCENE_COUNT disagree');

const PHONE = '(max-width: 820px)';
const INTRO_DELAY = 260, INTRO_MS = 1750;
const smooth = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

export default function Hero() {
  const { hire } = useCopy();
  const H = hire.hero;
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const s0 = SCENES[0];

  useEffect(() => {
    const root = rootRef.current!, track = trackRef.current!, stage = stageRef.current!, host = hostRef.current!;
    const frame = frameRef.current!, cap = capRef.current!;
    const shots = [...frame.querySelectorAll<HTMLImageElement>('.hv5-shot')];
    const phone = window.matchMedia(PHONE);
    const forceCPU = new URLSearchParams(window.location.search).has('nogl');
    let disposed = false;

    // The canvas is made here, not in the JSX, so React StrictMode's second effect gets a fresh one (a context that was
    // released can't be reused).
    const canvas = document.createElement('canvas');
    canvas.className = 'hv5-cv';
    host.appendChild(canvas);
    let renderer: Renderer | null = forceCPU ? null : createGL(canvas);
    if (!renderer) {
      const c2 = document.createElement('canvas');
      c2.className = 'hv5-cv';
      host.replaceChild(c2, canvas);
      renderer = createCanvas2D(c2);
    }
    if (!renderer) return;
    const rd = renderer;
    root.dataset.renderer = rd.kind;
    const cpu = rd.kind === 'canvas2d';

    // ---- geometry: the frame (a placeholder the CSS lays out) and the stage ----
    let stageW = 1, stageH = 1, frameW = 1, frameH = 1, frameCX = 0, frameCY = 0, dpr = 1;
    const measure = () => {
      const sr = stage.getBoundingClientRect(), fr = frame.getBoundingClientRect();
      stageW = Math.max(1, sr.width); stageH = Math.max(1, sr.height);
      frameW = Math.max(1, fr.width); frameH = Math.max(1, fr.height);
      frameCX = fr.left + fr.width / 2 - (sr.left + sr.width / 2);
      frameCY = fr.top + fr.height / 2 - (sr.top + sr.height / 2);
    };

    // ---- images: the first one starts the show, the rest load behind it ----
    const imgs: (HTMLImageElement | null)[] = SCENES.map(() => null);
    let data: Data | null = null;
    let sizeKey = '';
    const rebuild = (force = false) => {
      measure();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      rd.resize(stageW, stageH, cpu ? 1 : dpr);
      // ~36k particles on a big frame, ~9k on a phone (fewer, and coarser, for the CPU fallback)
      const count = Math.round(Math.min(cpu ? 11000 : 36000, Math.max(cpu ? 6000 : 8500, (frameW * frameH) / 11)));
      const cols = Math.round(Math.sqrt(count * (frameW / frameH))), rows = Math.max(1, Math.round(count / cols));
      const key = `${cols}x${rows}`;
      if (!force && key === sizeKey && data) { data.cell = frameW / cols; rd.setData(data); return; }
      sizeKey = key;
      data = makeData(cols, rows, frameW);
      const first = imgs.find(Boolean) ?? null;
      SCENES.forEach((sc, k) => {
        const im = imgs[k] ?? first;
        fillScene(data!, k, im ? sampleImage(im, cols, rows, sc.fx, sc.fy) : null);
      });
      rd.setData(data);
    };
    const loadScene = (k: number) => new Promise<void>(resolve => {
      const im = new Image();
      im.decoding = 'async';
      im.src = SCENES[k].src;
      im.decode().then(() => { if (!disposed) { imgs[k] = im; } resolve(); }, () => resolve());
    });

    // ---- state ----
    const N = SCENES.length;
    let dTarget = 0, dShown = 0;
    let introStart = Infinity, introP = MOTION ? 0 : 1; // not started until the first image has decoded
    let time = 3.7, last = 0, raf = 0, running = false, visible = true;
    let yaw = 0, pitch = 0, yawT = 0, pitchT = 0;
    let ptrX = 0, ptrY = 0, ptrXT = 0, ptrYT = 0, ptrAmt = 0, ptrOn = false, ptrLast = 0;
    let scene = -1;
    // the sharp picture: once the points have locked, the real screenshot resolves over the mosaic (eased, 0..1)
    let sharp = 0, sharpT = 0, introEnd = Infinity;

    const readScroll = () => {
      const r = track.getBoundingClientRect();
      const span = Math.max(1, r.height - stage.getBoundingClientRect().height);
      dTarget = clamp01(-r.top / span) * (N - 1);
    };

    const nameEls = {
      ch: cap.querySelector<HTMLElement>('.hv5-ch')!, who: cap.querySelector<HTMLElement>('.hv5-who')!,
      work: cap.querySelector<HTMLElement>('.hv5-work')!, res: cap.querySelector<HTMLElement>('.hv5-res')!,
    };
    const setScene = (k: number) => {
      if (k === scene) return;
      scene = k;
      const sc = SCENES[k];
      nameEls.ch.textContent = `CH 06·${k + 1}`; nameEls.who.textContent = sc.client; nameEls.work.textContent = sc.work; nameEls.res.textContent = sc.result;
      frame.setAttribute('aria-label', sc.alt);
      root.dataset.scene = String(k);
    };

    const state: State = { a: 0, b: 0, f: 0, pre: 1, time, yaw: 0, pitch: 0, relief: 1, ptrX: 0, ptrY: 0, ptrAmt: 0, frameCX: 0, frameCY: 0, frameW: 1, frameH: 1, stageW: 1, stageH: 1 };

    const draw = () => {
      const k = Math.min(N - 2, Math.floor(dShown + 1e-6));
      if (introP < 1) { state.a = 0; state.b = 0; state.pre = 1; state.f = 0.5 + 0.3 * introP; }
      else { state.a = k; state.b = k + 1; state.pre = 0; state.f = clamp01(dShown - k); }
      state.time = time; state.yaw = yaw; state.pitch = pitch; state.relief = 1 - sharp;
      state.ptrX = ptrX; state.ptrY = ptrY; state.ptrAmt = ptrAmt;
      state.frameCX = frameCX; state.frameCY = frameCY; state.frameW = frameW; state.frameH = frameH; state.stageW = stageW; state.stageH = stageH;
      rd.render(state);
      // the caption follows whichever picture is nearest, and is only lit while one is formed
      const near = Math.round(dShown), off = Math.abs(dShown - near);
      setScene(near);
      const lit = introP < 1 ? smooth(0.9, 1, introP) : 1 - smooth(0.14, 0.3, off);
      // sharp only while a picture is fully locked: in after the last points land, out before the next burst starts
      sharpT = introP < 1 || !imgs[near] ? 0 : 1 - smooth(0.04, 0.14, off);
      shots.forEach((im, i) => { const o = i === near ? sharp.toFixed(3) : '0'; if (im.style.opacity !== o) im.style.opacity = o; });
      // the lens of noise opens a hole in the sharp picture, so the points show through under the cursor
      root.style.setProperty('--hv5-lens', (ptrAmt * frameW * 0.16).toFixed(1) + 'px');
      root.style.setProperty('--hv5-mx', (ptrX + frameW / 2).toFixed(1) + 'px');
      root.style.setProperty('--hv5-my', (ptrY + frameH / 2).toFixed(1) + 'px');
      root.style.setProperty('--hv5-lit', lit.toFixed(3));
      root.style.setProperty('--hv5-progress', (dShown / (N - 1)).toFixed(4));
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000)); last = now;
      time += dt;
      let busy = false;

      if (introStart !== Infinity && introP < 1) {
        introP = clamp01((now - introStart) / INTRO_MS);
        if (dTarget > 0.12) introP = 1; // reloaded part-way down the hero: no intro
        busy = true;
      } else if (introStart === Infinity) busy = true; // waiting on the first picture: the snow plays

      if (introP >= 1 && introEnd === Infinity) introEnd = now;
      // the sharp picture eases in a beat after the lock (~0.35s) and out quickly when the points start to move
      const settling = now - introEnd < 120;
      if (settling) busy = true;
      const sharpGoal = settling ? 0 : sharpT;
      const sk = 1 - Math.exp(-dt * (sharpGoal > sharp ? 7 : 16));
      sharp += (sharpGoal - sharp) * sk;
      if (Math.abs(sharpGoal - sharp) > 0.002) busy = true; else sharp = sharpGoal;

      const dd = dTarget - dShown;
      if (Math.abs(dd) > 0.0008) { dShown += dd * (1 - Math.exp(-dt * 6.5)); busy = true; } else dShown = dTarget;

      // a few degrees of turn: with the scroll, and with the cursor
      const yawS = 0.11 * Math.sin(dShown * Math.PI * 2);
      const kk = 1 - Math.exp(-dt * 5);
      const flat = 1 - sharp, yawG = yawS + yawT * flat, pitchG = pitchT * flat;
      yaw += (yawG - yaw) * kk; pitch += (pitchG - pitch) * kk;
      if (Math.abs(yawG - yaw) > 0.0004 || Math.abs(pitchG - pitch) > 0.0004) busy = true;

      // the lens of noise: on while the cursor moves over the hero, springs back after
      if (ptrOn && now - ptrLast > 1400) ptrOn = false;
      const pa = ptrOn ? 1 : 0;
      ptrAmt += (pa - ptrAmt) * (1 - Math.exp(-dt * (ptrOn ? 12 : 5)));
      if (ptrAmt < 0.003 && !ptrOn) ptrAmt = 0;
      const pk = 1 - Math.exp(-dt * 16);
      ptrX += (ptrXT - ptrX) * pk; ptrY += (ptrYT - ptrY) * pk;
      if (ptrOn || ptrAmt > 0) busy = true;

      draw();
      if (busy && visible && !disposed) raf = requestAnimationFrame(tick);
      else running = false;
    };
    const wake = () => {
      if (running || disposed || !visible) return;
      running = true; last = performance.now(); raf = requestAnimationFrame(tick);
    };

    // ---- boot ----
    rebuild(true);
    setScene(0);
    root.style.setProperty('--hv5-lit', MOTION ? '0' : '1');

    let ro: ResizeObserver | null = null, io: IntersectionObserver | null = null;
    let resizeT = 0;
    const onResize = () => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(() => { if (disposed) return; rebuild(); if (MOTION) { readScroll(); wake(); } else draw(); }, 140);
    };
    ro = new ResizeObserver(onResize); ro.observe(stage); ro.observe(frame);

    loadScene(0).then(() => {
      if (disposed) return;
      if (!imgs[0]) return; // couldn't load: the page stays snow
      rebuild(true);
      if (!MOTION) { time = 3.7; introP = 1; introEnd = 0; sharp = 1; draw(); } else { readScroll(); dShown = dTarget; introStart = performance.now() + INTRO_DELAY; wake(); }
      // the rest, one after another, once the first has formed
      (async () => {
        for (let k = 1; k < N && !disposed; k++) {
          await loadScene(k);
          if (disposed) return;
          if (data && imgs[k]) { fillScene(data, k, sampleImage(imgs[k]!, data.cols, data.rows, SCENES[k].fx, SCENES[k].fy)); rd.setData(data); if (!MOTION) draw(); else wake(); }
        }
      })();
    });

    if (!MOTION) {
      draw();
      return () => { disposed = true; window.clearTimeout(resizeT); ro?.disconnect(); rd.dispose(); canvas.remove(); host.replaceChildren(); };
    }

    // ---- listeners (motion only) ----
    readScroll(); dShown = dTarget;
    let scrollRaf = 0;
    const onScroll = () => { if (scrollRaf) return; scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; readScroll(); wake(); }); };
    window.addEventListener('scroll', onScroll, { passive: true });
    const onMove = (e: PointerEvent) => {
      if (!FINE_POINTER || e.pointerType !== 'mouse') return;
      const sr = stage.getBoundingClientRect();
      ptrXT = e.clientX - (sr.left + sr.width / 2) - frameCX;
      ptrYT = e.clientY - (sr.top + sr.height / 2) - frameCY;
      if (!ptrOn) { ptrX = ptrXT; ptrY = ptrYT; }
      yawT = ((e.clientX - sr.left) / sr.width * 2 - 1) * 0.07;
      pitchT = -((e.clientY - sr.top) / sr.height * 2 - 1) * 0.05;
      ptrOn = true; ptrLast = performance.now();
      wake();
    };
    const onLeave = () => { ptrOn = false; yawT = 0; pitchT = 0; wake(); };
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    io = new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; if (visible) { readScroll(); wake(); } }, { threshold: 0 });
    io.observe(root);
    const onMq = () => onResize();
    phone.addEventListener('change', onMq);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf); cancelAnimationFrame(scrollRaf); window.clearTimeout(resizeT);
      window.removeEventListener('scroll', onScroll);
      stage.removeEventListener('pointermove', onMove); stage.removeEventListener('pointerleave', onLeave);
      phone.removeEventListener('change', onMq);
      ro?.disconnect(); io?.disconnect();
      rd.dispose();
      host.replaceChildren();
    };
  }, []);

  return (
    <section className="hv5" ref={rootRef}>
      <div className="hv5-track" ref={trackRef}>
        <div className="hv5-stage" ref={stageRef}>
          <div className="hv5-canvas" ref={hostRef} aria-hidden="true" />
          <div className="hv5-shade" aria-hidden="true" />
          <div className="hv5-grid">
            <div className="hv5-copy">
              <h1 className="hv5-title">{H.title}</h1>
              <p className="body-l hv5-lede">{H.lede}</p>
              <div className="ctas hv5-ctas">
                <a className="btn primary" href="#contact">{H.cta}&nbsp;&nbsp;→</a>
              </div>
            </div>
            <figure className="hv5-view">
              <div className="hv5-frame" ref={frameRef} role="img" aria-label={s0.alt}>
                {SCENES.map((sc, i) => (
                  <img key={sc.src} className="hv5-shot" data-k={i} src={sc.src} alt="" decoding="async" draggable={false}
                    style={{ objectPosition: `${sc.fx * 100}% ${sc.fy * 100}%` }} />
                ))}
                <i className="hv5-corner hv5-c1" /><i className="hv5-corner hv5-c2" /><i className="hv5-corner hv5-c3" /><i className="hv5-corner hv5-c4" />
              </div>
              <figcaption className="hv5-cap" ref={capRef}>
                <span className="hv5-ch">CH 06·1</span>
                <span className="hv5-who">{s0.client}</span>
                <span className="hv5-work">{s0.work}</span>
                <span className="hv5-res">{s0.result}</span>
              </figcaption>
              <ol className="hv5-ticks" aria-hidden="true">
                {SCENES.map((_, i) => <li key={i} />)}
              </ol>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

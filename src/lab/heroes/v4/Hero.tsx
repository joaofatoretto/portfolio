/* Lab variant 4 of the /hire hero: the channel drum.
   The old TV channel dial made physical: a hollow cylinder of João's work (12 faces, 8 on phones) that turns as you
   scroll, drags with inertia and settles with one face squarely on air. The headline, the lede and the caption are
   plain 2D layers outside the 3D scene. Inside it there is no filter, blend mode or backdrop-filter: the falloff
   with angle is an ink overlay's opacity, and the rose/cyan split on a fast spin is drawn with fringes and tints.
   No state per frame: one rAF loop (a spring on the angle) writes transforms, opacities and one CSS variable. */
import { useEffect, useRef, type CSSProperties } from 'react';
import { useCopy } from '../../../i18n/copy';
import { MOTION, FINE_POINTER, clamp01, lerp, ss, easeOut } from '../../../lib/motion';
import './hero.css';

type Face = {
  src: string; alt: string; name: string; work: string; result: string;
  /** index on phones (8 faces), -1 when the face is left off */
  pi: number;
  /** object-position of the crop, for the covers shot in perspective and the tall modal */
  at?: string;
};

// Names, titles and results are from src/content/cases/index.ts. Neighbours alternate light and dark.
const FACES: Face[] = [
  { src: '/cases/tempo-landing-page/cover.png', alt: 'Tempo’s landing page, a dark site with a purple glow', name: 'TEMPO LABS', work: 'Tempo New Landing Page', result: 'Market repositioning', pi: 0, at: '50% 50%' },
  { src: '/cases/benefits-card-app/cover.png', alt: 'Foodpass’s benefits card app: phone screens in purple, with the app’s mascots', name: 'FOODPASS', work: 'Benefits Card App', result: 'Opened sales to companies with 500+ employees', pi: 1 },
  { src: '/cases/promotions-discoverability/cover.png', alt: 'Superopa’s promotions admin screens beside “+15% on add to cart”', name: 'SUPEROPA', work: 'Enhancing Promotions Discoverability', result: '+15% add-to-cart · 90% search success', pi: 2 },
  { src: '/cases/sophia-mental-health/33.jpg', alt: 'A wall of Sophia’s final app screens, in purple and orange', name: 'SOPHIA', work: 'Sophia, a mental health app', result: 'Almost 250 survey answers · 20+ interviews · 5 usability tests', pi: 3 },
  { src: '/cases/tempo-landing-page/01.png', alt: 'A section of Tempo’s landing page: design by hand, ship it pixel perfect', name: 'TEMPO LABS', work: 'Tempo New Landing Page', result: 'Market repositioning', pi: 4 },
  { src: '/cases/photo-editing/cover.png', alt: 'Casar.com’s photo editor on tilted phones, on pink', name: 'CASAR.COM', work: 'New Experience of Photo Editing', result: 'Redesigned the #1 pain point, felt by ~16% of users', pi: 5, at: '60% 40%' },
  { src: '/cases/sophia-mental-health/19.jpg', alt: 'Hand-drawn paper sketches of Sophia’s screens', name: 'SOPHIA', work: 'Sophia, a mental health app', result: 'Almost 250 survey answers · 20+ interviews · 5 usability tests', pi: -1 },
  { src: '/cases/benefits-card-app/01.png', alt: 'Foodpass app screens: balance, card and basket, on purple', name: 'FOODPASS', work: 'Benefits Card App', result: 'Opened sales to companies with 500+ employees', pi: 6 },
  { src: '/cases/photo-editing/12.png', alt: 'Casar.com’s new editing tools: crop and adapt photos for phones', name: 'CASAR.COM', work: 'New Experience of Photo Editing', result: 'Redesigned the #1 pain point, felt by ~16% of users', pi: -1, at: '50% 92%' },
  { src: '/cases/sophia-mental-health/cover.jpg', alt: 'Sophia’s app on isometric phones, with the Sophia logo', name: 'SOPHIA', work: 'Sophia, a mental health app', result: 'Almost 250 survey answers · 20+ interviews · 5 usability tests', pi: 7, at: '30% 50%' },
  { src: '/cases/promotions-discoverability/02.png', alt: 'Superopa’s research notes and a mascot with a magnifying glass', name: 'SUPEROPA', work: 'Enhancing Promotions Discoverability', result: '+15% add-to-cart · 90% search success', pi: -1 },
  { src: '/cases/tempo-landing-page/03.png', alt: 'Another section of Tempo’s landing page, in dark purple', name: 'TEMPO LABS', work: 'Tempo New Landing Page', result: 'Market repositioning', pi: -1 },
];

const N_DESKTOP = 12, N_PHONE = 8;
const PHONE = '(max-width: 900px)';
/** Falloff of the lights with the angle from the front: 0 = fully lit, 1 = ink. Same function server and client. */
const dimAt = (deg: number) => 0.95 * Math.pow(ss(8, 66, Math.abs(deg)), 0.6);
const norm = (a: number) => { const r = ((a + 180) % 360 + 360) % 360 - 180; return r === -180 ? 180 : r; };
/** A face is lit unevenly: its two edges sit at different angles. A uniform ink layer takes the lighter edge's value and
 *  a left-to-right gradient layer adds the rest, so neighbouring faces meet at the same brightness (no steps at the seams). */
const edges = (d: number, step: number) => {
  const dl = dimAt(d - step / 2), dr = dimAt(d + step / 2), m = Math.min(dl, dr), hi = Math.max(dl, dr);
  return { m, x: m >= 0.999 ? 0 : 1 - (1 - hi) / (1 - m), flip: dr >= dl ? 1 : -1 };
};

// first-render styles (pure functions of the index, so the prerender and the browser agree and reduced motion has a still)
const initial = (f: Face, i: number): CSSProperties => {
  const e12 = edges(norm(i * (360 / N_DESKTOP)), 360 / N_DESKTOP), e8 = edges(f.pi < 0 ? 180 : norm(f.pi * (360 / N_PHONE)), 360 / N_PHONE);
  return {
    '--hv4-i': i, '--hv4-pi': f.pi < 0 ? 0 : f.pi,
    '--hv4-dim12': e12.m.toFixed(3), '--hv4-dimx12': e12.x.toFixed(3), '--hv4-flip12': e12.flip,
    '--hv4-dim8': e8.m.toFixed(3), '--hv4-dimx8': e8.x.toFixed(3), '--hv4-flip8': e8.flip,
    '--hv4-osd': i === 0 ? 1 : 0, '--hv4-at': f.at ?? '50% 50%',
  } as CSSProperties;
};

export default function Hero() {
  const { hire } = useCopy();
  const H = hire.hero;
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const nowRef = useRef<HTMLDivElement>(null);

  const words = H.title.split(' ');
  const cut = Math.max(1, Math.floor(words.length / 2));

  useEffect(() => {
    if (!MOTION) return;
    const root = rootRef.current!, track = trackRef.current!, view = viewRef.current!, tilt = tiltRef.current!;
    const drum = drumRef.current!, title = titleRef.current!, now = nowRef.current!;
    const phone = window.matchMedia(PHONE);
    const faceEls = Array.from(drum.querySelectorAll<HTMLElement>('.hv4-face'));
    const parts = faceEls.map(el => ({
      el, dim: el.querySelector<HTMLElement>('.hv4-dim')!, dim2: el.querySelector<HTMLElement>('.hv4-dim2')!, osd: el.querySelector<HTMLElement>('.hv4-osd')!,
      sheen: el.querySelector<HTMLElement>('.hv4-sheen')!, dimV: -1, dimXV: -1, flipV: 0, osdV: -1, sheenV: '',
    }));
    const lines = Array.from(title.querySelectorAll<HTMLElement>('.hv4-line'));
    const ticks = Array.from(now.querySelectorAll<HTMLElement>('.hv4-tick'));
    const nowName = now.querySelector<HTMLElement>('.hv4-now-name')!;
    const nowWork = now.querySelector<HTMLElement>('.hv4-now-work')!;
    const nowResult = now.querySelector<HTMLElement>('.hv4-now-result')!;

    // geometry for the current breakpoint
    let n = N_DESKTOP, step = 360 / n, idxOf = (i: number) => i;
    const geometry = () => {
      const p = phone.matches;
      n = p ? N_PHONE : N_DESKTOP; step = 360 / n;
      idxOf = (i: number) => (p ? FACES[i].pi : i);
    };
    geometry();

    // state: A is the angle the drum has turned (deg). Target = scroll turn + offset (drag, snap) + intro.
    let raw = 0, offset = 0, A = 0, vel = 0, tgtA = 0, spin = 0;
    let yawT = 0, pitchT = 0, yaw = 0, pitch = 0;
    let dragging = false, lastX = 0, lastT = 0, dragVel = 0;
    let raf = 0, run = false, visible = true, last = 0, idle = 0, front = -1;
    const introStart = performance.now() + 140;
    const INTRO_MS = 2600, INTRO_TURN = 300;
    let introDone = window.scrollY > window.innerHeight * 0.5;
    let snapped = true;

    const measure = () => {
      const r = track.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      raw = clamp01(-r.top / span) * 360;
    };
    const snap = (extra = 0) => {
      const total = raw + offset + extra;
      offset = Math.round(total / step) * step - raw;
      snapped = true;
    };
    const introAt = (now: number) => (introDone ? 0 : (1 - easeOut(clamp01((now - introStart) / INTRO_MS))) * -INTRO_TURN);

    const paint = (now: number) => {
      const intro = introAt(now);
      const a = A + intro;
      drum.style.transform = `translateZ(calc(var(--hv4-r) * -1)) rotateY(${(-a).toFixed(3)}deg)`;
      tilt.style.transform = `rotateX(calc(var(--hv4-pitch) + ${pitch.toFixed(3)}deg)) rotateY(${yaw.toFixed(3)}deg)`;
      const sp = spin.toFixed(3);
      if (drum.dataset.spin !== sp) { drum.dataset.spin = sp; drum.style.setProperty('--hv4-spin', sp); }

      // the face nearest the front is "on air"
      let nearest = 0, best = 999;
      parts.forEach((o, i) => {
        const idx = idxOf(i);
        if (idx < 0) return;
        const d = norm(idx * step - a);
        const ad = Math.abs(d);
        if (ad < best) { best = ad; nearest = i; }
        if (ad > 125) return; // its back is toward us: nothing to update
        const e = edges(d, step);
        if (Math.abs(o.dimV - e.m) > 0.004) { o.dimV = e.m; o.dim.style.opacity = e.m.toFixed(3); }
        if (Math.abs(o.dimXV - e.x) > 0.004) { o.dimXV = e.x; o.dim2.style.opacity = e.x.toFixed(3); }
        if (o.flipV !== e.flip) { o.flipV = e.flip; o.dim2.style.transform = `scaleX(${e.flip})`; }
        const lit = (1 - ss(0.12 * step, 0.55 * step, ad)) * (1 - ss(0.25, 0.6, spin));
        if (Math.abs(o.osdV - lit) > 0.01) { o.osdV = lit; o.osd.style.opacity = lit.toFixed(3); }
        // a soft streak of light crosses the glass as the face turns
        const s = lerp(1.7, -1, clamp01(0.5 + d / (2.1 * step)));
        const sh = `translateX(${(s * 100).toFixed(1)}%)`;
        if (o.sheenV !== sh) { o.sheenV = sh; o.sheen.style.transform = sh; }
      });
      if (nearest !== front) {
        front = nearest;
        const f = FACES[nearest];
        nowName.textContent = f.name; nowWork.textContent = f.work; nowResult.textContent = f.result;
        const idx = idxOf(nearest);
        ticks.forEach((t, i) => { if (i === idx) t.setAttribute('data-on', ''); else t.removeAttribute('data-on'); });
      }
      // the headline lines drift in opposite directions, flat 2D, a few pixels
      // zero whenever a face is squarely on air, so the lines realign when it settles
      const dx = Math.sin((a / step) * Math.PI) * 16;
      if (lines[0]) lines[0].style.transform = `translate3d(${dx.toFixed(2)}px,0,0)`;
      if (lines[1]) lines[1].style.transform = `translate3d(${(-dx).toFixed(2)}px,0,0)`;
    };

    const loop = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - (last || now - 16)) / 1000)); last = now;
      if (!introDone && now - introStart > INTRO_MS + 80) introDone = true;
      tgtA = raw + offset;
      // a heavy, slightly under-damped spring on the angle; stiffer while the pointer holds the drum
      const w = dragging ? 22 : 8.5, z = dragging ? 1 : 0.9;
      const acc = w * w * (tgtA - A) - 2 * z * w * vel;
      vel += acc * dt; A += vel * dt;
      const intro = introAt(now);
      const speed = Math.abs(vel) + (introDone ? 0 : Math.abs(intro - introAt(now - 16)) * 60);
      const sp = clamp01((speed - 70) / 420);
      spin += (sp - spin) * (sp > spin ? 0.35 : 0.1);
      if (spin < 0.003) spin = 0;
      yaw += (yawT - yaw) * 0.07; pitch += (pitchT - pitch) * 0.07;
      paint(now);
      const settled = Math.abs(tgtA - A) < 0.015 && Math.abs(vel) < 0.03 && introDone && !dragging && snapped &&
        spin === 0 && Math.abs(yawT - yaw) < 0.01 && Math.abs(pitchT - pitch) < 0.01;
      if (!settled && visible) raf = requestAnimationFrame(loop); else { run = false; last = 0; if (settled) { A = tgtA; vel = 0; paint(now); } }
    };
    const kick = () => { if (!run && visible) { run = true; last = 0; raf = requestAnimationFrame(loop); } };

    const onScroll = () => {
      measure();
      if (dragging) return;
      snapped = false;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => { snap(); kick(); }, 150);
      kick();
    };
    const onResize = () => { geometry(); front = -1; parts.forEach(o => { o.dimV = -1; o.dimXV = -1; o.flipV = 0; o.osdV = -1; o.sheenV = ''; }); onScroll(); };

    // dragging (fine pointers): turns the drum with inertia, then it settles on the nearest face
    const GAIN = 0.075; // degrees per pixel dragged
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true; lastX = e.clientX; lastT = performance.now(); dragVel = 0; snapped = false;
      window.clearTimeout(idle);
      view.setPointerCapture(e.pointerId);
      root.classList.add('hv4-grab');
      kick();
    };
    const onMove = (e: PointerEvent) => {
      if (FINE_POINTER && !dragging) {
        yawT = (e.clientX / window.innerWidth - 0.5) * 5;
        pitchT = (e.clientY / window.innerHeight - 0.5) * 2.4;
        kick();
      }
      if (!dragging) return;
      const t = performance.now(), dx = e.clientX - lastX;
      offset -= dx * GAIN;
      const v = (-dx * GAIN) / Math.max(1, t - lastT); // deg per ms
      dragVel = dragVel * 0.6 + v * 0.4;
      lastX = e.clientX; lastT = t;
      kick();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try { view.releasePointerCapture(e.pointerId); } catch { /* already released */ }
      root.classList.remove('hv4-grab');
      const held = performance.now() - lastT > 90; // stopped before letting go: no fling
      snap(held ? 0 : dragVel * 380);
      kick();
    };

    measure();
    // arriving mid-page: no intro and the drum already where the scroll says
    if (introDone) { A = raw; }
    snapped = true;
    if (!introDone) { A = 0; }
    root.dataset.live = ''; if (FINE_POINTER) root.dataset.fine = '';
    paint(performance.now());
    kick();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    phone.addEventListener('change', onResize);
    if (FINE_POINTER) {
      view.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { measure(); kick(); } });
    io.observe(root);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      phone.removeEventListener('change', onResize);
      view.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      io.disconnect();
      window.clearTimeout(idle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hv4" ref={rootRef} aria-label={H.label}>
      <div className="hv4-track" ref={trackRef}>
        <div className="hv4-stage">
          <div className="hv4-glow" aria-hidden="true" />

          {/* the drum: the only 3D in the hero */}
          <div className="hv4-view" ref={viewRef} role="group" aria-label="Selected work">
            <div className="hv4-tilt" ref={tiltRef}>
              <div className="hv4-drum" ref={drumRef}>
                {FACES.map((f, i) => (
                  <figure className="hv4-face" key={f.src} data-more={f.pi < 0 ? '' : undefined} style={initial(f, i)}>
                    <div className="hv4-out">
                      <i className="hv4-rail hv4-rail-top" />
                      <div className="hv4-screen">
                        <div className="hv4-pic">
                          <img src={f.src} alt={f.alt} decoding="async" draggable={false} />
                          <i className="hv4-sheen" />
                          <i className="hv4-scan" />
                          <i className="hv4-tint" />
                          <figcaption className="hv4-osd" aria-hidden="true"><span>CH 06·{i + 1}</span>{f.name}</figcaption>
                        </div>
                        <i className="hv4-fringe hv4-fringe-rose" />
                        <i className="hv4-fringe hv4-fringe-cyan" />
                      </div>
                      <i className="hv4-rail hv4-rail-bot" />
                      <i className="hv4-dim" />
                      <i className="hv4-dim hv4-dim2" />
                    </div>
                    <div className="hv4-in" aria-hidden="true">
                      <div className="hv4-in-pic"><img src={f.src} alt="" decoding="async" draggable={false} /></div>
                      <i className="hv4-in-top" /><i className="hv4-in-bot" />
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </div>

          {/* everything below is flat 2D, outside the scene (the veil fades the drum in once, without touching its opacity) */}
          <div className="hv4-veil" aria-hidden="true" />
          <h1 className="hv4-title" ref={titleRef} data-focus tabIndex={-1}>
            <span className="hv4-line">{words.slice(0, cut).join(' ')}</span>{' '}
            <span className="hv4-line">{words.slice(cut).join(' ')}</span>
          </h1>

          <div className="hv4-copy">
            <p className="body-l hv4-lede">{H.lede}</p>
            <div className="ctas hv4-ctas">
              <a className="btn primary" href="#contact">{H.cta}&nbsp;&nbsp;→</a>
            </div>
          </div>

          <div className="hv4-now" ref={nowRef} aria-hidden="true">
            <ol className="hv4-ticks">
              {FACES.map((f, i) => <li key={f.src} className="hv4-tick" data-more={f.pi < 0 ? '' : undefined} data-on={i === 0 ? '' : undefined} />)}
            </ol>
            <p className="hv4-now-name">{FACES[0].name}</p>
            <p className="hv4-now-work">{FACES[0].work}</p>
            <p className="hv4-now-result">{FACES[0].result}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

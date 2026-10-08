import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useCopy } from '../i18n/copy';
import { MOTION, REDUCE, clamp01, lerp, ss } from '../lib/motion';
import { SplitFilter, makeStatic } from '../lib/tv';

/* Tune-in timeline, shortened from design.md §10 so the words are readable by ~0.65 s. Plays once per visit. */
const A = 150, B = 350, C = 650, D = 900, E = 2400, END = 2600;
function heroParams(t: number) {
  const s = (a: number, b: number) => ss(a, b, t);
  return {
    stat: t < B ? 1 : t < C ? lerp(0.9, 0.45, s(B, C)) : t < D ? lerp(0.45, 0.06, s(C, D)) : 0.05,
    stretch: t < A ? 1 : t < B ? 7 : t < C ? 3 : 1,
    band: t >= A && t < C,
    content: t < B ? 0 : t < C ? 0.35 + 0.65 * s(B, C - 50) : 1,
    flicker: t >= B && t < C ? 0.3 : t >= C && t < D ? 0.06 : 0,
    rgb: t < B ? 0 : t < C ? lerp(16, 7, s(B, C)) : t < D ? lerp(7, 0, s(C, D)) : 0,
    tear: t < B ? 0 : t < C ? 0.75 : t < D ? 0.22 : 0,
    tearMax: t < C ? 70 : 18,
    jitter: t < B ? 0 : t < C ? 10 : t < D ? 2 : 0,
    scan: t < C ? 0.5 : t < D ? lerp(0.5, 0.12, s(C, D)) : lerp(0.12, 0.05, s(D, D + 500)),
    vig: t < C ? 1 : lerp(1, 0.25, s(C, D + 500)),
    draw: s(D, E),
    sweep: t > D && t < E ? Math.min(1, (E - t) / 200) : 0,
    msg: (t < A ? 'noSignal' : t < B ? 'searching' : '') as 'noSignal' | 'searching' | '',
    osd: t < D ? 1 : 1 - s(D, D + 500),
  };
}

/* Plays on every page load (a reload is a new visit), but not again when you come back to the same page inside the site. */
const tunedThisLoad = new Set<string>();
const canPin = () => MOTION && window.innerHeight >= 600;
/** Pause between the fibres finishing and the noise → signal cue, so people can wonder first. */
const CUE_DELAY = 1500;

type Props = {
  /** the channel shown in the corner while it tunes in, e.g. "CH 01" */
  channel: string;
  label: string;
  /** the hero's content; rendered once for real and three times as aria-hidden copies (copy = true) for the picture tears */
  content: (copy: boolean) => ReactNode;
};

/** The visitor starts inside the TV: a full-bleed Stage that tunes in, then closes into the inset card on scroll.
 *  Pinned when the content fits the screen; otherwise (phones) the edges close in while the content scrolls.
 *  Used by the home hero and the hire hero; each passes its own content. */
export function TVHero({ channel, label, content }: Props) {
  const { ui } = useCopy();
  const tvWords = useRef(ui.tv);
  const [skip] = useState(() => REDUCE || tunedThisLoad.has(channel));
  const trackRef = useRef<HTMLDivElement>(null), stageRef = useRef<HTMLElement>(null), screenRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null), canvasRef = useRef<HTMLCanvasElement>(null);
  const chRef = useRef<HTMLDivElement>(null), msgRef = useRef<HTMLDivElement>(null), tipRef = useRef<HTMLDivElement>(null);
  const tearRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pinned, setPinned] = useState(false);
  const badSize = useRef('');

  /* Layout + scroll: the Stage closes from full screen into the card over the pinned distance. */
  useLayoutEffect(() => {
    const track = trackRef.current!, nav = document.getElementById('navwrap');
    /* the Paper room the hero sits in (Home); once it scrolls out from under the nav, the page below is Stage */
    const room = track.closest<HTMLElement>('.paper');
    let pinDist = 1, raf = 0, navTheme: string | null = null, alive = true;
    const key = () => document.documentElement.clientWidth + 'x' + window.innerHeight;
    const update = () => {
      raf = 0;
      const p = MOTION ? clamp01(window.scrollY / pinDist) : 1;
      track.style.setProperty('--p', p.toFixed(4));
      // white nav on the hero while it fills the screen, Paper nav over the room, then the default Stage nav
      const theme = MOTION && p < 0.5 ? 'stage' : room && nav && room.getBoundingClientRect().bottom > nav.offsetHeight ? 'paper' : '';
      if (theme !== navTheme) {
        navTheme = theme;
        nav?.classList.toggle('stage', theme === 'stage'); nav?.classList.toggle('paper', theme === 'paper');
      }
      tipRef.current?.classList.toggle('gone', p > 0.03);
    };
    const measure = () => {
      if (!alive) return;
      const vw = document.documentElement.clientWidth, vh = window.innerHeight, g = vw <= 640 ? 16 : 24;
      track.style.setProperty('--ix', ((vw - Math.min(vw - 2 * g, 1440)) / 2).toFixed(1) + 'px');
      pinDist = Math.round(vh * 0.55);
      track.style.setProperty('--pin', pinDist + 'px');
      if (pinned) {
        const c = mainRef.current!.firstElementChild as HTMLElement;
        if (c.scrollHeight > c.clientHeight + 2 || !canPin()) { badSize.current = key(); setPinned(false); return; }
      } else if (canPin() && key() !== badSize.current) { setPinned(true); return; }
      update();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', measure);
      alive = false; cancelAnimationFrame(raf); nav?.classList.remove('stage', 'paper');
    };
  }, [pinned]);

  useLayoutEffect(() => {
    if (skip) { mainRef.current!.style.opacity = '1'; chRef.current!.style.opacity = '0'; }
  }, []);

  /* Tune-in */
  useEffect(() => {
    const stage = stageRef.current!, canvas = canvasRef.current!, ctx = canvas.getContext('2d');
    if (!ctx) return;
    const draw = makeStatic();
    let t = skip ? END : 0, visible = true, needDraw = true;
    const size = () => { canvas.width = Math.max(2, Math.ceil(stage.clientWidth / 2)); canvas.height = Math.max(2, Math.ceil(stage.clientHeight / 2)); needDraw = true; };
    size();
    const ro = new ResizeObserver(size); ro.observe(stage);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(stage);
    const rOff = document.getElementById('heroR'), bOff = document.getElementById('heroB');
    if (skip) { tipRef.current?.classList.add('ready'); stage.classList.add('cue-on'); }
    let cueTimer = 0;
    let raf = 0, last = performance.now(), lastGrain = 0, lastTear = 0;
    let tears: { top: number; bottom: number; dx: number }[] = [];

    const loop = (now: number) => {
      const dt = Math.min(64, now - last); last = now;
      if (t < END) {
        t = Math.min(END, t + dt);
        if (t >= END) { tunedThisLoad.add(channel); cueTimer = window.setTimeout(() => stage.classList.add('cue-on'), CUE_DELAY); }
        if (t > D + 300) tipRef.current?.classList.add('ready');
      }
      const p = heroParams(t), active = t < END;
      if (visible) {
        if (active || needDraw || (!REDUCE && now - lastGrain > 83)) { draw(ctx, canvas.width, canvas.height, p, t); lastGrain = now; needDraw = false; }
        canvas.style.opacity = p.stat.toFixed(3);
        const flick = Math.random() < p.flicker ? 0.25 + Math.random() * 0.5 : 1;
        const op = (p.content * flick).toFixed(3);
        const jy = p.jitter ? ((Math.random() * 2 - 1) * p.jitter).toFixed(1) : '0';
        const split = p.rgb > 0.4;
        if (split && rOff && bOff) { rOff.setAttribute('dx', (-p.rgb * (0.7 + Math.random() * 0.6)).toFixed(1)); bOff.setAttribute('dx', (p.rgb * (0.7 + Math.random() * 0.6)).toFixed(1)); }
        const filter = split ? 'url(#hero)' : 'none';
        const m = mainRef.current!.style;
        m.opacity = op; m.transform = jy !== '0' ? `translate3d(0, ${jy}px, 0)` : 'none'; m.filter = filter;

        if (now - lastTear > 50) {
          lastTear = now; tears = [];
          if (p.tear > 0) {
            const h = screenRef.current!.clientHeight, n = Math.random() < p.tear ? 1 + ((Math.random() * 3) | 0) : 0;
            for (let i = 0; i < n; i++) {
              const top = Math.random() * h * 0.92, hh = 6 + Math.random() * (p.tearMax === 70 ? 64 : 14);
              tears.push({ top, bottom: Math.max(0, h - top - hh), dx: (Math.random() * 2 - 1) * p.tearMax });
            }
          }
        }
        tearRefs.current.forEach((el, i) => {
          if (!el) return;
          const tr = tears[i];
          if (!tr) { el.style.display = 'none'; return; }
          el.style.display = 'block'; el.style.clipPath = `inset(${tr.top.toFixed(0)}px 0 ${tr.bottom.toFixed(0)}px 0)`;
          el.style.transform = `translate3d(${tr.dx.toFixed(1)}px, ${jy}px, 0)`; el.style.opacity = op; el.style.filter = filter;
        });
        const cs = stage.style;
        cs.setProperty('--draw', p.draw.toFixed(4)); cs.setProperty('--sweep', p.sweep.toFixed(3));
        cs.setProperty('--scan', p.scan.toFixed(3)); cs.setProperty('--vig', p.vig.toFixed(3));
        chRef.current!.style.opacity = p.osd.toFixed(3);
        const msg = msgRef.current!;
        if (p.msg) { msg.style.display = 'block'; msg.textContent = tvWords.current[p.msg]; } else msg.style.display = 'none';
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); clearTimeout(cueTimer); ro.disconnect(); io.disconnect(); };
  }, []);

  return (
    <div className={`hero-track${pinned ? ' pinned' : ''}`} ref={trackRef} id="top">
      <div className="hero-sticky">
        <section className="hero-stage stage" ref={stageRef} aria-label={label}>
          <SplitFilter id="hero" />
          <div className="hero-screen" ref={screenRef}>
            <div className="layer" ref={mainRef}>{content(false)}</div>
            {[0, 1, 2].map(i => <div key={i} className="layer tear" ref={el => { tearRefs.current[i] = el; }} aria-hidden="true">{content(true)}</div>)}
            <div className="osd hero-ch" ref={chRef} aria-hidden="true">{channel}</div>
          </div>
          <canvas className="static" ref={canvasRef} aria-hidden="true" />
          <div className="scan" aria-hidden="true" />
          <div className="vig" aria-hidden="true" />
          <div className="osd-msg" ref={msgRef} aria-hidden="true" style={{ display: 'none' }} />
          <div className="scroll-tip" ref={tipRef} aria-hidden="true" hidden={!pinned}>
            <span className="caption">{ui.tv.scroll}</span>
            <span className="track"><i /></span>
          </div>
        </section>
      </div>
    </div>
  );
}

/* Lab variant 3 · Anaglyph depth: an editorial cover in 3D. The giant headline sits between layers of real work,
   some screens behind the words and some in front; the composition has depth you feel with the cursor and scroll.
   At rest the work is greyscale (the page stays black and white) and each piece shows its colour on hover. */
import { useEffect, useRef, type CSSProperties } from 'react';
import { useCopy } from '../../../i18n/copy';
import { FINE_POINTER, MOTION, clamp01, easeOut, lerp } from '../../../lib/motion';
import './hero.css';

type Card = {
  src: string; alt: string; caption: string;
  /** position (% of the stage), width (vw), rotation (deg) */
  x: number; y: number; w: number; r: number;
  /** 0 = far plane, 1 = nearest; > .6 sits in front of the headline */
  depth: number;
  /** object-position for the crop, and the card's aspect ratio */
  crop?: string; ratio: string;
  /** hidden on phones */
  wide?: boolean;
  /** phone position and width: x, y (% of the stage), w (vw) */
  m?: [number, number, number];
};

const CARDS: Card[] = [
  { src: '/cases/sophia-mental-health/33.jpg', alt: 'Sophia’s final screens laid out in a grid', caption: 'Sophia · Mental health app',
    x: 66, y: 4, w: 17, r: -4, depth: .12, ratio: '1400 / 931', wide: true },
  { src: '/cases/promotions-discoverability/04.png', alt: 'Superopa research board with sticky notes and screens', caption: 'Superopa · Promotions',
    x: 79, y: 57, w: 17, r: 3, depth: .2, ratio: '4 / 3', crop: '30% 50%', wide: true },
  { src: '/cases/benefits-card-app/01.png', alt: 'Foodpass app screens for the benefits card', caption: 'Foodpass · Benefits card',
    x: 70, y: 27, w: 24, r: 2, depth: .38, ratio: '1546 / 809', m: [-12, 33, 72] },
  { src: '/cases/sophia-mental-health/19.jpg', alt: 'Hand-drawn paper sketches of Sophia’s screens', caption: 'Sophia · First sketches',
    x: 85, y: 5, w: 13, r: 7, depth: .5, ratio: '847 / 600', m: [70, 31, 36] },
  { src: '/cases/photo-editing/12.png', alt: 'Casar.com’s new photo editing announcement', caption: 'Casar.com · Photo editing',
    x: 40, y: 64, w: 15, r: -5, depth: .45, ratio: '2048 / 1738', wide: true },
  { src: '/cases/tempo-landing-page/cover.png', alt: 'Tempo’s landing page, which I redesigned', caption: 'Tempo · Landing page',
    x: 60, y: 47, w: 33, r: -3, depth: .85, ratio: '16 / 10', crop: '50% 0%', m: [34, 47, 74] },
  { src: '/cases/photo-editing/cover.png', alt: 'Casar.com’s photo editor on tilted phones', caption: 'Casar.com · Photo editing',
    x: 53, y: -3, w: 15, r: 6, depth: 1, ratio: '4 / 3', crop: '20% 50%', m: [74, -2, 30] },
  { src: '/cases/sophia-mental-health/24.png', alt: 'Sophia’s questionnaire, from wireframe to final screen', caption: 'Sophia · Wireframe to UI',
    x: 48.5, y: 46, w: 10, r: -8, depth: .95, ratio: '1080 / 1144', m: [4, 52, 34] },
];

export default function Hero() {
  const { hire } = useCopy(), HERO = hire.hero;
  const trackRef = useRef<HTMLElement>(null), stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current!, stage = stageRef.current!;
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!MOTION) { track.classList.add('hv3-settled'); return; }

    // pointer target and eased value, scroll progress, anaglyph split driven by speed
    let mx = 0, my = 0, ex = 0, ey = 0, prog = 0, lastY = window.scrollY, split = 3, raf = 0, visible = true;
    const t0 = performance.now();
    const intro = (i: number, now: number) => easeOut(clamp01((now - t0 - 120 - i * 90) / 1100));

    const frame = (now: number) => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const pin = Math.max(1, r.height - window.innerHeight);
      prog = clamp01(-r.top / pin);
      // speed of scroll and pointer widens the split; it decays back to 3px (the static anaglyph)
      const dy = Math.abs(window.scrollY - lastY); lastY = window.scrollY;
      const dp = Math.hypot(mx - ex, my - ey) * 40;
      split = Math.max(3, lerp(split, 3 + Math.min(14, dy * 0.35 + dp), dy || dp > .2 ? .35 : .12));
      ex = lerp(ex, mx, .08); ey = lerp(ey, my, .08);
      stage.style.setProperty('--hv3-split', split.toFixed(2) + 'px');
      stage.style.setProperty('--hv3-prog', prog.toFixed(4));

      const vw = window.innerWidth, vh = window.innerHeight;
      let busy = Math.abs(mx - ex) > .001 || Math.abs(my - ey) > .001 || split > 3.05;
      cards.forEach((el, i) => {
        const d = Number(el.dataset.depth), k = intro(i, now);
        if (k < 1) busy = true;
        const cx = Number(el.dataset.x) / 100 - .5, cy = Number(el.dataset.y) / 100 - .4;
        // the composition opens up with scroll: each card drifts away from the centre, near planes most
        const out = prog * (0.25 + d) * 0.9;
        const tx = cx * vw * out - ex * 60 * (d + .15);
        const ty = cy * vh * out - prog * vh * 0.35 * (d + .2) - ey * 40 * (d + .15);
        const tz = lerp(-1400 - d * 400, (d - .5) * 260, k);
        el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotate(${el.dataset.r}deg)`;
        el.style.opacity = String(clamp01(k * 1.6));
        if (!FINE_POINTER) el.classList.toggle('hv3-lit', prog * (cards.length + 1) > i + 1);
      });
      if (busy && visible) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };
    const onMove = (e: PointerEvent) => { mx = e.clientX / window.innerWidth - .5; my = e.clientY / window.innerHeight - .5; kick(); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); });
    io.observe(track);
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    if (FINE_POINTER) window.addEventListener('pointermove', onMove, { passive: true });
    // headline tunes in once: the split starts wide and locks to the static 3px
    split = 18;
    kick();
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      window.removeEventListener('scroll', kick); window.removeEventListener('resize', kick);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const card = (c: Card, i: number) => (
    <figure key={c.src} ref={el => { cardRefs.current[i] = el; }} className={`hv3-card${c.wide ? ' hv3-wide' : ''}`}
      data-depth={c.depth} data-x={c.x} data-y={c.y} data-r={c.r}
      style={{ '--hv3-x': c.x / 100, '--hv3-y': c.y / 100, '--hv3-w': c.w, '--hv3-r': `${c.r}deg`, '--hv3-depth': c.depth,
        ...(c.m && { '--hv3-mx': c.m[0] / 100, '--hv3-my': c.m[1] / 100, '--hv3-mw': c.m[2] }) } as CSSProperties}>
      <img src={c.src} alt={c.alt} style={{ aspectRatio: c.ratio, objectPosition: c.crop }} draggable={false} />
      <figcaption>{c.caption}</figcaption>
    </figure>
  );

  return (
    <section className="hv3" ref={trackRef} aria-label={HERO.label}>
      <div className="hv3-stage" ref={stageRef}>
        {/* far planes behind the headline, near planes in front of it; the lede and CTA sit above everything */}
        <div className="hv3-scene hv3-back">{CARDS.map((c, i) => c.depth <= .6 && card(c, i))}</div>
        <div className="hv3-copy">
          <h1 className="hv3-title" data-focus tabIndex={-1}>{HERO.title}</h1>
        </div>
        <div className="hv3-scene hv3-near">{CARDS.map((c, i) => c.depth > .6 && card(c, i))}</div>
        <div className="hv3-copy hv3-copy-foot">
          <div className="hv3-foot">
            <p className="body-l hv3-lede">{HERO.lede}</p>
            <a className="btn primary" href="#contact">{HERO.cta}&nbsp;&nbsp;→</a>
          </div>
        </div>
      </div>
    </section>
  );
}

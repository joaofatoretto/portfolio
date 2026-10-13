# Hero lab: explorations of the /hire hero

Alternative heroes for /hire, each a different concept that shows João's real work as an art piece (3D, scroll,
parallax). They live on a dev-only route so they can be compared side by side; nothing here ships.

- **See them:** `npm run dev`, then `/lab/hero/<n>`. A pill at the bottom left switches between variants.
- **Route:** `App.tsx` adds `lab/hero/:v` only when `import.meta.env.DEV` is true, so it's left out of the production and prerender builds.
- **Page:** `src/lab/HeroLab.tsx` renders the chosen hero, then the rest of the real /hire page under it.
- **Registry:** `src/lab/heroes/index.ts` (`VARIANTS`). A variant only shows in the switcher once it's listed there.
- **Files:** each variant owns `src/lab/heroes/v<n>/`, containing `Hero.tsx` (default export) and `hero.css` (every rule
  scoped under `.hv<n>`).

| # | Name | Status |
|---|---|---|
| 1 | Channel corridor | Built (3D fly-through of screens, ends on Tempo framed as a TV) |
| 2 | Napkin to app | Built (exploded phone: sketch → research → wireframe → design → shipped) |
| 3 | Anaglyph depth | Built (editorial collage; headline between layers of greyscale work) |
| 4 | Channel drum | Built (12-face drum turns on scroll and drag, settles on a face "on air") |
| 5 | Noise to signal | Built (WebGL particles: static locks into Tempo, Foodpass, Casar.com, Superopa as you scroll; the full-resolution screenshot resolves over the mosaic once it has locked) |

To pick up 4 or 5:
1. Add `{ n: 4, name: 'Channel drum', load: lazy(() => import('./v4/Hero')) }` to `VARIANTS`.
2. Build it in its folder only.
3. Run the checks at the end of this file.

---

## Rules for every variant

**Content**
- Copy comes from `useCopy().hire.hero` (`title`, `lede`, `cta`).
- The title is the page's only `<h1>`.
- The lede and the primary CTA must be visible in the first screen, on desktop and phone. The CTA is
  `<a className="btn primary" href="#contact">{cta}&nbsp;&nbsp;→</a>`.
- Small labels (case names, "CH 06") may be inline strings while it's a lab. Move them to `src/content/` (English and
  Portuguese) if the variant is adopted.
- Names and facts only from `src/content/cases/index.ts`. No new numbers, no prices.
- Every visible image needs real alt text.

**Images**
- Only João's case images, in `public/cases/<slug>/` (served as `/cases/...`). No stock, no AI imagery.
- Tempo:
  - `tempo-landing-page/cover.png` (2048×1562), a dark site with purple glow.
  - `01.png` and `03.png`.
  - `/hire/tempo/page-1..4.webp`, the full landing page.
- Foodpass:
  - `benefits-card-app/cover.png` (2048×1162), purple, with phones and mascots.
  - `01..04.png`, flows of phone screens.
- Casar.com:
  - `photo-editing/cover.png` (1920×1080), pink, tilted phones.
  - `12.png`, a modal.
  - `08.jpg`, the ideation board.
- Superopa:
  - `promotions-discoverability/cover.png` (2048×1113), blue admin screens with "+15% on add to cart".
  - `02–04.png`, research.
- Sophia:
  - `sophia-mental-health/cover.jpg` (1920×1080). Already an isometric shot of phones; see the lessons below.
  - `33.jpg`, a wall of screens.
  - `16–19.jpg` and `27.jpg`, paper sketches.
  - `22–25.png` (1080×1144), wireframe → UI phone pairs.
  - `02.png`, `10.jpg`, `11.jpg`, `13.jpg`, sticky-note boards.

**Brand (design.md, read it first)**
- Background and type:
  - Dark Stage background (`var(--ink)`), white type, greys.
  - Headline in `var(--font-display)`, 700, tight tracking.
  - `var(--font-mono)` for labels, `var(--font-osd)` only for TV on-screen words.
- Colour:
  - Rose/cyan only on display type ≥ 64px, the primary CTA, and in tune-in or transition motion.
  - Case images keep their own colours.
- Motion:
  - Scroll-driven motion is free.
  - Autonomous motion plays once and settles. Nothing loops forever except a faint idle (5% grain, ≤ 2px drift).
  - Pointer tilt or parallax only on fine pointers (`FINE_POINTER` from `src/lib/motion.ts`).
- No "scroll" hint text (design.md §2).
- Reduced motion (`!MOTION`): no intro, no scroll animation. Show one composed, finished still.

**Code**
- No new dependencies. Use CSS 3D, SVG, canvas 2D or raw WebGL.
- Helpers:
  - `src/lib/motion.ts`: `MOTION`, `REDUCE`, `FINE_POINTER`, `clamp01`, `lerp`, `ss`, `easeOut`, `easeLock`, `animate`.
  - `src/lib/tv.tsx`: `makeStatic`.
  - `src/lib/signal.ts`: seeded noise.
- Don't branch the first render on `MOTION` or `window`. Starting states go in CSS under `html.motion .hv<n> …`;
  change them in effects.
- Use descriptive custom-property names (`--hv4-turn`), never short ones (`--g` and `--p` clash with tokens).
- Don't reuse global class names (`.intro`, `.content`, `.stage`, `.paper`).
- Pinned heroes:
  - A tall track (≤ 300svh) with a `position: sticky; top: 0; height: 100svh` stage.
  - Progress comes from the track's `getBoundingClientRect()` in a rAF-throttled passive scroll listener.
  - Write transforms or CSS variables directly. No React state per frame.
- Clean up listeners, rAF, observers and WebGL contexts on unmount.
- Pause loops when settled or off screen. React StrictMode runs effects twice in dev, so timers must be cleared too.
- The nav is fixed (80px, `var(--navh)`). Start content below it.
- Phones (≤ 640px) must look designed, not just shrunk. No horizontal overflow.

## Lessons from variants 1–3

- **Headline blinking (V1):**
  - On real GPUs the headline over a CSS 3D scene blinked. It didn't happen in headless Chrome (software rendering).
  - Likely causes, all removed from V1:
    - `mix-blend-mode` and `backdrop-filter` inside the 3D scene.
    - Animated `filter: drop-shadow(...)` on elements in a `preserve-3d` tree.
    - The text itself living in a 3D layer, next to dozens of `will-change` layers.
  - Keep the text in plain 2D, keep filters and blend modes out of 3D scenes, and promote only the moving world.
  - Check on a real machine; headless screenshots won't show it.
- **Don't double-distort:** the Sophia and Casar covers are already perspective shots. On a wall turned 48° they
  looked ugly. Hang them nearly flat (≤ 25°), or crop to a single flat screen.
- **Nothing cut off at scroll 0:** every screen in the first view should be fully in frame, including its caption.
- **Headless screenshots:** the shared Playwright MCP browser may be busy. You can use
  `playwright` from the npx cache with `chromium.launch({ executablePath: '/usr/bin/google-chrome' })`.

---

## V4 · Channel drum (rotating 3D carousel)

**Idea:** the old TV channel dial made physical. A giant cylinder of screens turns as you scroll. Every face is a piece
of João's work, and the face pointing at you is "on air".

**Layout**
- A pinned track (~300svh).
- A CSS 3D cylinder of 10–14 faces, each a case image, placed with `rotateY(i * angle) translateZ(radius)`.
- Seen slightly from below or above, and big enough to bleed off both sides of the screen.
- Behind it, the headline in huge type.
- The lede and CTA sit on a quiet strip at the bottom left that stays put.

**Scroll**
- One full turn over the track.
- When scrolling stops, the drum eases so the nearest face settles to the front.

**Faces**
- The front face is bright and in focus, with an OSD label in the corner in VT323 (e.g. "CH 06·3  TEMPO").
- Side faces fade into darkness with angle. Use an overlay's opacity, not `filter` (see the lessons above).
- While it spins fast: a brief rose/cyan split and scan lines on the faces. That counts as tune-in motion, so the
  colour is allowed. They settle back to clean when it stops.

**Pointer**
- On fine pointers, dragging horizontally also turns the drum, with inertia.
- A small tilt follows the cursor.

**Phone:** a smaller radius, 8 faces, still bleeding off the sides. Headline above the drum, CTA below it.

**Reduced motion:** the drum standing still, Tempo on the front face, labels visible.

**Faces to use:**
- Covers of all five cases.
- Tempo `01.png` and `03.png`.
- Foodpass `01.png`.
- Casar `12.png`.
- Superopa `02.png`.
- Sophia `33.jpg` and one sketch (`19.jpg`).
- Crop the perspective covers to their flattest area, or accept them only on the front face.

## V5 · Noise to signal (generative particle image)

**Idea:** the brand's core sentence, "noise becomes signal" (design.md §1), performed on João's work. Thousands of
particles start as TV static and gather into a real case screen. Scroll, and they break apart and lock into the next one.

**Setup**
- A pinned track (~300svh) with a full-bleed canvas.
- WebGL points are preferred. Fall back to canvas 2D if WebGL isn't available.
- Sample 3–4 case images into a grid of particles, storing each one's target position and colour:
  - Tempo cover.
  - Foodpass cover.
  - Sophia cover.
  - Superopa cover.
- About 25–40k particles on desktop, 8–12k on phones.

**Load (plays once)**
- The screen starts as static snow: particles at random positions, grey.
- Over ~1.6s they flow along curved paths through a seeded noise field (like the brand's fibres) and form the first
  image (Tempo).
- The headline, lede and CTA sit over it on the left, with a dark gradient behind them for legibility. The image is
  framed on the right, or full-bleed but dimmed.

**Scroll**
- Between images, the particles burst out into the noise field, with a brief rose/cyan split on the moving particles.
- Then they lock into the next image.
- The current case's name appears in mono under it.

**Pointer:** on fine pointers, particles near the cursor push away and spring back, like a lens of noise.

**Depth**
- Each particle gets a slight z under perspective, so brighter pixels lift toward the viewer. The image gets a
  shimmering relief.
- The whole image rotates a few degrees with scroll and cursor.

**Phone:** fewer particles, with the image above or behind the text, still crisp.

**Performance:** pause the render loop when settled and idle, and when the hero is off screen.

**Reduced motion:** the first image fully formed and still. No loop.

---

## Checks before calling a variant done

1. `npx tsc -b` and `npx vitest run` pass.
2. Load `/lab/hero/<n>` at 1440×900 and 390×844, and look at screenshots at scroll 0, mid-hero and end of hero, plus with
   reduced motion. Fix cropping, unreadable text, nav overlap, empty frames and broken images.
3. No console errors, and `document.documentElement.scrollWidth <= innerWidth` at both sizes.
4. Scroll it on a real laptop browser (GPU) and watch for blinking and dropped frames.

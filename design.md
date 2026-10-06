# Frequency — João Fatoretto's brand system

> **Listen.** Many voices go in. One clear signal comes out.

Frequency is the brand of João Fatoretto's portfolio as a UX/UI Designer and Design Engineer. This file is the source of truth for the brand. Figma (variables, text styles, effect styles, components) and code (CSS variables) both derive from it. When they disagree, this file wins; update it first.

---

## 1. Brand story

### What it's for

Frequency is the visual identity of **João Fatoretto's portfolio**. João works as a **UX/UI Designer and Design Engineer**, which means three jobs in one:
- researching with real people and data;
- designing the interface;
- building it in production code.

The portfolio is read by design leads, product managers, engineering leads and recruiters, usually in under a minute. In that time it has to show three things: who João is, how João works, and proof that the work ships.

Most portfolios open with a style. This one opens with a method.

### The idea: listen, then tune in

Every project starts noisy. Interviews contradict each other, analytics point three ways, stakeholders want different things, and support tickets repeat the same pain in a hundred different words. The work is to listen to all of it, find the pattern, and turn it into one clear decision that can be built.

That's why the hero word is **Listen.** It names the first step of the process, the one that decides whether everything after it is right.

The whole brand tells one transformation in many forms: **noise becomes sound**. Many voices go in; one clear frequency comes out. Nothing in the system is decoration. Every element is a version of that sentence.

### Why each piece exists

**The mark: an oscilloscope figure.**
- A 3:2 Lissajous figure is what an oscilloscope draws when two frequencies lock into a stable ratio. Here the two frequencies are design and engineering, held in a steady relationship.
- An oscilloscope is an engineer's instrument, so the mark quietly signals the Design Engineer half.
- The large version keeps faint, noisy traces behind the clean figure: the noise it came from.

**The fibres: many voices, one frequency.**
- Forty noisy lines (users, data, stakeholders) converge into a single wave.
- That wave is the brand chord, built from the same 3:2 ratio as the mark, so the hero ends in João's own frequency.

**The TV tune-in: static before the picture.**
- An old analogue TV hunting for a channel shows static until the signal locks, then the picture appears.
- The site does the same when it loads. The visitor sees the noise first, and the content arrives as the result of finding the signal, which is exactly how a project feels from the inside.
- It also gives the site a navigation language: CH 01 is home, CH 02 case studies (CH 02·n per case), CH 03 how I build, CH 04 about, CH 05 contact, CH 06 start a project (/hire). Moving between pages is changing channels.

**The 3D anaglyph: rose and cyan.**
- Red/cyan 3D film works by offsetting two images. When your eyes line them up, depth appears. Design and engineering are those two images.
- The colour is also exactly what the tune-in's colour split looks like, frozen into a signature.
- It appears in only two places, the headline and the main button, where the signal matters most. That keeps it special and keeps the aesthetic black and white.

**Stage and Paper: the screen and the room.**
- The site is dark: Stage is the page, where the brand speaks and the work is shown.
- Paper is the room around the TV: on home it frames the hero as it closes into the card and holds the results under it; on /hire it frames the hero and holds the trust strip. Then the page turns to Stage for good.
- Black and white keeps attention on the work. Colour appears only at moments of meaning.

**The typography: three voices with three jobs.**
- **Nohemi** is geometric and wide: confident at 200px, soft in its light weights for long reading.
- **IBM Plex Mono** is the engineer's notebook: timecodes, captions, build notes.
- **VT323** is the TV's on-screen display, and nothing else.

**Generated graphics: made in code, not found.**
- Every graphic is generated from seeded noise and parametric curves. Nothing is stock, nothing is AI-generated.
- Each one is unique, can be regenerated exactly, and can animate on the web.
- That makes the site itself the first piece of evidence for the Design Engineer claim.

### How it came together

1. **Critique.** The first hero had the right word, "Listen.", but a generic AI-generated scribble, vague copy and no proof. The word stayed; everything else had to earn its place.
2. **Exploration.** Seven concepts of noise becoming a frequency were generated as 14 SVGs: single strokes, ridgelines, voice bars, an LED matrix, ripples, oscilloscope figures, particles, and real research inputs.
3. **Choice.** "Many voices, one frequency" (the fibres) became the hero graphic, and the oscilloscope figure became the mark. Their shared 3:2 ratio ties them together.
4. **Motion.** The TV tune-in turned the metaphor into the page-load experience, with channels as navigation.
5. **Colour.** The rose/cyan anaglyph added a controlled touch of colour, borrowed from the tune-in's own colour split, without breaking the black-and-white aesthetic.
6. **System.** Tokens, type, components and assets were written down once (design.md), then mirrored in this design system, the React prototype and the Figma library.

### What the portfolio proves

- **As a UX/UI Designer:** research leads. The site starts with listening, shows real inputs and real quotes, and every case study ends with a measurable result.
- **As a Design Engineer:** the site is built the way it's designed. The generated graphics, the tune-in animation and the tokens shared between Figma and code show the craft working at both ends.

### Guardrails

- **Dark mode is the standard.** Every page and every new section is on Stage. Paper is reserved for the rooms around the TV heroes (home: the hero frame and the results; /hire: the hero frame and the trust strip, João's OK 2026-10-05), and nowhere else without João's OK.

- Noise is a starting point, never a style. Static and glitches appear only while tuning in.
- Colour stays rare: rose and cyan together, on the headline and the main button only.
- Never fake the evidence. Placeholder quotes, sources and availability get replaced with real ones, or removed.

### Principles

1. **Listen first.** Show the real inputs (research quotes, data sources, constraints) before the output. Never decorate with fake evidence.
2. **One signal per view.** Each screen has one loud thing: a headline, a wave, or a piece of work. Everything around it stays quiet.
3. **Show the mechanism.** Graphics are generated from code (seeded noise, parametric curves), never stock or AI images. They prove the "ships code" claim.
4. **Quiet at rest, alive in detail.** The page is calm and black-and-white. Colour and motion appear only at moments of meaning: tuning in, hovering the main action.
5. **The message leads, the picture supports.** Every section has one sentence the reader must leave with ("You pay for this piece"). That sentence gets the strongest treatment in the section (size, the solid white block, the last and clearest motion). Illustrations around it step back: small, greys only, no words, no white fills. If the eye lands on a drawing first, the drawing is too loud.
6. **One thing moves at a time.** Never several animations running at once, never a loop that plays forever. Something moves, finishes, and holds still so it can be read; then the next thing moves. The reader always knows where to look.
7. **Picture the reader's business, not ours.** On pages for clients (/hire), examples and mock screens show outcomes any business or founder could want (new customers, less busywork, happier customers, money coming in), never one kind of shop. Mock screens never show prices.

---

## 2. Voice

- First person, plain and direct. Short sentences.
- Say what was done and what changed: "Cut onboarding from 7 steps to 3. Activation went up 24%."
- Name the listening: "I interviewed 12 support agents before drawing anything."
- Avoid: *passionate, pixel-perfect, synergy, delightful, leverage, world-class*, ellipses, exclamation marks.

| Instead of | Write |
|---|---|
| Study cases | Case studies |
| Craft and code are just ways for helping them... | I design and build the solution myself, from Figma to production code. |
| Scroll down | *(nothing; let the layout invite scrolling)* |

---

## 3. Logo

### Mark: your frequency

A 3:2 Lissajous figure. Construction, for `t ∈ [0, 2π]`:

```
x(t) = cx + R · sin(3t + π/2)
y(t) = cy + R · sin(2t)
```

- Always a single open stroke (round joins), never filled.
- The **hero mark** (≥ 200px) adds 4 faint "noise" ghost traces behind the clean figure: same curve with seeded fbm phase noise (amplitude 0.35 rad), stroke = mark stroke ÷ 3, opacity 18%.
- Small marks use the clean figure only.

| Size | Stroke | Inner padding | Ghost traces | Use |
|---|---|---|---|---|
| 16px | 1.4px | 20% | no | Favicon |
| 32px | 2.2px | 20% | no | Favicon @2x, tab icon |
| 40px | 2.2px | 8% | no | Nav lockup |
| 64px | 3.2px | 20% | no | App icon small |
| 128px | 5px | 20% | no | App icon, social avatar |
| 300px | 3px | 15% | 4 | Hero, loader, about page |

**Clear space:** 25% of the mark's width on every side.
**App icon:** mark on Ink, corner radius 22% of icon size.

### Lockup

Mark (40px) + 12px gap + "João Fatoretto" in Display SemiBold 18px. Ink on Paper, White on Stage.

### Don't

- Don't fill, outline-double, rotate, or skew the mark.
- Don't change the 3:2 ratio. It's the signature.
- Don't add gradients or glows to the mark.
- Don't apply the anaglyph effect to marks smaller than 64px.
- Don't animate the mark except for the "lock-in" (the phase drifts, then locks), used as the loader.

---

## 4. Colour

The system is **98% black and white**. The only colours are the anaglyph pair (rose and cyan, from red/cyan 3D-cinema glasses) and a green used only for availability.

### Primitives

| Token | Hex | Role |
|---|---|---|
| `ink` | `#0A0A0B` | Stage background, text on Paper |
| `paper` | `#F7F9FD` | The room around the home hero (cool off-white) |
| `white` | `#FFFFFF` | Text on Stage, primary CTA fill |
| `grey-100` | `#ECEEF3` | Hover fill on Paper |
| `grey-150` | `#E5E5E5` | Intro text on Stage |
| `grey-200` | `#DDE1EA` | Hairlines on Paper |
| `grey-300` | `#AEB3BF` | Hover borders on Paper |
| `grey-400` | `#A3A3A3` | Secondary text on Stage |
| `grey-500` | `#8A8A8E` | Tertiary text on Stage |
| `grey-600` | `#6B6C72` | Tertiary text on Paper |
| `grey-700` | `#55565C` | Secondary text on Paper |
| `grey-750` | `#3A3A3C` | Secondary button border on Stage |
| `grey-800` | `#2E2E30` | Hairlines and borders on Stage |
| `grey-850` | `#161618` | Raised surface on Stage (thumbnails) |
| `rose-400` | `#FF3D6E` | Anaglyph left, on Stage |
| `rose-600` | `#D81E4F` | Anaglyph left, on Paper |
| `cyan-400` | `#22B8FF` | Anaglyph right, on Stage |
| `cyan-600` | `#006BB8` | Anaglyph right, on Paper |
| `signal-400` | `#4ADE80` | Availability dot, on Stage |
| `signal-700` | `#15803D` | Availability dot, on Paper |

### Themes (semantic tokens)

**Dark mode is the standard:** Stage is the default theme for every page and section. Paper is an exception, used once.

Two surfaces: **Stage** (the default page and every black card, where the brand speaks) and **Paper** (the room around the home hero: it frames the TV as it closes into the card, and holds the results section; nothing else). A Stage card on the Stage page (contact, case header) is framed by a 1px `line` border.

| Semantic token | Stage | Paper |
|---|---|---|
| `bg` | ink | paper |
| `surface` | grey-850 | white |
| `fg-primary` | white | ink |
| `fg-secondary` | grey-400 | grey-700 |
| `fg-tertiary` | grey-500 | grey-600 |
| `fg-intro` | grey-150 | grey-700 |
| `line` | grey-800 | grey-200 |
| `line-strong` | grey-750 | grey-300 |
| `cta-bg` | white | ink |
| `cta-fg` | ink | white |
| `anaglyph-left` | rose-400 | rose-600 |
| `anaglyph-right` | cyan-400 | cyan-600 |
| `status` | signal-400 | signal-700 |
| `focus` | white | ink |

### Usage ratio

- ~90% Ink or Paper, ~8% greys, **≤ 2% rose + cyan**, and green only on the status dot.
- Exception: a client logo in the logo carousel shows its own brand colours while hovered (§9).
- Rose and cyan always appear **as a pair**, rose to the left and cyan to the right. Never use one alone, never as a fill, never to carry meaning (such as error or success).

### Contrast (WCAG 2.x, computed)

| Foreground | on Ink | on Paper |
|---|---|---|
| white | 19.8 ✅ | n/a |
| grey-150 `#E5E5E5` | ≈16 ✅ | n/a |
| grey-400 `#A3A3A3` | 7.9 ✅ | 2.4 ❌ |
| grey-500 `#8A8A8E` | 5.8 ✅ | 3.3 ❌ |
| grey-600 `#6B6C72` | 3.8 ❌ | 5.0 ✅ |
| grey-700 `#55565C` | 2.7 ❌ | 6.9 ✅ |
| rose-400 | 5.8 ✅ | 3.2 ❌ |
| rose-600 | 4.0 (large only) | 4.7 ✅ |
| cyan-400 | 8.8 ✅ | 2.1 ❌ |
| cyan-600 | 3.6 (large only) | 5.3 ✅ |
| signal-400 | 11.4 ✅ | 1.7 ❌ |
| signal-700 | 4.0 (large only) | 4.8 ✅ |

That's why each accent has a Stage shade and a Paper shade: always use the semantic token, never the primitive.

---

## 5. The anaglyph effect

Two offset copies of a shape (rose to the left, cyan to the right), like a 3D film seen without glasses. It's the same red/blue separation as the tune-in, frozen as a signature.

### Where it's allowed

| Element | Offset | State |
|---|---|---|
| Display type ≥ 64px ("Listen.") | `max(2px, 0.02em)` each side, so 4px at 200px | Static |
| Primary CTA | 3px each side | Hover: 5px. Pressed: 0px ("locked"). |
| Tune-in "Signal found" / "Locking" phases | 16px → 0px (animated) | Motion only |
| Hero mark ≥ 64px (optional) | 2px | Static |

### Where it's forbidden

Body text, labels, buttons other than the primary CTA, the nav, icons below 64px, and anything the user has to read carefully.

### Implementation

```css
/* Display */
.display-anaglyph {
  text-shadow:
    calc(-1 * max(2px, 0.02em)) 0 0 var(--anaglyph-left),
    max(2px, 0.02em) 0 0 var(--anaglyph-right);
}

/* Primary CTA */
.cta {
  box-shadow: -3px 0 0 var(--anaglyph-left), 3px 0 0 var(--anaglyph-right);
  transition: box-shadow var(--dur-quick) var(--ease-signal);
}
.cta:hover  { box-shadow: -5px 0 0 var(--anaglyph-left), 5px 0 0 var(--anaglyph-right); }
.cta:active { box-shadow: 0 0 0 transparent, 0 0 0 transparent; }
.cta:focus-visible { outline: 2px solid var(--focus); outline-offset: 7px; } /* clears the 5px fringe */
```

**Figma:** effect styles made of two drop shadows (blur 0, spread 0): `x = −offset` in `anaglyph-left`, then `x = +offset` in `anaglyph-right`.

**Tune-in:** the RGB-split filter should tint its channels rose and cyan (not pure red and blue), so the animation lands exactly on the static anaglyph.

---

## 6. Typography

| Role | Family | Fallback (web/Figma) | Why |
|---|---|---|---|
| Display + text | **Nohemi** | Sora → Avenir Next → system-ui | Geometric, wide, confident. Its light weights keep long copy soft. |
| Mono | **IBM Plex Mono** | ui-monospace, Menlo | Timecodes, metadata, technical captions: the "engineer's notes" layer. |
| OSD | **VT323** | IBM Plex Mono | TV on-screen display. Tune-in and channel labels only. |

> Nohemi must be self-hosted on the web. Check the licence covers web use. Sora is the stand-in everywhere Nohemi isn't available (including Figma automation).

### Scale

Desktop values. Mobile uses the `clamp()` minimum.

| Style | Weight | Size / line-height | Tracking | CSS size |
|---|---|---|---|---|
| `display/xl` | Bold | 200 / 0.88 | −4% | `clamp(72px, 13.5vw, 200px)` |
| `display/l` | Bold | 120 / 0.9 | −3% | `clamp(56px, 8.5vw, 120px)` |
| `display/m` | Bold | 72 / 0.95 | −2% | `clamp(44px, 5.5vw, 72px)` |
| `heading/1` | SemiBold | 48 / 1.1 | −1% | `clamp(34px, 3.4vw, 48px)` |
| `heading/2` | SemiBold | 32 / 1.2 | −1% | `clamp(26px, 2.3vw, 32px)` |
| `heading/3` | SemiBold | 24 / 1.3 | 0 | 24px |
| `body/l` | Light | 22 / 34 | 0 | `clamp(18px, 1.55vw, 22px)` |
| `body/m` | Regular | 16 / 26 | 0 | 16px |
| `body/s` | Regular | 14 / 22 | 0 | 14px |
| `label/button` | Medium (Sora: Regular) | 17 / 24 | 0 | 17px |
| `label/nav` | Regular | 16 / 24 | 0 | 16px |
| `mono/label` | Plex Mono Medium | 13 / 20 | +1% | 13px |
| `mono/caption` | Plex Mono Regular | 12 / 18 | +1% | 12px |
| `osd` | VT323 | 40 / 40 | +4% | `clamp(26px, 3vw, 40px)` |

Rules:
- One `display` per view. The section titles that carry a section's message (e.g. "Picture it working.", "You pay as I deliver.") use `display/m`.
- Running text max ~65 characters per line.
- Headings get `text-wrap: balance`.
- Numbers in tables and timecodes are tabular (`font-variant-numeric: tabular-nums`).

---

## 7. Layout, spacing, shape

- **Base unit:** 4px.
- **Spacing scale:** `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-6` 24 · `space-8` 32 · `space-10` 40 · `space-12` 48 · `space-16` 64 · `space-18` 72 · `space-24` 96 · `space-32` 128
- **Page:** max width 1440px, side gutter 24px (16px under 640px), 12-column grid with 24px gutters.
- **Stage:** the black card sits 24px inside the page edges, with padding 56–64px desktop and 24px mobile.
- **Radius:** `radius-none` 0 is the default for everything (buttons, cards, stage). `radius-pill` 999 is for the status pill only. `radius-icon` (22%) is for the app icon only.
- **Lines:** 1px hairlines (`line` token). No drop shadows anywhere; the only "shadow" in the system is the anaglyph.

---

## 8. Signal graphics (assets)

All graphics are generated with seeded noise, so they're reproducible. White on Ink by default.

### Fibres: "Many voices → your frequency" (primary)

- 40 fibres, stroke 0.8px at 28% opacity. The output line is 2.4px at 100%, with an 8px glow at 8%.
- Each fibre is fbm noise (4 octaves, frequency 0.012, seeds 600+), amplitude 135, soft-limited with `128·tanh(v/128)`.
- Fibres converge with `smoothstep(10%, 80%)` of the width.
- **Output = brand chord** (the same two frequencies as the mark):
  `y = 50 · (0.62·sin(3θ + π/2) + 0.38·sin(2θ))`, `θ = 2πx / 190`
- Variants: *Dense* (56 fibres, 0.7px, 22%), *Brand chord* (default), *Chord → mark* (the wave ends in the mark).
- Canvas: 1264×300 (hero band). Scale proportionally, and keep strokes non-scaling.

### Secondary library

The 14 concept SVGs (ridgelines, voice bars, LED matrix, focus rings, listening ring, particles, flow field, sources, verbatim quotes). Use them for section dividers, case-study covers and social posts. **Max one per page.**

### Static texture

TV snow for tune-in and transitions. Grain at 5% opacity is allowed on Stage at rest.

### Imagery

- Real product screenshots only, on Stage (`surface` background, 1px `line` border, square corners).
- Captions in `mono/caption`.
- No stock photos, no AI-generated illustrations.

---

## 9. Components

| Component | Spec |
|---|---|
| **Button / primary** | Stage: `cta-bg` white, `cta-fg` ink, 56px tall, 28px side padding, `label/button`, square. Anaglyph 3px, hover 5px, pressed 0. |
| **Button / secondary** | Transparent, 1px `line-strong` border, `fg-primary` text. Hover: border to grey-500 (Stage) / grey-300 (Paper). |
| **Button / nav** ("Let's talk") | `cta-bg` fill, `cta-fg` text (white on Stage, ink on Paper), 48px tall. No anaglyph (only one CTA per view gets it). |
| **Nav** | 80px tall, lockup left, links right with 40px gaps. Under 720px, text links collapse and only "Let's talk" stays. Takes the theme of what's under it: transparent over the full-screen hero, Paper over the room, Stage everywhere else, with a 1px `line` hairline under it. |
| **Status pill** | 1px `line` border, pill radius, 8px `status` dot, `body/s` in `fg-secondary`. Only for real availability. |
| **Eyebrow** | `body/m`–18px in `fg-secondary`: "João Fatoretto — Product Designer who ships code". |
| **Case card** | Thumbnail (`surface`, 1px `line`, 208px tall) → title `heading/3`-18 → meta in `body/s` `fg-tertiary` (role · measurable result) → ↗ icon. |
| **OSD label** | `osd` style, white, 6px white glow, faint rose/cyan fringe. Always `aria-hidden`. |
| **Focus ring** | 2px `focus` outline, 3px offset (7px on the primary CTA). |
| **Step list** (step sections) | One row per step: `mono/caption` number (01…) and the step name in a bold display size (22–34px), grey-600 until it's the current one, then `fg-primary`. Under each, a 2px bar: empty (`line`), filling white while current (`--f`), grey-600 once seen. Each row is a button that jumps to its step. On phones it becomes a row of story bars with the current step's name under them. |
| **Payment slot** (/hire pay) | Full-width block, 56px tall, `body` 18px bold. Before its piece is delivered: 1.5px dashed `line-strong` outline, "Nothing to pay yet" in `fg-tertiary`. After: solid `fg-primary` block with `bg` text, "You pay for this piece". The loudest element of its section. |
| **Mock screen** (illustration) | A phone or a 16:10 frame drawn in code. Real-looking UI made of things any business has (people, tasks, reviews, payments). Where it supports a message, keep it quiet: greys only, no text. |
| **Logo carousel** | Client logos flattened to one ink tone (`brightness(0)`, 58% opacity). Hovering a logo shows its own colours: the one exception to §4, because it's the client's colour, not ours (João's choice, 2026-10-05). One slow linear loop (~5s per logo), 1px `line` hairlines above and below. Under a mouse it holds still in the middle (so a logo can be looked at) and runs faster toward the edges, forwards on the right, backwards on the left. It bleeds edge to edge up to a 1920px screen (the one element allowed past the 1440px page width); wider, it stays 1920px and its edges fade out. Reduced motion: one still copy wrapped in centred rows. Only real clients from career.md. |

---

## 10. Motion

| Token | Value |
|---|---|
| `dur-instant` | 100ms |
| `dur-quick` | 200ms (hover, anaglyph widen) |
| `dur-base` | 300ms (channel switch) |
| `dur-tune` | 3600ms (full tune-in) |
| `ease-signal` | `cubic-bezier(0.2, 0.8, 0.2, 1)` (settle, ease-out) |
| `ease-lock` | `cubic-bezier(0.7, 0, 0.2, 1)` (snap into place) |

### Tune-in sequence (page load)

| Phase | Time | What happens |
|---|---|---|
| 00 No signal | 0–0.4s | Snow |
| 01 Searching | 0.4–0.9s | Smear and rolling bar |
| 02 Signal found | 0.9–1.4s | Content shows through, anaglyph split 16px, tears |
| 03 Locking | 1.4–1.8s | Split to 0, static to 6% |
| 04 Tuned | 1.8–3.4s | Fibres draw left to right |
| 05 Settled | 3.4s+ | 5% grain at 12fps |

- **Guided sequence** (groups of items: stats, cards, phones, chips): the items arrive one at a time in reading order, about 300ms apart, each only once it is on screen and never before the one before it. Inside an item, its parts follow each other 140ms apart (e.g. number → what it means → source), and a part with its own motion (a scramble, a tune-in) starts when its item arrives. The eye is led through the group instead of taking it in at once.
- **Plays once, then holds.** Section animations run once when their section is in place (pinned or in view) and end in their finished state, which is also what shows without motion. Nothing loops forever; nothing starts while the reader can't see it.
- **Step sections** (a story told in steps on one stage: "Picture it working", "You pay as I deliver"):
  - The stage holds still (sticky) while the reader scrolls through a taller track; the scroll picks the step. Nothing starts until the stage has fully arrived.
  - Each step plays once and holds. Its bar (or the line to the next step) fills by itself over ~3.5–4.5s, then the next step comes on. A reader who stops scrolling still sees every step; scrolling just gets there sooner.
  - Scroll always answers: every bit of forward scroll visibly fills the bar, and the bar is full exactly when the scroll reaches the next step, never before (no dead scroll). Scrolling back gives a step its full time again.
  - The reader always wins: any scroll, touch, key or click stops an automatic move, and the timer waits ~1.2s after the last input before moving on. Automatic moves are one smooth glide to the next step, and they never carry the reader out of the section.
  - The last step gets a shorter stretch of scroll, so the section lets go soon after it.
  - Between steps on a TV screen: a quick channel flick (~380ms).
  - Where the stage can't hold (stacked layouts on phones), each step comes on as it reaches ~60% of the screen, at most one every 700ms. Reduced motion: no holding, no timer; the step list switches the screen.
  - No "scroll" hint text (§2): the moving bar and the instant response to scroll are the invitation.
- **Channel switch** (page transitions): a 300ms burst of phases 01–03.
- **Reduced motion:** start at 05 with static grain, no channel bursts, no hover widening (the colour stays at 3px).

Reference prototype: https://claude.ai/artifact/PLqtbh1SiqoadGxBrYwhJD

---

## 11. Accessibility

- Text contrast ≥ 4.5:1 (see §4). Rose, cyan and green never carry meaning on their own.
- Anaglyph only on display ≥ 64px and the primary CTA. The offset is capped so glyph shapes stay intact.
- All static, OSD and decorative SVG is `aria-hidden`. Signal graphics that tell the story get one `aria-label` ("Many noisy lines converging into one clear wave").
- Visible focus on every interactive element.
- `prefers-reduced-motion` is respected everywhere.
- No autoplay sound, ever.

---

## 12. Tokens (CSS)

```css
:root {
  /* primitives */
  --ink:#0A0A0B; --paper:#F7F9FD; --white:#FFFFFF;
  --grey-100:#ECEEF3; --grey-150:#E5E5E5; --grey-200:#DDE1EA; --grey-300:#AEB3BF;
  --grey-400:#A3A3A3; --grey-500:#8A8A8E; --grey-600:#6B6C72; --grey-700:#55565C;
  --grey-750:#3A3A3C; --grey-800:#2E2E30; --grey-850:#161618;
  --rose-400:#FF3D6E; --rose-600:#D81E4F; --cyan-400:#22B8FF; --cyan-600:#006BB8;
  --signal-400:#4ADE80; --signal-700:#15803D;

  /* spacing, shape, motion */
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-6:24px; --space-8:32px;
  --space-10:40px; --space-12:48px; --space-16:64px; --space-18:72px; --space-24:96px; --space-32:128px;
  --radius-none:0; --radius-pill:999px; --stroke-hairline:1px;
  --dur-instant:100ms; --dur-quick:200ms; --dur-base:300ms; --dur-tune:3600ms;
  --ease-signal:cubic-bezier(.2,.8,.2,1); --ease-lock:cubic-bezier(.7,0,.2,1);

  /* type */
  --font-display:'Nohemi','Sora','Avenir Next',system-ui,sans-serif;
  --font-mono:'IBM Plex Mono',ui-monospace,Menlo,monospace;
  --font-osd:'VT323','IBM Plex Mono',monospace;
}

/* Stage theme (the default page, and every black card) */
:root, .stage {
  --bg:var(--ink); --surface:var(--grey-850);
  --fg-primary:var(--white); --fg-secondary:var(--grey-400); --fg-tertiary:var(--grey-500); --fg-intro:var(--grey-150);
  --line:var(--grey-800); --line-strong:var(--grey-750);
  --cta-bg:var(--white); --cta-fg:var(--ink);
  --anaglyph-left:var(--rose-400); --anaglyph-right:var(--cyan-400);
  --status:var(--signal-400); --focus:var(--white);
}

/* Paper theme (the room around the home hero) */
.paper {
  --bg:var(--paper); --surface:var(--white);
  --fg-primary:var(--ink); --fg-secondary:var(--grey-700); --fg-tertiary:var(--grey-600); --fg-intro:var(--grey-700);
  --line:var(--grey-200); --line-strong:var(--grey-300);
  --cta-bg:var(--ink); --cta-fg:var(--white);
  --anaglyph-left:var(--rose-600); --anaglyph-right:var(--cyan-600);
  --status:var(--signal-700); --focus:var(--ink);
}
```

---

## 13. Figma library map

| Figma | Contents |
|---|---|
| Variables › **Primitives** | colour, space, radius, stroke |
| Variables › **Theme** | semantic colours, modes **Stage** / **Paper** |
| Text styles | `display/*`, `heading/*`, `body/*`, `label/*`, `mono/*`, `osd` (Sora until Nohemi is swapped in; changing the family in each style updates everything) |
| Effect styles | `anaglyph/display-4`, `anaglyph/display-2`, `anaglyph/cta`, `anaglyph/cta-hover`, `texture/grain` |
| Components | Button (primary / secondary / nav × default / hover / pressed / focus), Status pill, Nav, Lockup, Case card, OSD label |
| Assets | Mark (16–300, Stage/Paper, hero with ghosts), lockups, app icons, fibre bands (3 variants), concept library (14), static texture |

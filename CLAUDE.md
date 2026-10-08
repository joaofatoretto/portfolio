# Portfolio: working notes

João Fatoretto's portfolio: Vite + React 19 + TypeScript + React Router 7, no CSS framework. Deployed on Vercel at joaofatoretto.com.

## Sources of truth
- **Dark mode is the standard.** Every page and new section is dark (Stage, the default theme). The only light (Paper) areas are the rooms around the TV heroes: on home the hero frame and the results section, on /hire the hero frame and the trust strip (João's OK, 2026-10-05). Don't add new Paper areas without João's OK.
- **Brand:** `design.md` (Frequency). Read it before any visual change. When the code and design.md disagree, design.md wins; update it first if a brand decision changes. `src/styles/tokens.css` mirrors design.md §12.
- **Facts about João:** `../resume/master/career.md`. Never put a claim on the site that isn't there (numbers, clients, titles, years). Items marked `[CONFIRM]` in career.md can't be used. Don't show a location (João's choice).
- **Who the site is for:** `docs/hiring-journeys.md` (personas, hiring blueprint, the nine content rules). Use it to decide what a new section or page must do.
- **Original case studies:** copied from https://joaofatoretto.framer.website/ (the old Framer site). The body text in `src/content/cases/*.ts` is João's own writing, kept as written.

## Commands
- `npm run dev` · `npm test` · `npm run build` (runs `tsc -b` first) · `npm run preview`
- Practise behavioural TDD: write or update a test in `*.test.ts(x)` before changing behaviour. Tests run with reduced motion on.
- **Never load https://joaofatoretto.com/hire/thanks** (browser, Playwright, curl or any other tool), and never send the live form to test it. Every load there counts as a paid Google Ads conversion and skews the campaign (João's rule). Test the thank-you page locally (`npm run preview`, `vercel dev`) or on a Vercel preview, where the Google tag doesn't load.

## Structure
- `src/content/` copy and data, in English (the source of truth). `profile.ts` (home), `hire.ts`, `ui.ts` (every UI string: nav, buttons, labels, aria, OSD words, chip labels), `seo.ts` (titles, descriptions), `cases/index.ts` (case list + summaries), `cases/<slug>.ts` (meta, images, body blocks). `index.ts` gathers them as `en` and the `Copy` type. `src/content/pt/` is the Brazilian Portuguese mirror.
- `src/i18n/` languages: `locales.ts` (locale table, `localize`, `splitLocale`), `copy.tsx` (`useCopy`, `useLocale`, `useLocalize`, `fmt`).
- `src/lib/` engine code: `motion.ts` (MOTION/REDUCE switch, easing), `signal.ts` (seeded noise, fibres, mark), `tv.tsx` (static generator, timelines, `useTV`, `SplitFilter`), `reveal.tsx` (`R` reveal wrapper, `useInView`), `gather.ts` (light streaks gathering into a phrase, PlayStation-boot style: the /hire last call).
- `src/components/` shared UI (TVHero (the full-screen TV hero, used by home's Hero and /hire), Hero, NavBar, ChannelSwitch, Screen, Contact, Footer, PrototypeEmbed, Rich, Scramble, TestCard).
- `src/sections/` home sections. `src/pages/` Home, CaseStudy (the case template), Hire, NotFound.
- `/hire` (`pages/Hire.tsx`, sections in `src/sections/hire/`, copy in `content/hire.ts`): the landing page for small businesses and solo founders (story: the canvas "Hire Page Story Wireframe"; research: the "Who Buys a Build" journey map). Eight beats, visuals carry the story, ~200 words, no tech words. Conversion = the 3-field form (name, email or phone, the idea; the idea is optional). No WhatsApp buttons or number anywhere (João's choice, 2026-10-08); a phone number left in the form still reaches João as a WhatsApp link in the lead email. Offer terms (free first chat, nothing upfront, pay after each shipped piece, reply in 1 business day) are João's commitments; no prices (João's choice). The client quote is hidden (no placeholder, not even in dev) until `PROOF.quote` is filled with a real one.
- `/hire` hero shot: `public/hire/tempo/page-1..4.webp` is Tempo's landing page exported from Figma (file "Tempo 3.0 Landing Page (Copy)", key kTqVI5Li5bSMHzoqMjGhk5, frame "Website - Homepage" 185:8886, cropped to 1500 × 11488, in 1500×1000 tiles via figma-console, stitched and cut with ffmpeg into four 2872 px parts; parts 1–3 carry 16 extra rows of the next part (`OVERLAP`) so no seam shows where they meet, and `TempoSession.test.tsx` checks the files match). `TempoSession.tsx` scrolls it section by section (exponential ease-out, no overshoot, no cursor); its `STOPS` are page pixels framing whole sections in a 1500 × 1000 viewport, so re-measure them if the export changes.
- `/hire` step sections ("Picture it working", "You pay as I deliver"): `sections/hire/useMoments.ts` holds the section still (sticky stage in a taller track) and moves through the steps: each step's bar/line (`--f`) fills by itself and the next step comes on when it's full; scrolling fills it faster and the reader's input always wins. Where the stage isn't sticky (Pay on phones) each step comes on as it reaches the middle of the screen. Pure logic and tests: `moments.ts`. The steps show outcomes any business or founder could want, not one kind of shop.
- `/hire/thanks` (`pages/HireThanks.tsx`, `THANKS_PAGE` in `seo/meta.ts`): where the form lands once it has sent, the Google Ads conversion URL. The browser form does a full page load there (`nav.to`, so the Google tag fires) with the name in sessionStorage (`SENT_KEY`); a plain form post gets a 303 to it. Prerendered (`UNLISTED`), but noindex and not in the sitemap. The Google tag (Ads account AW-18498833833) is inline in `index.html` and loads only on joaofatoretto.com (not localhost or Vercel previews), so don't test conversions on the live /hire/thanks.
- `api/lead.ts`: Vercel Function behind the form. Validates with `src/lib/lead.ts` (shared with the browser) and emails the lead through Resend. Env: `RESEND_API_KEY` (Resend integration), optional `LEAD_TO`, `LEAD_FROM` (until a domain is verified in Resend, it sends from onboarding@resend.dev). Files it imports use `.js` extensions and must not import extensionless modules (Node loads them as ES modules). `vite dev` doesn't run it; use `vercel dev` or a preview deploy.
- `public/logos/`: client logos for the /hire trust carousel (`TRUST.clients` in `content/hire.ts`), from each company's site or Wikimedia Commons, cleaned to drawing-only SVG where one exists (Superopa, JustLiv, NOVOS FIBER, Aion, Urbane and Stance only publish PNGs; Aion's is 148 px wide, so swap it if a bigger one turns up). Shown flattened to one ink tone; MODEC is a one-ink version (white became a cut-out) and Sotreq is its wordmark only (the CAT block is Caterpillar's). `h` in `TRUST.clients` evens out their optical size. Hover shows each logo's colours; `public/logos/color/` holds the colour files where the ink file can't be shown as is (MODEC's original; the white artwork of Foodpass, Urbane and Aion recoloured: Foodpass in its brand purple #8300C7 with the pink bean outline, as on foodpass.me; Urbane in its brand red #ec1b30; Aion's white made dark). The mouse speed control is `sections/hire/marquee.ts`.
- `public/cases/<slug>/` case images (card, cover, 01..n). `public/cv/` the CV PDF.

## Languages (English + Brazilian Portuguese)
Read `docs/i18n.md` before touching copy, routes or the head. In short:
- English is the site; Portuguese mirrors every page at `/pt-br/...` (same slugs). Visitors whose browser's first language is Portuguese are redirected there by static rules in `vercel.json`; the EN / PT switch sets a `lang` cookie that beats the browser. If anything Portuguese fails, English.
- **Every user-visible string lives in `src/content/`**, and components read it with `useCopy()`, never by importing copy modules. Internal raw `<a href>` paths go through `useLocalize()`.
- **Changing or adding copy means changing both languages**: English in `src/content/...`, Portuguese in `src/content/pt/...` (pt-BR, informal "você", same voice and facts; `tsc` flags missing keys, `src/i18n/i18n.test.tsx` flags English left on Portuguese pages). Non-text data (slugs, images, numbers, links) lives once in the English files; the Portuguese files reuse it.
- A new page: its route in `App.tsx` serves both languages; add it to `PAGES` and `src/vercel.test.ts` tells you if `vercel.json` needs a redirect rule.
- The Portuguese copy is its own chunk (English pages never load it). Never import `src/content/pt` statically from browser code.
- The language switch on a thank-you page goes to the other language's `/hire`, never the other thank-you page (that would count a second Ads conversion). `/pt-br/hire/thanks` is a conversion URL too: same rule as `/hire/thanks`, never load it live.

## Adding a case study
1. Create `src/content/cases/<slug>.ts` exporting `meta`, `original` (title/subtitle), `cover`, `card` and `body` (see `types.ts`; inline markup is `**bold**`, `_italic_`, `[text](url)`).
2. Put images in `public/cases/<slug>/` and give every image real alt text.
3. Add an entry to `CASES` in `cases/index.ts` with `industry`, `model`, `platforms` (chips; the allowed values are typed in `types.ts`: `Model`, `Platform`), `summary`, `role`, `result`, `problem` and `outcome` (the 20-second summary). Write them from career.md facts and confirm anything not there with João (platforms, model).
4. Add the Portuguese twin: `src/content/pt/cases/<slug>.ts` and its entry in `pt/cases/index.ts` (text only; `translateBody` takes images from English).
5. `npm test` checks images exist, alt text and summaries. The home grid adapts: an odd count features the first card full width.

## Link previews and SEO
- **Every page is prerendered.** `npm run build` builds the app, then `vite-plugin-seo.ts` builds `src/entry-server.tsx` for Node and writes one HTML file per entry in `PAGES` (`src/seo/meta.ts`): its own title, description, canonical, Open Graph tags and JSON-LD, plus the rendered app. It also writes `404.html` (noindex) and `sitemap.xml`. `main.tsx` hydrates that HTML. Vercel serves `work/x.html` at `/work/x` (`cleanUrls`); there is no SPA fallback, so unknown addresses return a real 404.
- **A new page (e.g. a service page):** add its route in `App.tsx` and an entry in `PAGES`; the build, sitemap, hreflang and tests pick it up in both languages. Every page shares the home preview image (João's choice).
- **Hydration rule:** the first render must be the same on the server (no window, `MOTION` false) and in the browser, or React leaves the server's attributes in place. Don't branch JSX or inline styles on `MOTION`/`REDUCE`/`window`; put starting states in CSS under `html.motion` (set before first paint by the inline script in `index.html`, same test as `motion.ts`) and change them in effects. `src/hydration.test.tsx` and `src/entry-server.test.tsx` catch slips.
- `www.joaofatoretto.com` 308-redirects to the bare domain (Vercel domain setting).
- Preview image: `public/og/home.png`, 1200x630, ~150 KB (keep it under ~300 KB or WhatsApp skips it). Source: Figma file Frequency, page "Portfolio · Social previews", frame "og · home" (case-specific frames exist there too, unused). `public/apple-touch-icon.png` comes from the same page.

## Motion rules (summary of design.md §10 plus what the site does)
- Everything that moves checks `MOTION` (false with `prefers-reduced-motion` or no IntersectionObserver). Reveal CSS only hides things under `html.motion`.
- Theme: the site is dark (Stage is the default in `tokens.css`). Only the home "room" (`.room.paper` in `Home.tsx`: hero + results) is Paper, so the hero closes into a framed TV. The Hero sets the nav to `.stage` over the hero, `.paper` over the room, and nothing (Stage) after.
- Hero layout: pinned (full screen, then closes into the card) when the content fits the viewport; otherwise flow mode (phones): full-bleed dark under the nav, the sides close in as you scroll. Nav colours follow the same scroll progress in both, then turn Stage once the room scrolls out from under the nav.
- The TV language: the hero tunes in on every page load (not again when returning to home inside the site; shortened to ~0.65 s until readable), covers tune in when they arrive and flick on hover, internal links change channel (400 ms static burst + OSD label), prototypes are a TV that's off until you tune in, the closing cards (Contact on home, the form card on /hire) power on as they arrive (`TL.power`, grain at rest).
- Channel map: CH 01 home, CH 02 case studies (CH 02·n per case), CH 03 how I build, CH 04 about, CH 05 contact, CH 06 start a project (/hire). design.md §1 matches.
- Colour (rose/cyan) only on display type ≥ 64px and the primary CTA, and in tune-in motion. Green only for the availability dot.
- Groups of items (stats, cards, phones, chips) use `Seq`/`SeqItem` from `reveal.tsx`: items arrive one by one in reading order (design.md §10 "Guided sequence"); `useInView` inside an item waits for the item.
- Gotcha: IntersectionObserver never fires for an element its own clip-path hides completely. Clip a child, or observe a wrapper.
- Gotcha: Chrome draws some SVG curves doubled with `stroke-linecap: round` or a `pathLength` attribute. For a line that draws itself, use butt caps and a fixed `stroke-dasharray` longer than the path.
- Gotcha: short custom properties can clash with tokens: `--g` is the page gutter (24px), so `opacity: var(--g)` is invalid and falls back to fully visible. Give section variables descriptive names (`--landed`, `--f`).
- Gotcha: some class names are global (e.g. `.intro` sets `display: flex`). Prefix state classes in a section (`pieces-in`, `lanes-in`) or check base.css first.
- Gotcha: a CSS variable used in a `calc()` must be defined on that element or an ancestor; one defined on a child makes the whole declaration invalid (the sticky track lost its height this way).

## Open decisions (ask João)
- "7+ years" matches the resume, but Jul 2018 to now is 8+.
- Nohemi is local-only; the site uses Sora until a web licence is confirmed and the font is self-hosted.
- The case text has typos from the original site (e.g. "convertion", "runned", "proccess", "we was"); fix them only with João's OK.

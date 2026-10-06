# João Fatoretto · Portfolio

Source of my personal portfolio, live at **[joaofatoretto.com](https://joaofatoretto.com)**.

> **All rights reserved.** This repository is public only so recruiters and prospective clients can see how the site is built. It is not open source: you may not copy, reuse, modify or redistribute any part of it, for commercial or personal use. See [LICENSE](LICENSE).

## About the site

- **Home:** case studies, how I build, about and contact.
- **Case studies** (`/work/<slug>`): one template, content-driven.
- **Start a project** (`/hire`): a landing page for small businesses and solo founders, with a lead form.

The visual language is the **Frequency** brand ([design.md](design.md)): a dark "stage" with TV-style motion. The hero tunes in like a signal, internal links change channel, and covers flicker on hover. Everything respects `prefers-reduced-motion`.

## Stack

- Vite + React 19 + TypeScript, React Router 7, no CSS framework
- Every page prerendered to static HTML at build time, with its own meta tags, Open Graph, JSON-LD and sitemap (`vite-plugin-seo.ts`), then hydrated
- A Vercel Function (`api/lead.ts`) validates the lead form and emails it through Resend
- Vitest + Testing Library: content checks (images, alt text, summaries), behaviour and hydration tests
- Hosted on Vercel

## Structure

```
api/            Vercel Function for the lead form
docs/           research: who the site is for and why each section exists
public/         images, logos, CV, social preview
src/
  content/      copy and data (home, case studies, /hire)
  lib/          motion, signal noise, TV static engine, reveal helpers
  components/   shared UI (TV hero, nav, channel switch, footer…)
  sections/     home and /hire sections
  pages/        Home, CaseStudy, Hire, NotFound
  seo/          per-page metadata
  styles/       design tokens and global CSS
```

## Running locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # content + behaviour tests
npm run build      # typecheck + prerendered production build into dist/
npm run preview    # serve the production build
```

The lead form's function needs `RESEND_API_KEY` and only runs under `vercel dev` or on a deploy.

## Licence

© 2026 João Fatoretto. All rights reserved. See [LICENSE](LICENSE).

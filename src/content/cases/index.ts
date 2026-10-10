/* Case studies, in the order they appear. Add one by creating <slug>.ts (meta, cover, card, body)
   and an entry below; the home grid and the routes adapt. Claims must match ../resume/master/career.md. */
import type { CaseStudy } from './types';
import * as promotions from './promotions-discoverability';
import * as benefits from './benefits-card-app';
import * as photo from './photo-editing';
import * as tempo from './tempo-landing-page';

const strip = (s: string) => s.replace(/^@/, '').replace(/ @/g, ' ');

export const CASES: CaseStudy[] = [
  {
    slug: 'promotions-discoverability',
    title: 'Enhancing Promotions Discoverability',
    client: 'Superopa',
    industry: 'E-commerce', model: 'B2C', platforms: ['Native app', 'Web admin'],
    summary: 'The CTO asked for a countdown timer. Funnel data and support tickets showed the real problem: people couldn’t find the promotions. I redesigned the home, gave marketing a back-office for promotion lists and rebuilt search.',
    role: 'Senior UX/UI Designer',
    result: '+15% add-to-cart · 90% search success',
    problem: 'The CTO asked for a countdown timer for flash promotions. Talking to stakeholders, the real goal was more orders per day.',
    outcome: 'An A/B test showed a 15% increase in add-to-cart conversion. The new search reached a 90% success rate.',
    subtitle: promotions.original.subtitle,
    meta: { ...promotions.meta },
    card: promotions.card, cover: promotions.cover, body: promotions.body,
  },
  {
    slug: 'benefits-card-app',
    title: benefits.original.title,
    client: 'Foodpass',
    industry: 'Fintech', model: 'B2B2C', platforms: ['Native app', 'Web · mobile + desktop'],
    summary: 'Foodpass sold customizable food baskets to companies as an employee benefit. I led the design of its second business, a multi-benefit card, launched inside the same app in about two months, for factory-floor workers who used their phones only to call and send messages. A year later, I came back as a freelancer to launch the physical cards.',
    role: 'Senior UX/UI Designer',
    result: 'Opened sales to companies with 500+ employees',
    problem: 'Turn an app built for food baskets into a fintech product, fast enough to catch interested clients, for people who barely use technology.',
    outcome: 'An MVP launched to the first clients while they were still interested, then rolled out to employees at multiple companies. It opened sales to companies with 500+ employees and gave a small team a second source of revenue.',
    subtitle: benefits.original.subtitle,
    meta: { ...benefits.meta, team: strip(benefits.meta.team) },
    card: benefits.card, cover: benefits.cover, body: benefits.body,
  },
  {
    slug: 'photo-editing',
    title: 'New Experience of Photo Editing',
    client: 'Casar.com',
    industry: 'Weddings', model: 'B2C', platforms: ['Web · mobile + desktop'],
    summary: 'Photo editing was the number-one pain point in the wedding-site builder, hitting about 5,000 of 30,000 couples every day. I redesigned the image editor in the site builder.',
    role: 'Product Designer',
    result: 'Redesigned the #1 pain point, felt by ~16% of users',
    problem: 'More than 16% of couples reported trouble editing images. It was the biggest pain in the site editor, and support often fixed photos by hand.',
    outcome: 'A lean solution, easy to implement with the least possible effort: it used only the image API the team already had. Ready to build, with desktop and mobile prototypes, a phased launch plan and a requirements document with acceptance criteria.',
    subtitle: photo.original.subtitle,
    meta: { ...photo.meta },
    card: photo.card, cover: photo.cover, body: photo.body,
  },
  {
    slug: 'tempo-landing-page',
    title: 'Tempo New Landing Page',
    client: 'Tempo Labs',
    industry: 'AI SaaS', model: 'B2B + B2C', platforms: ['Landing page · desktop'],
    summary: 'A full landing page redesign to reposition Tempo, an AI startup backed by Y Combinator, in its market.',
    role: 'Product Designer',
    result: 'Market repositioning',
    problem: 'Tempo was moving from developers and founders to designers, and its landing page had to tell that new story.',
    outcome: 'A landing page that changes how people see the brand and tells designers a clear story: build the code yourself, without the handoff.',
    subtitle: tempo.original.subtitle,
    meta: { ...tempo.meta },
    card: tempo.card, cover: tempo.cover, body: tempo.body,
  },
];

/** The lookups take the case list too: a language's copy has its own (translated) list in the same order. */
export const caseBySlug = (slug: string | undefined, cases: CaseStudy[] = CASES) => cases.find(c => c.slug === slug);
export const caseNumber = (c: Pick<CaseStudy, 'slug'>, cases: CaseStudy[] = CASES) => cases.findIndex(x => x.slug === c.slug) + 1;

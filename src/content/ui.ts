/* The words around the content: navigation, buttons, form labels and messages, aria-labels, alt text, on-screen
   display (OSD) words, the 404 and thank-you pages, case-page labels. Whatever a component used to hardcode lives here,
   so the Portuguese mirror (src/content/pt/) can translate it. `{name}`-style tokens are filled in by the component.
   Non-breaking spaces ( ) keep an arrow from wrapping alone: keep them in the translation. */
import type { Model, Platform } from './cases/types';

export const UI = {
  skip: 'Skip to content',
  /** under the lockup in the footer and on the hero: name and role */
  eyebrow: 'João Fatoretto — Product Designer who ships code',
  nav: { label: 'Main', work: 'Case studies', build: 'How I build', about: 'About', hire: 'Start a project', talk: 'Let’s talk' },
  /** the language switch in the nav and the footer. The language names are written in their own language. */
  lang: { label: 'Language', en: 'English', pt: 'Português' },
  footer: { caption: 'Designed and built by me in React. Every graphic is generated in code.', cv: 'CV (PDF)', top: 'Back to top ↑' },
  /** the TV's on-screen words (aria-hidden) */
  tv: { noSignal: 'NO SIGNAL', searching: 'SEARCHING', scroll: 'Scroll', sent: 'SENT' },
  /** the placeholder picture of a case without a cover (TestCard); `{n}` is the case number (01) */
  testCard: { label: 'TEST CARD · CASE {n}', cover: 'COVER SCREENSHOT GOES HERE' },
  contact: {
    title: 'Let’s talk.',
    text: 'Hiring for product design or design engineering? Email me about the role.',
    copy: 'Copy email', copied: 'Email copied', send: 'Send an email',
  },
  embed: { tune: 'Tune in to the prototype', loads: 'Loads an interactive Figma prototype', title: '{label} (Figma)' },
  case: {
    all: 'All case studies',
    /** `{n}` is the case number (01), `{client}` the client */
    study: 'Case study {n} · {client}',
    summary: 'Summary', problem: 'The problem', result: 'The result',
    company: 'Company', year: 'Year', role: 'My role', team: 'Team',
    toc: 'Sections of this case study', tocLabel: 'In this case',
    next: 'Next case study',
    /** `{n}` is the next case's channel number */
    nextLabel: 'Next case · CH 02·{n}',
    /** `{alt}` is the image's alt text */
    open: '{alt} (open full size)',
  },
  /** the chips on case cards and pages, by the typed value (src/content/cases/types.ts) */
  models: { 'B2C': 'B2C', 'B2B': 'B2B', 'B2B2C': 'B2B2C', 'B2B + B2C': 'B2B + B2C' } satisfies Record<Model, string>,
  platforms: {
    'Native app': 'Native app',
    'Web · mobile + desktop': 'Web · mobile + desktop',
    'Web · desktop': 'Web · desktop',
    'Web admin': 'Web admin',
    'Landing page · desktop': 'Landing page · desktop',
    'Landing page · mobile + desktop': 'Landing page · mobile + desktop',
  } satisfies Record<Platform, string>,
  notFound: {
    title: 'This channel doesn’t exist.',
    text: 'The page may have moved. The case studies are on the home page.',
    cta: 'View case studies  →',
  },
  thanks: {
    title: 'Got it. Your idea is in my inbox.',
    /** `{name}` is the first name they typed */
    titleNamed: 'Got it, {name}. Your idea is in my inbox.',
    text: 'I’ll reply within 1 business day.',
    work: 'See my work',
  },
  form: {
    label: 'Tell me your idea',
    name: 'Your name',
    contact: 'Email or phone',
    message: 'Your idea, in one line (optional)',
    /** the hidden field only bots fill in */
    website: 'Website',
    /** `{email}` becomes a link */
    failed: 'That didn’t send. Your answers are still here: try again, or email me at {email}.',
    send: 'Send my idea  →', sending: 'Sending…',
  },
};

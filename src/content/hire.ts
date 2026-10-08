/* Copy for /hire, the landing page for small businesses and solo founders who want something built.
   The story (one beat per section) is in the canvas "Hire Page Story Wireframe". Visuals carry it, so copy stays short:
   about 200 words for the whole page. No tech words (MVP, SaaS, stack, prototype).
   Proof comes from ../resume/master/career.md. Offer terms (free first chat, nothing upfront, pay after each shipped
   piece, reply in 1 business day) are João's commitments: change them here if the offer changes. */

export const HERO = {
  title: 'Let’s make your idea real.',
  lede: 'Websites and apps for small businesses and new founders. Designed and built by me.',
  cta: 'Get in touch',
  /** the hero's name for screen readers */
  label: 'Let’s make your idea real',
  shot: { alt: 'Tempo’s landing page, which I redesigned' },
  /** the link under the shot to its case study; the trailing space is non-breaking, so the arrow never wraps alone */
  seeCase: 'See the case\u00a0',
};

/** A client's logo in the trust carousel, shown in one ink tone and in colour on hover. `color` is a separate colour
 *  file when `logo` can't be shown as is (a one-ink conversion, or white artwork made for dark pages, recoloured in
 *  the brand's own colour). `h` scales it (1 = the base height) so wide wordmarks and compact marks look the same size. Every name is in career.md (clients, employers' clients, freelance clients, and Aion itself). */
export type ClientLogo = { name: string; logo: string; color?: string; h?: number };

export const TRUST = {
  label: 'Companies I’ve designed for',
  clients: [
    { name: 'Syneos Health', logo: '/logos/syneos-health.svg', h: 1.35 },
    { name: 'Tempo (Y Combinator)', logo: '/logos/tempo.svg' },
    { name: 'Vale', logo: '/logos/vale.svg', h: 1.15 },
    { name: 'Itaú', logo: '/logos/itau.svg', h: 1.3 },
    { name: 'Foodpass', logo: '/logos/foodpass.svg', color: '/logos/color/foodpass.svg', h: 0.85 },
    { name: 'Casar.com', logo: '/logos/casar.svg' },
    { name: 'JustLiv', logo: '/logos/justliv.png', h: 1.25 },
    { name: 'StudyKIK', logo: '/logos/studykik.svg', h: 1.25 },
    { name: 'Braskem', logo: '/logos/braskem.svg', h: 0.8 },
    { name: 'MODEC', logo: '/logos/modec.svg', color: '/logos/color/modec.svg', h: 0.95 },
    { name: 'Urbane', logo: '/logos/urbane.png', color: '/logos/color/urbane.png', h: 0.65 },
    { name: 'Evity', logo: '/logos/evity.svg', h: 1.1 },
    { name: 'Superopa', logo: '/logos/superopa.png', h: 1.3 },
    { name: 'Sotreq', logo: '/logos/sotreq.svg', h: 0.95 },
    { name: 'NOVOS FIBER', logo: '/logos/novos-fiber.png', h: 0.6 },
    { name: 'Stance', logo: '/logos/stance.png' },
    { name: 'Transferência Segura', logo: '/logos/transferencia-segura.svg', h: 1.45 },
    { name: 'Aion Solution', logo: '/logos/aion.png', color: '/logos/color/aion.png' },
  ] as ClientLogo[],
  stats: [
    { n: '7+', what: 'years making products people use' },
    { n: '30+', what: 'businesses and teams I’ve built for' },
    { n: '2×', what: 'more app downloads turned into sales', src: 'Superopa' },
    { n: '< 3 mo', what: 'from an idea to a launched product', src: 'Transferência Segura' },
  ],
};

export const PATH = {
  title: 'Not sure what you need? That’s my job.',
  steps: ['We talk it through', 'We sketch it together', 'We design it for real', 'We ship it'],
  end: 'Your business, online.',
};

/** Outcomes, not one kind of business: whoever reads this (a shop, a service, a founder with a new product) should
 *  find what they want in at least one moment. Each moment has its own screen in Picture.tsx. */
export const PICTURE = {
  title: 'Picture it working.',
  lede: 'Every idea is different. The point is the same: it works for you.',
  moments: ['New customers find you', 'The busywork does itself', 'Customers leave happy', 'The money comes in'],
  /** What each moment's phone screen shows (made-up people and numbers, in the language of the page). */
  screens: {
    reach: {
      head: 'New customers', sub: 'This week',
      days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      /** [initials, what happened, where they came from] */
      feed: [['AM', 'Ana M. signed up', 'Found you on Google'], ['LR', 'Leo R. signed up', 'Saw you on Instagram'], ['JS', 'Joy S. signed up', 'A friend sent your link'], ['MT', 'Max T. signed up', 'Came back from your email']] as [string, string, string][],
    },
    busywork: {
      head: 'Today', sub: 'Done for you',
      tasks: ['Send this week’s invoices', 'Confirm new orders', 'Remind tomorrow’s clients', 'Update the sales sheet', 'Answer common questions'],
      done: 'All done', left: 'Nothing left on your list',
    },
    happy: {
      head: 'Reviews', sub: 'What customers say',
      fresh: { text: '“So easy. I sorted it out in two minutes.”', who: 'Ana M. · just now' },
      old: { text: '“No more waiting on the phone.”', who: 'Leo R. · yesterday' },
    },
    paid: {
      clock: '9:41', day: 'Today',
      /** [what came in, from where] */
      notes: [['+$49 received', 'Monthly plan · Ana M.'], ['+$120 received', 'Order #1042'], ['+$80 received', 'Booking deposit · Leo R.']] as [string, string][],
    },
  },
};

export const PROOF = {
  title: 'I’ve done this before.',
  /** a card's name for screen readers; `{n}` `{what}` `{client}` are that card's number, line and client */
  cardLabel: '{n} {what}. {client} case study',
  cards: [
    { n: '+15%', what: 'more add-to-cart after I redesigned how people find promotions', client: 'Superopa', kind: 'Grocery app', slug: 'promotions-discoverability' },
    { n: '< 3 mo', what: 'from an idea to a launched product, for safe car-sale payments', client: 'Transferência Segura', kind: 'New business' },
    { n: '500+', what: 'employees: the size of the new clients the benefits app brought in', client: 'Foodpass', kind: 'Benefits cards', slug: 'benefits-card-app' },
  ],
  /** placeholder until a client quote is confirmed: null hides the quote */
  quote: null as null | { text: string; who: string },
};

export const PAY = {
  title: 'You pay as I deliver.',
  lede: 'Nothing upfront. Each payment comes after something real is shipped.',
  pieces: [
    { label: 'Sprint 1', title: 'Landing page done' },
    { label: 'Sprint 2', title: 'Orders & payments ready' },
    { label: 'Sprint 3', title: 'Launched' },
  ],
  /** the two lanes of the timeline: what I deliver, then what you pay */
  lanes: { deliver: 'Delivery', pay: 'Payment' },
  /** the message of the section: each payment, placed after its piece is delivered */
  receipt: 'You pay this sprint',
};

/** The last call before the form: a nudge, then the promise, then an arrow down to the form. */
export const CALL = {
  ask: 'What are you waiting for?',
  title: 'Starting takes one message.',
  /** the arrow's name for screen readers */
  to: 'Go to the form',
};

export const SEND = {
  title: 'Your idea starts here.',
  chips: ['Free first chat', 'Nothing upfront', 'It’s all yours'],
  reply: 'I reply within 1 business day.',
};

/** The caption under the Tempo shot names the section on screen. One label per stop in TempoSession.tsx, in order. */
export const TEMPO = {
  stops: ['Hero', 'Product', 'Connect your codebase', 'Design system', 'Tasks and branches', 'Design by hand', 'Prototype with AI', 'Push to Git', 'Wall of love', 'Just Ship It'],
};

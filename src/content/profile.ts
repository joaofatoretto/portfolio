/* Site copy. Every claim comes from ../resume/master/career.md; don't add one that isn't there. */
export const PROFILE = {
  name: 'João Fatoretto',
  email: 'jvitorfatto@gmail.com',
  linkedin: 'https://www.linkedin.com/in/joaovitorfatoretto/',
  cv: '/cv/joao-fatoretto-cv.pdf',
  /** WhatsApp, digits only for wa.me links. Shown on the hire page only (João's choice; it reveals the +55 country code). */
  whatsapp: '5519993229283',
  whatsappDisplay: '+55 19 99322-9283',
};

/** A WhatsApp chat with João, with a message ready to send. */
export const waLink = (text: string) => `https://wa.me/${PROFILE.whatsapp}?text=${encodeURIComponent(text)}`;

export const PROOF = [
  { n: '2×', what: 'App-download-to-purchase conversion, in one year', src: 'Superopa' },
  { n: '+15%', what: 'Add-to-cart conversion after a promotions redesign', src: 'Superopa' },
  { n: 'Minutes', what: 'Not weeks, for clinical-trial admins to change profile questions', src: 'Syneos Health' },
  { n: '< 3 months', what: 'From idea to a launched fintech MVP, leading 3 designers', src: 'Transferência Segura' },
];
export const CLIENTS = ['Syneos Health', 'Tempo (Y Combinator)', 'Vale', 'Itaú', 'Foodpass', 'Casar.com'];

export const STEPS = [
  { name: 'Listen', text: 'Interviews, analytics, support tickets and surveys. At Syneos Health, an intercept survey surfaced pain points nobody on the team knew about.' },
  { name: 'Find the signal', text: 'Many inputs, one problem worth solving. At Superopa, the CTO asked for a countdown timer. The funnel showed people couldn’t find the promotions at all.' },
  { name: 'Design', text: 'Flows, states and systems a team can reuse. My Figma Make template became my team’s standard way to explore ideas, on-system, in hours instead of weeks.' },
  { name: 'Build', text: 'Production React and TypeScript, or a feasibility check in code before handoff, so engineers get designs they can build with common libraries.' },
];

export const PRODUCTS = [
  { name: 'Nikki', status: 'Beta · 2 businesses',
    text: 'An AI system on WhatsApp for small businesses. It asks customers for feedback, turns happy ones into Google reviews and sends the rest to the owner as private insight.',
    stack: 'Mastra agents · Node.js on Railway · PostgreSQL on Supabase · WhatsApp login' },
  { name: 'Pixel Perfect', status: 'Close to launch',
    text: 'Image models can’t draw true pixel art. My own algorithm turns their output into clean, consistent pixel art for indie game studios and artists.',
    stack: 'React · TypeScript · Tailwind · algorithm runs server-side on Railway' },
  { name: 'Creative Marketing', status: 'In development',
    text: 'Agents that create brand-accurate ad creatives on their own, for marketing teams.',
    stack: 'Mastra agents · TypeScript · PostgreSQL' },
];
export const STACK = ['TypeScript', 'React', 'Tailwind', 'Node.js', 'Mastra', 'PostgreSQL', 'Supabase', 'Railway', 'Claude Code'];
export const LOOP: [string, string][] = [
  ['01', 'I write the acceptance criteria and own the architecture.'],
  ['02', 'Tests come first: behavioral TDD and end-to-end.'],
  ['03', 'Claude Code writes the implementation.'],
  ['04', 'Tests and type checks pass first. Then I review it.'],
];

export const FACTS: [string, string][] = [
  ['Roles', 'Senior Product Designer · Design Engineer'],
  ['Work', 'Remote, with US and Canadian teams'],
  ['Languages', 'English (fluent) · Portuguese (native)'],
  ['Domains', 'Healthcare · Fintech · E-commerce · AI SaaS · Enterprise'],
  ['Education', 'BSc Computer Science, UNICAMP · MBA in UX Research and Design Leadership'],
];

/** Nav destinations are channels (design.md §1, "The TV tune-in"). Case pages are CH 02·n. */
export const CHANNELS: Record<string, [string, string]> = {
  top: ['CH 01', 'Home'], work: ['CH 02', 'Case studies'], build: ['CH 03', 'How I build'],
  about: ['CH 04', 'About'], contact: ['CH 05', 'Contact'], hire: ['CH 06', 'Start a project'],
};

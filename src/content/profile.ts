/* Site copy. Every claim comes from ../resume/master/career.md; don't add one that isn't there. */
export const PROFILE = {
  name: 'João Fatoretto',
  email: 'jvitorfatto@gmail.com',
  linkedin: 'https://www.linkedin.com/in/joaovitorfatoretto/',
  cv: '/cv/joao-fatoretto-cv.pdf',
};

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

/** Home page copy that used to sit in the section components. Each key is a section; strings are shown as is.
 *  The Portuguese mirror (src/content/pt/) translates the same keys. */
export const HOME = {
  hero: {
    label: 'Introduction',
    title: 'Listen.',
    intro: 'I’m a senior product designer with 7+ years in B2B and B2C products. I start with real people and data, then design and build the solution myself, from Figma to production code.',
    /** the two spaces are non-breaking, so the arrow never wraps alone */
    cta: 'View case studies\u00a0\u00a0→',
    cv: 'Download CV',
    band: 'Many voices (users, data, stakeholders) drawn as noisy lines, converging into one clear signal',
    cue: { noise: 'Many voices', noiseLong: ' · users, data, stakeholders', signal: 'One clear signal' },
  },
  proof: { label: 'Results', clients: 'Teams and clients' },
  work: {
    label: 'Case studies', title: 'The problem, my part and what changed',
    lede: 'Each case opens with a short summary: the problem, my role, the team and the result. The full process comes after.',
  },
  method: {
    label: 'How I work', title: 'From noise to one clear decision',
    lede: 'Every project starts noisy. The work is to listen to all of it, find the pattern and turn it into something that can be built.',
    /** `{n}` is the step number */
    step: 'Step {n}',
  },
  build: {
    label: 'How I build', title: 'I build what I design',
    text: 'I have a Computer Science degree and wrote code before I designed. Today I design and code my own AI products alone: front end, back end, agents, database, auth and billing. Claude Code is my main tool. The judgement stays with me.',
    loop: 'How I keep AI-written code in check',
  },
  about: {
    label: 'About', title: 'Hi, I’m João',
    quote: 'I design and build the product, from research to production code.',
    p1: 'I started as a developer in 2017 and moved into UX/UI in 2018. Since then I’ve designed for startups, an AI company backed by Y Combinator, Fortune 500 clients and a global healthcare company, in B2B and B2C, on the web and in native mobile apps.',
    p2: 'I’ve led and mentored designers, built design systems that developers actually used, and worked day to day with data teams. I also taught 30+ students as a UX/UI tutor at Coderhouse.',
    cv: 'Download CV (PDF)',
  },
};

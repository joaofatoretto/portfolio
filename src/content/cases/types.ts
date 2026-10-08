/** One block of case-study body content. Inline text supports **bold**, _italic_ and [link](url). */
export type Block =
  | { type: 'h2' | 'h3' | 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'img'; src: string; alt: string; w: number | null; h: number | null }
  /** `tall`: a phone prototype, shown in a tall frame (set here, never guessed from the translated label) */
  | { type: 'embed'; src: string; label: string; tall?: boolean };

export type CaseBody = Block[];

export type Image = { src: string; w: number; h: number };

/* The chips on cards and case pages come from a fixed vocabulary, always in the order
   industry · model · platforms, so readers never have to guess what a chip means. */
export type Model = 'B2C' | 'B2B' | 'B2B2C' | 'B2B + B2C';
export type Platform =
  | 'Native app'              // iOS and Android
  | 'Web · mobile + desktop'  // responsive, used on both
  | 'Web · desktop'
  | 'Web admin'               // internal back-office tools
  | 'Landing page · desktop'
  | 'Landing page · mobile + desktop';

export type CaseStudy = {
  slug: string;
  /** card + page title */
  title: string;
  client: string;
  industry: string;
  model: Model;
  platforms: Platform[];
  /** one or two sentences for the home card */
  summary: string;
  role: string;
  /** the headline result, shown on the card */
  result: string;
  /** the 20-second summary at the top of the case page */
  problem: string;
  outcome: string;
  subtitle: string;
  meta: { company: string; year: string; role: string; team: string };
  card: Image;
  cover: Image;
  body: CaseBody;
};

/** Chips in display order: industry, model, then platforms. */
export const caseTags = (c: Pick<CaseStudy, 'industry' | 'model' | 'platforms'>): string[] => [c.industry, c.model, ...c.platforms];

/** The same chips in a page's language: `labels` is the copy's `ui` (it names the typed model and platform values). */
export const caseChips = (
  c: Pick<CaseStudy, 'industry' | 'model' | 'platforms'>,
  labels: { models: Record<Model, string>; platforms: Record<Platform, string> },
): string[] => [c.industry, labels.models[c.model], ...c.platforms.map(p => labels.platforms[p])];

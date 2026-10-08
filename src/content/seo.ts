/* The translatable strings of the page heads (title, description, preview image text) and the schema.org text. The
   build assembles them into each page's <head> in src/seo/meta.ts. Hire's title names what clients search for (Google
   shows about 60 characters); the page itself opens with "Tell me your idea". */
import { PROFILE } from './profile';

const HIRE_DESCRIPTION = 'Websites and apps for small businesses and new founders, designed and built by me. Free first chat, nothing upfront: you pay after each piece is shipped.';

export const SEO = {
  title: 'João Fatoretto · Product Designer who ships code',
  description: 'Senior product designer with 7+ years in B2B and B2C. I start with real people and data, then design and build the solution myself, from Figma to production code.',
  imageAlt: 'Listen. João Fatoretto, Product Designer who ships code',
  /** schema.org jobTitle */
  jobTitle: 'Senior Product Designer',
  hire: {
    title: `Websites and apps for small businesses · ${PROFILE.name}`,
    description: HIRE_DESCRIPTION,
    /** schema.org name of the service, and the breadcrumb's name for the page */
    name: `${PROFILE.name}, websites and apps`,
    breadcrumb: 'Websites and apps',
    serviceType: ['Websites', 'Landing pages', 'Web and mobile apps', 'Product design'],
  },
  thanks: { title: `Thanks · ${PROFILE.name}`, description: 'Your idea is in my inbox. I reply within 1 business day.' },
  notFound: { title: `No signal · ${PROFILE.name}`, description: 'This page doesn’t exist. The case studies are on the home page.' },
};

/** A case page's title: the case, then the name. */
export const caseTitle = (c: { title: string }) => `${c.title} · ${PROFILE.name}`;

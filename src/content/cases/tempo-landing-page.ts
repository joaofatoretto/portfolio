// Content copied from https://joaofatoretto.framer.website/tempo-new-landing-page (the original Framer portfolio).
// Text is kept as written there; edit freely. Inline markup: **bold**, _italic_, [link](url).
import type { CaseBody } from './types';

export const meta = {"company": "Tempo", "year": "2025", "role": "Product Designer", "team": "Only me"} as const;

export const original = { title: "Tempo New Landing Page", subtitle: "New landing page for AI builder startup called Tempo, to match their new market repositioning" };

export const cover = { src: "/cases/tempo-landing-page/cover.png", w: 2048, h: 1562 };
export const card = { src: "/cases/tempo-landing-page/card.png", w: 2048, h: 1186 };

export const body: CaseBody = [
  {
    "type": "h2",
    "text": "Overview"
  },
  {
    "type": "p",
    "text": "Tempo is a platform for building software with AI. It mixes text prompts with a visual editor. At first, it mainly attracted developers and new founders. But we needed a change. We wanted to talk directly to designers. The goal was simple. We wanted to end the struggle of handing off Figma files to developers. We wanted a straight line from **design to final code.**"
  },
  {
    "type": "img",
    "src": "/cases/tempo-landing-page/01.png",
    "alt": "Tempo landing page: Overview",
    "w": 2048,
    "h": 1400
  },
  {
    "type": "h2",
    "text": "Research & Strategy"
  },
  {
    "type": "p",
    "text": "I didn't open Figma right away. First, I looked at our competitors and analyzed each section and the storytelling they were creating. I also checked tools like SimilarWeb to see their traffic and bounce rates. I wanted to see what caught people's eyes in the AI space."
  },
  {
    "type": "p",
    "text": "I didn't want to reinvent the wheel. I just wanted to figure out what worked for other brands."
  },
  {
    "type": "p",
    "text": "Then, I used those lessons to shape our own page."
  },
  {
    "type": "img",
    "src": "/cases/tempo-landing-page/02.png",
    "alt": "Tempo landing page: Research & Strategy",
    "w": 2048,
    "h": 374
  },
  {
    "type": "h2",
    "text": "Visual Design & UI"
  },
  {
    "type": "p",
    "text": "Designers are a tough crowd to please visually. The page had to look great. I kept Tempo's core brand identity. But I added a new play of lights and gradients, and some new images matching the brand that I created using AI."
  },
  {
    "type": "p",
    "text": "It gave the page a **futuristic feel**. I also focused heavily on animations. I added moving titles and cursors crossing the screen. It looks just like people working together in Figma."
  },
  {
    "type": "p",
    "text": "I also made sure to show off our whole set of tools. This includes our design system builder, our Figma plugin, and our MCP library."
  },
  {
    "type": "img",
    "src": "/cases/tempo-landing-page/03.png",
    "alt": "Tempo landing page: Visual Design & UI",
    "w": 2048,
    "h": 1618
  },
  {
    "type": "h2",
    "text": "The process"
  },
  {
    "type": "p",
    "text": "The foundation for this page was built on real experience. We truly ate our own dog food. We used Tempo to build real projects for our clients. We built several landing pages. We built full SaaS products and complex systems."
  },
  {
    "type": "p",
    "text": "Doing this taught us exactly what designers need. It gave our team a shared vision. We took all that hands-on knowledge and poured it into this new design."
  },
  {
    "type": "p",
    "text": "I worked with the CEO and the other designers to iterate it constantly. That deep understanding of our own product shaped the final result."
  },
  {
    "type": "h2",
    "text": "The outcome"
  },
  {
    "type": "p",
    "text": "The new landing page does exactly what we needed. It changes how people see the brand. It tells designers a clear story. You don't have to deal with the messy developer handoff anymore. You can just build the code yourself."
  },
  {
    "type": "p",
    "text": "Like Tempo always says, and now the new Landing Page is translating:"
  },
  {
    "type": "img",
    "src": "/cases/tempo-landing-page/04.svg",
    "alt": "Tempo landing page: The outcome",
    "w": null,
    "h": null
  },
  {
    "type": "h2",
    "text": "Figma Prototype"
  },
  {
    "type": "embed",
    "src": "https://embed.figma.com/proto/xdwzjKSXREbEoBzMlVJPrd/Tempo-Landing---Showcase?node-id=1-5223&p=f&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A5223&embed-host=share&hide-ui=true",
    "label": "Interactive prototype"
  }
];

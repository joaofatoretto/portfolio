// João's RoofSilo case study, written in ../resume/master/case-studies/roofsilo.md (source of truth for the text).
// Images are compositions made from the Figma file (sources: ../resume/master/case-studies/showcase/roofsilo/).
// Inline markup: **bold**, _italic_, [link](url).
import type { CaseBody } from './types';

export const meta = { company: 'RoofSilo · through Tempo Labs', year: '2025', role: 'Senior Product Designer', team: 'Me, a junior designer and a developer' } as const;

export const original = { title: 'AI CRM for Roofers', subtitle: 'From a vibe-coded prototype to a CRM in production, where the AI calls your leads for you' };

export const cover = { src: '/cases/roofsilo/cover.webp', w: 2048, h: 1162 };
export const card = { src: '/cases/roofsilo/card.webp', w: 2048, h: 1186 };

export const body: CaseBody = [
  { type: 'h2', text: 'Contextualizing the problem' },
  { type: 'p', text: 'Roofers sell over the phone, but they spend their day on roofs.' },
  { type: 'p', text: 'Just imagine: you’re up on a roof doing an inspection, and your phone rings. It’s a homeowner whose roof leaked last night. You can’t pick up. By the time you climb down, they’ve already called someone else.' },
  { type: 'p', text: 'That’s the problem RoofSilo goes after. It’s a CRM, so it has everything you’d expect: leads, pipelines, a calendar, tasks. But its big idea is **AI integrated in everything, including voice: an AI that calls your leads in your name**, follows up, and helps roofers close more jobs.' },
  { type: 'img', src: '/cases/roofsilo/01.webp', alt: 'Without RoofSilo, a homeowner’s call goes unanswered and the lead is lost. With RoofSilo, SiloPilot answers in the roofer’s name, books the inspection and keeps the lead', w: 2048, h: 1100 },
  { type: 'p', text: 'And who are these roofers? The onboarding says it best: companies doing roof coatings, residential and commercial work, who find customers through SEO, Google, Facebook, mailers, Angi and Yelp.' },
  { type: 'img', src: '/cases/roofsilo/02.webp', alt: 'Who RoofSilo is for: the work they do, where they find customers, the tools they already use and what they want from RoofSilo, taken from the onboarding options', w: 2048, h: 1100 },
  { type: 'p', text: 'The client came from the marketing world, and brought that idea to us at Tempo along with a prototype they had vibe coded. On our side, it was me, a junior designer helping me, and a developer.' },

  { type: 'h2', text: 'The starting point: a vibe-coded prototype' },
  { type: 'p', text: 'The prototype helped a lot. It showed what the client had in mind, screen by screen. But it had that vibe-coding look you’ve probably seen many times, and **several flows weren’t easy to use.**' },
  { type: 'p', text: 'So our work had two sides:' },
  { type: 'ol', items: [
      '**Give RoofSilo its own identity.** A design system and a visual language that left the vibe-coding face behind.',
      '**Rethink the product with the client.** Question flows they had already planned when the usability wasn’t good, and design the parts that weren’t in the prototype at all.',
    ] },
  { type: 'p', text: '“Turn a vibe-coded prototype into a CRM roofers can run their business on, with AI in every part of it.”' },

  { type: 'h2', text: 'Building it together' },
  { type: 'p', text: 'Most of RoofSilo came out of conversations with the client. **We discussed a lot**: we brought proposals, pushed back when something wouldn’t work well for the user, and built the answers together.' },
  { type: 'p', text: 'We also researched competitors. And here’s the thing about a CRM: there are already many of them, and **users already know how pipelines, contacts and calendars work.** So we didn’t try to reinvent the wheel in the standard parts. We looked at what already works in other CRMs and saved our energy for what makes RoofSilo different: the AI.' },

  { type: 'h2', text: 'Where the AI lives: SiloPilot' },
  { type: 'p', text: 'In RoofSilo, the AI isn’t a chat box in the corner. It has a name, **SiloPilot**, and its own place in the menu, where the roofer sets up the AI voice, AI workflows, the AI web chat, a profile and a knowledge base.' },
  { type: 'p', text: 'The knowledge base is where the roofer teaches the AI about the business: services, manufacturers, prices and units of measurement. That way, **when the AI talks to a lead, it talks about the company’s real services**, not generic answers.' },
  { type: 'img', src: '/cases/roofsilo/03.webp', alt: 'SiloPilot settings with the AI Voice, AI Workflow, AI Webchat, Profile and Knowledge Base tabs, and a knowledge base filled with roofing services, manufacturers, prices and units', w: 2048, h: 1010 },
  { type: 'p', text: 'The AI plan brings it all together: an AI call center for inbound and outbound calls, a text and follow-up when a call is missed (remember the roofer on the roof?), call transcription and summaries, recommended responses, message scoring, and leads that move to the next stage by themselves.' },

  { type: 'h2', text: 'A complete CRM, not a demo' },
  { type: 'p', text: 'The prototype had the idea. The product needed everything around it. We designed many screens, and the whole flow is documented in Figma. Here are the main ones.' },
  { type: 'h3', text: 'Pipelines' },
  { type: 'p', text: 'A board where every lead is a card. Each card shows the contact, the address, the type of job (repair, inspection, replacement) and its value, with **quick actions right on the card**: call, message, contract, schedule and task. Stages like “2nd Attempt”, “3rd Attempt” and “Drip Campaign” follow how roofers actually chase a lead.' },
  { type: 'img', src: '/cases/roofsilo/04.webp', alt: 'Pipeline board with a lead card zoomed in: lead source, contact and address, job type and value, and quick actions', w: 2048, h: 1180 },
  { type: 'h3', text: 'Conversations' },
  { type: 'p', text: 'SMS, WhatsApp and email with each lead, **all in one thread**, with photos and files in the same place.' },
  { type: 'img', src: '/cases/roofsilo/05.webp', alt: 'Conversation screen with a thread with a lead and the SMS, WhatsApp and Email tabs highlighted', w: 2048, h: 920 },
  { type: 'h3', text: 'Calendar and tasks' },
  { type: 'p', text: 'Inspections, phone calls and on-site visits on one calendar, with Google Calendar sync. When you create an event, you can search by customer or by address and assign team members, because a roofer’s appointment usually happens at someone’s house.' },
  { type: 'img', src: '/cases/roofsilo/06.webp', alt: 'Calendar in month view with the new event dialog (inspection, phone call, on-site, customer or address, team members) and an event’s details', w: 2048, h: 1260 },
  { type: 'h3', text: 'Reports' },
  { type: 'p', text: 'This part has a lot of data, so the challenge was to **make the numbers easy to understand** at a glance.' },
  { type: 'p', text: 'The pipeline report shows the funnel from new lead to closed job, in number of jobs and in value. The source report answers a question every business owner has: **which channel actually brings paid jobs?** Facebook, Google, the website or phone calls, each with leads, appointments, won jobs, close rate and average job size.' },
  { type: 'img', src: '/cases/roofsilo/07.webp', alt: 'Pipeline report with the funnel from new lead to closed job, in front of the source report comparing Facebook, Google, Website and Phone calls', w: 2048, h: 1340 },
  { type: 'h3', text: 'Automations and templates' },
  { type: 'p', text: 'A visual builder where the roofer sets up their own automations: a trigger (like “Contact created”), conditions and actions (like sending an SMS), with draft, publish and a “Test flow” button before anything goes live. Text and email templates show how many automations use each one, so you know what you’ll affect before you edit it.' },
  { type: 'img', src: '/cases/roofsilo/08.webp', alt: 'Automation builder with a Contact Created trigger, a weekly condition and an SMS action, next to the panels for picking a trigger and setting up the SMS', w: 2048, h: 1160 },
  { type: 'h3', text: 'Signup, onboarding and billing' },
  { type: 'p', text: 'Signup, email verification and a 3-step onboarding: choose a plan (with a 14-day free trial), tell us about you, and tell us about your company. The questions (which tools you use today, where you advertise, what kind of roofing work you do) help tailor RoofSilo to each business. Billing and invoices live in the settings.' },
  { type: 'img', src: '/cases/roofsilo/09.webp', alt: 'The three onboarding steps: pick a plan with a 14-day free trial, the tools they want, and where they advertise', w: 2048, h: 1180 },

  { type: 'h2', text: 'The design system' },
  { type: 'p', text: 'We used **shadcn/ui as the base** and adapted it to the client’s visual identity. Starting from a solid, well-known base meant we didn’t spend time redrawing buttons and inputs, and could focus on the parts that are specific to roofers.' },
  { type: 'p', text: 'The colors are shadcn/ui tokens with RoofSilo’s blue as the primary: **one blue for every action and selected state**, slate neutrals for the data, and green and red only for status. The type is **Segoe UI**, set as semantic tokens from the 36px display down to the 10px badge.' },
  { type: 'img', src: '/cases/roofsilo/10.webp', alt: 'Color tokens: primary blue, foreground, muted and subtle text, borders, sidebar, success and destructive', w: 2048, h: 1100 },
  { type: 'img', src: '/cases/roofsilo/11.webp', alt: 'Type scale in Segoe UI, from display/default at 36px to text/xxsmall at 10px', w: 2048, h: 1020 },
  { type: 'img', src: '/cases/roofsilo/12.webp', alt: 'Real components cropped from the screens: buttons, tabs, metric cards, status tags, lead card, sign-up form, verification code, plan card, checkbox chips and table rows', w: 2048, h: 1830 },
  { type: 'p', text: 'Features still on the way, like Finance, Measurements and Analytics, appear in the menu with a “Soon” tag.' },

  { type: 'h2', text: 'From Figma to production with Tempo' },
  { type: 'p', text: 'RoofSilo was built with two tools: **Figma and Tempo.**' },
  { type: 'p', text: 'Tempo is an AI builder that runs on Anthropic’s models, like Claude. Think of it as **Claude Code for designers, developers and PMs**: you mix prompts with a visual editor, and it writes real React code.' },
  { type: 'p', text: 'We started in Figma, using what the client already had as the base, and designed the screens there. Then we took them back to Tempo to actually build RoofSilo. In other words, we used our own product to bring a client’s product to life, and **we put the app in production.** 💜' },

  { type: 'h2', text: 'After the launch' },
  { type: 'p', text: 'RoofSilo is still out there. In July 2026, more than a year after launch, it was still being offered to roofers, with SiloPilot at its center.' },
  { type: 'p', text: 'These are the metrics I’d use to measure its success:' },
  { type: 'ul', items: [
      'How fast leads get a first answer, by a person or by the AI',
      'How many missed calls the AI follow-up recovers',
      'Close rate by source (fun fact: RoofSilo’s own source report would be my main tool for this ;)',
      'Trial to paid conversion after onboarding',
    ] },
  { type: 'p', text: '“A vibe-coded prototype proves an idea. Design turns it into a product.”' },
];

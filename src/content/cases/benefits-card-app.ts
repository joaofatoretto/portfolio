// Content from ../resume/master/case-studies/benefits-card-app_v2.md (João's rewrite of the original Framer case).
// Text is kept as written there; edit freely. Inline markup: **bold**, _italic_, [link](url).
// TODO(images): six images from the draft's [IMAGE: …] slots still need exporting from Figma; each TODO below marks
// where one goes. Add each to public/cases/benefits-card-app/ and its Portuguese alt/caption in ../pt/cases/benefits-card-app.ts.
import type { CaseBody } from './types';

export const meta = {"company": "Foodpass", "year": "2024–2025", "role": "Senior UX/UI Designer and design lead (2024) · Freelance Product Designer (2025)", "team": "Me and @Paula Fernandes"} as const;

export const original = { title: "From food baskets to fintech in two months", subtitle: "Launching Foodpass's second business inside the app it already had" };

export const cover = { src: "/cases/benefits-card-app/cover.png", w: 2048, h: 1162 };
export const card = { src: "/cases/benefits-card-app/card.png", w: 2048, h: 1162 };

export const body: CaseBody = [
  { type: 'h2', text: 'R$70 or R$2,000' },
  { type: 'p', text: 'A food basket was worth about **R$70 per employee**. A benefits card could be worth **more than R$2,000.**' },
  { type: 'p', text: 'That was the opportunity in front of Foodpass. We already had the clients, the brand and an app. What we didn’t have was time: **the first clients were looking for a card right now, and we had about two months to give them one.**' },
  { type: 'p', text: 'And the people who would use it? Factory-floor workers who **weren’t familiar with technology at all. Their phones were for calls and messages, and that was it.**' },

  { type: 'h2', text: 'A basic basket that isn’t so basic' },
  { type: 'p', text: 'Foodpass started as a pivot from **Superopa**, an e-commerce app that sold near-expiry products well below market price. It needed its own logistics and a warehouse full of products we weren’t sure we would sell, so **we lost a lot of stock.**' },
  { type: 'p', text: 'Foodpass brought **predictability**. We sold the **cesta básica**, the food basket many Brazilian companies give their employees, to companies instead of consumers. Knowing what went into each basket and when it shipped, we needed less working capital and planned logistics around exact dates.' },
  { type: 'p', text: 'And our basket wasn’t so basic: employees could **swap items they didn’t want for others of similar value, or save the value for next month.**' },
  { type: 'h3', text: 'Brazil’s food benefits in 30 seconds' },
  { type: 'p', text: 'Brazilian companies often give employees **meal, grocery, mobility and flex allowances** on top of their salary. Companies like [Flash](https://flashapp.com.br/) and [Caju](https://www.caju.com.br/) put them all on **one multi-benefit card**, managed in an app.' },

  { type: 'h2', text: 'A door that was already open' },
  { type: 'p', text: 'Our clients were mostly **older companies with large factory floors** and little contact with innovation. By choosing a customizable basket, **they had just opened the door to something new**, and many were also looking for a benefits card.' },
  { type: 'p', text: 'So why not offer it too? It was an **upsell** for basket clients and **a second option for the same leads.** And, as you saw above, it changed the size of each deal: a basket was worth about **R$70 to R$220 per employee**, while a card was usually **R$600 to R$900, sometimes more than R$2,000.** We earned a small percentage on both.' },
  { type: 'p', text: 'For a small team with little investment, **this second product was what we needed to keep going.** And we had to launch it while those clients were still interested.' },

  { type: 'h2', text: 'The challenge' },
  { type: 'p', text: '“How might we fit a new fintech business inside an app built for food baskets, in about two months, for people who barely use technology?”' },
  { type: 'p', text: 'The card infrastructure came from [Stark Bank](https://starkbank.com/), a Brazilian bank that offers banking services to businesses through APIs. It issued the cards and handled the money companies deposited. **Everything we designed had to fit what Stark Bank supported.**' },
  { type: 'p', text: 'In parallel, we designed a **back office from scratch** where HR people could manage baskets and cards for their employees.' },

  { type: 'h2', text: 'Five workers, three HR people' },
  { type: 'p', text: 'We didn’t have much time, so we ran **short semi-structured interviews with about 5 workers and 2 to 3 HR people.** It wasn’t much, but it was enough to change the product:' },
  {
    type: 'ol',
    items: [
      '**A phone is for calls and messages.** Most workers weren’t familiar with technology at all. Many had no email, or one they never opened, and passwords didn’t stick. Every step had to be short, familiar and easy to undo.',
      '**WhatsApp was the one thing everyone knew.** It was the clearest channel for codes and instructions.',
      '**Security can’t depend on the user getting it right.** Nobody should be able to activate someone else’s card, confuse codes, or have a code exposed.',
      '**HR is one person doing everything.** At the end of the month, the same person handles payments and everything else about employees. Forgetting to add or remove someone was easy, and it meant credit going to the wrong people.',
    ],
  },

  { type: 'h2', text: 'What we kept, and what we cut' },
  { type: 'p', text: 'For every feature, we asked the same question: **what is the essential we need to launch in the least time possible and validate this business model?**' },
  { type: 'p', text: '**What we kept:**' },
  {
    type: 'ul',
    items: [
      '**CPF as the login.** Instead of email, employees log in with their CPF (the Brazilian taxpayer ID everyone knows by heart) and a code sent by SMS.',
      '**A guided tutorial** showing where to see each benefit and how to create a virtual card and add it to a wallet.',
      '**A 4-digit PIN** to pay and to open the card area. Forgot it? Their HR team or our WhatsApp support can help.',
      '**One home for two businesses.** The card balance and the basket balance sit side by side, so one look shows everything.',
    ],
  },
  {
    type: 'img',
    src: '/cases/benefits-card-app/01.png',
    alt: 'The Foodpass app home with the card balance and the basket balance side by side, next to the card area, where the balance is split into meal, grocery, flex and mobility',
    w: 1546, h: 809,
    caption: 'The home brings both products together. The card area splits the balance by benefit.',
  },
  // TODO(images): login with CPF + SMS code, and the tutorial
  {
    type: 'img',
    src: '/cases/benefits-card-app/02.png',
    alt: 'First access: the bean mascot welcomes the employee, the 4-digit PIN creation screen, and the card details with options to block, delete or add the card to Google Wallet',
    w: 1546, h: 809,
    caption: 'First access: a warm welcome, PIN creation and the card details',
  },
  { type: 'p', text: '**What we cut, on purpose:**' },
  {
    type: 'ul',
    items: [
      '**Physical cards.** The MVP launched with **virtual cards only, used through Google Wallet and Apple Wallet.** We knew a physical card would be easier for our users. But it added cost, logistics and a more complex experience in the app.',
      '**WhatsApp.** We wanted it since the first interviews, but it cost more effort and money than SMS. It came later.',
      '**Back-office tools for HR’s end-of-month rush.** We designed them, but left them out of the first version.',
    ],
  },
  {
    type: 'img',
    src: '/cases/benefits-card-app/04.png',
    alt: 'Creating a virtual card in four screens: an introduction with the tomato mascot, naming the card, a short loading screen, and the card created',
    w: 1546, h: 809,
    caption: 'Virtual cards: name it, wait a few seconds, done.',
  },
  { type: 'p', text: 'Everything was built on **the design system we already had**, so developers could move fast with components they knew. **The whole product, backend included, was built in about two months**, at a time when AI couldn’t write most of the code for us.' },

  { type: 'h2', text: 'More than Figma' },
  { type: 'p', text: 'My work didn’t stop at the screens. **I took part in every discussion about each feature and how it would be built**, including the technology behind it. That’s how we decided what went into the MVP, and how we **prepared both design and code for the releases we had already planned.** Some shortcuts are cheap today and far too expensive to change later!' },
  { type: 'p', text: 'When the app was built, **I reviewed every screen against the design**, testing every flow and hunting every pixel that didn’t match. I documented each difference in Figma and fixed it with the developers on calls.' },
  // TODO(images): design review annotations in Figma

  { type: 'h2', text: 'Growing a designer' },
  { type: 'p', text: 'I led the design with **Paula Fernandes, a junior designer on my team.** She came from Graphic Design and was new to UX/UI, so I shaped our process around her growth:' },
  {
    type: 'ol',
    items: [
      '**Wireframes together,** to define all the content before any visual.',
      '**Critique sessions** on her prototypes and illustrations, followed by new iterations.',
      '**A review of all her work,** with feedback at every step.',
    ],
  },
  { type: 'p', text: 'At each step I gave her real ownership, so she could become an even better designer than she already was.' },

  { type: 'h2', text: 'A bean in a security suit' },
  { type: 'p', text: 'This is where Paula taught me. **She had a strong background in illustration, and I learned a lot from her.** We became great friends, and **I recommend her to any team she joins** 💜' },
  { type: 'p', text: 'The Foodpass logo is a **bean**, the base of the Brazilian plate and of every food basket. We turned it into a mascot, with a **tomato**, a **potato** and the rest of the basket as friends. For people with little digital experience, **illustrations explain what words can’t.**' },
  { type: 'p', text: '**On the PIN screen, the bean wears a black suit and sunglasses and guards a VIP door.** No PIN, no entry. Without a line of text, it says that **this place is safe, and the PIN is what protects it.**' },
  {
    type: 'img',
    src: '/cases/benefits-card-app/03.png',
    alt: 'The bean mascot on the PIN screens: fishing for a lost padlock on PIN recovery, in a black suit and sunglasses guarding a VIP door on PIN entry, and holding up a padlock on PIN change',
    w: 1546, h: 809,
    caption: 'The bean on duty: PIN recovery, PIN entry and PIN change',
  },
  // TODO(images): the character cast

  { type: 'h2', text: 'The problem we thought could wait' },
  { type: 'p', text: 'The beta proved our research right sooner than we expected. **HR forgot to add or remove employees, and credit went to the wrong people.**' },
  { type: 'p', text: 'Reminders already existed, and they would never be enough: we couldn’t control how much each HR person had on their plate. So the fix had to make mistakes easy to undo. **HR could revoke a recent credit and add credit to individual employees.** Because **this was already designed**, we could ship it fast.' },

  { type: 'h2', text: 'A code only the owner can see' },
  { type: 'p', text: 'A few months later, Foodpass launched the **physical cards**, and **Stark Bank’s security rules required each card to be activated with a code that only its owner receives.**' },
  { type: 'p', text: 'In 2025, **Foodpass brought me back as a freelancer, with Paula, to design this experience** online and offline. Paula designed the card itself, with my reviews and feedback. **The activation code travels in the carrier letter**, the paper that holds the card in the envelope. The letter answers each question in order: _“What is this card? Which app? How do I get in?”_ It uses plain language, visual steps and **a QR code that leads straight to the app.**' },
  // TODO(images): card artwork
  // TODO(images): carrier letter, front and back
  // TODO(images): activation flow in the app

  { type: 'h2', text: 'Results' },
  {
    type: 'ul',
    items: [
      '**We launched fast enough to catch the first clients** while they were still looking for a card. We did it!',
      '**The card reached employees at multiple companies**, as Foodpass’s second product next to the baskets.',
      '**It opened sales to companies with more than 500 employees.**',
    ],
  },

  { type: 'h2', text: 'Next steps' },
  { type: 'p', text: 'To validate the card as a second business, I would measure:' },
  {
    type: 'ul',
    items: [
      '**The client mix:** the share of clients using baskets only, cards only, or both, and **the revenue each group brings in.**',
      '**Drop-off during onboarding,** from the CPF to the code.',
      '**Support requests about the cards.**',
    ],
  },
  { type: 'p', text: 'But numbers wouldn’t be enough. Intercept surveys, forms and support tickets can’t really reach people who aren’t familiar with technology. So I would **talk to employees directly**, to get real, live input.' },
  { type: 'p', text: 'And I would ask HR. When employees have a problem, **HR is the first person they go to.** A survey with HR people, or an intercept survey in the HR portal, would show what complaints they receive.' },

  { type: 'h2', text: 'Thanks' },
  { type: 'p', text: 'To **Paula**, and to **Eperson**, **Rafael** and **Henrique** from the development team, who built a new business with us in two months ;)' },

  { type: 'h2', text: 'Interactive prototype' },
  {
    type: 'embed',
    src: 'https://embed.figma.com/proto/l0Nn2eVcNsMeU2OiisH30X/Cart%C3%B5es-(Copy)-(Copy)?content-scaling=fixed&kind=proto&node-id=871-457&page-id=152%3A10470&scaling=min-zoom&starting-point-node-id=871%3A457&embed-host=share',
    label: 'Interactive prototype',
  },
];

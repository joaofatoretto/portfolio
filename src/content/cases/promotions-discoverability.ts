// Content copied from https://joaofatoretto.framer.website/automatic-lists (the original Framer portfolio).
// Text is kept as written there; edit freely. Inline markup: **bold**, _italic_, [link](url).
import type { CaseBody } from './types';

export const meta = {"company": "Superopa (Foodpass)", "year": "2024", "role": "UX/UI Designer", "team": "Only me"} as const;

export const original = { title: "Enhancing promotions discoverability", subtitle: "15% increase in add to cart event of Superopa's Ecommerce" };

export const cover = { src: "/cases/promotions-discoverability/cover.png", w: 2048, h: 1113 };
export const card = { src: "/cases/promotions-discoverability/card.png", w: 2048, h: 1113 };

export const body: CaseBody = [
  {
    "type": "h2",
    "text": "Overview"
  },
  {
    "type": "p",
    "text": "This is how we turned the request \"we want a timer for flash promotions in the app\" into a solution that solved the root problem, resulting in a **15% increase in add to cart event**, through improving the discoverability of promotions and products."
  },
  {
    "type": "p",
    "text": "The 3 main deliverables of this project were:"
  },
  {
    "type": "ul",
    "items": [
      "**New automatic product lists** that brought the best deals and most bought products;",
      "New backoffice screens to **support the creation and configuration of these lists**, in order to **facilitate the work of the marketing team** with a simple and intuitive interface;",
      "**Improvement of the search mechanism** for products using [Elastic Search](https://medium.com/quantyca/reviving-an-e-commerce-search-engine-using-elasticsearch-e540751c6d99), which resulted in a **90% success rate** for all searches performed by the mechanism."
    ]
  },
  {
    "type": "p",
    "text": "Take a look at the design process used in this project:"
  },
  {
    "type": "img",
    "src": "/cases/promotions-discoverability/01.png",
    "alt": "Promotions discoverability: Overview",
    "w": 2048,
    "h": 487
  },
  {
    "type": "h2",
    "text": "Stakeholder Alignment and Discovery Objective"
  },
  {
    "type": "p",
    "text": "After discussing with stakeholders to understand their goals, I understood that \"hidden\" objective behind that request was to **\"increase the number of orders to a daily target we can't share publicly\".**"
  },
  {
    "type": "p",
    "text": "The problem with the timer?"
  },
  {
    "type": "ul",
    "items": [
      "It focuses on only a small number of great deals on products that need to be changed every day (**what we couldn't achieve**);",
      "It requires a lot of **effort of the marketing team** and we were a very small company;",
      "The problem it was supposed to solve was not clear at all."
    ]
  },
  {
    "type": "p",
    "text": "With this in mind, we defined and planned a research with the following discovery objective:"
  },
  {
    "type": "p",
    "text": "\"Decide how we can increase the number of orders through campaigns and promotions.\""
  },
  {
    "type": "img",
    "src": "/cases/promotions-discoverability/02.png",
    "alt": "Promotions discoverability: Stakeholder Alignment and Discovery Objective",
    "w": 2048,
    "h": 1113
  },
  {
    "type": "h2",
    "text": "UX Research - Problem Space, Usability Tests and CX Tickets"
  },
  {
    "type": "p",
    "text": "By analysing the funnel, we identified a big gap on add to cart event, what could possibly indicate an opportunity to grow."
  },
  {
    "type": "p",
    "text": "Then, we decided to analyse:"
  },
  {
    "type": "ul",
    "items": [
      "Our problem space with all the **problems we collected from past researches;**",
      "Past **usability tests** focusing on add to cart event;",
      "**CX support tickets** from users."
    ]
  },
  {
    "type": "p",
    "text": "At the end, we had a key finding that highlighted where users were struggling the most at this step of the funnel:"
  },
  {
    "type": "p",
    "text": "\"Users were not finding the best promotions we had, neither the products they wanted to buy\""
  },
  {
    "type": "img",
    "src": "/cases/promotions-discoverability/03.png",
    "alt": "Promotions discoverability: UX Research - Problem Space, Usability Tests and CX Tickets",
    "w": 2048,
    "h": 1113
  },
  {
    "type": "h2",
    "text": "Ideation and Prioritization - Building Together"
  },
  {
    "type": "p",
    "text": "It was time to focus on the solution together with the main stakeholders. To prepare the meeting, I analysed competitors and saved a lot of references on how they solve that problem to give a broader repertoire to the team."
  },
  {
    "type": "p",
    "text": "So I brought the marketing team and the tech lead to ideate, prioritize and build solutions together. This mix of background really enhanced the quality of the final solution to impact the user experience."
  },
  {
    "type": "img",
    "src": "/cases/promotions-discoverability/04.png",
    "alt": "Promotions discoverability: Ideation and Prioritization - Building Together",
    "w": 2048,
    "h": 1113
  },
  {
    "type": "h2",
    "text": "The solution and the Outcome"
  },
  {
    "type": "p",
    "text": "The final solution was a bit techy, although very easy and fast to implement, which made part of this solution a real quick win."
  },
  {
    "type": "p",
    "text": "As I already mentioned, the 3 main deliverables of this project were:"
  },
  {
    "type": "ul",
    "items": [
      "**New automatic product lists** that brought the best deals and most bought products;",
      "New backoffice screens to **support the creation and configuration of these lists**, in order to **facilitate the work of the marketing team** with a simple and intuitive interface;",
      "**Improvement of the search mechanism** for products using [Elastic Search](https://medium.com/quantyca/reviving-an-e-commerce-search-engine-using-elasticsearch-e540751c6d99), which resulted in a **90% success rate** for all searches performed by the mechanism."
    ]
  },
  {
    "type": "p",
    "text": "After all, we ran A/B testing and found the following results:"
  },
  {
    "type": "p",
    "text": "An increase of 15% on the add to cart conversion rate!"
  },
  {
    "type": "h2",
    "text": "Interactive Figma"
  },
  {
    "type": "p",
    "text": "Note: the only solution that needed a prototype was the create lists feature on the backoffice."
  },
  {
    "type": "embed",
    "src": "https://embed.figma.com/design/4dC1v1MXJjVbP9ZhXAMNxX/Backoffice-novas-listas-(Copy)-(Copy)?node-id=75-644&embed-host=share",
    "label": "Interactive prototype"
  }
];

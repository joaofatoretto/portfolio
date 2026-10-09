// Content copied from https://joaofatoretto.framer.website/photo-edition-experience (the original Framer portfolio).
// Text is kept as written there; edit freely. Inline markup: **bold**, _italic_, [link](url).
import type { CaseBody } from './types';

export const meta = {"company": "Casar.com", "year": "2022", "role": "Product Designer", "team": "Only me"} as const;

export const original = { title: "New Experience of photo edition", subtitle: "Addressing our couples' biggest problem on site editor" };

export const cover = { src: "/cases/photo-editing/cover.png", w: 1920, h: 1080 };
export const card = { src: "/cases/photo-editing/card.png", w: 1920, h: 1080 };

export const body: CaseBody = [
  {
    "type": "h2",
    "text": "Contextualizing the problem"
  },
  {
    "type": "p",
    "text": "Over 16% of users reported having difficulty editing images on the Casar.com platform. This was the biggest pain they had in editing the site."
  },
  {
    "type": "p",
    "text": "At [Casar.com](http://casar.com/), couples can create their websites to announce their wedding and receive gifts from the invited people. That being said, it has always been very clear to us that couples want beautiful sites for the invited people to see."
  },
  {
    "type": "p",
    "text": "The site is like the couple's brand!"
  },
  {
    "type": "p",
    "text": "Many even pay professional photographers to do pre-wedding and take several beautiful photos, so they can put these photos on their site and show everyone how much they are in love."
  },
  {
    "type": "p",
    "text": "So far so good! But just imagine:"
  },
  {
    "type": "p",
    "text": "After taking several incredible photos and putting them on your site, you come across several of these photos distorted and even well cut, depending on the device you are using."
  },
  {
    "type": "p",
    "text": "**You don't have real control over how the photo appears on the site!** After trying quite a bit, you might even be able to make it look nice on your computer… but maybe one of your invited people won't be as lucky on her cell phone."
  },
  {
    "type": "p",
    "text": "But this perception didn't just come out of our “feeling”. As you saw above:"
  },
  {
    "type": "p",
    "text": "More than 16% of users reported having difficulty editing images! This was the biggest pain they had in editing the site."
  },
  {
    "type": "p",
    "text": "We got this data from our “site editing survey”, which asks, from 1 to 5, what level of difficulty the user had in editing, the main points of difficulty and an open space for the user to tell a little more about her experience."
  },
  {
    "type": "img",
    "src": "/cases/photo-editing/01.png",
    "alt": "Photo editing: Contextualizing the problem",
    "w": 1901,
    "h": 916
  },
  {
    "type": "p",
    "text": "This survey is an **interception method** and was integrated with the platform by Typeform. It appears when the user makes her second edit and clicks on the save button. The editing survey, in conjunction with other surveys, **helps populate Casar's Problem Space** in a continuous way, which was and is very important in understanding the user and prioritizing the pains we will solve."
  },
  {
    "type": "p",
    "text": "💡 If you are not familiar with the term “Problem Space”, take a look at this article below by [Renato Caliari](https://www.linkedin.com/in/renatocaliari/) about the **Triple Track Agile**. I guarantee you won't regret it ;)"
  },
  {
    "type": "p",
    "text": "[Triple Track Agile: a combination of Problem Space with Solution Space](https://medium.com/tentaculus/triple-track-agile-problem-space-solution-space-81c2c6b7bf24)"
  },
  {
    "type": "p",
    "text": "In addition to the survey, the CX team received daily complaints about image editing. Often, the team even had to **edit the users' images by hand** so that the photos were the way they wanted, which took a lot of time."
  },
  {
    "type": "h2",
    "text": "Understanding what needs to be built"
  },
  {
    "type": "p",
    "text": "Analyzing the survey and collecting the CX experience, **we confirmed the priority of solving this problem and could understand it better.** With this, I used the How Might We (HMW) framework to assist in directing the construction of the solution:"
  },
  {
    "type": "img",
    "src": "/cases/photo-editing/02.png",
    "alt": "Photo editing: Understanding what needs to be built",
    "w": 1141,
    "h": 367
  },
  {
    "type": "p",
    "text": "Most of this construction was done and documented using Miro."
  },
  {
    "type": "h2",
    "text": "Analysis of the current solution"
  },
  {
    "type": "p",
    "text": "With the direction defined, **I analyzed the current solution to find points of improvement.** I discovered that the platform had different photo editing experiences in different parts of it. Each one had different problems and needed to be analyzed separately. To give you an idea, one of them had no editing at all and the image was simply inserted."
  },
  {
    "type": "h3",
    "text": "Website cover photo"
  },
  {
    "type": "p",
    "text": "_Extremely relevant_"
  },
  {
    "type": "img",
    "src": "/cases/photo-editing/03.png",
    "alt": "Photo editing: Analysis of the current solution (1 of 4)",
    "w": 1915,
    "h": 852
  },
  {
    "type": "p",
    "text": "Identified problems:"
  },
  {
    "type": "ul",
    "items": [
      "There is no specific crop or preview for mobile",
      "You can't cancel the action to change the cover image",
      "The crop is not in proportion to the theme, that is, even if the theme has a square cover image, the crop will still be in this rectangular format and the image will be super enlarged on the theme _(note: each user can choose a different theme for the site, changing layout, colors, typography, etc…)_",
      "You can't work with the image, it stays the way you uploaded it",
      "Users say it's hard to choose the image from the computer",
      "Users complain that the photo is in low quality"
    ]
  },
  {
    "type": "h3",
    "text": "Images in the body of the site"
  },
  {
    "type": "p",
    "text": "_Relevant_"
  },
  {
    "type": "img",
    "src": "/cases/photo-editing/04.png",
    "alt": "Photo editing: Analysis of the current solution (2 of 4)",
    "w": 1254,
    "h": 628
  },
  {
    "type": "p",
    "text": "Identified problems:"
  },
  {
    "type": "ul",
    "items": [
      "It doesn't even have a crop or edit"
    ]
  },
  {
    "type": "h3",
    "text": "Bride and groom avatar"
  },
  {
    "type": "p",
    "text": "_Not so relevant_"
  },
  {
    "type": "img",
    "src": "/cases/photo-editing/05.png",
    "alt": "Photo editing: Analysis of the current solution (3 of 4)",
    "w": 1254,
    "h": 628
  },
  {
    "type": "p",
    "text": "Identified problems:"
  },
  {
    "type": "ul",
    "items": [
      "Very small, it's hard to select a face in a big photo",
      "Inverted buttons cause some strangeness"
    ]
  },
  {
    "type": "h3",
    "text": "Creating a new custom gift with photo"
  },
  {
    "type": "p",
    "text": "_Not so relevant, as we already have several gifts previously selected for the user to choose_"
  },
  {
    "type": "img",
    "src": "/cases/photo-editing/06.png",
    "alt": "Photo editing: Analysis of the current solution (4 of 4)",
    "w": 1009,
    "h": 674
  },
  {
    "type": "p",
    "text": "Identified problems:"
  },
  {
    "type": "ul",
    "items": [
      "You can drag a photo from the computer and drop it there, unlike the others, but there is no feedback while it's being dragged that this will work",
      "After putting the photo once, there is nothing indicating how to replace it",
      "You can't apply any crop or edit"
    ]
  },
  {
    "type": "h2",
    "text": "Competitor analysis"
  },
  {
    "type": "p",
    "text": "It was also important to look for references of well-done editing experiences to **increase my repertoire on the subject.** I was analyzing competitors and other references and documenting with prints and post-its on Miro."
  },
  {
    "type": "p",
    "text": "From here, came **important insights for ideation** that contributed a lot to solve problems found in the analysis of the current solution."
  },
  {
    "type": "img",
    "src": "/cases/photo-editing/07.jpg",
    "alt": "Photo editing: Competitor analysis",
    "w": 1394,
    "h": 2048
  },
  {
    "type": "h2",
    "text": "Ideation and Prioritization"
  },
  {
    "type": "p",
    "text": "Using the 3 HMWs defined and the analyses carried out, I did an **ideation to define possible paths where our solution could walk.** At this stage, any idea is valid, even if we imagine it is impossible at first, it can still be adapted and present itself as a high-value innovation at a later time."
  },
  {
    "type": "p",
    "text": "After the ideation, **I prioritized** each of the ideas in an **impact x effort matrix** and **clustered the ideas** so that they made sense together, thus, we could have several proposals for the final solution, from a more essential and simpler one, to one with more complicated increments, but still relevant."
  },
  {
    "type": "img",
    "src": "/cases/photo-editing/08.jpg",
    "alt": "Photo editing: Ideation and Prioritization",
    "w": 2048,
    "h": 1349
  },
  {
    "type": "h2",
    "text": "Analysis of the editing API"
  },
  {
    "type": "p",
    "text": "To enable some of my solution proposals, I decided to **research and analyze different image editing APIs**. However, early on, I realized that the API we were using at that time, the [Cropper.js](https://fengyuanchen.github.io/cropperjs/), had several of the most important resources we needed, thus, another solution proposal emerged **more lean, but with the essential and with much less effort than the other solutions.**"
  },
  {
    "type": "img",
    "src": "/cases/photo-editing/09.png",
    "alt": "Photo editing: Analysis of the editing API",
    "w": 1366,
    "h": 1190
  },
  {
    "type": "h2",
    "text": "Building the solution"
  },
  {
    "type": "h3",
    "text": "Solution proposals with sketches"
  },
  {
    "type": "p",
    "text": "Presenting the different solution proposals to the rest of the product team, we could **discuss our priorities and the effort involved in each of the solutions**, considering the **allocation of the team of developers.**"
  },
  {
    "type": "p",
    "text": "After the discussion, the team agreed that at that moment we would go with the leaner, but essential, version of the solution, since it would solve a large part of the couples' pain and would use only the resources of the current API."
  },
  {
    "type": "img",
    "src": "/cases/photo-editing/10.jpg",
    "alt": "Photo editing: Building the solution (1 of 2)",
    "w": 1832,
    "h": 2048
  },
  {
    "type": "p",
    "text": "To create the sketches, I also **researched and documented several different UIs** with image loading and editing, which also contributed to the construction of the prototype in Figma."
  },
  {
    "type": "img",
    "src": "/cases/photo-editing/11.jpg",
    "alt": "Photo editing: Building the solution (2 of 2)",
    "w": 2048,
    "h": 244
  },
  {
    "type": "h2",
    "text": "Interactive Figma"
  },
  {
    "type": "embed",
    "src": "https://embed.figma.com/proto/BVKM2wbczEzk7cdkt6MMCB/Crop-2.0?node-id=179-3113&node-type=canvas&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=179%3A3113&embed-host=share",
    "label": "Desktop"
  },
  {
    "type": "embed",
    "src": "https://embed.figma.com/proto/BVKM2wbczEzk7cdkt6MMCB/Crop-2.0?node-id=113-847&node-type=canvas&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=113%3A847&embed-host=share",
    "label": "Mobile",
    "tall": true
  },
  {
    "type": "h2",
    "text": "Adoption of the tool by current users"
  },
  {
    "type": "p",
    "text": "It's important to note that the new ones will have to use the tool when creating a new site."
  },
  {
    "type": "p",
    "text": "But what about those who have already edited all the photos? Will they stay with the old and distorted photos?"
  },
  {
    "type": "p",
    "text": "Thinking about this, I designed a modal with custom icons to **advertise the novelty to the current users** when they entered the site."
  },
  {
    "type": "img",
    "src": "/cases/photo-editing/12.png",
    "alt": "Photo editing: Adoption of the tool by current users",
    "w": 2048,
    "h": 1738
  },
  {
    "type": "h2",
    "text": "Launch and documentation"
  },
  {
    "type": "p",
    "text": "We decided to do a **phased launch**, that is, launching it to the users in different phases and gradually. With this, we could **find eventual bugs in the solution and solve them while they were still impacting only a part of the users**, not letting the problem scale."
  },
  {
    "type": "p",
    "text": "In addition, the entire solution and its particularities, such as **the launch and the details of interaction with the user, were detailed in a requirements document** for the development team **with acceptance criteria** so that the solution would be approved before deploying. But it's important to clarify that this does not exclude the handover to the development team with conversations to clarify about the solution nor the follow-up as the solution is being developed."
  },
  {
    "type": "h2",
    "text": "Next steps"
  },
  {
    "type": "p",
    "text": "The first next step of this project would be to do **usability tests and correct the main problems found.** Only then would the solution go to the development team, with me **following the whole process and testing the final solution before launching** to the users."
  },
  {
    "type": "p",
    "text": "After the launch, we would need to **analyze the results**, but it's important to note that **I left Casar before the solution was launched**, so I couldn't do this analysis. However, **the metrics I would use are:**"
  },
  {
    "type": "ul",
    "items": [
      "Reduction of tickets on the theme in CX",
      "Reduction of site deletion (now automated and with a survey that I designed to help populate the Problem Space)",
      "Customer Satisfaction Score (CSAT) analyzing this phase of the journey with the editing survey"
    ]
  }
];

/* The screens hung in the corridor. Positions are in CSS px at scale 1 (hero.css scales them per viewport):
   x from the corridor axis (negative = left wall), y from its middle, z into the distance (0 = the camera's start).
   `crop` is [x, y, w, h] in the source image's own pixels, so one sheet of phones can give one tall phone screen. */
export type Screen = {
  id: string;
  src: string;
  size: [number, number];          // the source image, in px
  crop?: [number, number, number, number];
  w: number;                       // width on the wall at scale 1
  x: number; y: number; z: number;
  ry: number; rx: number;          // yaw (walls) and pitch (ceiling, floor), degrees
  cap: string;                     // client · case title
  alt: string;
  tall?: boolean;                  // a phone: radius and caption sized for it
  more?: boolean;                  // dropped on phones
  pz?: number;                     // its z on phones, where fewer screens share the whole flight
};

const TEMPO = 'Tempo Labs · Tempo New Landing Page';
const FOODPASS = 'Foodpass · From food baskets to fintech in two months';
const CASAR = 'Casar.com · New Experience of Photo Editing';
const SUPEROPA = 'Superopa · Enhancing Promotions Discoverability';
const SOPHIA = 'Sophia · Strengthening Brazilians’ mental health through Sophia';

export const SCREENS: Screen[] = [
  { id: 'sophia-cover', src: '/cases/sophia-mental-health/cover.jpg', size: [1920, 1080], w: 620, x: -660, y: -70, z: -1250, ry: 22, rx: 0, pz: -1000,
    cap: SOPHIA, alt: 'Sophia’s app screens, laid out in isometric view' },
  { id: 'foodpass-wallet', src: '/cases/benefits-card-app/01.png', size: [1546, 809], crop: [310, 105, 392, 704], w: 250, x: 780, y: 30, z: -700, ry: -48, rx: 0, tall: true, pz: -800,
    cap: FOODPASS, alt: 'Foodpass app home screen with card and basket balances' },
  { id: 'tempo-page', src: '/cases/tempo-landing-page/03.png', size: [2048, 1618], crop: [90, 97, 741, 1449], w: 236, x: -760, y: 0, z: -1750, ry: 48, rx: 0, tall: true, pz: -1900,
    cap: TEMPO, alt: 'Tempo’s landing page, top to bottom' },
  { id: 'superopa', src: '/cases/promotions-discoverability/cover.png', size: [2048, 1113], w: 540, x: 740, y: -60, z: -1500, ry: -48, rx: 0, pz: -2600,
    cap: SUPEROPA, alt: 'Superopa’s promotions admin screens and the plus 15 percent on add to cart result' },
  { id: 'casar-cover', src: '/cases/photo-editing/cover.png', size: [1920, 1080], w: 520, x: -720, y: 40, z: -2350, ry: 48, rx: 0, pz: -3600,
    cap: CASAR, alt: 'Casar.com’s photo editing screens on phones, on pink' },
  { id: 'sophia-ui', src: '/cases/sophia-mental-health/22.png', size: [1080, 1144], crop: [585, 58, 440, 1030], w: 226, x: 700, y: 10, z: -2400, ry: -48, rx: 0, tall: true, pz: -4700,
    cap: SOPHIA, alt: 'Sophia’s finished onboarding screen on a phone' },
  { id: 'tempo-cards', src: '/cases/tempo-landing-page/03.png', size: [2048, 1618], crop: [940, 256, 1021, 510], w: 560, x: -150, y: -420, z: -2800, ry: 0, rx: -52, more: true,
    cap: TEMPO, alt: 'Two feature cards from Tempo’s landing page' },
  { id: 'foodpass-cover', src: '/cases/benefits-card-app/cover.png', size: [2048, 1162], w: 540, x: -700, y: -30, z: -3250, ry: 48, rx: 0, more: true,
    cap: FOODPASS, alt: 'Foodpass launch art: a phone with the card, two app screens and the mascots' },
  { id: 'casar-modal', src: '/cases/photo-editing/12.png', size: [2048, 1738], w: 440, x: 680, y: 20, z: -3650, ry: -48, rx: 0, more: true,
    cap: CASAR, alt: 'Casar.com’s announcement modal for the new photo editing' },
  { id: 'sophia-wall', src: '/cases/sophia-mental-health/33.jpg', size: [1400, 931], w: 520, x: -680, y: 0, z: -4000, ry: 48, rx: 0, more: true,
    cap: SOPHIA, alt: 'A wall of Sophia’s final app screens' },
  { id: 'superopa-notes', src: '/cases/promotions-discoverability/02.png', size: [2048, 1113], w: 500, x: 180, y: 425, z: -4350, ry: 0, rx: 52, more: true,
    cap: SUPEROPA, alt: 'Research notes from the Superopa promotions project' },
  { id: 'foodpass-card', src: '/cases/benefits-card-app/01.png', size: [1546, 809], crop: [872, 105, 392, 704], w: 240, x: 660, y: 10, z: -4700, ry: -48, rx: 0, tall: true, more: true,
    cap: FOODPASS, alt: 'Foodpass app card screen with balances by category' },
  { id: 'sophia-sketch', src: '/cases/sophia-mental-health/16.jpg', size: [624, 881], w: 290, x: -600, y: 10, z: -5150, ry: 48, rx: 0, more: true,
    cap: SOPHIA, alt: 'A hand-drawn paper sketch of Sophia’s app screens, before any design' },
  { id: 'tempo-store', src: '/cases/tempo-landing-page/03.png', size: [2048, 1618], crop: [940, 807, 1021, 554], w: 460, x: 600, y: -20, z: -5500, ry: -48, rx: 0, more: true,
    cap: TEMPO, alt: 'Tempo’s integrations card, from its landing page' },
];

export const FINAL = {
  src: '/cases/tempo-landing-page/cover.png',
  size: [2048, 1562] as [number, number],
  z: -6300,
  cap: TEMPO,
};

/** Tunnel sections: how many and how long (px). */
export const SECTION = 700;
export const SECTIONS = 9;
/** How far the camera flies (the final screen's z, so it ends at the glass). */
export const TRAVEL = 6300;

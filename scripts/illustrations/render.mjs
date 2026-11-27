// scripts/illustrations/render.mjs   (needs puppeteer-core and a Chromium; used to create the stand-in images)
import { scene } from './objects.mjs';
import { readFile } from 'node:fs/promises';
export const plan = {};
const P = (slot, ...args) => (plan[slot] = args);
// hero + cards
P('hero-1', 'gown', 'navy', 'cream'); P('hero-2', 'jacket', 'camel', 'sage'); P('hero-3', 'sunglasses', 'black', 'sand', { shape: 'cat' });
const cards = [['gown', 'burgundy', 'stone'], ['sunglasses', 'black', 'mist', { shape: 'round', frame: '#b9904a' }], ['hoops', 'ivory', 'wine'], ['jacket', 'navy', 'cream'], ['necklace', 'ivory', 'noir'], ['kaftan', 'terracotta', 'sand'], ['sunglasses', 'black', 'cream', { shape: 'aviator' }], ['cuffs', 'ivory', 'navy'], ['gown', 'green', 'mist'], ['trousers', 'champagne', 'noir']];
cards.forEach((c, i) => P(`card-${i + 1}`, ...c));
const cat = {
  'bespoke-sewing': [['gown', 'navy', 'cream'], ['gown', 'burgundy', 'stone'], ['jacket', 'black', 'mist'], ['jacket', 'ivory', 'noir'], ['kaftan', 'champagne', 'wine'], ['gown', 'green', 'sand'], ['kaftan', 'navy', 'cream']],
  'ready-to-wear': [['kaftan', 'terracotta', 'sand'], ['gown', 'sage', 'cream'], ['trousers', 'camel', 'mist'], ['kaftan', 'ivory', 'navy'], ['jacket', 'sage', 'stone'], ['trousers', 'black', 'cream'], ['gown', 'terracotta', 'noir']],
  jewellery: [['hoops', 'ivory', 'navy'], ['hoops', 'ivory', 'wine'], ['necklace', 'ivory', 'noir'], ['cuffs', 'ivory', 'sage'], ['drops', 'ivory', 'cream'], ['ring', 'ivory', 'stone'], ['necklace', 'ivory', 'navy']],
  sunglasses: [['sunglasses', 'black', 'sand', { shape: 'cat' }], ['sunglasses', 'black', 'stone', { shape: 'cat', frame: '#b9904a' }], ['sunglasses', 'black', 'noir', { shape: 'square', frame: '#2a2118' }], ['sunglasses', 'black', 'cream', { shape: 'round', frame: '#b9904a' }], ['sunglasses', 'black', 'mist', { shape: 'aviator' }], ['sunglasses', 'black', 'sage', { shape: 'square' }], ['sunglasses', 'black', 'navy', { shape: 'cat' }]],
};
for (const [c, list] of Object.entries(cat)) list.forEach((a, i) => P(i === 0 ? `${c}-hero` : `${c}-${i}`, ...a));
const look = [['gown', 'navy', 'stone'], ['jacket', 'camel', 'noir'], ['hoops', 'ivory', 'sand'], ['sunglasses', 'black', 'mist', { shape: 'round', frame: '#b9904a' }], ['kaftan', 'burgundy', 'cream'], ['trousers', 'ivory', 'navy'], ['necklace', 'ivory', 'wine'], ['sunglasses', 'black', 'cream', { shape: 'cat' }], ['gown', 'terracotta', 'sage']];
look.forEach((a, i) => P(`lookbook-${i + 1}`, ...a));
P('about-1', 'form', 'camel', 'cream'); P('about-2', 'jacket', 'navy', 'sand');
export const svgFor = (slot) => scene(...plan[slot]);

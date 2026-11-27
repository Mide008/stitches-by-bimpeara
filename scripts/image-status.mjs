// scripts/image-status.mjs
// Run: npm run images
// Lists every photo slot, where it appears, and whether it is still a stand-in illustration.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const where = (slot) => {
  if (slot.startsWith('hero-')) return 'Home, social sharing';
  if (slot.startsWith('card-')) return 'Home hero cards';
  if (slot.startsWith('lookbook-')) return 'Lookbook and home preview';
  if (slot.startsWith('about-')) return 'About page';
  const [cat] = slot.split(/-(?=\d|hero)/); return `${cat} page` + (slot.endsWith('hero') ? ' (hero, home index)' : '');
};
const slots = JSON.parse(await readFile('src/data/photo-slots.json', 'utf8')).map((s) => s.slot);
const dir = path.resolve('src/assets/photos');
const have = new Map((await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).map((f) => [f.replace(/\.[^.]+$/, ''), f]));
let standIn = 0, missing = 0;
console.log('slot'.padEnd(24), 'status'.padEnd(10), 'size'.padEnd(11), 'used on');
for (const slot of slots) {
  const f = have.get(slot);
  if (!f) { missing++; console.log(slot.padEnd(24), 'MISSING'.padEnd(10), ''.padEnd(11), where(slot)); continue; }
  const m = await sharp(path.join(dir, f)).metadata();
  const stand = m.width === 900 && m.height === 1125 && /jpe?g/i.test(f); // the stand-in illustrations are exactly 900 x 1125
  if (stand) standIn++;
  const small = m.width < 1000 && !stand ? '  (small, use 1600px or wider)' : '';
  console.log(slot.padEnd(24), (stand ? 'stand-in' : 'real').padEnd(10), `${m.width}x${m.height}`.padEnd(11), where(slot) + small);
}
console.log(`\n${slots.length - standIn - missing} real, ${standIn} stand-in, ${missing} missing. Portrait 4:5 photos, 1600px wide or more, work best.`);

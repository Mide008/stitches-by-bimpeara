// scripts/fetch-photos.mjs
// Downloads one free Pexels photo per empty slot in src/data/photo-slots.json.
// Usage: add PEXELS_API_KEY to .env (free at pexels.com/api), then run: npm run photos
// Existing files are never overwritten, so you can swap in her real photos by dropping
// a file with the same slot name (for example hero-1.jpg) into src/assets/photos.
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) { console.error('Missing PEXELS_API_KEY. Add it to .env first.'); process.exit(1); }

const dir = path.resolve('src/assets/photos');
await mkdir(dir, { recursive: true });
const slots = JSON.parse(await readFile('src/data/photo-slots.json', 'utf8'));
const creditsPath = path.resolve('src/data/photo-credits.json');
let credits = {};
try { credits = JSON.parse(await readFile(creditsPath, 'utf8')); } catch {}

const exists = (p) => access(p).then(() => true, () => false);
let ok = 0, skipped = 0, failed = 0;

for (const s of slots) {
  const target = path.join(dir, `${s.slot}.jpg`);
  if (await exists(target)) { skipped++; continue; }
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(s.query)}&orientation=${s.orientation}&per_page=8`;
    const res = await fetch(url, { headers: { Authorization: KEY } });
    if (!res.ok) throw new Error(`Pexels ${res.status}`);
    const { photos } = await res.json();
    if (!photos?.length) throw new Error('no results');
    const pick = photos[Math.floor(Math.random() * Math.min(photos.length, 4))];
    const img = await fetch(pick.src.large2x || pick.src.large);
    if (!img.ok) throw new Error(`download ${img.status}`);
    await writeFile(target, Buffer.from(await img.arrayBuffer()));
    credits[s.slot] = { photographer: pick.photographer, url: pick.url };
    ok++;
    console.log(`✓ ${s.slot}  (${pick.photographer})`);
    await new Promise((r) => setTimeout(r, 350)); // stay well under the rate limit
  } catch (e) {
    failed++;
    console.warn(`✗ ${s.slot}: ${e.message}`);
  }
}
await writeFile(creditsPath, JSON.stringify(credits, null, 1));
console.log(`\nDone. ${ok} downloaded, ${skipped} already present, ${failed} failed.`);
console.log('Review every image. Replace weak matches by dropping your own file with the same name.');

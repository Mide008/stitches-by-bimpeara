// scripts/qa.mjs
// Static release checks over the built site. Run after `npm run build`: npm run qa
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const walk = async (d) => (await Promise.all((await readdir(d, { withFileTypes: true })).map((e) => e.isDirectory() ? walk(path.join(d, e.name)) : path.join(d, e.name)))).flat();
const files = await walk(dist);
const pages = files.filter((f) => f.endsWith('.html'));
const problems = [];
const exists = async (p) => stat(p).then(() => true, () => false);

for (const f of pages) {
  const rel = path.relative(dist, f), html = await readFile(f, 'utf8');
  const say = (m) => problems.push(`${rel}: ${m}`);
  if (rel === '404.html') { if (!/<title>/.test(html)) say('missing title'); continue; }
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  if (!title) say('missing title'); else if (title.length > 65) say(`title is ${title.length} chars`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  if (!desc) say('missing meta description'); else if (desc.length > 170) say(`description is ${desc.length} chars`);
  if (!/<link rel="canonical"/.test(html)) say('missing canonical');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) say(`${h1} h1 elements`);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt\b/.test(m[0])) say('image without alt');
  for (const m of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
    const href = m[1]; if (href.startsWith('//')) continue;
    const ok = (await exists(path.join(dist, href))) || (await exists(path.join(dist, href, 'index.html'))) || (await exists(path.join(dist, href + '.html')));
    if (!ok) say(`broken internal link ${href}`);
  }
  for (const m of html.matchAll(/(?:src|srcset)="(\/[^"\s,]+)/g)) {
    if (!(await exists(path.join(dist, m[1].split('?')[0])))) say(`missing asset ${m[1]}`);
  }
}
const need = ['sitemap.xml', 'robots.txt', 'manifest.webmanifest', '404.html'];
for (const n of need) if (!(await exists(path.join(dist, n)))) problems.push(`missing ${n}`);

console.log(`${pages.length} pages checked`);
if (problems.length) { console.log('\nProblems:\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('All static checks passed.');

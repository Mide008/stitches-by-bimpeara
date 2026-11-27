// scripts/launch-check.mjs
// Truth lock before going live: lists every placeholder and unverified claim still in the content.
// Run: npm run launch-check        (add --strict to fail a build until all are resolved)
import { readFile } from 'node:fs/promises';

const files = ['src/data/content.ts', 'src/data/site.ts'];
const issues = [];
for (const f of files) {
  const lines = (await readFile(f, 'utf8')).split('\n');
  lines.forEach((l, i) => { if (/PLACEHOLDER/.test(l) && !/Anything marked/.test(l)) issues.push(`${f}:${i + 1}  ${l.trim().slice(0, 110)}`); });
}
const photos = await import('node:child_process').then((m) => m.execSync('node scripts/image-status.mjs', { encoding: 'utf8' }));
const stand = Number(photos.match(/(\d+) stand-in/)?.[1] ?? 0);
if (stand) issues.push(`${stand} images are still stand-in illustrations (run npm run images)`);
if (!process.env.SITE_URL) issues.push('SITE_URL is not set, so canonical links use the default address');
if (!process.env.PUBLIC_WEB3FORMS_KEY) issues.push('PUBLIC_WEB3FORMS_KEY is not set, so the form falls back to the visitor\'s email app');

if (!issues.length) { console.log('Launch check passed.'); process.exit(0); }
console.log(`${issues.length} thing(s) to confirm before launch:\n` + issues.map((x) => ' - ' + x).join('\n'));
process.exit(process.argv.includes('--strict') ? 1 : 0);

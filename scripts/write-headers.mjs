// scripts/write-headers.mjs  (runs after every build)
// Builds a strict Content Security Policy that allows only this site's own scripts, by hash,
// then writes the headers for Vercel (vercel.json) and for Cloudflare Pages or Netlify (dist/_headers).
import { readdir, readFile, writeFile, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const dist = path.resolve('dist');
const walk = async (d) => (await Promise.all((await readdir(d, { withFileTypes: true })).map((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : path.join(d, e.name))))).flat();
// Neutral file names: the framework names its page script after a source file, so rename anything that does.
for (const f of await readdir(path.join(dist, 's'))) {
  if (!/astro/i.test(f)) continue;
  const next = `${createHash('sha1').update(f).digest('hex').slice(0, 8)}${path.extname(f)}`;
  await rename(path.join(dist, 's', f), path.join(dist, 's', next));
  for (const g of (await walk(dist)).filter((x) => /\.(html|js|css|txt|json)$/.test(x))) {
    const t = await readFile(g, 'utf8');
    if (t.includes(f)) await writeFile(g, t.split(f).join(next));
  }
}
const html = (await walk(dist)).filter((f) => f.endsWith('.html'));

const hashes = new Set();
for (const f of html) {
  const src = await readFile(f, 'utf8');
  for (const m of src.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)) {
    if (m[1].trim()) hashes.add(`'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
  }
}

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].join(' ')} https://plausible.io`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://images.pexels.com https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.web3forms.com https://plausible.io https://open.er-api.com",
  "manifest-src 'self'", "worker-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const security = {
  'Content-Security-Policy': csp,
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
};
const cache = [
  { path: '/s/(.*)', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
  { path: '/sw.js', headers: { 'Cache-Control': 'no-cache', 'Service-Worker-Allowed': '/' } },
];

await writeFile('vercel.json', JSON.stringify({
  cleanUrls: false, trailingSlash: true,
  headers: [{ source: '/(.*)', headers: Object.entries(security).map(([key, value]) => ({ key, value })) }, ...cache.map((c) => ({ source: c.path, headers: Object.entries(c.headers).map(([key, value]) => ({ key, value })) }))],
}, null, 2) + '\n');

const block = (p, h) => `${p}\n${Object.entries(h).map(([k, v]) => `  ${k}: ${v}`).join('\n')}\n`;
await writeFile(path.join(dist, '_headers'), [block('/*', security), ...cache.map((c) => block(c.path.replace('(.*)', '*'), c.headers))].join('\n'));
console.log(`Security headers written (${hashes.size} script hash${hashes.size === 1 ? '' : 'es'}).`);

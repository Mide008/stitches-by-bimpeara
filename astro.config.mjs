// astro.config.mjs
import { defineConfig } from 'astro/config';
import { readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// The live address. Set SITE_URL in Vercel, Cloudflare or Netlify settings once you have a domain.
const site = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://stitchesbybimpeara.vercel.app');

// Writes sw.js after every build with a fresh cache name and the list of built CSS and JS to precache.
const offlineSupport = () => ({
  name: 'offline-support',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const root = fileURLToPath(dir);
      const built = await readdir(path.join(root, 's')).catch(() => []);
      const precache = ['/', '/offline/', '/brand/logo-mark.png', '/favicon.svg', ...built.filter((f) => /\.(css|js)$/.test(f)).map((f) => `/s/${f}`)];
      const build = Date.now().toString(36);
      await writeFile(path.join(root, 'sw.js'), `const CACHE = 'c-${build}';
const PRECACHE = ${JSON.stringify(precache)};
const MAX_RUNTIME = 80;
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
const trim = async (c) => { const ks = await c.keys(); if (ks.length > MAX_RUNTIME) await c.delete(ks[0]); };
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname === '/sw.js') return;
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await Promise.race([fetch(req), new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 4000))]);
        if (res.ok) cache.put(req, res.clone());
        return res;
      } catch { return (await cache.match(req)) || (await cache.match('/offline/')) || Response.error(); }
    })());
    return;
  }
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    const refresh = fetch(req).then((res) => { if (res.ok) { cache.put(req, res.clone()); trim(cache); } return res; }).catch(() => hit);
    return hit || refresh;
  })());
});
`);
    },
  },
});

export default defineConfig({
  site,
  compressHTML: true,
  devToolbar: { enabled: false },
  // Neutral output: no framework named folders or file names, no source maps.
  build: { assets: 's' },
  vite: {
    build: {
      sourcemap: false,
      rollupOptions: { output: { entryFileNames: 's/[hash].js', chunkFileNames: 's/[hash].js', assetFileNames: 's/[hash][extname]' } },
    },
  },
  integrations: [offlineSupport()],
});

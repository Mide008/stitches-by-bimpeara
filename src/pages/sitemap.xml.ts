// src/pages/sitemap.xml.ts
// Our own sitemap (no plugin, no tool specific file names).
import type { APIRoute } from 'astro';
import { categoryPages } from '../data/content';

export const GET: APIRoute = ({ site }) => {
  const base = String(site).replace(/\/$/, '');
  const paths = ['/', ...categoryPages.map((c) => `/${c.slug}/`), '/about/', '/lookbook/', '/contact/', '/privacy/'];
  const priority = (p: string) => (p === '/' ? '1.0' : p === '/privacy/' ? '0.2' : '0.8');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${base}${p}</loc><priority>${priority(p)}</priority></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

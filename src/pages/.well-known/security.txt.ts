// src/pages/.well-known/security.txt.ts
// Tells security researchers where to report a problem (RFC 9116).
import type { APIRoute } from 'astro';
import { site } from '../../data/site';

export const GET: APIRoute = ({ site: origin }) => {
  const base = String(origin).replace(/\/$/, '');
  const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString();
  return new Response(`Contact: mailto:${site.email}\nExpires: ${expires}\nPreferred-Languages: en\nCanonical: ${base}/.well-known/security.txt\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

// src/pages/catalogue.json.ts
// The collections as JSON, for AI agents and tools that prefer structured data.
import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { categoryPages } from '../data/content';

export const GET: APIRoute = ({ site: origin }) => {
  const base = String(origin).replace(/\/$/, '');
  const data = {
    business: { name: site.name, designer: site.designer, tagline: site.tagline, description: site.description, country: 'NG', ships: 'worldwide', contact: { whatsapp: `+${site.whatsapp}`, email: site.email, instagram: site.instagram } },
    pricing: 'Starting prices in NGN. The website converts them to the visitor currency. The final price is confirmed on enquiry.',
    howToOrder: 'Send an enquiry by WhatsApp, email or the form on the contact page. Pricing is quoted per piece.',
    collections: categoryPages.map((c) => ({ name: c.label, url: `${base}/${c.slug}/`, description: c.intro, pieces: c.pieces.map((p) => ({ name: p.name, description: p.note, priceFrom: { amount: p.price, currency: 'NGN' } })) })),
  };
  return new Response(JSON.stringify(data, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};

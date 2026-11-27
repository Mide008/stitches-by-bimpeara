// src/pages/llms.txt.ts
// A short, clean summary for AI assistants (the llms.txt convention). Generated from the same data as the pages.
import type { APIRoute } from 'astro';
import { site, waLink } from '../data/site';
import { categoryPages, homeFaqs, glance } from '../data/content';

export const GET: APIRoute = ({ site: origin }) => {
  const base = String(origin).replace(/\/$/, '');
  const body = `# ${site.name}

> ${site.tagline} ${site.description}

## At a glance
${glance.map((g) => `- ${g.k}: ${g.v}`).join('\n')}

## Pricing
Starting prices are written in Nigerian naira (NGN) and the website converts them to the visitor's currency. The final price is confirmed when you enquire.

## Contact
- WhatsApp: ${site.phoneDisplay} (${waLink().split('?')[0]})
- Email: ${site.email}
- Instagram: ${site.instagram}

## Collections
${categoryPages.map((c) => `- [${c.label}](${base}/${c.slug}/): ${c.metaDescription}`).join('\n')}

## More
- [About Adebimpe](${base}/about/): The designer and how she works.
- [Lookbook](${base}/lookbook/): Looks from the studio.
- [Contact and enquiry form](${base}/contact/): The fastest way to start an order.
- [Full text version](${base}/llms-full.txt): Every page as plain text.
- [Machine readable catalogue](${base}/catalogue.json): Collections and pieces as JSON.

## Frequently asked questions
${homeFaqs.map((f) => `- ${f.q} ${f.a}`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

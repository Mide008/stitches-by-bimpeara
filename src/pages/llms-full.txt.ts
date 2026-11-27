// src/pages/llms-full.txt.ts
import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { categoryPages, homeFaqs, glance, process, aboutContent } from '../data/content';

export const GET: APIRoute = ({ site: origin }) => {
  const base = String(origin).replace(/\/$/, '');
  const body = `# ${site.name}: full text

${site.tagline} ${site.strap}
${site.description}

## At a glance
${glance.map((g) => `- ${g.k}: ${g.v}`).join('\n')}

## How ordering works
${process.map((p) => `${p.n}. ${p.title}. ${p.body}`).join('\n')}

${categoryPages.map((c) => `## ${c.label} (${base}/${c.slug}/)
${c.intro}

Pieces:
${c.pieces.map((p) => `- ${p.name}: ${p.note} From NGN ${p.price.toLocaleString('en-US')}.`).join('\n')}

${c.detailTitle}:
${c.details.map((d) => `- ${d.h}. ${d.p}`).join('\n')}

Questions:
${c.faqs.map((f) => `- ${f.q} ${f.a}`).join('\n')}
`).join('\n')}
## About Adebimpe (${base}/about/)
${aboutContent.intro}
${aboutContent.story.join('\n\n')}

## General questions
${homeFaqs.map((f) => `- ${f.q} ${f.a}`).join('\n')}

## Contact
WhatsApp ${site.phoneDisplay}. Email ${site.email}. Instagram ${site.instagram}.
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

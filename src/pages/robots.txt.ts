// src/pages/robots.txt.ts
// Open to search engines and AI assistants. To keep AI training crawlers out, move those user agents to Disallow.
import type { APIRoute } from 'astro';

const assistants = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot'];

export const GET: APIRoute = ({ site }) => {
  const base = String(site).replace(/\/$/, '');
  const body = [
    'User-agent: *', 'Allow: /', 'Disallow: /offline/', '',
    ...assistants.flatMap((a) => [`User-agent: ${a}`, 'Allow: /', '']),
    `Sitemap: ${base}/sitemap.xml`,
    `# Plain language summary for AI assistants: ${base}/llms.txt`, '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

import type { APIRoute } from 'astro';
import { SITE, person } from '../data/site';
import { roles } from '../data/work';
import { getPosts } from '../data/posts';

// work.ts text is first person for the site; these files must read in the third person.
const third = (t: string) =>
  t
    .replace(/\bMy side project, run alongside my engineering work\b/g, 'His side project, run alongside his engineering work')
    .replace(/\bOur guest-service agents\b/g, 'His team’s guest-service agents')
    .replace(/\bwith our curriculum\b/g, 'with Zehn’s curriculum');
const orgLabel = (org: string) => (org === 'Second Nature' ? 'Second Nature hometels, formerly room2' : org);

// llms.txt: a short, plain-text map of the site for AI assistants (llmstxt.org).
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const current = roles.filter(r => r.current);

  const body = `# ${person.name}

> ${person.summary} He has been working in AI for 3 years (freelance work and research since 2023, full-time since 2024). Open to new work: roles and contracts building AI products, remote from Pakistan with US and UK overlap.

Contact: ${person.email} · Book a call: ${person.calendly}
LinkedIn: ${person.linkedin} · GitHub: ${person.github}

## Current work
${current.map(r => `- ${r.company}${r.org ? ` (${orgLabel(r.org)})` : ''}, ${r.role}, ${r.period}: ${third(r.summary)}`).join('\n')}

## Pages
- [Home](${SITE}/): overview, selected work, and an AI clone you can interview
- [Work history](${SITE}/work): every role with details and stack
- [About](${SITE}/about): background, how he works, stack, education, research, FAQ
- [CV (PDF)](${SITE}/cv)
- [Full profile for LLMs](${SITE}/llms-full.txt): everything above in one plain-text file

## Research
- Co-author (2nd of 6) of "Towards LLM-assisted High-Quality Property Generation for Solidity Smart Contracts", arXiv, Jul 2026: https://arxiv.org/abs/2607.23308
${posts.length ? `
## Writing
${posts.map(p => `- [${p.data.title}](${SITE}/blog/${p.id}): ${p.data.description}`).join('\n')}
` : ''}`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

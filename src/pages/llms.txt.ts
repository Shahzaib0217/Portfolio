import type { APIRoute } from 'astro';
import { SITE, person } from '../data/site';
import { roles } from '../data/work';
import { getPosts } from '../data/posts';

// llms.txt: a short, plain-text map of the site for AI assistants (llmstxt.org).
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const current = roles.filter(r => r.current);

  const body = `# ${person.name}

> ${person.summary} He has been working in AI for 3 years (university research from 2023, professionally since 2024). Open to new work: roles and contracts building AI products, remote from Pakistan with US and UK overlap.

Contact: ${person.email} · Book a call: ${person.calendly}
LinkedIn: ${person.linkedin} · GitHub: ${person.github}

## Current work
${current.map(r => `- ${r.company}${r.org ? ` (${r.org})` : ''}, ${r.role}, ${r.period}: ${r.summary}`).join('\n')}

## Pages
- [Home](${SITE}/): overview, selected work, and an AI clone you can interview
- [Work history](${SITE}/work): every role with details and stack
- [About](${SITE}/about): background, how I work, stack, education, research, FAQ
- [CV (PDF)](${SITE}/cv)
- [Full profile for LLMs](${SITE}/llms-full.txt): everything above in one plain-text file
${posts.length ? `
## Writing
${posts.map(p => `- [${p.data.title}](${SITE}/blog/${p.id}): ${p.data.description}`).join('\n')}
` : ''}`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

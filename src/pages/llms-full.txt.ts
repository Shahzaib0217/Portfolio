import type { APIRoute } from 'astro';
import { SITE, person } from '../data/site';
import { roles } from '../data/work';

export const GET: APIRoute = () => {
  const body = `# ${person.name} · ${person.title}

${person.summary}

- Website: ${SITE}
- Email: ${person.email}
- Book a call: ${person.calendly}
- LinkedIn: ${person.linkedin}
- GitHub: ${person.github}
- Location: ${person.location} (PKT, UTC+5). Works remotely with teams in the US and UK.
- Availability: open to new work, roles and contracts building AI products.

## Skills
${person.knowsAbout.join(', ')}.
Stack: Python (FastAPI, LangChain, LangGraph, LlamaIndex, Pydantic AI), Node.js, TypeScript, Next.js, React, PostgreSQL, MongoDB, Redis, Pinecone, pgvector, LiveKit, VAPI, AssemblyAI, Deepgram, Docker, GCP Cloud Run, AWS (EC2, S3, Bedrock), DigitalOcean, GitHub Actions.

## Experience
${roles.map(r => `### ${r.company}${r.org ? ` (${r.org})` : ''}: ${r.role}
${r.period} · ${r.type} · ${r.location}${r.url ? ` · ${r.url}` : ''}
${r.ladder ? `Roles: ${r.ladder.map(s => `${s.role} (from ${s.from})`).join(', ')}\n` : ''}${r.summary}
${r.points.map(p => `- ${p}`).join('\n')}
Tools: ${r.tags.join(', ')}`).join('\n\n')}

## Education and research
- BS Computer Science, FAST NUCES, 2024.
- First-author paper: "LLM-assisted High-Quality Property Generation for Solidity Smart Contracts", under review at STVR, with researchers at DFKI Bremen and UAEU. An LLM pipeline that generates test invariants for property-based testing of Solidity contracts, with an agent that fixes compilation errors; evaluated with mutation testing.

## Disambiguation
This is Shahzaib Khan the AI engineer (LinkedIn: shahzaib17, GitHub: Shahzaib0217), Founding Senior Engineer at Bridge. Not to be confused with other people named Shahzaib Khan.
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

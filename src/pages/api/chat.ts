import type { APIRoute } from 'astro';

export const prerender = false;

const SYSTEM_PROMPT = `You are Shahzaib's digital clone — an AI version of Shahzaib that answers questions about his work, career, interests, and ideas. You speak in first person as Shahzaib.

About Shahzaib:
- Full-Stack AI Engineer and founding engineer at multiple AI startups, based in Pakistan, with 3+ years of experience building production AI systems end-to-end
- Currently at DreamDesk AI (Jan 2026 – Present, full-time, remote UK) as AI Product Engineer & Team Lead — Enterprise AI for hospitality; led a team of 2 engineers and shipped POC in 4 weeks; built multi-channel AI agents across phone calls, emails, web chat, WhatsApp, and Booking.com; integrated Mews & Guestline PMS for real-time reservation sync; built a RAG pipeline ingesting hotel knowledge bases; stack: FastAPI, Next.js, GCP, Cloud Run, Pydantic AI, Pinecone, PostgreSQL
- Currently at Simplora AI (Jul 2025 – Present, part-time, remote USA) as Founding AI Engineer — AI meeting management platform; shipped MVP in 2 months and scaled to 300+ active users; built agentic workflows using LangChain to automate the complete meeting lifecycle (pre-meeting briefs, real-time summaries, action item extraction); integrated MCP servers connecting agents with ClickUp, Slack, Google Drive, and Notion; optimized DB queries reducing response latency from 60s to under 2s; stack: Node.js, Next.js, LangChain, MCP, PostgreSQL, Digital Ocean
- Previously: Reconsider AI (Nov–Dec 2025, contract, remote Estonia) — built a Chrome extension to detect deepfake and AI-generated images on e-commerce sites; integrated image classification models into a real-time browser-side pipeline; stack: FastAPI, Next.js, C2PA
- Previously: AI Governance Sandbox (Apr–Nov 2025, full-time, remote USA) — Founding Fullstack AI Engineer on an automated AI compliance evaluation platform; built a multi-agentic system covering EU AI Act, US state regulations, and global compliance frameworks; built an agentic retrieval system with iterative context refinement to fix retrieval accuracy; stack: Python, FastAPI, LangGraph, Docker, MongoDB, AWS EC2/S3
- Previously: Foomotion LLC (Dec 2024 – Apr 2025, full-time, Lahore on-site) — worked with YC-funded startups, led client syncs, and owned AI development end-to-end; built RAG and multi-agentic systems using AWS Bedrock, LangGraph, LangChain, and LlamaIndex; developed LiveKit voice agents and n8n automation workflows; stack: FastAPI, Next.js, LangGraph, LangChain, LlamaIndex, LiveKit, n8n, AWS EC2/S3/Bedrock
- Previously: Cyber Evangelists (Jun–Dec 2024, full-time, Lahore on-site) — built a real-time RAG voice agent with TTS, STT, and voice cloning for automated conversations; built an Attack Surface Management (ASM) MVP using FastAPI and gRPC microservices, Dockerized with PostgreSQL and Redis; stack: Node.js, FastAPI, gRPC, Docker, LangChain
- Also freelancing since June 2023 — MVPs for AI-powered products and ERP systems for stealth startups
- Has a BS in Computer Science from NUCES (FAST), graduated 2024
- Co-authored research on LLM-assisted property generation for Solidity smart contracts (under review); benchmarked LLM-generated test invariants against manually written ones, achieving 25.99% mutation score vs 31.75% manual; collaborated with Dr. Hassan at DFKI Bremen and Dr. Jalil at UAEU
- Beyond writing code: does product research, writes technical specs, translates them into sprint plans; comfortable owning a product end-to-end or plugging in as a technical lead
- Core tech stack: Python (FastAPI, LangChain, LangGraph, LlamaIndex, Pydantic AI), Node.js/TypeScript, Next.js, React, Docker, GCP, AWS (EC2/S3/Bedrock), Digital Ocean, PostgreSQL, MongoDB, Redis, Supabase, Pinecone, pgvector, Voice AI (VAPI, LiveKit), MCP servers, GitHub Actions CI/CD
- Contact: hello@shahzaib.ai | LinkedIn: linkedin.com/in/shahzaib17 | GitHub: github.com/Shahzaib0217
- Age: ~24, direct and practical communicator
- Full name: Shahzaib Khan

Personality traits for responses:
- Direct and concise — don't over-explain
- Practical and builder-minded — focus on what you're doing, not theory
- Enthusiastic about AI and building products
- Humble but confident
- Use casual professional tone — not too formal, not too casual
- Keep responses short (2-4 sentences) unless asked for detail
- If asked something you don't know or that's too personal, deflect gracefully

Never:
- Make up information not provided above
- Discuss topics unrelated to Shahzaib's professional life, interests, or work
- Provide personal contact details beyond what's on the website
- Be rude or dismissive`;

// Simple in-memory rate limiter (resets on worker restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;

  entry.count++;
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  const ip =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown';

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: "I'm getting a lot of visitors right now. Try again in a moment!" }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let messages: { role: string; content: string }[];

  try {
    const body = await request.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) throw new Error();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const apiKey = import.meta.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Keep last 10 messages to manage context
  const recentMessages = messages.slice(-10).map(m => ({
    role: m.role as 'user' | 'assistant',
    content: String(m.content),
  }));

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...recentMessages,
        ],
        stream: true,
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      const err = await groqResponse.text();
      console.error('Groq error:', err);
      if (groqResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "I'm getting a lot of visitors right now. Try again in a moment!" }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`Groq returned ${groqResponse.status}`);
    }

    // Pass through the SSE stream directly
    return new Response(groqResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error('Chat error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

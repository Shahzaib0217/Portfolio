import type { APIRoute } from 'astro';

export const prerender = false;

const SYSTEM_PROMPT = `You are Shahzaib's digital clone — an AI version of Shahzaib that answers questions about his work, career, interests, and ideas. You speak in first person as Shahzaib.

About Shahzaib:
- Full-Stack AI Engineer with 2+ years of experience building Gen AI solutions, based in Pakistan
- Currently working at DreamDesk AI (Jan 2026 – Present, full-time, remote UK) — an Enterprise AI solution for hospitality; building voice, email, and web chat agents that automate end-to-end hotel workflows and integrate with PMS platforms; FastAPI backend, Next.js frontend, multi-agentic pipelines via LangGraph
- Currently working at Simplora AI (Aug 2025 – Present, part-time, remote USA) — AI meeting management platform; built Node.js backend and Next.js frontend with multi-agentic workflows; integrated MCP servers connecting agents to CRMs, ClickUp, and Notion; STT services like AssemblyAI and Deepgram for real-time meeting transcription
- Previously: Reconsider AI (Nov–Dec 2025, contract, Estonia) — AI-powered full-stack features with FastAPI and Gemini API
- Previously: AI Governance Sandbox (Mar–Nov 2025, full-time, remote USA) — Founding engineer; built multi-agentic system for AI governance, compliance, and risk evaluation covering EU AI Act and US state AI regulations; integrated MIT AI Risk Repo, IBM AI Risk Atlas Nexus, Trusted AI's ART; deployed on EC2 with Dockerized microservices
- Previously: Foomotion LLC (Nov 2024 – Mar 2025, full-time, Lahore on-site) — Built scalable RAG pipeline for Pearson Labs (YC-funded); LangChain, Llama Index, multi-tenancy in Pinecone, query expansion; integrated with FastAPI and Next.js; also worked with ElevenLabs, n8n, and AWS EC2/S3 deployments
- Previously: Cyber Evangelists (Jun–Nov 2024, full-time, Lahore on-site) — Built real-time RAG voice calling agent with STT, TTS, voice cloning using Node.js and LiveKit; built MVP for Attack Surface Management tool using FastAPI microservices and gRPC, Dockerized with PostgreSQL and Redis
- Also freelancing since June 2023 — MVPs for AI-powered products and ERP systems for stealth startups
- Has a BS in Computer Science from NUCES (FAST), graduated 2024
- Published first-author research on LLM-assisted property generation for Solidity smart contracts (under review at STVR; collaborated with Dr. Hassan at DFKI Bremen and Dr. Jalil at UAEU)
- Core tech stack: Python (FastAPI, LangChain, LangGraph, Llama Index), Node.js/TypeScript, Next.js, React, Docker, GCP, AWS EC2/S3, Digital Ocean, PostgreSQL, MongoDB, Redis, Supabase, Pinecone, pgvector, ChromaDB, Voice AI (VAPI, LiveKit, Twilio), MCP servers, GitHub Actions CI/CD
- Experience with AI risk frameworks (MIT AI Risk Repository, IBM AI Risk Atlas Nexus, Trusted AI's ART)
- Interested in AI/ML, building products, and the future of software engineering
- Age: ~23, direct and practical communicator

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

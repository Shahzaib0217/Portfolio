import type { APIRoute } from 'astro';

export const prerender = false;

const SYSTEM_PROMPT = `You are an AI representing Shahzaib Khan. Speak in first person at all times. Never refer to yourself as "Shahzaib" in third person. Never make up information not provided below.

## How to respond
- Keep responses concise unless asked for detail
- Be specific. Tie answers to the visitor's actual question
- Share real opinions on AI/tech rather than deflecting
- Only decline topics unrelated to tech, AI, or professional context
- When someone seems interested in working together, share the booking link: [book a call](https://calendly.com/shahzaib-khan0217/30min)
- For compensation questions: "Happy to discuss that on a call."

## About me
Full-Stack AI Engineer, ~24, based in Pakistan. 3+ years building production AI systems end-to-end. Founding engineer at multiple AI startups including a YC-funded company. I take products from zero to deployment: architecture, backend, frontend, AI pipelines, infra, CI/CD. Also do product research, sprint planning, and lead teams.

## Current roles
- DreamDesk AI (Jan 2026, full-time, UK): AI Product Engineer & Team Lead. Built multi-channel AI agents (phone, email, web chat, WhatsApp, Booking.com) for hotels. PMS integrations (Mews, Guestline). RAG pipeline. Led team of 2, shipped POC in 4 weeks. Stack: FastAPI, Next.js, GCP, Pydantic AI, Pinecone, Postgres.
- Simplora AI (Jul 2025, part-time, USA): Founding AI Engineer. Meeting lifecycle automation. Shipped MVP in 2 months, scaled to 300+ users. MCP integrations (ClickUp, Slack, Notion, Google Drive). Cut query latency from 60s to under 2s. Stack: Node.js, Next.js, LangChain, MCP, Postgres.

## Past roles (brief)
- Reconsider AI (2025, Estonia): Chrome extension for deepfake detection on e-commerce sites.
- AI Governance Sandbox (2025, USA): Multi-agentic AI compliance platform for EU AI Act and US regulations.
- Foomotion LLC (2024-25, Lahore): RAG and multi-agent systems for YC-funded startups. LiveKit voice agents, n8n workflows.
- Cyber Evangelists (2024, Lahore): Real-time RAG voice agent with STT/TTS/voice cloning. ASM MVP with FastAPI and gRPC microservices.

## Domains I've shipped in
Hospitality AI, Meeting/productivity AI, AI governance, Voice AI, RAG systems, Deepfake detection, Business automation (n8n, MCP)

## Core stack
Python (FastAPI, LangChain, LangGraph, LlamaIndex, Pydantic AI), Node.js/TypeScript, Next.js, React, Docker, GCP, AWS (EC2/S3/Bedrock), PostgreSQL, MongoDB, Redis, Pinecone, Voice AI (VAPI, LiveKit), MCP, GitHub Actions

## Research
BS CS from NUCES (FAST), 2024. First-author paper on LLM-assisted property generation for Solidity smart contracts (under review at STVR). Collaborated with researchers at DFKI Bremen and UAEU.

## Availability
Open to contracts, freelance, and part-time. Selectively evaluating full-time roles with real technical depth. Remote preferred. PKT timezone, flexible for US/EU overlap.

Contact: hello@shahzaib.ai | linkedin.com/in/shahzaib17 | github.com/Shahzaib0217`;

// Simple in-memory rate  er (resets on worker restart)
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
    if (messages.some(m => m.role === 'user' && (typeof m.content !== 'string' || m.content.length > 1000))) throw new Error();
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

  // Keep last 2 messages to manage context
  const recentMessages = messages.slice(-2).map(m => ({
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
        // model: 'llama-3.3-70b-versatile',
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...recentMessages,
        ],
        stream: true,
        max_tokens: 768,
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

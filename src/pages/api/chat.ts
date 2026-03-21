import type { APIRoute } from 'astro';

export const prerender = false;

const SYSTEM_PROMPT = `You are Shahzaib's digital clone — an AI version of Shahzaib that answers questions about his work, career, interests, and ideas. You speak in first person as Shahzaib.

About Shahzaib:
- Full-stack software engineer and entrepreneur based in Pakistan
- CEO of Baseera Labs, a service-based software company focused on AI-first development
- Building Simplora.ai — an AI-powered meeting management platform with features like Meeting Briefs, AI summaries, and action item extraction
- Building DreamdeskAI — an AI platform for the hospitality industry with RAG-powered knowledge bases, AI concierge, and WhatsApp integration
- Has a BS in Computer Science from NUCES (FAST), graduated 2024 with a 3.09 CGPA
- Published first-author research on LLM-assisted property generation for Solidity smart contracts (AI for Software Engineering)
- Core tech stack: Python (FastAPI, LangChain, LangGraph), Node.js/TypeScript, Next.js, React, Docker, GCP, PostgreSQL, Pinecone, MongoDB
- Experience with AI risk frameworks (NIST AI RMF, MIT AI Risk Repository, IBM Risk Atlas)
- Built hospitality voice bot systems using ElevenLabs, n8n, and hotel PMS integrations
- Runs Baseera Labs with two partners: Aqib (lead generation) and Ali (sales/delivery)
- Interested in AI/ML, building products, entrepreneurship, and the future of software engineering
- Age: ~23, young entrepreneur energy, direct and practical communicator

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

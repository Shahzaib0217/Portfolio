---
title: "What I've learned building production LLM apps"
description: "Practical lessons from shipping AI-powered products — what works, what doesn't, and what surprised me."
date: "2025-01-15"
readTime: "5 min read"
---

After spending the last year building AI-powered products — an AI meeting platform, a hospitality concierge, and various client projects — I've accumulated a set of opinions about what actually matters when you're shipping LLM applications to real users.

Here are the things that surprised me most.

## Prompt engineering is real engineering

The first thing I underestimated was how much the system prompt architecture matters. Early on, I treated prompts as configuration — something you write once and tweak occasionally. That's wrong.

Your system prompt is the core of your product logic. It needs versioning. It needs testing. It needs the same rigor you'd apply to application code. One subtle change in instruction ordering can completely alter model behavior.

## Latency is a UX problem, not a technical footnote

Users are patient with loading spinners if they're watching text stream in. They're not patient with a blank screen followed by a wall of text.

Streaming is non-negotiable for any conversational interface. The perceived quality of the response goes up dramatically when users watch it appear in real-time — even if the final text is identical. This is why I use Groq for anything latency-sensitive.

## RAG is harder than it sounds

Retrieval-Augmented Generation sounds simple: embed your docs, search on query, add context to prompt. In practice, the hard part is **chunking strategy** and **retrieval quality**.

Bad chunks break good models. You can have GPT-4 and still get garbage output if your retrieval is pulling irrelevant context. Most of my debugging time has been in the retrieval layer, not the LLM layer.

## The model is rarely the bottleneck

Once you're past the prototype stage, you realize the model quality is rarely what limits your product. The bottlenecks are usually:

- The quality and coverage of your data
- Your retrieval strategy (for RAG)
- Your output parsing and error handling
- The UX around the AI feature

Switching from one capable model to another often has less impact than improving any of those.

## Ship faster than you think you should

The gap between "it works in my test cases" and "users are happy with it in production" is enormous — and you can only close it by shipping. Start with a constrained scope, watch real usage, and iterate. The feedback you get from real users is worth more than any amount of internal testing.

That's the mode I operate in with Simplora.ai and DreamdeskAI. Ship something real, watch what breaks, improve fast.

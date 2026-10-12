# SEO / AEO / GEO audit: shahzaib.ai

Date: 12 Oct 2026 · Site: Astro 6 on Cloudflare Workers (static pages + one chat API)

**Goal:** when someone asks ChatGPT, Claude or Perplexity to find an AI engineer, Shahzaib Khan gets recommended.

## Scores (estimated, 0–100)

| Area | Weight | Live site today | After this change ships |
|---|---|---|---|
| AI citability and visibility | 25% | 20 | 60 |
| Brand / entity authority | 20 | 10 | 15 (needs off-site work) |
| Content quality and E-E-A-T | 20 | 40 | 60 |
| Technical foundations | 15 | 45 | 85 |
| Structured data | 10 | 0 | 90 |
| Platform readiness | 10 | 20 | 55 |
| **Overall** | | **~22** | **~55** |

The site itself is now in good shape. **What holds the score down is that almost nothing else on the internet links "Shahzaib Khan" to Bridge, voice agents or AI engineering.** AI assistants recommend people they have seen described the same way by several independent sources. The off-site list below matters more than anything on the site.

## What I found on the live site

1. **No sitemap, no llms.txt, no structured data.** Search engines and AI have no machine-readable statement of who you are.
2. **Broken share image and favicon.** `og-image.png` and `favicon.ico` were referenced but returned 404, so LinkedIn and Slack link previews had no image.
3. **robots.txt has no rules.** It only contains Cloudflare's managed "content signals" comment header, with no Sitemap line and no signals set.
4. **The site isn't indexed as you.** A web search for "shahzaib.ai" returns other people.
5. **Name collision.** "Shahzaib Khan AI engineer" returns your LinkedIn, but also Shahzaib Khan Gakhar (DFKI), Muhammad Shahzaib (KIOS) and several Fiverr freelancers.
6. **The AI chat was broken in production.** The Groq model was retired; fixed in the redesign.
7. **Heavy portrait.** The portrait was 1.1 MB for a 32–176px display.

## What I changed (in this repo, not deployed yet)

| Change | File(s) | Why |
|---|---|---|
| Person + Organization + WebSite JSON-LD on every page; ProfilePage on /, /work, /about; FAQPage on /about | `src/data/site.ts`, `BaseLayout.astro` | Gives Google and AI one clear entity: name, role, employers, school, skills and `sameAs` links to LinkedIn and GitHub. This is how you get told apart from the other Shahzaib Khans. |
| `/llms.txt` and `/llms-full.txt`, generated from your work data | `src/pages/llms*.txt.ts` | A plain-text profile AI assistants can read in one request. It includes a disambiguation line. |
| `/sitemap.xml` (blog posts are added automatically) | `src/pages/sitemap.xml.ts` | For submitting to Google and Bing. |
| `robots.txt`: allows all crawlers, names the AI crawlers explicitly, adds the Sitemap line and `Content-Signal: search=yes, ai-input=yes, ai-train=yes` | `public/robots.txt` | Lets AI search use your pages. **Training is your call**; it's set to yes because you want models to know you. |
| Real share image (1200×630), favicon.ico, apple-touch-icon; new waveform favicon | `public/` | Fixes the 404s and gives proper link previews. |
| Keyword-bearing titles and descriptions; a one-sentence definition used everywhere | all pages | "Shahzaib Khan is an AI engineer from Pakistan and Founding Senior Engineer at Bridge…" is the sentence AI will quote. |
| FAQ on /about ("Is Shahzaib Khan open to new work?", "What kind of AI systems has he built?", …) | `about.astro` | Answers the exact questions people ask AI, in plain words. |
| Blog: `/blog`, `/blog/<post>`, RSS at `/rss.xml`, BlogPosting schema, author box | `src/pages/blog/`, `src/content/blog/` | Ready for posts. The "Writing" nav link and the sitemap entry only appear once a post is published. The empty blog page is set to noindex. |
| Portrait 1.1 MB → 5 KB / 44 KB | `public/shahzaib-256.webp`, `shahzaib.jpg` | Faster pages. |
| Long cache for hashed assets | `public/_headers` | Faster repeat visits on Cloudflare. |

## Cloudflare: check these in the dashboard

1. **Security → Bots / AI Crawl Control:** make sure **"Block AI bots" is off**, and that GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot and PerplexityBot are **allowed**. I can't verify this from outside; a spoofed user-agent test always looks fine.
2. **Managed robots.txt:** Cloudflare puts its own block on top of your robots.txt. Either turn it off, or set its content signals to match (search yes, AI input yes, AI training your choice). Otherwise the two can conflict.
3. **Bot Fight Mode:** if it's on, make sure verified bots are allowed.
4. **Caching → Crawler Hints: on.** It pings Bing and others via IndexNow when pages change.
5. **Workers env vars:** `GROQ_API_KEY` (and optionally `OPENROUTER_API_KEY`) must be set for the chat.

## Search engines (one-time, ~20 minutes)

1. **Google Search Console:** add `shahzaib.ai` (DNS verification is one click with Cloudflare), submit `https://shahzaib.ai/sitemap.xml`, and request indexing for /, /about and /work.
2. **Bing Webmaster Tools:** import from Search Console and submit the sitemap. **ChatGPT search leans heavily on Bing's index**, so this matters as much as Google.

## Off-site: the biggest lever

AI assistants trust repeated, consistent mentions across independent sites more than anything you say about yourself.

1. **Use the same one-line description everywhere:** "AI engineer, Founding Senior Engineer at Bridge. AI agents, voice AI, RAG, MCP."
2. **LinkedIn:**
   - put that in the headline
   - add shahzaib.ai as the website in Contact info and as a Featured link
   - fix the "so Simplora ranks" line to "Bridge"
3. **GitHub:** set the website field to shahzaib.ai and add a profile README with the same sentence.
4. **Bridge, DreamDesk and Zehn sites:** ask for a team or about-page mention with a link to shahzaib.ai. A link from meetonbridge.com is worth more than ten blog posts.
5. **Talks and appearances:** guest posts, podcast appearances, conference or meetup talks, especially about voice agents or MCP. Each one creates a page saying "Shahzaib Khan, AI engineer at Bridge".
6. **Talent profiles:** Wellfound, Contra, Peerlist (founding-engineer roles are posted there), each linking back.
7. **Communities:** answer questions on Reddit (r/LocalLLaMA, r/MachineLearning, r/AI_Agents) and Hacker News about voice latency, MCP and RAG. AI assistants cite these heavily.
8. **The paper:** when it's published, create ORCID and Google Scholar profiles linking to shahzaib.ai.

## Blog: daily vs. weekly

**Don't publish one AI-written post a day.** Google treats mass-produced, low-originality content as spam ("scaled content abuse"), and AI engines cite first-hand experience with specific numbers. Thin daily posts can pull the whole domain down.

**Do publish 1–2 posts a week from your own work.** Each one should answer a question in its first paragraph, with real numbers. Topics only you can write:

1. How we got a hotel voice agent to answer in ~1.7s with RAG and MCP calls
2. Cutting a meeting app's query latency from 60s to under 2s
3. Being the first engineer: shipping Bridge's MVP in two months
4. AssemblyAI vs Deepgram for meeting transcription, from production use
5. Connecting agents to ClickUp, Slack, Drive and Notion with MCP: what broke
6. Building an AEO/GEO content engine for a startup (you did this at Bridge)
7. Voice agents on WhatsApp, phone, email and web: one brain, four channels
8. RAG over a hotel's knowledge base: chunking, freshness, PMS data
9. Teaching AI to Grade 5–7 students in Pakistan: what I learned starting Zehn
10. What a founding AI engineer actually does in the first 90 days

**To publish:** copy `src/content/blog/_TEMPLATE.md` to `your-slug.md`, write it, set `draft: false`, deploy. The nav link, sitemap, RSS, llms.txt and schema all update automatically. Cross-post to LinkedIn and dev.to with a link back to the original.

## Realistic expectations

- "Hire an AI engineer" with no other context is a huge, generic query. No individual gets recommended for it reliably.
- Aim to win the specific ones:
  - "who is Shahzaib Khan, AI engineer"
  - "AI engineer who built voice agents for hotels"
  - "founding engineer for voice agents / MCP, remote"
  - "AI engineer in Pakistan open to work"
- **AI search** (ChatGPT search, Perplexity, Google AI Overviews) can pick up the new pages within weeks of indexing.
- **Model memory** (answers without search) only updates when new models are trained, so expect months, and only if the off-site mentions exist.

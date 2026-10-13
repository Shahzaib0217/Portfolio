# SEO / AEO / GEO audit: shahzaib.ai

Date: 13 Oct 2026 · Live site after the desktop redesign · Previous audit: 12 Oct 2026

**Goal:** when someone asks ChatGPT, Claude, Perplexity or Google to find an AI engineer, Shahzaib Khan gets found, and described correctly.

## Score: 58 / 100 (was ~22 before the redesign)

| Area | Weight | Score | Notes |
|---|---|---|---|
| AI citability and visibility | 25% | 60 | Crawlers allowed, llms.txt, clear facts in server HTML. **But the site isn't showing up in search results yet.** |
| Brand / entity authority | 20% | 20 | LinkedIn is the only strong source. Two name/company collisions (below). |
| Content quality and E-E-A-T | 20% | 65 | Specific, first-hand, with numbers and a published paper. No articles yet. |
| Technical foundations | 15% | 82 | Lighthouse (mobile): SEO 100, Accessibility 100, Best Practices 77. |
| Structured data | 10% | 88 | Person, Organization, WebSite, ProfilePage, FAQPage, ScholarlyArticle all valid. |
| Platform readiness | 10% | 45 | Not visible in search yet, so ChatGPT, Perplexity and Google AI can't cite it. |

## What's working

- **Every crawler is welcome.** robots.txt allows all crawlers, names the AI crawlers explicitly, has `Content-Signal: search=yes, ai-input=yes, ai-train=yes` and links the sitemap.
- **Content is in the HTML, not hidden behind JavaScript.** The homepage serves 833 words of text in the page itself, /work 751 and /about 608, so crawlers that don't run JavaScript still read everything.
- **Every page has the basics.** Each one has a unique title, meta description, canonical URL, share image and `lang`. Every image has alt text.
- **Structured data is complete.** One consistent Person (`@id https://shahzaib.ai/#person`) is linked to Bridge, DreamDesk, Zehn, FAST NUCES, LinkedIn and GitHub. /about adds an FAQ and the arXiv paper as a ScholarlyArticle.
- **AI-readable profiles exist.** `/llms.txt` and `/llms-full.txt` are live and generated from the same data as the pages, and llms-full includes a disambiguation note.
- **The facts agree everywhere.** Site, CV, llms files and the AI clone all say the same things: Bridge only, Lead Product Engineer, part-time/full-time, co-author.

## Findings, most important first

### Critical (you need to do these; I can't from here)

1. **AI search is repeating that you're the paper's first author.**
   - A search for the paper returns an AI summary saying "Shahzaib Khan is the first author", sourced from your **LinkedIn**.
   - arXiv lists you as **2nd of 6**.
   - Fix the LinkedIn project/publication text to "co-author" and add the arXiv link under Publications.
   - This is the one claim that could embarrass you in front of a recruiter.
2. **shahzaib.ai isn't showing up in search results yet.**
   - `site:shahzaib.ai` and `"shahzaib.ai"` return only other people (Fiverr profiles, other Shahzaibs). No search engine, and therefore no AI assistant, is using the site yet.
   - Fix: Google Search Console (add the domain, submit `https://shahzaib.ai/sitemap.xml`, request indexing of /, /about and /work) and Bing Webmaster Tools (import from Search Console). ChatGPT search relies heavily on Bing.
   - Until this is done, nothing else in this report pays off.
3. **Name collision with a DFKI researcher.**
   - "Shahzaib Khan Gakhar" is a research assistant at **DFKI**, and your paper's co-author is at **DFKI Bremen**. AI assistants can easily attribute your paper, or your profile, to him.
   - Fix: create a **Google Scholar** profile and claim the arXiv paper, plus an **ORCID** iD, both linking to shahzaib.ai. Then I'll add them to the site's structured data so the identity link is explicit.

### High (site fixes I can make)

4. **"Second Nature" collides with a well-known AI company.**
   - "Second Nature" is also an AI sales-coaching company with a Wikipedia page, and a search for your DreamDesk work returns that company.
   - Fix: always write "Second Nature hometels (formerly room2)", and add DreamDesk's own URL and a short description to the structured data, so AI doesn't say you work at the sales-training company.
5. **Calendly loads on every page.** Its stylesheet blocks the page from drawing until it loads, and it sets a third-party cookie. These are the only two failed Lighthouse checks (Best Practices 77). Fix: load Calendly only when someone clicks "Book a call".
6. **No security headers.** HSTS, `X-Content-Type-Options`, `Referrer-Policy` and frame protection are missing. These are trust signals, and the fix is a few lines in `_headers`.
7. **/call is a near-empty page that search engines index.** It has 37 words, sits in the sitemap, and competes with your real pages. Fix: `noindex` it and remove it from the sitemap.
8. **Structured data gaps:**
   - `jobTitle` is missing "Lead Product Engineer".
   - The address has no city (Lahore).
   - The DreamDesk organization has no URL.
   - The sitemap has no `lastmod` dates.
9. **The site and CV don't fully match.**
   - The CV lists **Freelance (Jun 2023 – Feb 2025)** and the **DevDen internship (Jun–Aug 2023)**; the site's work history doesn't.
   - The site says your 3 years started with "university research from 2023", while the CV shows freelance work from Jun 2023.
   - Fix: add both roles to the site and phrase the start as "freelance work and research since 2023".
   - Also, parts of `llms-full.txt` switch between "I" and "he". Using "he" throughout is clearer for AI quoting.

### Medium

10. **No articles yet.**
    - The blog is ready, but it's set to `noindex` while it's empty.
    - The fastest content win is 2–3 first-hand posts, for example the ~1.7s voice agent with RAG and MCP, or "first engineer at Bridge".
    - The topic list from the previous audit still applies. Aim for 1–2 a week, not daily.
11. **Temporary (307) redirects.** `/about/` and `/work.html` redirect with 307 (temporary) instead of 301 (permanent). This is Cloudflare's default for static files. Canonical tags already point to the right URL, so it's low impact.

## Search results checked (13 Oct 2026)

- [arXiv: Towards LLM-assisted High-Quality Property Generation for Solidity Smart Contracts](https://arxiv.org/abs/2607.23308)
- [LinkedIn: Shahzaib Khan](https://pk.linkedin.com/in/shahzaib17)
- [DFKI: Shahzaib Khan Gakhar](https://dsa.dfki.de/team/members/shahzaib/) (name collision)
- [Wikipedia: Second Nature (AI company)](https://en.wikipedia.org/wiki/Second_Nature_(AI_Company)) (company-name collision)

## Order of work

1. You, this week:
   - LinkedIn: change first author to co-author, add the arXiv link under Publications, and add shahzaib.ai to Contact info and Featured.
   - Google Search Console and Bing Webmaster Tools: submit the sitemap.
   - Google Scholar and ORCID.
2. Me, now: fixes 4–9.
3. You, ongoing: 1–2 first-hand posts a week; guest posts, podcasts and Reddit/HN answers about voice agents and MCP. Mentions on other sites matter more than anything on your own.

## What to expect

- **Once the site is indexed,** "Shahzaib Khan AI engineer", "AI engineer Pakistan voice agents" and "Bridge founding engineer" should start returning shahzaib.ai within a few weeks.
- **AI search** (ChatGPT search, Perplexity, Google AI Overviews) follows the index: weeks.
- **What AI models know without searching** changes only with new model training: months, and only if other sites mention you consistently.

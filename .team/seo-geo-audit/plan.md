# Plan
On-site (implement now):
1. public/robots.txt — allow all, explicit AI crawlers, Sitemap line.
2. /sitemap.xml endpoint (prerendered, no new dependency) incl. blog posts.
3. /llms.txt + /llms-full.txt generated from src/data/work.ts.
4. JSON-LD: Person (sameAs LinkedIn/GitHub, worksFor, knowsAbout, alumniOf), WebSite, ProfilePage on /about, FAQPage for an FAQ block, BlogPosting on posts.
5. Real og-image.png (1200×630) + favicon.ico (both 404 today).
6. Titles/descriptions with entity + skills; a one-sentence entity definition near the top of /about; plain FAQ (no self-praise).
7. Blog infrastructure: content collection, /blog, /blog/[slug], RSS, nav link only once posts exist.
Off-site + Cloudflare: written up as an action list (Search Console, Bing Webmaster/IndexNow, Cloudflare AI Crawl Control + content signals, LinkedIn/GitHub consistency, Bridge team page link).
Content strategy: quality over daily volume.
- Generated og-image.png, favicon.ico, apple-touch-icon.png; new waveform favicon.svg

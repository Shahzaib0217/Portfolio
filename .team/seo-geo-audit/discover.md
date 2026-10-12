# Discover — SEO / AEO / GEO audit (2026-10-12)

## Live https://shahzaib.ai (old design still deployed)
- robots.txt: only Cloudflare managed "Content Signals" comment header, no rules, no Sitemap line, no content-signal values set.
- /sitemap.xml 404, /llms.txt 404, /og-image.png 404 (referenced in og:image!), /favicon.ico 404 (referenced).
- No JSON-LD structured data. Title/description/canonical present.
- AI bot UAs get 200 (UA spoof only — real Cloudflare bot rules can't be verified from outside; check dashboard).
- Pages are prerendered static HTML (good: no JS needed to read content). Chat answers are client-only (not crawlable — fine).

## Entity / brand
- Web search for "shahzaib.ai" returns unrelated people → site not indexed / no entity.
- "Shahzaib Khan AI engineer" → his LinkedIn (shahzaib17) ranks, but name collides with Shahzaib Khan Gakhar (DFKI), Muhammad Shahzaib (KIOS), Fiverr Shahzaibs. Needs strong disambiguation: Person schema + sameAs + consistent descriptor.
- No off-site mentions tying him to Bridge / DreamDesk / Zehn.

## Goal reality check
"Hire an AI engineer" is a huge generic query; models recommend entities they've seen repeatedly across independent sources. Realistic targets: entity questions ("who is Shahzaib Khan, AI engineer") and long-tail ("AI engineer who built hotel voice agents", "founding engineer voice agents MCP Pakistan remote").

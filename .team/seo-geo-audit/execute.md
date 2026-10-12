# Execute
- src/data/site.ts (Person/Org/WebSite/ProfilePage/FAQPage JSON-LD builders, one-sentence summary)
- BaseLayout: JSON-LD graph, og:type/site_name/image size, author, robots meta (+noindex prop), rel=me, RSS + sitemap links, favicon.ico + apple-touch-icon
- Pages: keyword titles/descriptions; /about FAQ (+FAQPage schema)
- Blog: content.config.ts collection, src/data/posts.ts, /blog, /blog/[...id] (BlogPosting), rss.xml, _TEMPLATE.md; Nav "Writing" only when posts exist; empty /blog noindex
- sitemap.xml, llms.txt, llms-full.txt endpoints (prerendered); public/robots.txt; public/_headers
- og-image.png, favicon.svg/.ico, apple-touch-icon.png generated via headless Chrome + PIL
- Portrait 1.1MB PNG → shahzaib-256.webp (5KB) + shahzaib.jpg (44KB); png removed
- GEO-AUDIT-REPORT.md: findings, scores, Cloudflare + search console + off-site actions, blog strategy

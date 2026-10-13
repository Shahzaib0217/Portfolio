# Execute
Committed 94ba546 (redesign, chat fix, SEO/GEO, CV) excluding .claude/; pushed to master → Cloudflare auto-deploy (~100s).
Found live /about, /work 307 → trailing slash while sitemap/schema used /about. Fixed: astro trailingSlash 'never' + build.format 'file', canonical strips .html, nav active state strips .html. Commit e3cec12, pushed.

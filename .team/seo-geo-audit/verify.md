# Verify
- npm run build OK; dist has robots.txt, sitemap.xml, llms.txt, llms-full.txt, rss.xml, og-image.png, favicon.ico, apple-touch-icon.png, _headers.
- JSON-LD parses on /, /about, /work, /blog (types: Person, Organization, WebSite, ProfilePage/FAQPage/Blog).
- /blog noindex while empty; sitemap omits /blog until posts exist.
- Browser: /about FAQ renders + expands; blog post page renders with test post (removed after).
- OG image + icon visually checked.

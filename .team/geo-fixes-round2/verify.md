# Verify
- `npm run build` passes.
- Built JSON-LD on all pages: jobTitle includes Lead AI Product Engineer, address Lahore/PK, DreamDesk url; /about still has FAQPage and ScholarlyArticle.
- call.html is "noindex, follow"; the sitemap has 3 URLs with lastmod.
- llms.txt/llms-full.txt: no first-person words; Research section; Gakhar and Second Nature disambiguation.
- Local browser: before the click, no Calendly CSS/JS. After clicking Book a call, the scripts load, the popup opens and the URL is unchanged.
- Notification history reads "Joined Foomotion…", "Started freelancing…", "Joined DevDen…".
- _headers is only applied on Cloudflare, so check after deploy.

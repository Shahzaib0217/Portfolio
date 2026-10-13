# Discover (13 Oct 2026)
1. Remove "Simplora" everywhere; it should say Bridge only. Found in:
   - work.ts (org and summary)
   - site.ts (JSON-LD legalName)
   - about.astro (FAQ)
   - index.astro (Bridge window)
   - chat.ts (prompt)
   - the CV LaTeX in the scratchpad
2. About photo shows a sparkle bottom-right. It's a Gemini watermark baked into public/shahzaib.jpg at about (755,755), sitting on the dark suit. Round crops (logo, favicon, OG) don't include that corner. `.jpg` files are cached for 7 days (`_headers`).
3. Phone: the home screen shouldn't scroll; swipe up should do something surprising.

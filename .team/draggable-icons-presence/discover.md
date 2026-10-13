# Discover
Request (13 Oct 2026): two features (the notification idea was dropped).
1. Let visitors drag and rearrange desktop icons. Positions reset on refresh.
2. Google Docs-style presence: other visitors appear as anonymous animals.

Constraints:
- Site runs on Cloudflare Workers via `@astrojs/cloudflare` 13.1.3.
- `wrangler.jsonc` main was the adapter entry. The adapter exports `./handler`, and the Astro docs show a custom `src/worker.ts` that exports a Durable Object and calls `handle()`.
- Homepage icons are `<a>` elements in a flex column. Window drag code already exists.

# Iterate
## Round 1 — 2026-10-12
VERIFY found: dev server hung on every route using getCollection (workerd dev runtime); React "invalid hook call" from two dep-optimizer versions.
Root cause: stale Vite dep cache after content.config.ts was added mid-session (dep re-optimization left mismatched modules).
Fix: stop dev server, rm -rf node_modules/.vite, restart. Re-verify: getCollection returns in 3ms, all routes 200 in <0.12s. Production build was never affected.

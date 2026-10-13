# Verify (local dev, workerd)
Presence (two tabs)
- Tab A shows tab B as "🐸 Anonymous Frog".
- Opening Bridge in B updates A's tooltip to "looking at Bridge".
- B's cursor shows in A with an orange "🐸 Frog" tag at 1280px. No cursor is sent at 655px (phone layout), as intended.
- Closing B hides A's avatars and cursor.

Icons (real drags)
- Bridge dragged to the middle of the desktop snaps to a grid cell.
- Contact dragged into the old Bridge cell.
- Neither drag opened a window. A plain click on the moved Bridge icon still opens it (#bridge).

Phone 375
- Two avatars fit in the status bar; scrollWidth is 375.

Build and deploy
- `npm run build` passes.
- `dist/server/wrangler.json` has the DO binding and migration.
- `.wrangler/deploy/config.json` redirects deploy to it.
- `wrangler deploy --dry-run` lists `env.PRESENCE (Presence) Durable Object`.

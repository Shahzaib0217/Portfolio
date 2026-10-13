# Plan
Icons (desktop only, in memory)
- After a 5px move, switch the icon nav to absolute grid mode: one column, positions measured from the current layout.
- Drag with window-level listeners. On drop, snap to the nearest cell and swap with any icon already there.
- Suppress the click after a drag, and disable native link drag.

Presence
- `src/worker.ts`: `/api/presence` WebSocket goes to the `Presence` DO (single room `home`). Everything else goes to Astro `handle()`.
- DO uses hibernatable WebSockets with each visitor stored as a socket attachment, so there's no storage and no cookies.
  - Assigns a free animal and colour, and sends welcome/join/leave/view/cursor/hide messages.
  - Checks the origin, caps the room at 60, rejects messages over 200 bytes, clamps cursor coordinates.
- Client `src/scripts/presence.ts`:
  - Avatars in the menu bar: max 3 plus "+N", hidden when you're alone.
  - Cursors on the desktop only, normalized to the desktop size, sent only when someone else is present and throttled to 60 ms.
  - Shares which window you're viewing.
  - Disconnects after 5 minutes in a background tab; reconnects with backoff.
- `wrangler.jsonc`: main `./src/worker.ts`, DO binding `PRESENCE`, migration v1 `new_sqlite_classes` (works on the free plan).

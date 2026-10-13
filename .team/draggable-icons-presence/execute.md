# Execute
- New: `src/worker.ts` (worker entry + `Presence` DO), `src/scripts/presence.ts`.
- `wrangler.jsonc`: custom main, DO binding, migration.
- `src/pages/index.astro`:
  - `#presence` in the menu bar and `#cursors` layer in the desktop.
  - Icons get `draggable="false"`.
  - CSS for peers, cursors and the icon free/drag states.
  - Icon drag/snap/swap script; `startPresence()`.
  - Taskbar hint now says "drag windows and icons".
- Dev server restarted with the Vite cache cleared, because the worker entry changed.

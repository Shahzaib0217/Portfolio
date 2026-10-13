# Discover

Request (13 Oct 2026):
- Windows can only be closed; add minimize to keep the desktop clean.
- "Ask my clone" is a text chat, so it shouldn't have a voice/waveform icon.
- Refine the desktop UI further.
- Then design the mobile view as a phone home screen.

Current state (`src/pages/index.astro`, `src/components/desktop/Window.astro`):
- Windows support open, close, focus, drag and Esc. There is no minimize, no maximize and no taskbar, so a closed window disappears completely.
- The clone icon is the `wave` glyph (bars), and the Chat header status says "Speaking"/"Listening" (voice wording).
- On mobile, the README sits in the page flow, the icons are a 4-column grid below it, and windows open as full-screen sheets.
- `ThemeToggle` uses ids, so there can be only one instance (it lives in the menu bar).

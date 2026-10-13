# Execute

- `src/components/desktop/Glyph.astro` (new): line icons shared by the desktop icons, taskbar and dock. Adds chat, call, linkedin, github, user and school glyphs.
- `src/components/desktop/Window.astro`:
  - Title bar has minimize, maximize and close buttons, plus a phone-only "‹ Home" back button.
  - The `open` prop now renders `desk-open`, which shows the window on desktop only.
- `src/pages/index.astro`:
  - Apps are data-driven (`on: 'desk' | 'phone'`, `accent`).
  - Clone icon is now a chat bubble on an accent tile.
  - Phone home screen: status bar, profile widget with a "Now" list, 4×2 app grid (README, Bridge, DreamDesk, Work, CV, About, Zehn, GitHub) and a dock (Chat, Email, Book a call, LinkedIn).
  - Desktop taskbar: task buttons for open windows (minimized ones are dimmed), a hint line and a "Show desktop" strip.
  - Script:
    - Minimize animates toward the matching taskbar button, with a timeout fallback in case the animation stalls.
    - Maximize via the button or by double-clicking the title bar.
    - Taskbar click restores a minimized window, minimizes the active one, or brings another to the front.
    - New windows are clamped inside the desktop.
    - Phone sheets push a history entry, and `popstate` closes them.
    - Esc closes.
- `src/components/Chat.tsx`: the status label reads Typing/Online instead of Speaking/Listening.
- `src/components/Waveform.astro`: comment wording only.

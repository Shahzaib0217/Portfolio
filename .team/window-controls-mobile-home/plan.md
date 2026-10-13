# Plan

Desktop
- Window title bar: minimize, maximize/restore and close buttons. Double-clicking the title bar also maximizes.
- Bottom taskbar lists every open window, including minimized ones. Clicking a task:
  - restores it if it's minimized
  - minimizes it if it's the active window
  - otherwise brings it to the front
- "Show desktop" button at the right end of the taskbar.
- Short open/minimize animations using the Web Animations API (skipped when the user prefers reduced motion).
- Clone icon becomes a chat bubble. Chat status changes from Speaking/Listening to Typing/Online.
- Glyphs move into a `desktop/Glyph.astro` component so the icons, taskbar and dock can share them.

Mobile (<768px): phone home screen
- Menu bar becomes a status bar: Lahore time on the left; "Open to work" and the theme toggle on the right.
- Profile widget: avatar, name and role, then "Now" rows (Bridge, DreamDesk, Zehn) that open their apps, plus "Read more", which opens the README.
- App grid (4 columns): README, Bridge, DreamDesk, Work, CV, About, GitHub (and Writing, once posts exist).
- Dock fixed at the bottom: Chat (clone), Email, Book a call, LinkedIn.
- Apps open as full-screen sheets below the status bar, with a "‹ Home" back button. The sheet pushes a history entry, so the browser back button also closes it.
- The README no longer starts open on mobile: the `open` prop sets `desk-open`, which only shows on desktop (this also keeps the no-JS fallback working).

Files: `index.astro`, `desktop/Window.astro`, new `desktop/Glyph.astro`, `Chat.tsx`.

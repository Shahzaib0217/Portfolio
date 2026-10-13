# Execute
- BaseLayout `variant="desktop"` (no Nav/Footer/container).
- ThemeToggle.astro extracted from Footer (used by Footer and the home menu bar).
- components/desktop/Window.astro: chrome + body; role=dialog, aria-label.
- index.astro rewritten: menu bar (name, Work/About/CV, Open to new work, Lahore clock via Asia/Karachi, theme, Book a call); icon column (README, Ask my clone, Bridge, DreamDesk, Work, CV.pdf, Contact, Writing when posts exist) with no-JS hrefs; windows README (open), clone (Chat bare, client:idle), bridge, dreamdesk, work, contact; waveform wallpaper; window manager (open/focus/drag/Esc/hash deep links); clone auto-opens beside README at >=1360px.
- Chat.tsx `bare` prop. about.astro Zehn link → zehn.school. Clone prompt: no founder-identity language.

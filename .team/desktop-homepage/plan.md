# Plan
- BaseLayout `variant="desktop"`: no Nav/Footer/container; page fills viewport on md+.
- MenuBar (home only): name, Work/About/CV links, "Open to new work", Lahore clock (Asia/Karachi), theme toggle, Book a call. ThemeToggle extracted from Footer.
- Window.astro: chrome (title, close), drag by title bar, focus/z-order, Esc closes; positions from data-x/y; mobile = full-screen sheet.
- Windows: README.md (open on load; plain who/now/before/stack/education/contact), Bridge, DreamDesk, Ask my clone (Chat, bare variant), Work, Contact. CV icon links to /cv. Writing icon only when posts exist.
- Icons are links with real fallbacks (/work#bridge, /cv, mailto) and data-open for JS.
- Wallpaper: the existing Waveform, faint, along the bottom of the desktop (still reacts to the clone).
- Hash: opening sets #id; loading /#clone etc. opens that window.
- Mobile (<768px): README in flow, icon grid below, windows open as full-screen sheets.
Verify: build; desktop + mobile, light + dark screenshots; open/drag/close/Esc; chat streams in window; #clone deep link; no horizontal scroll.

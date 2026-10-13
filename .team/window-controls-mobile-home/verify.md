# Verify (13 Oct 2026, local dev on :4321)

Desktop 1280×800
- README opens on load.
- Minimize button hides it; its taskbar task dims.
- Clicking the task restores it and brings it to the front.
- Clone opened from its icon is clamped inside the right edge (it used to run off-screen at x=800).
- Double-clicking the title bar maximizes the window.
- Chat bubble icon is in place.

Phone 375×812
- Home screen fits with no scroll.
  - scrollWidth is 375.
  - Status bar, widget, 8-app grid and dock all render.
- Widget Bridge row opens a full-screen sheet; "‹ Home" closes it and clears the hash.
- README → DreamDesk link → browser back returns to README → back again returns home. Body scroll lock is released each time.
- Dock Chat opens the chat as a full app.
- Dark mode renders correctly.

Build: `npm run build` passes. One h1; taskbar markup present.
Earlier finding fixed during verify: minimize could stall when the animation didn't finish in a background tab (now has a timeout fallback). Off-screen clone fixed with the clamp.

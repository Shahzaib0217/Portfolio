# Iterate

## 13 Oct 2026, round 1
- Found:
  - At 1280px, the clone opened at x=800 and ran off the right edge.
  - Minimize depended on `animation.finished`, which can stall in a background tab.
  - The DreamDesk widget row wrapped on phones, and the app grid had an empty slot.
- Changed:
  - Windows are clamped inside the desktop when opened.
  - Minimize has a 300 ms timeout fallback, and the animation is cancelled once the window is hidden.
  - The role text is shortened to "Team Lead", and a Zehn app was added.
- Re-verified: all three are fixed (screenshots at 1280×800 and 375×812).

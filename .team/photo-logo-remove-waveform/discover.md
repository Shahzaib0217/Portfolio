# Discover
Request (13 Oct 2026):
- Remove the voice/waveform animation.
- Replace the logo with his photo in a circle.
- Mid-task: "fix the minimize icon".

Findings:
- Waveform was only used on the homepage wallpaper. Chat.tsx emitted `clone:*` events just for it.
- Logo was the waveform `favicon.svg` (menu bar + browser tab).
- Minimize glyph: a 10px, 1.6-stroke dash on a half pixel, so it rendered thin and blurry and didn't match its neighbours. Maximize also had no "restore" state.

# Verify
- Headless 360x800, 360x740, 360x690, 360x640: all fit, search clear of the dock.
- Pane 360x740, measured: search bottom 623 < dock top 635.
- At 125% root font: no overlap (577 < 592); the grid row clips instead (acceptable for very large text).
- `npm run build` passes.

## Iterate: real-device screenshot (Galaxy A07, Samsung Internet)
- The dock was cut off at the bottom and the fixed home bar was drawn over it, so the body height (100dvh) was taller than the visible area in that browser.
- Fix: an inline script sets --app-h = innerHeight before first paint and on resize/visualViewport resize. Body height is var(--app-h, 100vh) on both phone and desktop.
- Headless 360x640 and 1280x800 render correctly; build passes. Real-device confirmation still pending from the user.

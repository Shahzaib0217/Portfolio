# Verify
- Desktop 1280: Ask AI menu renders with 3 items and a footer.
- Clipboard capture (stubbed write): ok=true, 8041 chars starting with the intro header.
- Toast text is "Copied. Paste it into ChatGPT or Claude."
- Phone 375: tapping the search pill opens the clone (#clone) with its input focused. A clone:ask event shows the user message.
- Headless screenshots: 360x800, 412x915 and 375x667 fit with clean spacing.
- Resize phone to desktop: the open clone stays as a desktop window; on load with nothing open, README opens.
- `npm run build` passes.

# Plan
- Move the `.home-search` markup between the hero card and the app grid; margin-top 0.75rem (0.6rem compact).
- Restore the pre-search dock: position fixed, bottom calc(1.4rem + safe area), and `.desktop` reserves 7.5rem at the bottom (6.5rem compact) instead of the flex column.
- Keep the --app-h script for the .desktop height (falls back to 100dvh).

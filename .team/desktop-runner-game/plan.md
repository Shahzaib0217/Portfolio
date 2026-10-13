# Plan
- src/scripts/desk-game.ts: canvas runner. Avatar circle (/shahzaib-256.webp, already cached), ground bugs to jump, flying "500" errors to duck under (after score 150), double bugs after 300. Best score in localStorage (try/catch). Colors and font read from the theme tokens, so dark mode works.
- Load it with a dynamic import the first time the desktop is empty; no loop runs unless a game is in progress. Pause when a window shows or the tab is hidden.
- Keys ignored while typing; Space on a focused link/button stays with that control. Desktop only.

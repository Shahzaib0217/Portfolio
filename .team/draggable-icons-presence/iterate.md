# Iterate
## 13 Oct 2026, round 1
- Found: real mouse drags didn't move icons. The pointer left the icon before the 5px threshold, and the move/up listeners were on the icon (pointer capture was only set after the threshold).
- Changed: move/up listeners are now on the window.
- Re-verified: drags move, snap and swap; clicks still open windows.

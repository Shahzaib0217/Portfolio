# Iterate
## Round 1 — styles not applied in browser: stale Vite HMR CSS; restarted dev with cleared node_modules/.vite.
## Round 2 — mobile: icons above README → flex order; name wrapped → nowrap, hide "Lahore" label <640px.
## Round 3 — mobile sheet invisible: README (flex item, z-index 80) stacked over sheet with inline z 11. Fix: #readme z-index auto !important; sheets z 80 !important.
## Round 4 — 1280px: clone overlapped README → auto-open only at >=1360px.

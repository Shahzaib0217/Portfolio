# Plan
1. Delete every Simplora mention.
   - work.astro shows `org`, so removing it there drops it from that page too.
   - CV .tex: drop "(Simplora AI)". Also bring the DreamDesk title in line: "Lead Product Engineer (Full-time)".
2. Cover the watermark with a feathered patch of suit taken from the left (patching from above copied the sleeve edge). Add `?v=2` on the About photo to bypass the 7-day cache.
3. Phone home screen
   - html/body/desktop overflow hidden and overscroll-behavior none.
   - Swipe up (touch, at least 60px, mostly vertical, no app open) opens "Notification history": a lock-screen panel under the status bar.
     - Date and big Lahore clock.
     - "Now" pinned items: Bridge ~500 users, DreamDesk live at 3 locations, open to work.
     - History generated from `roles` (Bridge ladder as Joined/Promoted, other roles as Joined, Zehn Started) plus graduation, sorted newest first.
     - Tapping Bridge or DreamDesk opens the app.
   - Closes by swipe down at the top, the Close button, Esc, or back (#notifications history entry).
   - A home-indicator bar under the dock opens it too and nudges once as a hint.
   - Short phones (max-height 720px): compact spacing so it fits without scrolling.

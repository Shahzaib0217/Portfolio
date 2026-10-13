# Plan
- Put the dock into the flex column: widget, apps, search (margin-top:auto), dock. They can then never overlap.
- Body height 100dvh; .desktop flex:1.
- The app grid is the only part allowed to give way (min-height:0, overflow hidden).
- Raise the compact-layout threshold from 720px to 780px.

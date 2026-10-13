# Plan
- AskAI.astro (Sonnet agent): an "Ask AI" menu in the desktop top bar.
  - Items: Copy profile for AI (header + /llms-full.txt), Open in ChatGPT (chatgpt.com/?q=), Open in Claude (claude.ai/new?q=), /llms.txt link.
  - Safari-safe clipboard (ClipboardItem with a promise, then writeText fallback).
  - window.copyProfileForAI(); toast.
- Chat.tsx (Sonnet agent): clone:ask / clone:focus window events and a __clonePending fallback.
- Me, in index.astro:
  - Phone search pill above the dock (margin-top:auto in a flex column); tap opens the clone and focuses its input; right icon copies the profile.
  - Integrate AskAI into index.astro and Nav.astro.
- Review both agents output, test in the browser and headless at 360x800, 375x812, 412x915 and 375x667.

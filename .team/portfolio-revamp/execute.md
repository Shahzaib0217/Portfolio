# Execute

- `src/styles/global.css` — new "Signal" tokens (paper/panel/ink/muted/rule/wash/signal, light + dark), Anybody + IBM Plex fonts, `.display`, `.label`, `.live-dot`, `.link`, focus-visible, reduced-motion.
- `src/layouts/BaseLayout.astro` — wider container (max-w-6xl), dark mode also follows system preference, new default title/description.
- `src/components/Nav.astro`, `Footer.astro` — restyled; Calendly links fall back to /call without JS.
- `src/components/Waveform.astro` (new) — canvas recording strip; playhead records clone voice level; listens to `clone:speaking` / `clone:token`; IntersectionObserver pause; theme-aware; static under reduced motion.
- `src/components/Chat.tsx` — transcript layout (speaker + mm:ss), token colors (fixes dark mode), scrolls only its own container (no page jump), SSE line buffering across chunks, emits waveform events.
- `src/data/work.ts` (new) — single source of roles for home + /work.
- `src/pages/index.astro` — hero thesis, waveform + clone, Bridge flagship (role ladder, metrics, pipeline, product/growth), DreamDesk × Second Nature (latency meter, channels, hometels), Zehn (founder), earlier roles, CTA.
- `src/pages/work.astro`, `about.astro`, `call.astro`, `404.astro` — rewritten.
- `src/pages/api/chat.ts` — prompt updated (Bridge, promotion, Second Nature, Zehn, stacks, anti-hallucination rules); **models fixed**: Groq `llama-3.3-70b-versatile` was retired (404) → `openai/gpt-oss-120b` (reasoning_effort low); OpenRouter free fallback `stepfun/step-3.5-flash:free` gone → `google/gemma-4-31b-it:free`; temperature 0.7 → 0.3.

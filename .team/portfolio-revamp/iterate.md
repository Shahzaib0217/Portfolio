# Iterate

## Round 1 — 2026-10-12
VERIFY found: chat 404 (retired models); clone hallucinating details.
Changed: Groq → openai/gpt-oss-120b (reasoning low), OpenRouter → google/gemma-4-31b-it:free, temperature 0.3, stricter fact rules + per-company stacks in prompt.
Re-verify: chat streams; answers stay on listed facts.

## Round 2 — 2026-10-12 (reviewer subagent)
Found: empty-stream placeholder stuck; reset during stream wrote into empty list; input lost focus; API accepted any role / unbounded assistant content; waveform single-instance + possible double rAF loop; dark ::selection contrast; weak focus ring; aria-live on every token; pulse ignores reduced motion; overclaims ("founding or lead engineer" for all roles, "Latency 30×" ambiguous next to voice latency, "gets cited" as outcome, "hotels" vs hometels); /about heading order.
Changed: all of the above fixed. Hero lead now leads with Bridge proof. Kept clone as primary CTA (it's the site's differentiator) and Zehn section as-is (user wants it featured).
Not changed (needs user): availability line, Zehn founder vs co-founder / start date, DreamDesk "team of 2" wording, testimonial.
Re-verify: build OK, chat + reset + focus tested in browser.

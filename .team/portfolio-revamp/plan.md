# Plan

## Thesis
Single job of the home page: convince a founder/CTO that Shahzaib can take their AI product from first commit to real users, then get them to interview the clone or book a call.
Common thread of his work: AI that **listens, talks and acts** — agents that join meetings (Bridge), answer the phone (Second Nature), and do the follow-up (MCP).

## Design tokens ("Signal")
- Paper #F1F2EE (cool off-white, deliberately not warm cream) · Ink #121417 · Muted #5F646B · Rule #D9DBD5 · Panel #FFFFFF · Signal #3B2BFF (ultramarine, used only for live/playhead/links)
- Dark: paper #0F1113 · ink #E9EAE5 · muted #8E939A · rule #262A2F · panel #16191C · signal #8F86FF
- Type: Anybody (variable width display, condensed heavy) · IBM Plex Sans (body) · IBM Plex Mono (labels, timestamps, metrics)

## Signature
A full-width recording waveform with a moving playhead under the hero. It is the clone's "voice": idle it breathes, when the AI clone streams a reply it swells with every token. The clone chat is styled as a meeting transcript (speaker labels in mono, no bubbles) — the vernacular of Bridge.

## Layout (home)
```
nav: Shahzaib Khan ● | work about cv | book a call | in gh
HERO  eyebrow: ● Founding Senior Engineer at Bridge
      H1: I build AI that joins the meeting, answers the phone, and handles the follow-up.
      lead + [Interview my AI clone] [Book a call]
~~~~~~~~~~~~ waveform (playhead) ~~~~~~~~~~~~
CLONE  transcript-style chat panel
WORK   Bridge (flagship: role ladder, metrics, pipeline diagram, product/growth lists)
       DreamDesk × Second Nature (latency meter 1.7s, channels, 3 hometels)
       Zehn (founder)
EARLIER  compact rows + research
CTA    "Building something with AI?" email + call
```
/work = full detailed timeline (updated). /about = rewritten story, stack, education/research.
Chat system prompt + starter prompts updated with new facts.

## Files
global.css, BaseLayout, Nav, Footer, index, work, about, call, 404, Chat.tsx, Waveform.astro (new), api/chat.ts prompt.

## Verify
build passes; screenshots desktop + mobile, light + dark; chat streams and waveform reacts; no page jump on load; reduced-motion static.

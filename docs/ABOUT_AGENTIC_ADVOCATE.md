## Inspiration
Legal work is slow, repetitive, and often gated by expensive tools. We wanted a privacy-first assistant that runs where work happens—the browser—to help with research, drafting, and filing without sending sensitive data to the cloud. Chrome’s built‑in AI (Gemini Nano) finally makes on‑device, low‑latency legal assistance practical.

## What it does
Agentic Advocate is a Chrome extension that:

- Summarizes legal pages, acts, and judgments on‑device.
- Proofreads and rewrites drafts for clarity and compliance.
- Translates and detects language for cross‑border content.
- Autocompletes forms (RTI/complaints) with context and highlights.
- Stores notes, excerpts, and references locally via IndexedDB.

## How we built it
- Manifest V3 extension (Vanilla JS) for popup, background, and content scripts.
- Chrome Built‑in AI APIs (Prompt, Summarizer, Proofreader, Writer/Rewrite, Translator, Language Detector) backed by Gemini Nano.
- Local-first storage (IndexedDB) for documents, highlights, and session memory.
- Next.js + Tailwind dashboard for richer views and workflows.
- Function-calling patterns for automation and page context extraction.

## Challenges we ran into
- Ensuring on‑device model availability and managing initial downloads.
- Handling user activation requirements reliably in extension UX flows.
- Keeping prompts robust across varied legal texts and formats.
- Balancing accuracy vs. speed while staying offline‑first.
- Designing safe fallbacks when an API isn’t available or is trial‑gated.

## Accomplishments that we're proud of
- Fully local summarization and proofreading with strong latency.
- Privacy-first workflows: no legal docs leave the browser by default.
- Clean, modular extension architecture ready for new legal workflows.
- Simple onboarding to load unpacked and verify AI readiness.

## What we learned
- Chrome’s built‑in AI APIs are production‑friendly but require precise UX around availability and user activation.
- Good legal prompting needs structure: citations, constraints, and style guides.
- Local storage design (IndexedDB) matters for reliability and search.
- Clear affordances (pin icon, toolbar actions) improve extension adoption.

## What's next for Agentic Advocate
- Add multimodal inputs (screenshots/audio) for evidence capture.
- Build templated flows for RTI, complaints, and standard legal notices.
- Add reference linking and citation extraction across tabs.
- Optional remote fallback with strict privacy controls (opt‑in only).
- Ship to Chrome Web Store with a public demo and docs.
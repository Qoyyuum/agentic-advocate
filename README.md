Here's a structure for a **project setup document** you can use for your "Agentic Advocate" Chrome extension project. This format is tailored for a legal/browse agent Chrome extension, based on your current document:

**Project Setup Document: Agentic Advocate Chrome Extension (2025 Challenge Edition)**

- Project Overview  
    Agentic Advocate is a specialized Chrome extension built to automate legal work and enhance user interactions for law, compliance, and tax planning. Now designed for Chrome's Built-in AI APIs and Gemini Nano.
- Objectives

- Streamline legal research and document proofing
- Analyze salary structure for personalized tax planning
- Enable fast, accurate autofill for RTI/complaint forms
- Support multimodal (text, audio, image) legal inputs
- Preserve privacy using local models and offline storage

- Key Features

- Chrome Built-in AI: Prompt, Summarizer, Proofreader, Translator, Writer, Rewriter APIs
- Multimodal support-audio-to-text, image analysis
- Gemini Nano for local inference (privacy, offline)
- Function-calling APIs for automation
- Highlighting, referencing, persistent memory
- Email/document generation for legal tasks
- Integration with browser-based indexDB for file search/storage
- Modular UI: extension popup, dashboard, landing page

- Technical Stack

- Chrome Extension (Manifest V3) using VanillaJS
- Chrome APIs (tabs, storage, runtime, bookmarks, notifications)
- LLM: Gemini Nano (local) + remote API fallback only as needed
- Backend: Prompt optimization, memory, and all storage locally in indexDB
- Audio-to-text: Web Speech API or Google Speech-to-Text
- Legal document database and search: indexDB
- Frontend dashboard/landing: Next.js, TailwindCSS, JS

- Architecture

- Extension UI (VanillaJS) ↔ background scripts ↔ Chrome AI APIs ↔ indexDB for storage
- Hybrid model-on-device by default, remote fallback for heavy compute
- All user data, chat logs, and legal files handled via indexDB (no cloud required)
- Multimodal file inputs processed and indexed for legal workflows
- Next.js and TailwindCSS power the external dashboard/landing page UX

- Development Workflow

- Prototype UI for extension and Next.js dashboard
- Integrate required Chrome APIs
- Connect Gemini Nano as on-device AI
- Create indexDB schema for user profiles, documents, notes, memory
- Build function-calling, autofill, and multimodal support
- Test workflows with sample legal scenarios, forms, and multimodal (audio/image)
- Prepare deployment and submission scripts per Chrome AI challenge: demo video, public repo, privacy policy

- Setup Instructions

- Clone project from GitHub
- Install Node.js and NPM (for Next.js parts)
- Run npm install for dashboard/landing dependencies
- Chrome extension files in /extension directory
- Load as "Unpacked" in Chrome (Developer mode)
- Configure Gemini Nano/local APIs as per [official docs](https://chromeai.google.com/docs/gemini-nano/)
- Index legal files and data using indexDB
- For dashboard, run npm run dev to test locally

- Testing & Debugging

- Use Chrome's extension debugger and logging
- Validate indexDB queries, autofill logic, and multimodal support
- Test accessibility and responsiveness for extension and dashboard
- Unit tests: Jest or VanillaJS tools; integration tests where possible
- Document legal test cases and validation flows

- Deployment

- Assets: icons, screenshots, privacy docs for Chrome Store
- Build extension and dashboard for production
- Submit public GitHub repo (with license, test instructions)
- Video demo (YouTube/Vimeo), privacy terms, and public app link
- Optional backend hosting only if remote APIs are strictly necessary

- Maintenance Guidelines

- Update dependencies for Chrome APIs and extension code
- Monitor Gemini/LLM performance; update prompts with evolving legal standards
- Patch bugs and handle user reports quickly
- Keep documentation and onboarding updated

- References

- [Chrome Built-in AI APIs Documentation](https://chromeai.google.com/docs/apis/)
- [Gemini Nano & Chrome AI Early Preview](https://chromeai.google.com/early-preview/)
- [Chromium Extension Docs](https://developer.chrome.com/docs/extensions/)
- [indexDB API Reference](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- Law AI Products: Harvey.ai, ChatGPT.com legal, YouTube - Legal AI
- Medium Article: Harvey - A High Stakes Bet on Legal AI
- [Chrome AI Challenge on Devpost](https://googlechromeai2025.devpost.com/)

**Tip:** Copy this outline into your Google Doc and expand each section as needed for your specific setup, referencing the details about law, LLM, memory functions, etc., from your existing notes. This helps keep your project structured, thorough, and ready for team onboarding or future updates.

- <https://docs.google.com/document/d/1D0vEP7tbOQMUvV2x0cPxHQe2MuyLNLgNpBEQYLx7uLg/edit?tab=t.0>

**Agentic Advocate Chrome Extension - Project Setup (2025 Chrome AI Challenge Ready)**

- **Project Overview  
    **Agentic Advocate is a Chrome extension automating legal, compliance, and tax tasks using Chrome's Built-in AI (Gemini Nano), providing robust offline/online features, and privacy-first workflows.
- **Objectives**

- Streamline legal research, document proofing, and compliance workflows
- Analyze salary structures for context-aware tax planning
- Enable fast and accurate RTI/complaint form autofill
- Allow multimodal (text, audio, image) legal inputs
- Prioritize on-device privacy, with offline and local storage support

- **Key Features**

- Chrome's Built-in AI APIs: Prompt, Proofreader, Summarizer, Translator, Writer, Rewriter
- Gemini Nano (local) with fallback to remote Gemini when needed
- Function-calling APIs for real-time automation
- Multimodal support: Audio-to-text (Web Speech API/Google Speech-to-Text), image analysis
- Legal document search and storage (indexDB)
- Highlighting, referencing, persistent chat memory
- Accurate legal email and document generation
- Multiple components for extension UI, dashboard, landing page

- **Technical Stack**

- Chrome Extension built using VanillaJS (plain JS, no frameworks in the extension)
- Five major Chrome APIs: tabs, storage, runtime, bookmarks, notifications
- LLM: Gemini Nano (local inference), remote fallback if resource-constrained
- Backend for prompt optimization, session memory-stored locally using indexDB
- Audio-to-text: Web Speech API (default), Google Speech-to-Text (optional/alternate)
- Legal database/search: indexDB for all document/index storage
- Frontend: Next.js (recommended for standalone dashboard/landing), TailwindCSS, JS

- **Architecture**

- Extension UI (VanillaJS) communicates with background scripts and AI/vector APIs
- Hybrid on-device/offline-first: Most features run locally (Gemini Nano, indexDB, Web Speech API); fall back to remote APIs if needed
- All extension core storage and document search processed in-browser via indexDB
- Memory/vector storage, chat history, file indexing kept on-device
- API endpoints for legal summarization, reference lookup, and autofill
- Next.js powers landing page/optional web UI, using TailwindCSS and JS

- **Development Workflow**

- Prototype UI/UX for core extension and Next.js dashboard
- Integrate core Chrome APIs for automation and notifications
- Connect to Gemini Nano for legal task inference (local)
- Implement indexDB schema: legal docs, chat logs, file indices, user config
- Add audio-to-text and image upload features
- Test workflows, referencing legal scenarios and multimodal samples
- Build deployment scripts: Chrome Store/manual install, and Next.js landing build
- Prepare hackathon deliverables: demo video, open-source repo, privacy policy

- **Setup Instructions**

- Clone repository (\[insert GitHub repo link\])
- Install Node.js and npm (for Next.js UI)
- npm install in /dashboard or /landing for dependencies
- Extension: Place all manifest, scripts, and assets in /extension
- Configure API keys for Gemini Nano/Built-in AI APIs (if remote is needed)
- Load extension as "Unpacked" in Chrome developer mode
- For Gemini Nano/local: follow [official docs](https://chromeai.google.com/docs/gemini-nano/)
- For legal search, index files and test storage in indexDB
- For the Next.js frontend, run npm run dev (development) or npm run build (production)

- **Testing & Debugging**

- Use Chrome's built-in extension debugger and console
- Validate indexDB operations, extension logic, and autofill flows
- Test audio-to-text features, modal dialogs, highlight/reference tools
- Unit tests using JS frameworks (Jest or out-of-box)
- Manual integration and scenario testing for all legal modules
- Ensure UI/UX works on both extension popup and landing page (Next.js)

- **Deployment**

- Package extension for Chrome Web Store: icons, screenshots, privacy policy
- Generate builds for the extension and Next.js UI
- Submit open-source repository, privacy materials, and hackathon demos
- Optionally, set up minimal backend if remote is enabled (for optimization/memory, only if needed)
- Monitor bugs/crashes using Chrome logs

- **Maintenance Guidelines**

- Keep all dependencies updated and test with new Chrome release cycles
- Monitor Gemini/LLM performance, adapt to changing legal prompts and laws
- Patch security issues promptly
- Keep docs and privacy policy aligned to hackathon/Chrome requirements
- Track issues on GitHub repo

- **References**

- [Chrome Built-in AI APIs Documentation](https://chromeai.google.com/docs/apis/)
- [Gemini Nano & Chrome AI Early Preview](https://chromeai.google.com/early-preview/)
- [Chromium Extension Docs](https://developer.chrome.com/docs/extensions/)
- [indexDB Storage Reference](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Next.js Documentation](https://nextjs.org/docs), [TailwindCSS Docs](https://tailwindcss.com/docs)
- Law AI Products: Harvey.ai, ChatGPT.com legal, YouTube - Legal AI
- Medium Article: Harvey - A High Stakes Bet on Legal AI
- [Google Chrome AI Challenge on Devpost](https://googlechromeai2025.devpost.com/)
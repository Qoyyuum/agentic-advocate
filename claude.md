# Agentic Advocate Chrome Extension

A Chrome extension automating legal, compliance, and tax tasks using Chrome's Built-in AI (Gemini Nano) with privacy-first, offline-capable workflows.

## Features

- **Chrome Built-in AI Integration**: Prompt, Proofreader, Summarizer, Translator, Writer, Rewriter APIs
- **Local AI Processing**: Gemini Nano for on-device inference with remote fallback
- **Multimodal Input**: Audio-to-text (Web Speech API), image analysis
- **Legal Workflows**: Document proofing, compliance automation, RTI/complaint form autofill
- **Tax Planning**: Context-aware salary structure analysis
- **Document Management**: Legal research, storage, and search via IndexedDB
- **Privacy-First**: Local storage, on-device processing, persistent chat memory

## Tech Stack

**Extension:**
- VanillaJS (no frameworks)
- Chrome APIs: tabs, storage, runtime, bookmarks, notifications
- Gemini Nano (local) / Gemini (remote fallback)
- IndexedDB for document storage
- Web Speech API for audio-to-text

**Dashboard/Landing:**
- Next.js
- TailwindCSS
- JavaScript

## Setup

1. **Clone Repository**
   ```bash
   git clone [repository-url]
   cd agentic-advocate
   ```

2. **Install Dependencies** (for Next.js UI)
   ```bash
   cd dashboard  # or /landing
   npm install
   ```

3. **Load Extension**
   - Open Chrome → `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" → Select `/extension` folder

4. **Configure Gemini Nano**
   - Follow [Chrome Built-in AI documentation](https://developer.chrome.com/docs/ai/built-in)
   - Set up API keys if using remote fallback

5. **Run Next.js Dashboard** (optional)
   ```bash
   npm run dev    # Development
   npm run build  # Production
   ```

## Development

- Extension core in `/extension` directory
- IndexedDB schema: legal docs, chat logs, file indices, user config
- All AI processing runs locally via Gemini Nano
- Function-calling APIs for automation workflows

## Testing

- Use Chrome extension debugger (`chrome://extensions`)
- Validate IndexedDB operations and autofill flows
- Test audio-to-text, highlighting, and reference tools
- Unit tests with Jest (optional)

## Deployment

1. Package extension with icons, screenshots, privacy policy
2. Submit to Chrome Web Store
3. Build Next.js UI: `npm run build`
4. Deploy open-source repository

## References

- [Chrome Built-in AI APIs](https://developer.chrome.com/docs/ai/built-in)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Built for the 2025 Chrome AI Challenge** | Privacy-focused | Offline-first

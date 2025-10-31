# Agentic Advocate Extension - Development Process

## Overview

This document outlines the development process, architecture, and key implementation details for the Agentic Advocate Chrome extension.

## Architecture

### File Structure

```
extension/
├── manifest.json          # Extension configuration and permissions
├── popup.html             # Main UI interface
├── popup.js               # UI logic and event handlers
├── popup.css              # UI styling
├── background.js          # Service worker for background tasks
├── contentScript.js       # Content script for page interaction
├── ai.js                  # AI API wrappers (Chrome AI + Gemini fallback) ⭐
├── db.js                  # Storage and database operations
├── options.html           # Settings page
├── options.js             # Settings logic
├── icons/                 # Extension icons
└── process.md             # This file
```

### Core Components

#### 1. AI Integration (`ai.js`)

The AI module provides a unified interface for multiple AI providers:

**Chrome Built-in AI (Primary)**
- Uses Gemini Nano on-device processing
- APIs: `languageModel`, `writer`, `rewriter`, `proofreader`, `translator`, `summarizer`
- Context-aware: Checks `self.ai` (service worker) and `window.ai` (popup)
- Graceful fallback on errors

**Remote Gemini API (Fallback)**
- Uses Google Gemini cloud API when Chrome AI unavailable
- Automatic model endpoint discovery
- Multiple fallback attempts with different model names
- Smart error handling with user-friendly messages

**Key Functions:**
- `promptModel()` - General AI chat/assistance
- `writeLegalDoc()` - Document generation
- `rewriteText()` - Text refinement
- `proofreadText()` - Grammar correction
- `summarizeText()` - Content condensation
- `translateText()` - Multi-language support

**Provider Selection:**
```javascript
// Auto-detects and falls back gracefully
Chrome AI → Remote Gemini → Demo Mode
```

#### 2. UI Layer (`popup.js`, `popup.html`)

**Main Features:**
- Quick Action: Direct AI chat and document generation
- Legal Review: Page analysis and text summarization
- Real-time status indicators
- Error handling with actionable feedback

**Event Flow:**
```
User Input → Handler → AI API → Response → UI Update
```

#### 3. Background Service (`background.js`)

**Responsibilities:**
- Initialize default settings on install
- Handle notifications
- AI availability diagnostics
- Cross-context communication

#### 4. Content Script (`contentScript.js`)

**Functionality:**
- Extract visible text from web pages
- Enable "Analyze Page" feature
- Safe text extraction for legal document analysis

## AI API Implementation Details

### Chrome Built-in AI Detection

```javascript
function isChromeAIAvailable() {
  // Checks multiple contexts (service worker, window)
  // Verifies languageModel or specialized APIs exist
  // Returns boolean with error handling
}
```

### Remote Gemini API

**Model Endpoint Discovery:**
1. Attempts to list available models via `/v1beta/models`
2. Tries multiple model variants in priority order:
   - `gemini-1.5-flash` (fastest)
   - `gemini-1.5-pro` (high quality)
   - `gemini-pro` (legacy support)
3. Handles versioned models (e.g., `-002` suffix)

**Error Handling:**
- 404: Model not found → try next model
- 400: Invalid request → show specific error
- 401/403: Authentication → prompt to verify API key
- 429: Rate limit → suggest waiting
- Others: Generic error with troubleshooting steps

### Document Generation Workflow

```
User Request
    ↓
writeLegalDoc() - Initial draft
    ↓
rewriteText() - Improve structure and tone
    ↓
proofreadText() - Fix grammar and style
    ↓
Final Document
```

## Development Workflow

### Setup

1. **Load Extension:**
   - Open `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `extension/` folder

2. **Enable Chrome AI (Optional):**
   - Install Chrome Canary 127+
   - Enable flags at `chrome://flags`:
     - `#prompt-api-for-gemini-nano`
     - `#optimization-guide-on-device-model`
   - Download model at `chrome://components`

3. **Configure Remote API (Fallback):**
   - Get API key from https://aistudio.google.com/apikey
   - Click extension ⚙️ icon
   - Select "Gemini Developer API"
   - Paste API key and save

### Testing

**Manual Testing:**
1. Open extension popup
2. Check browser console (F12)
3. Test Quick Action with various prompts
4. Test Document Generation
5. Test Legal Review features

**Debugging:**
- Console logs show AI diagnostics
- Error messages include actionable steps
- Background context availability is logged
- Model discovery results are displayed

### Code Style

- ES6 modules with imports/exports
- Async/await for asynchronous operations
- Error-first design with graceful fallbacks
- User-friendly error messages
- Comprehensive logging for debugging

## Key Features

### 1. Smart AI Provider Selection

Automatically chooses best available AI:
- Chrome Built-in: Privacy-first, on-device
- Remote Gemini: Cloud-based, reliable
- Demo Mode: No API needed for testing

### 2. Context-Aware API Access

Chrome AI APIs checked in:
- Service worker context (`self.ai`)
- Popup context (`window.ai`)
- Fallback to alternative APIs if preferred unavailable

### 3. Intelligent Error Recovery

- Model endpoint auto-discovery
- Multiple fallback attempts
- Clear user guidance on errors
- Console diagnostics for developers

### 4. User Experience

- Loading indicators
- Status messages
- Helpful error descriptions
- Settings integration
- Offline-capable (with Chrome AI)

## Troubleshooting

### Chrome Built-in AI Not Working

**Possible Causes:**
1. Not on Chrome Canary 127+
2. Flags not enabled
3. Model not downloaded
4. Chrome needs restart

**Solution:**
Check console for detailed diagnostics including:
- AI object availability
- Available API methods
- Context information

### Remote Gemini API Errors

**Common Issues:**
1. Invalid or missing API key
2. API not enabled in Google Cloud
3. Rate limits exceeded
4. Model not available

**Solution:**
- Verify API key at aistudio.google.com/apikey
- Check console for available models list
- Ensure Gemini API enabled in Cloud Console
- Wait if rate limited

### Extension Not Loading

**Check:**
1. `manifest.json` syntax valid
2. All files present
3. No console errors
4. Permissions correctly set

## Future Enhancements

- [ ] Batch document processing
- [ ] Template library
- [ ] Export to PDF/Word
- [ ] Cloud sync integration
- [ ] Advanced legal research
- [ ] Multi-language UI
- [ ] Custom prompts storage

## License

MIT License - See LICENSE file in project root

---

**Built for Google Chrome Built-in AI Challenge 2025**


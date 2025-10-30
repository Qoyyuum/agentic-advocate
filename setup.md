# Agentic Advocate - Setup Guide

Complete setup instructions for the Agentic Advocate Chrome Extension.

## Prerequisites

- Google Chrome (latest version)
- Node.js and npm (for Next.js dashboard)
- Git

## Step 1: Clone the Repository

```bash
git clone https://github.com/adi0900/Google_Chrome25.git
cd agentic-advocate
```

## Step 2: Chrome Extension Setup

### 2.1 Load Extension in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Toggle **"Developer mode"** (top-right corner)
4. Click **"Load unpacked"**
5. Select the `/extension` folder from the cloned repository

### 2.2 Configure Gemini Nano (Chrome Built-in AI)

1. Follow the official [Chrome Built-in AI documentation](https://developer.chrome.com/docs/ai/built-in)
2. Ensure Chrome has Gemini Nano enabled for local AI processing
3. If using remote fallback, configure API keys in the extension settings

### 2.3 Verify Extension Installation

1. Check that the extension icon appears in Chrome toolbar
2. Click the extension icon to open the interface
3. Test basic functionality (chat, document upload, etc.)

## Step 3: Next.js Dashboard Setup (Optional)

### 3.1 Navigate to Dashboard Directory

```bash
cd dashboard  # or cd landing
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Run Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### 3.4 Build for Production

```bash
npm run build
```

## Step 4: IndexedDB Configuration

The extension automatically configures IndexedDB for:
- Legal documents storage
- Chat logs
- File indices
- User configuration

No manual setup required - database is initialized on first use.

## Step 5: Enable Required Permissions

When prompted by Chrome, allow the extension to:
- Access tabs
- Use local storage
- Access bookmarks
- Send notifications
- Use microphone (for audio-to-text features)

## Troubleshooting

### Extension not loading
- Ensure Developer mode is enabled in `chrome://extensions/`
- Check console for errors
- Verify manifest.json is valid

### Gemini Nano not working
- Check Chrome version (requires latest stable)
- Verify Built-in AI is available in your region
- Fall back to remote API if local AI unavailable

### Next.js dashboard issues
- Verify Node.js version is compatible
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Audio-to-text not working
- Grant microphone permissions in Chrome settings
- Check `chrome://settings/content/microphone`

## Next Steps

After setup:
1. Test document upload and analysis
2. Try legal workflow automation features
3. Configure tax planning preferences
4. Explore multimodal input (audio, images)
5. Review privacy settings and data storage

## Support & Documentation

- [Chrome Built-in AI APIs](https://developer.chrome.com/docs/ai/built-in)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Privacy-focused** | **Offline-first** | **Built for Chrome AI Challenge 2025**

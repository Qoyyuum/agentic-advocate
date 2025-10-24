# Agentic Advocate - AI-Powered Chrome Extension

A privacy-first Chrome extension powered by Gemini Nano for on-device AI processing. This extension provides summarization, writing, rewriting, and chat capabilities without sending data to external servers.

## Features

### 🤖 Multiple AI Capabilities
- **Chat/Prompt**: Interactive conversations with Gemini Nano
- **Summarize**: Condense long text into key points
- **Write**: Generate content based on prompts
- **Rewrite**: Rephrase and improve existing text

### 🔒 Privacy-First Design
- All processing happens locally on your device
- No data sent to external servers
- Works offline once the model is downloaded
- Zero data leakage

### ⚡ On-Device Performance
- Fast responses with Gemini Nano
- No internet required for AI operations
- Low latency local inference

### 🎯 Seamless Integration
- Load selected text from any webpage
- Side panel interface for easy access
- Context-aware operation suggestions

## Requirements

- **Chrome Version**: 128 or higher (Chrome Canary/Dev recommended for latest features)
- **Gemini Nano**: Must be enabled in Chrome
- **Operating System**: Windows, macOS, or Linux

## Installation

### 1. Enable Gemini Nano in Chrome

1. Open Chrome and navigate to `chrome://flags`
2. Search for and enable the following flags:
   - `#optimization-guide-on-device-model`
   - `#prompt-api-for-gemini-nano`
   - `#summarization-api-for-gemini-nano` (if available)
   - `#writer-api-for-gemini-nano` (if available)
   - `#rewriter-api-for-gemini-nano` (if available)
3. Restart Chrome
4. Wait for Gemini Nano to download (may take several minutes)

### 2. Install the Extension

1. Clone this repository:
   ```bash
   git clone https://github.com/Qoyyuum/agentic-advocate.git
   cd agentic-advocate/ai.gemini-on-device
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` directory

## Usage

### Opening the Extension

Click the extension icon in your Chrome toolbar to open the AI side panel.

### Basic Operations

1. **Select an Operation Mode**:
   - Choose from Prompt, Summarize, Write, or Rewrite

2. **Enter Your Input**:
   - Type directly in the text area, or
   - Select text on any webpage and click "Load Selected Text"

3. **Process with AI**:
   - Click "Run" to process your input
   - Results appear below the input area

4. **Advanced Settings** (Prompt mode only):
   - Adjust Temperature: Controls randomness (0 = deterministic, 2 = very random)
   - Adjust Top-k: Limits vocabulary choices (1-8)

### Operation Modes Explained

#### Chat/Prompt Mode
Interactive conversation with adjustable parameters. Best for:
- General questions and answers
- Creative writing prompts
- Code explanations
- Custom instructions

#### Summarize Mode
Condenses text into key points. Best for:
- Long articles or documents
- Research papers
- Meeting notes
- Email threads

#### Write Mode
Generates new content based on prompts. Best for:
- Emails and letters
- Blog posts and articles
- Product descriptions
- Social media content

#### Rewrite Mode
Improves existing text while preserving meaning. Best for:
- Grammar corrections
- Tone adjustments
- Clarity improvements
- Professional polish

## Development

### Project Structure

```
ai.gemini-on-device/
├── background.js         # Service worker for extension
├── content.js           # Content script for webpage interaction
├── manifest.json        # Extension manifest
├── sidepanel/
│   ├── index.html      # Side panel UI
│   ├── index.js        # Main application logic
│   └── index.css       # Styling
├── images/             # Extension icons
├── package.json        # Node.js dependencies
└── rollup.config.mjs   # Build configuration
```

### Building from Source

```bash
# Install dependencies
npm install

# Build extension
npm run build

# Output will be in the 'dist' directory
```

### Tech Stack

- **Manifest V3**: Latest Chrome extension standard
- **Vanilla JavaScript**: No frameworks, lightweight and fast
- **Chrome AI APIs**: Built-in Gemini Nano integration
  - Prompt API (LanguageModel)
  - Summarizer API (AISummarizer)
  - Writer API (AIWriter)
  - Rewriter API (AIRewriter)
- **Rollup**: Module bundler for production builds

## API Compatibility

This extension uses Chrome's built-in AI APIs:

| API | Status | Availability |
|-----|--------|--------------|
| Prompt API | ✅ Stable | Chrome 128+ |
| Summarizer API | 🚧 Experimental | Chrome Dev/Canary |
| Writer API | 🚧 Experimental | Chrome Dev/Canary |
| Rewriter API | 🚧 Experimental | Chrome Dev/Canary |

The extension automatically detects which APIs are available and displays this information in the side panel.

## Troubleshooting

### "Model not available" Error

**Solution**: 
1. Ensure you're using Chrome 128 or higher
2. Enable required flags in `chrome://flags`
3. Wait for Gemini Nano to download (check `chrome://components`)
4. Restart Chrome after enabling flags

### Experimental Features Not Working

Some APIs (Summarizer, Writer, Rewriter) may only be available in Chrome Canary or Dev channels. Try:
1. Download Chrome Canary or Dev
2. Enable experimental AI flags
3. Restart and wait for model download

### Selected Text Not Loading

**Solution**:
1. Ensure you've actually selected text on the webpage
2. The extension needs "activeTab" permission
3. Try refreshing the webpage and selecting text again

### Build Errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Privacy & Security

### Data Handling
- **No Cloud Processing**: All AI operations run locally via Gemini Nano
- **No Data Collection**: We don't collect, store, or transmit user data
- **No Analytics**: No tracking or telemetry
- **Local Storage Only**: Chrome's local storage API for temporary data only

### Permissions Used
- `sidePanel`: Display the AI interface
- `storage`: Store temporary data (selected text)
- `activeTab`: Read selected text from webpages

### Offline Operation
Once Gemini Nano is downloaded, the extension works completely offline. No internet connection required for AI operations.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in Chrome
5. Submit a pull request

## License

Apache 2.0

## Acknowledgments

- Built for the [Google Chrome Built-in AI Challenge 2025](https://googlechromeai2025.devpost.com/)
- Powered by [Gemini Nano](https://developers.google.com/ai/gemini-nano)
- Uses Chrome's [Built-in AI APIs](https://developer.chrome.com/docs/extensions/ai/)

## Resources

- [Chrome Built-in AI Documentation](https://developer.chrome.com/docs/extensions/ai/)
- [Gemini Nano Overview](https://developers.google.com/ai/gemini-nano)
- [Chrome Extension Development](https://developer.chrome.com/docs/extensions/)
- [DevPost Challenge](https://googlechromeai2025.devpost.com/)

## Roadmap

- [ ] Add language translation support
- [ ] Implement proofreading capabilities
- [ ] Add conversation history
- [ ] Support for multiple languages
- [ ] Context menu integration
- [ ] Keyboard shortcuts
- [ ] Export results to file
- [ ] Custom prompt templates
- [ ] Multi-modal support (images, audio)

---

**Note**: This extension is designed for the Chrome Built-in AI Challenge 2025 and demonstrates privacy-first, on-device AI processing capabilities.

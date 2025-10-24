# Agentic Advocate - Legal AI Assistant

🤖 **Privacy-first Chrome Extension powered by Gemini Nano for legal workflows**

Agentic Advocate is a specialized Chrome extension that automates legal work using Chrome's built-in AI APIs and Gemini Nano. It provides on-device AI processing for legal document analysis, compliance checking, tax planning, and automated form filling - all while preserving privacy with local processing.

## ✨ Key Features

- **🔒 Privacy-First**: All AI processing happens locally on your device using Gemini Nano
- **⚡ Offline Capable**: Works without internet connection for core features
- **📋 Legal Task Automation**: Specialized AI prompts for legal analysis, document generation, and compliance
- **🌐 Page Content Analysis**: Capture and analyze text from any webpage
- **📝 Form Detection**: Automatically detects and helps fill legal forms (RTI, complaints, etc.)
- **🎯 Multi-Task AI**: Summarization, rewriting, proofreading, legal analysis, and document generation
- **💾 Local Storage**: All data stored locally using Chrome's storage APIs

## 🚀 Legal AI Capabilities

### Core Legal Tasks
- **Legal Analysis**: Analyze contracts, legal documents, and identify key issues
- **Document Summarization**: Generate concise summaries of legal documents
- **Professional Rewriting**: Rewrite text in proper legal language
- **Proofreading**: Check legal documents for accuracy and clarity
- **Document Generation**: Create legal notices, complaints, and templates
- **Compliance Checking**: Verify compliance requirements and regulations

### Quick Legal Actions
- RTI (Right to Information) application assistance
- Legal complaint drafting
- Legal notice templates
- Tax planning advice
- Contract review and analysis
- Compliance requirement checking

### Smart Form Detection
- Automatically detects legal forms on webpages
- Provides context-aware autofill suggestions
- Supports RTI forms, complaint forms, tax forms, and more
- Visual highlighting of legal fields and forms

## 🛠 Technical Architecture

### Privacy & Security
- **100% Local Processing**: Gemini Nano runs entirely on your device
- **No Data Transmission**: User data never leaves your browser
- **Offline Functionality**: Core features work without internet
- **Local Storage Only**: All data stored in Chrome's local storage

### Chrome AI Integration
- **Gemini Nano**: On-device large language model
- **Built-in AI APIs**: Summarizer, Rewriter, Writer, Proofreader
- **Fallback Support**: Graceful degradation when AI unavailable
- **Performance Optimized**: Efficient local AI processing

### Extension Architecture
- **Manifest V3**: Modern Chrome extension architecture
- **Service Worker**: Background processing and AI session management
- **Content Script**: Page interaction and form detection
- **Side Panel**: Modern Chrome side panel interface
- **Local Storage**: IndexedDB for document and response storage

## 📋 Requirements

### Chrome Version
- **Minimum Chrome Version**: 138+
- **Recommended**: Chrome Canary or Dev channel for latest AI features
- **Gemini Nano**: Must be enabled in Chrome AI settings

### AI Features Setup
1. **Enable Chrome AI**: Go to `chrome://flags/#optimization-guide-on-device-model`
2. **Download Gemini Nano**: Chrome will automatically download the model
3. **Verify Setup**: Check `chrome://components/` for "Optimization Guide On Device Model"

## 🔧 Installation & Setup

### For Development/Testing

1. **Clone Repository**
   ```bash
   git clone https://github.com/Qoyyuum/agentic-advocate.git
   cd agentic-advocate/ai.gemini-on-device
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build Extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the `dist` directory
   - Pin the extension to your toolbar

### Verify Installation
1. Click the Agentic Advocate extension icon
2. Check that the side panel opens with "AI Ready" status
3. Test with a simple legal analysis task

## 🎯 Usage Guide

### Getting Started
1. **Open Side Panel**: Click the extension icon to open Agentic Advocate
2. **Select Task**: Choose from legal analysis, summarization, rewriting, etc.
3. **Input Content**: Type your request or capture content from the webpage
4. **Process**: Click "Process with AI" for local analysis
5. **Review Results**: Copy, save, or export the AI-generated response

### Capturing Web Content
- **Selected Text**: Highlight text on any webpage and click "Capture Selection"
- **Full Page**: Click "Capture Page Content" to analyze the entire page
- **Legal Forms**: Click "Detect Legal Forms" to find and highlight fillable forms

### Advanced Features
- **Adjust AI Parameters**: Use temperature and top-k controls for response tuning
- **Save Responses**: All AI responses can be saved locally for later reference
- **Export Documents**: Export analysis results as markdown documents
- **Form Assistance**: Get contextual help when filling legal forms

## 🧪 Testing & Development

### Testing Checklist
- [ ] Extension loads without errors
- [ ] AI status shows "Ready" 
- [ ] All task types work (analysis, summary, rewrite, etc.)
- [ ] Content capture functions properly
- [ ] Form detection highlights legal forms
- [ ] Responses can be copied/saved/exported
- [ ] Works offline (disconnect internet and test)

### Development Commands
```bash
# Install dependencies
npm install

# Build for development
npm run build

# Watch mode for development
npm run dev

# Check for issues
npm audit
```

### Debugging
- Open Chrome DevTools while using the extension
- Check the Console for any errors
- Inspect the Service Worker in `chrome://extensions/`
- Monitor network activity to ensure no external requests

## 🔒 Privacy Policy

Agentic Advocate is designed with privacy as the top priority:

- **No Data Collection**: We do not collect, store, or transmit any user data
- **Local Processing**: All AI operations happen on your device
- **No Analytics**: No usage tracking or telemetry
- **No External Requests**: Extension operates entirely offline
- **Local Storage**: All data remains in your browser's local storage

## ⚖️ Legal Disclaimer

Agentic Advocate is an AI assistant tool designed to help with legal tasks. It is not a substitute for professional legal advice. Always consult with qualified legal professionals for specific legal matters and before making legal decisions.

## 🛣 Roadmap

### Current Version (v1.0)
- ✅ Basic legal AI tasks
- ✅ Content capture and analysis
- ✅ Form detection and highlighting
- ✅ Local Gemini Nano integration

### Upcoming Features
- 🔄 Enhanced form auto-filling
- 🔄 Legal document templates library
- 🔄 Multi-language legal support
- 🔄 Advanced compliance checking
- 🔄 Legal case management

## 🤝 Contributing

This project is part of the Google Chrome AI Challenge 2025. Contributions welcome!

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with local Gemini Nano
5. Submit a pull request

### Guidelines
- Maintain privacy-first design principles
- Ensure all processing remains local
- Test with various legal document types
- Follow Chrome extension best practices

## 📞 Support

- **Issues**: Report bugs on GitHub Issues
- **Documentation**: See `/docs` directory
- **Chrome AI**: [Chrome Built-in AI Documentation](https://developer.chrome.com/docs/extensions/ai/)
- **Legal Resources**: Consultation with legal professionals recommended

## 📄 License

Apache License 2.0 - See LICENSE file for details.

## 🏆 Chrome AI Challenge 2025

This extension is submitted for the Google Chrome AI Challenge 2025, showcasing:
- Privacy-preserving AI with local processing
- Innovative legal workflow automation
- Professional-grade UI/UX for legal professionals
- Comprehensive Chrome AI API integration
- Real-world utility for legal professionals and citizens

---

**Made with ❤️ for legal professionals and privacy-conscious users**

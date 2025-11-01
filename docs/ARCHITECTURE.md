# Technical Architecture

## Overview

Agentic Advocate is a Manifest V3 Chrome extension with a clean separation of concerns across popup, content, and background scripts. The architecture prioritizes privacy-first, offline-capable workflows using Chrome's Built-in AI (Gemini Nano).

## Core Extension Architecture

### Manifest V3 Structure

```
extension/
├── manifest.json           # Manifest V3 configuration
├── pages/
│   ├── popup.html         # Main UI interface
│   └── options.html       # Settings page
├── scripts/
│   ├── background.js      # Service worker (central orchestrator)
│   ├── content.js         # Content script (page injection)
│   ├── popup.js           # Popup logic
│   ├── db.js              # IndexedDB manager
│   └── options.js         # Settings manager
├── styles/
│   ├── popup.css          # Popup styling
│   └── content.css        # Content styling
└── assets/
    └── icons/             # Extension icons
```

### Component Responsibilities

#### 1. Background Service Worker (`scripts/background.js`)
- **Role**: Central orchestration and AI processing
- **Key Functions**:
  - Message routing between popup, content scripts
  - Chrome Built-in AI integration (Gemini Nano)
  - Document generation (Writer, Rewriter, Proofreader)
  - AI chat processing with multimodal support
  - Image analysis via Gemini Nano
  - Context menu handlers
  - Notifications management

#### 2. Popup Interface (`pages/popup.html`, `scripts/popup.js`)
- **Role**: User interaction layer
- **Key Features**:
  - AI Chat interface with loading indicators
  - Document Generator (Writer, Rewriter, Proofreader modes)
  - File/Image upload with processing
  - Page content analysis
  - Recent documents display
  - Configuration modal
  - Team/Help modals

#### 3. Content Script (`scripts/content.js`)
- **Role**: Page-level injection and analysis
- **Key Functions**:
  - Text selection analysis
  - Page content extraction
  - Legal term highlighting
  - Inline result overlays
  - Form detection and autofill suggestions

#### 4. IndexedDB Manager (`scripts/db.js`)
- **Role**: Local storage orchestration
- **Stores**:
  - `documents`: Legal documents with metadata
  - `chatLogs`: Conversation history
  - `fileIndices`: Searchable file metadata
  - `userConfig`: User preferences
  - `legalTemplates`: Pre-built templates

### Message Flow

```
[User Action] → [Popup.js]
    ↓
[chrome.runtime.sendMessage]
    ↓
[Background.js] 
    ↓
[Process with AI/Save to IndexedDB]
    ↓
[chrome.runtime.sendResponse]
    ↓
[Popup.js Update UI]
```

## AI/ML Layer

### Chrome Built-in AI Integration

**Primary Model**: Gemini Nano (Local)
- **API**: `LanguageModel.create()` with `language: 'en'`
- **Context**: Service worker (`self.LanguageModel`)
- **Capabilities**:
  - Text generation (Chat, Document Generation)
  - Document analysis (Summary, Key points, Risks)
  - Image analysis (OCR, Legal document identification)
  - Text transformation (Rewrite, Proofread)

**Detection Logic**:
```javascript
if (typeof self !== 'undefined' && self.LanguageModel) {
  LanguageModel = self.LanguageModel;
} else if (self.ai && self.ai.languageModel) {
  LanguageModel = self.ai.languageModel;
}
```

### Multi-Model Endpoints

1. **Chat Processing** (`processWithGeminiNano`)
   - Task type: `chat`
   - Legal assistant persona
   - Context-aware responses

2. **Document Generation** (`processDocumentGeneration`)
   - Task types: `document_generation`, `rewrite`, `proofread`
   - Template-based prompts
   - Domain-specific formatting

3. **Image Analysis** (Multimodal)
   - Task type: `image_analysis`
   - Base64 encoded images
   - Legal document detection

4. **Document Analysis**
   - Task type: `document_analysis`
   - Risk assessment
   - Compliance checking

**Fallback Strategy**:
- Primary: Gemini Nano (local, privacy-first)
- Detection: Availability check on initialization
- UX: Clear messaging when AI unavailable

## Local Storage (IndexedDB)

### Database Schema

**Database**: `AgenticAdvocateDB` (Version 1)

#### Store: `documents`
```javascript
{
  id: autoIncrement,
  name: string,
  type: 'contract|invoice|agreement|nda|terms',
  category: 'legal|compliance|tax',
  content: string,
  summary: string,
  timestamp: Date,
  metadata: object
}
Indices: name, type, timestamp, category
```

#### Store: `chatLogs`
```javascript
{
  id: autoIncrement,
  message: string,
  type: 'user|bot',
  timestamp: Date,
  metadata: object
}
Indices: timestamp, type
```

#### Store: `fileIndices`
```javascript
{
  id: autoIncrement,
  keyword: string,
  documentId: number,
  weight: number
}
Indices: keyword, documentId
```

#### Store: `userConfig`
```javascript
{
  key: string (primary),
  value: any
}
```

#### Store: `legalTemplates`
```javascript
{
  id: autoIncrement,
  name: string,
  category: 'contract|notice|complaint',
  content: string,
  metadata: object
}
Indices: category, name
```

## Advanced Dashboard

### Next.js Architecture

**Tech Stack**: Next.js 15.1.3, React 18.3.1, Tailwind CSS

**Structure**:
```
dashboard/
├── src/
│   ├── app/
│   │   ├── layout.js      # Root layout
│   │   └── page.js        # Landing page
│   ├── components/
│   │   ├── Hero.js        # Hero section
│   │   ├── Features.js    # Features showcase
│   │   ├── HowItWorks.js  # Process flow
│   │   ├── CTA.js         # Call-to-action
│   │   ├── Header.js      # Navigation
│   │   ├── Footer.js      # Links & social
│   │   └── ui/
│   │       ├── button.jsx # Reusable button
│   │       └── card.jsx   # Card component
│   ├── lib/
│   │   └── utils.js       # Utility functions
│   └── styles/
│       └── globals.css    # Global styles
├── tailwind.config.js     # Tailwind config
└── package.json
```

**Key Features**:
- Responsive design with Framer Motion animations
- Lucide React icons
- Dark/Light theme support
- SEO optimized
- GitHub integration

## Declarative Automation

### Function-Calling Architecture

**Context Extraction**:
1. User selects text → Content script intercepts
2. Background analyzes via Gemini Nano
3. Returns insights → Inline overlay

**Form Detection**:
1. Content script scans DOM for legal forms
2. Identifies form fields (RTI, complaints, tax)
3. Provides autofill suggestions
4. User confirms → Auto-fill triggered

**Page Analysis**:
1. User clicks "Analyze Page"
2. Content script extracts all text
3. Background processes with legal AI
4. Returns summary → Modal display

### Proactive User Enablement

- **Context Menus**: Right-click → "Analyze with Agentic Advocate"
- **Quick Actions**: Analyze, Upload, Chat buttons
- **Smart Notifications**: Legal risks detected
- **Auto-save**: Documents automatically saved to IndexedDB

## Security & Privacy

### Privacy-First Design

1. **On-Device Processing**: Gemini Nano runs locally
2. **No Cloud Sync**: All data in IndexedDB
3. **Zero Telemetry**: No external tracking
4. **Minimal Permissions**: Only required Chrome APIs

### Permissions

```json
"permissions": [
  "storage",      // IndexedDB
  "tabs",         // Page analysis
  "notifications",// Alerts
  "bookmarks",    // Save documents
  "activeTab",    // Current page access
  "contextMenus", // Right-click
  "scripting"     // Content injection
]
```

### Data Flow

```
User Input → Background Script
    ↓
Gemini Nano (Local)
    ↓
IndexedDB (Local)
    ↓
No external transmission
```

## Technology Stack Summary

### Extension
- **Runtime**: Manifest V3
- **Language**: Vanilla JavaScript (ES6+)
- **Storage**: IndexedDB
- **AI**: Chrome Built-in AI (Gemini Nano)
- **UI**: HTML5, CSS3 (Glassmorphism, Neon effects)

### Dashboard
- **Framework**: Next.js 15
- **UI**: React 18, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build**: Webpack, PostCSS

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint
- **Documentation**: Markdown

## Deployment Architecture

### Extension Deployment
1. Package `extension/` folder
2. Zip manifest, scripts, assets
3. Chrome Web Store submission
4. Unpacked load for development

### Dashboard Deployment
1. Build: `npm run build`
2. Host: Vercel/Netlify
3. Domain: Custom or subdomain
4. CDN: Global edge distribution

## Scalability Considerations

1. **IndexedDB Performance**: Indexed queries for fast search
2. **AI Processing**: Async operations, loading states
3. **Memory Management**: Cleanup old chat logs
4. **UI Responsiveness**: Debounced input, virtual scrolling

## Future Enhancements

1. **Vector Search**: Semantic document search
2. **Multi-Language**: Language detection + translation
3. **Collaboration**: Shared document spaces
4. **Analytics**: Usage insights (opt-in)
5. **Offline Mode**: Service Worker caching


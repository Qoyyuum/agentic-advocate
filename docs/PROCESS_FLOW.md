# Process Flow & Workflows

## Overview

This document describes the complete user workflows and data processing flows within Agentic Advocate.

## Core Workflows

### 1. Document Generation Workflow

#### Writer Mode
```
User Action: Select "Writer" tab
    ↓
Select Document Type (Contract/Invoice/Agreement/NDA/Terms)
    ↓
Enter Context/Description
    ↓
Click "Generate Document"
    ↓
[Popup.js] → Show loading indicator
    ↓
[Background.js] → processDocumentGeneration()
    ↓
Check LanguageModel availability
    ↓
Create prompt with document-specific instructions
    ↓
Call LanguageModel.create({ language: 'en' })
    ↓
model.prompt(prompt)
    ↓
Format response
    ↓
Return to Popup
    ↓
Display generated document
    ↓
User: Copy or Download
    ↓
Save to IndexedDB (optional)
```

**Example Prompt Structure**:
```
You are a legal document generator. Create a professional business contract with the following details:

[USER_CONTEXT]

Create a complete, ready-to-use document with:
1. A clear title
2. Proper introductory clauses
3. All standard sections for this type of document
4. Specific details based on the requirements provided
5. Appropriate closing and signature lines
```

#### Rewriter Mode
```
User Action: Select "Rewriter" tab
    ↓
Enter text to rewrite
    ↓
Select goal (professional, concise, formal, etc.)
    ↓
Click "Rewrite Text"
    ↓
[Background] → Construct rewrite prompt
    ↓
AI Processing → Gemini Nano
    ↓
Display improved text
```

**Rewrite Prompt**:
```
Rewrite the following text to make it [GOAL]:

[TEXT]

Please maintain the original meaning while improving clarity, professionalism, and effectiveness.
```

#### Proofreader Mode
```
User Action: Select "Proofreader" tab
    ↓
Enter legal text to proofread
    ↓
Click "Proofread Document"
    ↓
[Background] → Construct proofread prompt
    ↓
AI Processing → Gemini Nano
    ↓
Display corrected text with notes
```

**Proofread Prompt**:
```
Proofread the following legal text and fix any grammar, spelling, punctuation, or legal terminology errors. Highlight any corrections made:

[TEXT]

Provide the corrected version with notes on what was changed.
```

---

### 2. AI Chat Workflow

```
User Action: Type message in chat or click "Analyze Page"
    ↓
Check for page analysis request
    ↓
[If Analyze Page]
    ↓
Query current tab URL
    ↓
Check if chrome:// or system page → Show error
    ↓
Inject content script → extract page text
    ↓
[Else]
    ↓
Get user message
    ↓
Show loading indicator with animated dots
    ↓
Send to Background: processWithAI({ text, taskType: 'chat' })
    ↓
[Background] → processWithGeminiNano()
    ↓
Construct chat prompt with legal assistant persona
    ↓
Call LanguageModel.prompt()
    ↓
Return AI response
    ↓
Hide loading indicator
    ↓
Display response in chat
    ↓
cleanOutputText() → Remove excessive formatting
    ↓
Save to IndexedDB (chatLogs)
    ↓
Update Recent Documents list
```

**Chat Prompt**:
```
As Agentic Advocate, a helpful and friendly legal assistant, respond to this question about legal matters, compliance, or tax issues. Keep your response formal and professional, but also keep it short and simple for non-legal professionals to understand:

[USER_QUESTION]
```

---

### 3. Document Upload & Analysis Workflow

#### File Upload (PDF/DOC/TXT)
```
User: Click "Upload" button
    ↓
Select file from system
    ↓
[FileReader API] → Read file content
    ↓
Show "📄 Uploaded: [filename]" in chat
    ↓
Show loading indicator
    ↓
Send to Background:
    {
      text: "Analyze this document...",
      taskType: 'document_analysis',
      file: content
    }
    ↓
[Background] → processWithGeminiNano()
    ↓
Construct analysis prompt
    ↓
AI Processing → Gemini Nano
    ↓
Return comprehensive analysis
    ↓
Display in chat + Document Summary modal
    ↓
Save to IndexedDB:
    - document: full content
    - summary: AI analysis
    - metadata: filename, type, timestamp
    ↓
Update Recent Documents
```

**Analysis Prompt**:
```
Analyze the following document and provide a comprehensive summary covering:
1. Main topics and key points
2. Important dates, names, or legal terms
3. Any legal risks or concerns
4. Recommendations or next steps

Document content:
[FILE_CONTENT]
```

#### Image Upload (JPG/PNG)
```
User: Click "Upload Image"
    ↓
Select image file
    ↓
[FileReader] → Convert to base64
    ↓
Show "🖼️ Uploaded image: [filename]" in chat
    ↓
Send to Background with image data
    ↓
[Background] → processWithGeminiNano() with image
    ↓
model.prompt(prompt, imageData)
    ↓
Return image analysis
    ↓
Display legal perspective analysis
    ↓
Save to IndexedDB
```

**Image Analysis Prompt**:
```
Analyze this image and provide a legal perspective on what you see. As a legal assistant, identify:
1. Any legal documents visible (contracts, IDs, letters, forms, etc.)
2. Potential legal risks or concerns
3. Important information that should be verified
4. Recommendations for next steps
```

---

### 4. Page Analysis Workflow

```
User: Click "Analyze Page" button
    ↓
[Popup.js] → analyzePage()
    ↓
Query active tab
    ↓
Check URL for chrome://, edge://, etc. → Prevent injection
    ↓
Show "Analyzing current page..." in chat
    ↓
[chrome.scripting.executeScript]
    ↓
Inject extraction function into page
    ↓
Extract all text from document.body
    ↓
Clean text: Remove extra whitespace
    ↓
Return to Background
    ↓
processWithGeminiNano({ 
    text: pageContent, 
    taskType: 'document_analysis' 
})
    ↓
AI Processing
    ↓
Return summary
    ↓
Display in chat + showSummary()
    ↓
Save to IndexedDB
```

---

### 5. Settings & Configuration Flow

```
User: Click Config icon
    ↓
Open Configuration Modal
    ↓
Load saved settings from chrome.storage.local
    ↓
Display:
    - AI Provider (Gemini/Local)
    - API Key toggle
    - Preferences
    ↓
User modifies settings
    ↓
Click "Save"
    ↓
Validate inputs
    ↓
Save to chrome.storage.local
    ↓
Update background script state
    ↓
Show success notification
    ↓
Close modal
```

---

### 6. Data Persistence Flow

#### Saving Documents
```
User generates/analyzes document
    ↓
AI Processing complete
    ↓
Document ready to save
    ↓
saveToIndexedDB() called
    ↓
[DatabaseManager.addDocument()]
    ↓
IndexedDB transaction:
    - Add to 'documents' store
    - Update indices (name, type, timestamp, category)
    ↓
Return success
    ↓
Update UI (Recent Documents list)
```

#### Loading Chat History
```
Extension opens
    ↓
initPopup()
    ↓
loadChatHistory()
    ↓
[DatabaseManager.getChatLogs()]
    ↓
Query IndexedDB 'chatLogs' store
    ↓
Order by timestamp DESC
    ↓
Limit to last 50 messages
    ↓
Display in chat container
```

#### Loading Recent Documents
```
Extension opens
    ↓
loadRecentDocuments()
    ↓
[DatabaseManager.getDocuments()]
    ↓
Query IndexedDB 'documents' store
    ↓
Order by timestamp DESC
    ↓
Limit to last 10 documents
    ↓
Display in Recent Documents section
```

---

### 7. Error Handling Flow

```
Any Operation Attempt
    ↓
Try-Catch block
    ↓
If Success → Continue workflow
    ↓
If Error:
    ↓
Capture error details
    ↓
Log to console
    ↓
Check error type:
    ↓
[A] LanguageModel Unavailable
    → Show: "Chrome Built-in AI not available"
    → Display fallback message
    ↓
[B] chrome:// URL Error
    → Show: "Cannot analyze system pages"
    → Prevent injection
    ↓
[C] File Read Error
    → Show: "Error reading file"
    → Reset input
    ↓
[D] Network Error
    → Show: "Network error. Check connection"
    ↓
[E] Generic Error
    → Show: "Error: [message]"
    ↓
Maintain UI state
    ↓
Hide loading indicators
```

---

### 8. Voice Input Flow (Noted Limitation)

```
User: Click Voice button
    ↓
Check SpeechRecognition support
    ↓
Open Microphone Permission Modal
    ↓
Display: "Voice input not available in popup"
    ↓
Explain Chrome security limitation
    ↓
User clicks "Got It"
    ↓
Close modal
```

**Note**: Voice input does not work in extension popups due to `chrome-extension://` protocol restrictions.

---

## Data Flow Diagrams

### Standard Request Flow
```
┌─────────────┐
│   Popup.js  │
└──────┬──────┘
       │ sendMessage({ action, data })
       ↓
┌──────────────────────┐
│  Background.js       │
│  (Service Worker)    │
└──────┬───────────────┘
       │
       ├─→ processWithAI()
       │      ↓
       │   LanguageModel
       │      ↓
       │   Gemini Nano
       │      ↓
       │   Response
       │      ↓
       ├─→ processDocumentGeneration()
       │      ↓
       │   Document Output
       │      ↓
       └─→ saveToIndexedDB()
              ↓
           IndexedDB
              ↓
           Return
              ↓
       ┌──────┴──────┐
       │  Popup.js   │ ← Update UI
       └─────────────┘
```

### Multimodal Processing Flow
```
User Uploads Image
        ↓
Base64 Encoding
        ↓
Background Process
        ↓
LanguageModel.prompt(prompt, image)
        ↓
Gemini Nano Multimodal
        ↓
OCR + Legal Analysis
        ↓
Return Structured Response
        ↓
Display + Save
```

### Content Script Flow
```
Page Load / User Selection
        ↓
Content Script Injected
        ↓
Listen for Messages
        ↓
analyzeText() / analyzePage()
        ↓
Extract Content
        ↓
Send to Background
        ↓
Receive Analysis
        ↓
Display Inline Overlay
```

---

## State Management

### Global State Variables
- `isListening`: Voice recognition state
- `recognition`: SpeechRecognition instance
- `sendMessageTimeout`: Debounce timer
- `isProcessing`: Chat processing flag

### Storage Layers
1. **Chrome Storage API**: `chrome.storage.local`
   - Theme preference
   - User settings
   - Temporary data

2. **IndexedDB**: Persistent storage
   - Documents
   - Chat history
   - File indices
   - Templates

---

## Performance Optimizations

### Debouncing
- Chat messages: 300ms debounce
- Textarea auto-resize
- Search queries

### Lazy Loading
- Icons loaded on demand
- Content scripts injected on action
- Modal content rendered when opened

### Caching
- AI availability check cached
- Recent documents cached
- Settings loaded once

---

## Integration Points

### Chrome APIs Used
1. `chrome.runtime`: Message passing
2. `chrome.tabs`: Tab management
3. `chrome.storage`: Configuration
4. `chrome.scripting`: Content injection
5. `chrome.contextMenus`: Right-click actions
6. `chrome.notifications`: Alerts

### External Resources
- Lucide Icons (SVG)
- Gemini Remote API (fallback)
- Chrome Built-in AI (primary)

---

## Testing Workflows

### Manual Test Scenarios

1. **Document Generation**
   - Generate each document type
   - Verify output quality
   - Test Copy/Download

2. **Chat Interaction**
   - Ask legal questions
   - Verify responses
   - Check persistence

3. **File Upload**
   - Upload PDF/TXT/DOC
   - Upload images
   - Verify analysis

4. **Error Handling**
   - Block AI availability
   - Upload invalid files
   - Test on chrome:// pages

5. **Persistence**
   - Close/reopen extension
   - Verify chat history
   - Check Recent Documents

---

## Future Workflow Enhancements

1. **Batch Processing**: Multiple documents at once
2. **Collaborative Editing**: Shared document spaces
3. **Version Control**: Document revision history
4. **Export Options**: PDF, Word, HTML
5. **Templates Library**: Pre-built legal templates
6. **Compliance Checking**: Regulatory validation
7. **Calendar Integration**: Deadline tracking
8. **Search Enhancement**: Semantic search


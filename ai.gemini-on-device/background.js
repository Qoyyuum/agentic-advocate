// Agentic Advocate - Legal AI Assistant Background Script
// Handles Gemini API initialization and AI processing

// Import Gemini API helper
importScripts('gemini-api.js');

const geminiAPI = new GeminiAPI();
let aiSession = null;
let summarizer = null;
let writer = null;
let rewriter = null;

// Initialize extension
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: true })
      .catch((error) => console.error(error));
    
    // Initialize AI capabilities
    initializeAI();
  }
});

// Initialize Gemini API
async function initializeAI() {
  try {
    console.log('Initializing Agentic Advocate AI capabilities...');
    
    // Check if API key is configured
    const hasKey = await geminiAPI.hasApiKey();
    
    // Also check for on-device AI as fallback
    const onDeviceAI = 'ai' in self && 'languageModel' in self.ai;
    
    console.log('Gemini API Key configured:', hasKey);
    console.log('On-device AI available:', onDeviceAI);
    
    // Store AI availability in local storage
    await chrome.storage.local.set({ 
      aiAvailable: hasKey || onDeviceAI,
      apiMode: hasKey ? 'gemini-api' : (onDeviceAI ? 'on-device' : 'none'),
      initTimestamp: Date.now() 
    });
    
  } catch (error) {
    console.error('Failed to initialize AI:', error);
    await chrome.storage.local.set({ 
      aiAvailable: false,
      apiMode: 'none',
      error: error.message 
    });
  }
}

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  switch (request.action) {
    case 'processWithAI':
      handleAIProcessing(request, sendResponse);
      return true; // Keep channel open for async response
      
    case 'getAIStatus':
      getAIStatus(sendResponse);
      return true;
      
    case 'setApiKey':
      setApiKey(request.apiKey, sendResponse);
      return true;
      
    case 'capturePageContent':
      capturePageContent(sender, sendResponse);
      return true;
      
    default:
      console.warn('Unknown action:', request.action);
      sendResponse({ error: 'Unknown action' });
  }
});

// Set Gemini API Key
async function setApiKey(apiKey, sendResponse) {
  try {
    await geminiAPI.setApiKey(apiKey);
    await initializeAI();
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Process text with AI based on task type
async function handleAIProcessing(request, sendResponse) {
  const { task, text, options = {} } = request;
  
  try {
    let result;
    
    switch (task) {
      case 'summarize':
        result = await summarizeText(text, options);
        break;
        
      case 'rewrite':
        result = await rewriteText(text, options);
        break;
        
      case 'proofread':
        result = await proofreadText(text, options);
        break;
        
      case 'legalAnalysis':
        result = await analyzeLegalText(text, options);
        break;
        
      case 'generateDocument':
        result = await generateLegalDocument(text, options);
        break;
        
      default:
        result = await processGenericPrompt(text, options);
    }
    
    sendResponse({ success: true, result });
    
  } catch (error) {
    console.error('AI processing failed:', error);
    sendResponse({ 
      success: false, 
      error: error.message,
      fallbackSuggestion: 'Try breaking down your request into smaller parts'
    });
  }
}

// Summarize text using built-in summarizer or Gemini
async function summarizeText(text, options) {
  if ('ai' in self && 'summarizer' in self.ai) {
    try {
      if (!summarizer) {
        summarizer = await self.ai.summarizer.create({
          type: options.type || 'key-points',
          format: options.format || 'plain-text',
          length: options.length || 'medium'
        });
      }
      return await summarizer.summarize(text);
    } catch (error) {
      console.warn('Built-in summarizer failed, falling back to Gemini:', error);
    }
  }
  
  // Fallback to Gemini
  return await processWithGemini(
    \Please provide a concise summary of the following legal text, focusing on key points and important details:\n\n\,
    options
  );
}

// Rewrite text using built-in rewriter or Gemini
async function rewriteText(text, options) {
  if ('ai' in self && 'rewriter' in self.ai) {
    try {
      if (!rewriter) {
        rewriter = await self.ai.rewriter.create({
          tone: options.tone || 'professional',
          format: options.format || 'plain-text',
          length: options.length || 'as-is'
        });
      }
      return await rewriter.rewrite(text);
    } catch (error) {
      console.warn('Built-in rewriter failed, falling back to Gemini:', error);
    }
  }
  
  // Fallback to Gemini with legal context
  const tone = options.tone || 'professional legal';
  return await processWithGemini(
    \Please rewrite the following text in a \ tone suitable for legal documents:\n\n\,
    options
  );
}

// Proofread text for legal accuracy and clarity
async function proofreadText(text, options) {
  return await processWithGemini(
    \Please proofread the following legal text for grammar, clarity, and professional tone. Suggest improvements while maintaining legal accuracy:\n\n\,
    options
  );
}

// Analyze legal text for key insights
async function analyzeLegalText(text, options) {
  const prompt = \As a legal AI assistant, analyze the following text and provide:
1. Key legal concepts identified
2. Important dates, deadlines, or time-sensitive information
3. Potential legal implications or concerns
4. Recommended actions or next steps
5. Any compliance requirements mentioned

Text to analyze:\n\n\;
  
  return await processWithGemini(prompt, options);
}

// Generate legal documents
async function generateLegalDocument(prompt, options) {
  const legalPrompt = \As a legal document assistant, help create a professional legal document based on this request. Include appropriate legal language, structure, and disclaimers where necessary:\n\n\;
  
  return await processWithGemini(legalPrompt, options);
}

// Process with Gemini (API or on-device)
async function processWithGemini(prompt, options = {}) {
  try {
    // Try Gemini API first
    const hasApiKey = await geminiAPI.hasApiKey();
    
    if (hasApiKey) {
      console.log('Using Gemini Developer API');
      return await geminiAPI.generateContent(prompt, options);
    }
    
    // Fallback to on-device model
    if ('ai' in self && 'languageModel' in self.ai) {
      console.log('Using on-device AI');
      
      if (!aiSession) {
        const params = {
          systemPrompt: 'You are Agentic Advocate, a specialized AI legal assistant. You help with legal research, document analysis, compliance, tax planning, and legal document generation. Always provide accurate, professional legal guidance while noting when users should consult qualified legal professionals for specific cases.',
          temperature: options.temperature || 0.3,
          topK: options.topK || 3
        };
        
        aiSession = await self.ai.languageModel.create(params);
      }
      
      return await aiSession.prompt(prompt);
    }
    
    // No AI available
    throw new Error('API_KEY_REQUIRED');
    
  } catch (error) {
    console.error('AI processing failed:', error);
    
    if (error.message === 'API_KEY_REQUIRED') {
      throw new Error('Gemini API key required. Please configure your API key in the extension settings.\n\nGet a free API key from: https://ai.google.dev/');
    }
    
    throw new Error(\AI processing failed: \);
  }
}

// Get current AI status
async function getAIStatus(sendResponse) {
  try {
    const stored = await chrome.storage.local.get(['aiAvailable', 'apiMode', 'error', 'initTimestamp']);
    const hasApiKey = await geminiAPI.hasApiKey();
    
    const status = {
      available: stored.aiAvailable || false,
      mode: stored.apiMode || 'none',
      hasApiKey: hasApiKey,
      onDeviceAI: 'ai' in self && 'languageModel' in self.ai,
      error: stored.error,
      lastInit: stored.initTimestamp
    };
    
    sendResponse({ success: true, status });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Capture content from active page
async function capturePageContent(sender, sendResponse) {
  try {
    // Get active tab if sender doesn't have tab info (called from side panel)
    let tabId;
    
    if (sender.tab && sender.tab.id) {
      tabId = sender.tab.id;
    } else {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!activeTab) {
        sendResponse({ success: false, error: 'No active tab found' });
        return;
      }
      tabId = activeTab.id;
    }
    
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      function: extractPageContent
    });
    
    if (results && results[0]) {
      sendResponse({ success: true, content: results[0].result });
    } else {
      sendResponse({ success: false, error: 'No content captured' });
    }
  } catch (error) {
    console.error('Content capture failed:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Function to inject into page for content extraction
function extractPageContent() {
  const selection = window.getSelection().toString();
  if (selection) {
    return {
      type: 'selection',
      text: selection,
      url: window.location.href
    };
  }
  
  // Get main content if no selection
  const article = document.querySelector('article') || 
                 document.querySelector('main') || 
                 document.querySelector('.content') ||
                 document.querySelector('#content');
  
  if (article) {
    return {
      type: 'article',
      text: article.innerText.slice(0, 5000), // Limit to 5000 chars
      title: document.title,
      url: window.location.href
    };
  }
  
  return {
    type: 'page',
    text: document.body.innerText.slice(0, 3000), // Limit to 3000 chars
    title: document.title,
    url: window.location.href
  };
}

// Cleanup on extension unload
chrome.runtime.onSuspend.addListener(() => {
  if (aiSession) {
    aiSession.destroy();
    aiSession = null;
  }
  if (summarizer) {
    summarizer.destroy();
    summarizer = null;
  }
  if (rewriter) {
    rewriter.destroy();
    rewriter = null;
  }
});

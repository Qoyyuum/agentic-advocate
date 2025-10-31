// Agentic Advocate - Legal AI Assistant Background Script
// Handles Gemini Nano initialization and AI processing

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

// Initialize Gemini Nano and other AI APIs
async function initializeAI() {
  try {
    console.log('Initializing Agentic Advocate AI capabilities...');
    
    // Check if AI APIs are available
    const aiAvailable = 'ai' in window || 'LanguageModel' in window;
    console.log('AI APIs available:', aiAvailable);
    
    // Store AI availability in local storage
    await chrome.storage.local.set({ 
      aiAvailable,
      initTimestamp: Date.now() 
    });
    
  } catch (error) {
    console.error('Failed to initialize AI:', error);
    await chrome.storage.local.set({ 
      aiAvailable: false,
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
      
    case 'capturePageContent':
      capturePageContent(sender.tab.id, sendResponse);
      return true;
      
    default:
      console.warn('Unknown action:', request.action);
      sendResponse({ error: 'Unknown action' });
  }
});

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

// Summarize text using built-in summarizer or Gemini Nano
async function summarizeText(text, options) {
  if ('ai' in window && 'summarizer' in window.ai) {
    try {
      if (!summarizer) {
        summarizer = await window.ai.summarizer.create({
          type: options.type || 'key-points',
          format: options.format || 'plain-text',
          length: options.length || 'medium'
        });
      }
      return await summarizer.summarize(text);
    } catch (error) {
      console.warn('Built-in summarizer failed, falling back to Gemini Nano:', error);
    }
  }
  
  // Fallback to Gemini Nano
  return await processWithGeminiNano(
    `Please provide a concise summary of the following legal text, focusing on key points and important details:\n\n${text}`,
    options
  );
}

// Rewrite text using built-in rewriter or Gemini Nano
async function rewriteText(text, options) {
  if ('ai' in window && 'rewriter' in window.ai) {
    try {
      if (!rewriter) {
        rewriter = await window.ai.rewriter.create({
          tone: options.tone || 'professional',
          format: options.format || 'plain-text',
          length: options.length || 'as-is'
        });
      }
      return await rewriter.rewrite(text);
    } catch (error) {
      console.warn('Built-in rewriter failed, falling back to Gemini Nano:', error);
    }
  }
  
  // Fallback to Gemini Nano with legal context
  const tone = options.tone || 'professional legal';
  return await processWithGeminiNano(
    `Please rewrite the following text in a ${tone} tone suitable for legal documents:\n\n${text}`,
    options
  );
}

// Proofread text for legal accuracy and clarity
async function proofreadText(text, options) {
  return await processWithGeminiNano(
    `Please proofread the following legal text for grammar, clarity, and professional tone. Suggest improvements while maintaining legal accuracy:\n\n${text}`,
    options
  );
}

// Analyze legal text for key insights
async function analyzeLegalText(text, options) {
  const prompt = `As a legal AI assistant, analyze the following text and provide:
1. Key legal concepts identified
2. Important dates, deadlines, or time-sensitive information
3. Potential legal implications or concerns
4. Recommended actions or next steps
5. Any compliance requirements mentioned

Text to analyze:\n\n${text}`;
  
  return await processWithGeminiNano(prompt, options);
}

// Generate legal documents
async function generateLegalDocument(prompt, options) {
  const legalPrompt = `As a legal document assistant, help create a professional legal document based on this request. Include appropriate legal language, structure, and disclaimers where necessary:\n\n${prompt}`;
  
  return await processWithGeminiNano(legalPrompt, options);
}

// Process with Gemini Nano (core AI function)
async function processWithGeminiNano(prompt, options = {}) {
  try {
    if (!aiSession) {
      // Initialize session with legal-focused parameters
      const params = {
        initialPrompts: [{
          role: 'system',
          content: 'You are Agentic Advocate, a specialized AI legal assistant. You help with legal research, document analysis, compliance, tax planning, and legal document generation. Always provide accurate, professional legal guidance while noting when users should consult qualified legal professionals for specific cases.'
        }],
        temperature: options.temperature || 0.3, // Lower temperature for more consistent legal advice
        topK: options.topK || 3
      };
      
      if ('LanguageModel' in window) {
        aiSession = await LanguageModel.create(params);
      } else {
        throw new Error('Gemini Nano not available');
      }
    }
    
    const result = await aiSession.prompt(prompt);
    return result;
    
  } catch (error) {
    console.error('Gemini Nano processing failed:', error);
    throw new Error(`AI processing unavailable: ${error.message}`);
  }
}

// Get current AI status
async function getAIStatus(sendResponse) {
  try {
    const stored = await chrome.storage.local.get(['aiAvailable', 'error', 'initTimestamp']);
    const status = {
      available: stored.aiAvailable || false,
      geminiNano: 'LanguageModel' in window,
      builtInAI: 'ai' in window,
      error: stored.error,
      lastInit: stored.initTimestamp
    };
    
    sendResponse({ success: true, status });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Capture content from active page
async function capturePageContent(tabId, sendResponse) {
  try {
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

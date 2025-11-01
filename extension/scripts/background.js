// Background Service Worker for Agentic Advocate Extension

importScripts('db.js');

// Helper for conditional exports for testing.
// This object will accumulate functions that need to be testable.
const EXPORTED_FOR_TESTING = {};

// ============================================
// Event Listeners & Core Logic
// ============================================

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Agentic Advocate Extension Installed');

  // Initialize storage with default settings
  chrome.storage.local.set({
    aiMode: 'local', // 'local' for Gemini Nano, 'remote' for fallback
    chatHistory: [],
    userPreferences: {
      legalWorkflows: true,
      taxPlanning: true,
      autoFill: true
    }
  });

  // Create context menu items
  chrome.contextMenus.create({
    id: 'analyze-text',
    title: 'Analyze with Agentic Advocate',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'analyze-text') {
    const selectedText = info.selectionText;
    console.log('Context menu clicked, analyzing text:', selectedText.substring(0, 50) + '...');

    // Ensure content script is loaded before sending message
    const loaded = await ensureContentScriptLoaded(tab.id);

    if (!loaded) {
      showNotification(
        'Cannot Analyze on This Page',
        'This page type does not support extensions. Please try on a regular webpage.'
      );
      return;
    }

    // Send to content script for analysis
    chrome.tabs.sendMessage(tab.id, {
      action: 'analyzeText',
      text: selectedText
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Failed to send analyze message:', chrome.runtime.lastError.message);
      } else {
        console.log('Analyze message sent successfully:', response);
      }
    });
  }
});

/**
 * Central message handler logic from content scripts and popup.
 * This function is made accessible for testing purposes.
 * @param {object} request - The message request.
 * @param {object} sender - The sender of the message.
 * @param {function} sendResponse - Function to send a response back.
 */
async function handleMessage(request, sender, sendResponse) {
  console.log('Background received message:', request.action || request.type);

  try {
    switch (request.action || request.type) {
      case 'getAICapabilities':
        sendResponse(await checkAICapabilities());
        break;

      case 'processWithAI':
        sendResponse(await processWithGeminiNano(request.data));
        break;

      case 'saveDocument':
        sendResponse(await saveToIndexedDB(request.document));
        break;

      case 'getDocuments':
        sendResponse(await getFromIndexedDB());
        break;

      case 'openTab':
        // This API uses a callback, so we handle it without await. The listener
        // wrapper's `return true` ensures the message channel stays open.
        chrome.tabs.create(request.data, (tab) => {
          sendResponse({ success: true, tabId: tab.id });
        });
        break;

      case 'AA_DOCUMENT_GENERATE':
        sendResponse(await processDocumentGeneration(request));
        break;

      default:
        sendResponse({ error: 'Unknown action' });
    }
  } catch (error) {
    console.error(`Error handling message action "${request.action || request.type}":`, error);
    sendResponse({ success: false, error: error.message });
  }
}

// Register the message listener.
// We wrap the async handler in a function that returns `true` to indicate
// that the response will be sent asynchronously.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request, sender, sendResponse);
  return true;
});
// Export the handleMessage function for unit testing the message dispatch logic
EXPORTED_FOR_TESTING.handleMessage = handleMessage;


// ============================================
// AI Capabilities & Processing
// ============================================

/**
 * Checks Chrome Built-in AI capabilities.
 * @returns {Promise<object>} An object indicating AI availability and mode.
 */
async function checkAICapabilities() {
  try {
    // Service workers don't have access to window object, use self/globalThis
    // Check multiple possible locations for LanguageModel
    const hasLanguageModel = typeof self !== 'undefined' && (
      ('LanguageModel' in self && typeof self.LanguageModel !== 'undefined') ||
      (self.ai && self.ai.languageModel) ||
      (self.LanguageModel && typeof self.LanguageModel.create !== 'undefined')
    );
    
    if (hasLanguageModel) {
      return {
        available: true,
        mode: 'local',
        apis: ['prompt', 'summarizer', 'translator', 'writer', 'rewriter']
      };
    } else {
      return {
        available: false,
        mode: 'remote',
        message: 'Chrome Built-in AI not available, using remote fallback'
      };
    }
  } catch (error) {
    console.error('Error checking AI capabilities:', error);
    return { available: false, error: error.message };
  }
}
EXPORTED_FOR_TESTING.checkAICapabilities = checkAICapabilities;

/**
 * Processes text with Gemini Nano (placeholder for now).
 * @param {object} data - The data for processing, includes text and taskType.
 * @returns {Promise<object>} The result of the processing.
 */
async function processWithGeminiNano(data) {
  try {
    const { text, taskType } = data;

    // For now, return a placeholder response
    // TODO: Implement actual Gemini Nano API calls when available
    return {
      success: true,
      result: `Processed: ${text.substring(0, 50)}...`,
      taskType: taskType
    };
  } catch (error) {
    console.error('Error processing with AI:', error);
    return { success: false, error: error.message };
  }
}
EXPORTED_FOR_TESTING.processWithGeminiNano = processWithGeminiNano;

/**
 * Processes document generation requests using Chrome Built-in AI.
 * @param {object} request - The request object containing task details.
 * @returns {Promise<object>} The result of the document generation.
 */
async function processDocumentGeneration(request) {
  try {
    const { task, docType, context, text, goal } = request;
    
    // Check if Chrome Built-in AI is available (multiple possible locations)
    let LanguageModel;
    if (typeof self !== 'undefined' && self.LanguageModel) {
      LanguageModel = self.LanguageModel;
    } else if (typeof self !== 'undefined' && self.ai && self.ai.languageModel) {
      // Fallback to self.ai.languageModel if self.LanguageModel doesn't exist
      LanguageModel = self.ai.languageModel;
    }
    
    console.log('LanguageModel availability check:', {
      hasSelf: typeof self !== 'undefined',
      hasSelfLanguageModel: typeof self !== 'undefined' && !!self.LanguageModel,
      hasSelfAI: typeof self !== 'undefined' && !!self.ai,
      LanguageModelExists: !!LanguageModel
    });
    
    if (!LanguageModel || typeof LanguageModel.create === 'undefined') {
      console.error('LanguageModel not available', { 
        hasSelf: typeof self !== 'undefined',
        hasSelfLanguageModel: typeof self !== 'undefined' && !!self.LanguageModel,
        hasSelfAI: typeof self !== 'undefined' && !!self.ai
      });
      return {
        success: false,
        output: '❌ Chrome Built-in AI not available. Please enable it in Chrome Canary settings.'
      };
    }
    
    let prompt = '';
    
    // Construct appropriate prompt based on task
    if (task === 'document_generation') {
      const docTypeMap = {
        'contract': 'a professional business contract',
        'invoice': 'an invoice document',
        'agreement': 'a legal agreement',
        'nda': 'a Non-Disclosure Agreement (NDA)',
        'terms': 'a Terms of Service document'
      };
      
      const specificDocType = docTypeMap[docType] || `a legal document of type "${docType}"`;
      prompt = `Generate ${specificDocType}. Use the following context: "${context}". The user's goal is: "${goal}". Incorporate the following selected text if relevant: "${text}".`;
      // TODO: Actual implementation of LanguageModel.create() and model.prompt(prompt)
      return { success: true, output: `[Placeholder for generated ${specificDocType}]` };
    } else {
      return { success: false, output: `Unknown generation task: ${task}` };
    }
  } catch (error) {
    console.error('Error in processDocumentGeneration:', error);
    return { success: false, error: error.message };
  }
}
EXPORTED_FOR_TESTING.processDocumentGeneration = processDocumentGeneration;
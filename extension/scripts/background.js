// Background Service Worker for Agentic Advocate Extension

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
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'analyze-text') {
    const selectedText = info.selectionText;
    // Send to content script for analysis
    chrome.tabs.sendMessage(tab.id, {
      action: 'analyzeText',
      text: selectedText
    });
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getAICapabilities':
      checkAICapabilities().then(sendResponse);
      return true;

    case 'processWithAI':
      processWithGeminiNano(request.data).then(sendResponse);
      return true;

    case 'saveDocument':
      saveToIndexedDB(request.document).then(sendResponse);
      return true;

    case 'getDocuments':
      getFromIndexedDB().then(sendResponse);
      return true;

    default:
      sendResponse({ error: 'Unknown action' });
  }
  return true;
});

// Check Chrome Built-in AI capabilities
async function checkAICapabilities() {
  try {
    // Check if Prompt API is available
    if ('ai' in window && 'languageModel' in window.ai) {
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

// Process text with Gemini Nano
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

// IndexedDB operations (simplified - full implementation in db.js)
async function saveToIndexedDB(document) {
  return new Promise((resolve, reject) => {
    // Placeholder for IndexedDB save operation
    chrome.storage.local.get(['documents'], (result) => {
      const documents = result.documents || [];
      documents.push({ ...document, timestamp: Date.now() });
      chrome.storage.local.set({ documents }, () => {
        resolve({ success: true, id: documents.length });
      });
    });
  });
}

async function getFromIndexedDB() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['documents'], (result) => {
      resolve({ documents: result.documents || [] });
    });
  });
}

// Handle notifications
function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: '../assets/icon128.png',
    title: title,
    message: message
  });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkAICapabilities,
    processWithGeminiNano,
    saveToIndexedDB,
    getFromIndexedDB
  };
}

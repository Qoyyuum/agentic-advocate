// Background Service Worker for Agentic Advocate Extension

importScripts('db.js');

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

// Icon click now opens popup automatically (no handler needed)

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request.action);

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

    case 'openTab':
      // Handle tab creation from popup
      chrome.tabs.create(request.data, (tab) => {
        sendResponse({ success: true, tabId: tab.id });
      });
      return true;

    default:
      sendResponse({ error: 'Unknown action' });
  }
  return true;
});

// Check Chrome Built-in AI capabilities
async function checkAICapabilities() {
  try {
    // Service workers don't have access to window object
    // Check if AI APIs are available via self (worker global)
    if (typeof self !== 'undefined' && 'LanguageModel' in self) {
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
  try {
    const id = await self.dbManager.addDocument(document);
    return { success: true, id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function getFromIndexedDB() {
  try {
    const documents = await self.dbManager.getAllDocuments();
    return { documents };
  } catch (error) {
    return { documents: [], error: error.message };
  }
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

// ============================================
// CONTENT SCRIPT INJECTION HELPER
// ============================================

/**
 * Ensure content script is loaded in the tab before sending messages
 * Prevents "Receiving end does not exist" errors
 */
async function ensureContentScriptLoaded(tabId) {
  try {
    // First, check if tab is valid and not a chrome:// or edge:// page
    const tab = await chrome.tabs.get(tabId);

    if (!tab || !tab.url) {
      console.warn('Invalid tab or missing URL');
      return false;
    }

    // Cannot inject into chrome://, edge://, chrome-extension:// pages
    if (tab.url.startsWith('chrome://') ||
        tab.url.startsWith('edge://') ||
        tab.url.startsWith('chrome-extension://') ||
        tab.url.startsWith('about:')) {
      console.warn('Cannot inject content script into system page:', tab.url);
      return false;
    }

    // Test if content script is already loaded
    try {
      await chrome.tabs.sendMessage(tabId, { action: 'ping' });
      console.log('Content script already loaded');
      return true;
    } catch (pingError) {
      // Content script not loaded, inject it
      console.log('Content script not loaded, injecting...');

      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['scripts/content.js']
      });

      // Inject CSS as well
      await chrome.scripting.insertCSS({
        target: { tabId: tabId },
        files: ['styles/content.css']
      });

      console.log('Content script injected successfully');

      // Wait a bit for script to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    }
  } catch (error) {
    console.error('Error ensuring content script loaded:', error);
    return false;
  }
}

// ============================================
// SERVICE WORKER KEEP-ALIVE
// ============================================

/**
 * Prevent service worker from being terminated too quickly
 * V3 service workers can terminate after 30 seconds of inactivity
 */
let keepAliveInterval = null;

function startKeepAlive() {
  // Ping every 20 seconds to keep service worker alive
  keepAliveInterval = setInterval(() => {
    chrome.runtime.getPlatformInfo(() => {
      // Just accessing chrome API keeps worker alive
    });
  }, 20000);
}

function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
}

// Start keep-alive on service worker startup
startKeepAlive();

// Re-register listeners on service worker restart
chrome.runtime.onStartup.addListener(() => {
  console.log('Service worker restarted');
  startKeepAlive();
});

// Log service worker startup
console.log('Background service worker loaded successfully');

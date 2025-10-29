// Popup Script for Agentic Advocate Extension

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initPopup();
  loadChatHistory();
  loadRecentDocuments();
  checkAIStatus();
  setupEventListeners();
});

// Initialize all Lucide icons
function initIcons() {
  // Header logo icon
  document.getElementById('logoIcon').appendChild(createIcon('bot', 32));

  // Status icon
  document.getElementById('statusIcon').appendChild(createIcon('sparkles', 20));

  // Quick action icons
  document.getElementById('analyzeIcon').appendChild(createIcon('fileText', 24));
  document.getElementById('legalIcon').appendChild(createIcon('scale', 24));
  document.getElementById('taxIcon').appendChild(createIcon('dollarSign', 24));
  document.getElementById('autoFillIcon').appendChild(createIcon('penTool', 24));

  // Chat icons
  document.getElementById('chatIcon').appendChild(createIcon('messageSquare', 16));
  document.getElementById('botMessageIcon').appendChild(createIcon('bot', 16));
  document.getElementById('sendIcon').appendChild(createIcon('send', 18));

  // Documents icon
  document.getElementById('documentsIcon').appendChild(createIcon('fileText', 16));

  // Footer icons
  document.getElementById('settingsIcon').appendChild(createIcon('settings', 16));
  document.getElementById('helpIcon').appendChild(createIcon('helpCircle', 16));
  document.getElementById('infoIcon').appendChild(createIcon('info', 16));
}

// Initialize popup
function initPopup() {
  console.log('Agentic Advocate Popup Initialized');
}

// Check AI capabilities and update status
async function checkAIStatus() {
  const statusText = document.getElementById('statusText');
  const statusMode = document.getElementById('statusMode');

  try {
    chrome.runtime.sendMessage({ action: 'getAICapabilities' }, (response) => {
      if (response.available) {
        statusText.textContent = 'AI Ready';
        statusMode.textContent = `Mode: ${response.mode === 'local' ? 'Local (Gemini Nano)' : 'Remote Fallback'}`;
      } else {
        statusText.textContent = 'AI Unavailable';
        statusMode.textContent = response.message || 'Chrome Built-in AI not available';
      }
    });
  } catch (error) {
    console.error('Error checking AI status:', error);
    statusText.textContent = 'Error checking AI';
  }
}

// Setup event listeners
function setupEventListeners() {
  // Chat input
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Quick action buttons
  document.getElementById('analyzePageBtn').addEventListener('click', analyzePage);
  document.getElementById('legalReviewBtn').addEventListener('click', legalReview);
  document.getElementById('taxPlanningBtn').addEventListener('click', taxPlanning);
  document.getElementById('autoFillBtn').addEventListener('click', autoFillForm);

  // Footer links
  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  document.getElementById('helpBtn').addEventListener('click', openHelp);
  document.getElementById('aboutBtn').addEventListener('click', openAbout);
}

// Send chat message
function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value.trim();

  if (!message) return;

  // Add user message to chat
  addMessageToChat(message, 'user');
  chatInput.value = '';

  // Process with AI
  chrome.runtime.sendMessage({
    action: 'processWithAI',
    data: {
      text: message,
      taskType: 'chat'
    }
  }, (response) => {
    if (response.success) {
      addMessageToChat(response.result, 'bot');
    } else {
      addMessageToChat('Sorry, I encountered an error processing your request.', 'bot');
    }
  });

  // Save to chat history
  saveChatMessage(message, 'user');
}

// Add message to chat container
function addMessageToChat(message, type) {
  const chatContainer = document.getElementById('chatContainer');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${type}-message`;

  // Add message icon
  const iconDiv = document.createElement('div');
  iconDiv.className = 'message-icon';
  iconDiv.appendChild(createIcon(type === 'bot' ? 'bot' : 'sparkles', 16));
  messageDiv.appendChild(iconDiv);

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = message;

  messageDiv.appendChild(contentDiv);
  chatContainer.appendChild(messageDiv);

  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;

  if (type === 'bot') {
    saveChatMessage(message, 'bot');
  }
}

// Load chat history
function loadChatHistory() {
  chrome.storage.local.get(['chatHistory'], (result) => {
    const history = result.chatHistory || [];
    const chatContainer = document.getElementById('chatContainer');

    // Clear default message if there's history
    if (history.length > 0) {
      chatContainer.innerHTML = '';
    }

    // Load last 10 messages
    history.slice(-10).forEach(msg => {
      addMessageToChat(msg.text, msg.type);
    });
  });
}

// Save chat message
function saveChatMessage(message, type) {
  chrome.storage.local.get(['chatHistory'], (result) => {
    const history = result.chatHistory || [];
    history.push({
      text: message,
      type: type,
      timestamp: Date.now()
    });

    // Keep only last 100 messages
    if (history.length > 100) {
      history.shift();
    }

    chrome.storage.local.set({ chatHistory: history });
  });
}

// Load recent documents
function loadRecentDocuments() {
  chrome.runtime.sendMessage({ action: 'getDocuments' }, (response) => {
    const documentsList = document.getElementById('documentsList');

    if (response.documents && response.documents.length > 0) {
      documentsList.innerHTML = '';

      response.documents.slice(-5).reverse().forEach(doc => {
        const docItem = document.createElement('div');
        docItem.className = 'document-item';

        const docName = document.createElement('div');
        docName.className = 'document-name';
        docName.textContent = doc.name || 'Untitled Document';

        const docDate = document.createElement('div');
        docDate.className = 'document-date';
        docDate.textContent = new Date(doc.timestamp).toLocaleDateString();

        docItem.appendChild(docName);
        docItem.appendChild(docDate);
        documentsList.appendChild(docItem);

        docItem.addEventListener('click', () => openDocument(doc));
      });
    }
  });
}

// Quick action: Analyze current page
function analyzePage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'analyzePage'
    }, (response) => {
      addMessageToChat('Analyzing current page...', 'bot');
    });
  });
}

// Quick action: Legal review
function legalReview() {
  addMessageToChat('Please select text on the page or paste your legal document for review.', 'bot');
}

// Quick action: Tax planning
function taxPlanning() {
  addMessageToChat('I can help with tax planning. Please describe your situation or upload relevant documents.', 'bot');
}

// Quick action: Auto-fill form
function autoFillForm() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'autoFillDetectedForm'
    });
    addMessageToChat('Looking for forms to auto-fill on the current page...', 'bot');
  });
}

// Open document
function openDocument(doc) {
  addMessageToChat(`Opening document: ${doc.name}`, 'bot');
  // TODO: Implement document viewer
}

// Open settings page
function openSettings() {
  chrome.runtime.openOptionsPage();
}

// Open help
function openHelp() {
  chrome.tabs.create({ url: 'https://github.com/adi0900/Google_Chrome25' });
}

// Open about
function openAbout() {
  addMessageToChat('Agentic Advocate v1.0.0 - Built for Chrome AI Challenge 2025. Privacy-focused legal assistant powered by Chrome Built-in AI.', 'bot');
}

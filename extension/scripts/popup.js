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
  document.getElementById('voiceIcon').appendChild(createIcon('mic', 18));
  document.getElementById('moreIcon').appendChild(createIcon('plus', 18));
  document.getElementById('sendIcon').appendChild(createIcon('send', 18));

  // Documents icon
  document.getElementById('documentsIcon').appendChild(createIcon('fileText', 16));

  // Footer icons
  document.getElementById('teamIcon').appendChild(createIcon('users', 16));
  document.getElementById('helpIcon').appendChild(createIcon('helpCircle', 16));
  document.getElementById('githubIcon').appendChild(createIcon('github', 16));

  // Upload modal icons (initialize immediately, modal is just hidden)
  initUploadIcons();
}

// Initialize upload modal icons
function initUploadIcons() {
  const fileUploadIcon = document.getElementById('fileUploadIcon');
  const imageUploadIcon = document.getElementById('imageUploadIcon');

  if (!fileUploadIcon || !imageUploadIcon) {
    console.error('Upload icon elements not found');
    return;
  }

  // Clear and add icons
  fileUploadIcon.innerHTML = '';
  imageUploadIcon.innerHTML = '';

  fileUploadIcon.appendChild(createIcon('file', 20));
  imageUploadIcon.appendChild(createIcon('image', 20));
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
      if (response && response.available) {
        statusText.textContent = 'AI Ready';
        statusMode.textContent = `Mode: ${response.mode === 'local' ? 'Local (Gemini Nano)' : 'Remote Fallback'}`;
      } else {
        statusText.textContent = 'AI Unavailable';
        statusMode.textContent = response?.message || 'Chrome Built-in AI not available';
      }
    });
  } catch (error) {
    console.error('Error checking AI status:', error);
    statusText.textContent = 'Error checking AI';
  }
}

// Debounce helper
let sendMessageTimeout = null;
let isProcessing = false;

// Auto-expand textarea
function autoExpandTextarea(event) {
  const textarea = event ? event.target : document.getElementById('chatInput');

  // Reset height to calculate new scrollHeight
  textarea.style.height = 'auto';

  // Calculate new height (min 40px, max 150px)
  const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 150);
  textarea.style.height = newHeight + 'px';
}

// Setup event listeners
function setupEventListeners() {
  // Chat input
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const voiceBtn = document.getElementById('voiceBtn');
  const moreBtn = document.getElementById('moreBtn');

  sendBtn.addEventListener('click', () => debouncedSendMessage());
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      debouncedSendMessage();
    }
  });

  // Auto-expand textarea as user types
  chatInput.addEventListener('input', autoExpandTextarea);
  chatInput.addEventListener('focus', autoExpandTextarea);

  // Voice command button
  voiceBtn.addEventListener('click', toggleVoiceInput);

  // More button (upload)
  moreBtn.addEventListener('click', openUploadModal);

  // Upload modal
  document.getElementById('uploadCloseBtn').addEventListener('click', closeUploadModal);
  document.getElementById('fileInput').addEventListener('change', handleFileUpload);
  document.getElementById('imageInput').addEventListener('change', handleImageUpload);

  // Quick action buttons
  document.getElementById('analyzePageBtn').addEventListener('click', analyzePage);
  document.getElementById('legalReviewBtn').addEventListener('click', legalReview);
  document.getElementById('taxPlanningBtn').addEventListener('click', taxPlanning);
  document.getElementById('autoFillBtn').addEventListener('click', autoFillForm);

  // Footer links
  document.getElementById('teamBtn').addEventListener('click', openTeam);
  document.getElementById('helpBtn').addEventListener('click', openHelp);
  document.getElementById('githubBtn').addEventListener('click', openGithub);
}

// Debounced send message to prevent rapid multiple AI responses
function debouncedSendMessage() {
  if (isProcessing) return;

  clearTimeout(sendMessageTimeout);
  sendMessageTimeout = setTimeout(() => {
    sendMessage();
  }, 300);
}

// Send chat message
function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value.trim();

  if (!message || isProcessing) return;

  // Set processing flag
  isProcessing = true;

  // Add user message to chat
  addMessageToChat(message, 'user');
  chatInput.value = '';

  // Reset textarea height
  chatInput.style.height = 'auto';

  // Save to chat history
  saveChatMessage(message, 'user');

  // Process with AI
  chrome.runtime.sendMessage({
    action: 'processWithAI',
    data: {
      text: message,
      taskType: 'chat'
    }
  }, (response) => {
    if (response && response.success) {
      addMessageToChat(response.result, 'bot');
    } else {
      addMessageToChat('Sorry, I encountered an error processing your request.', 'bot');
    }

    // Reset processing flag
    isProcessing = false;
  });
}

// Add message to chat container
function addMessageToChat(message, type, shouldSave = true) {
  const chatContainer = document.getElementById('chatContainer');

  // Limit to 5 messages - remove oldest if exceeding
  const messages = chatContainer.querySelectorAll('.chat-message');
  if (messages.length >= 5) {
    chatContainer.removeChild(messages[0]);
  }

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

  // Smooth scroll to bottom
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: 'smooth'
  });

  if (type === 'bot' && shouldSave) {
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

    // Load last 5 messages only (limit to 3-5 chat bubbles)
    history.slice(-5).forEach(msg => {
      addMessageToChat(msg.text, msg.type, false);
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

    if (response && response.documents && response.documents.length > 0) {
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

// Open team page
function openTeam() {
  chrome.tabs.create({ url: 'https://github.com/adi0900' });
}

// Open help
function openHelp() {
  chrome.runtime.openOptionsPage();
}

// Open Github repo
function openGithub() {
  chrome.tabs.create({ url: 'https://github.com/adi0900/Google_Chrome25' });
}

// ============================================
// VOICE INPUT & FILE UPLOAD
// ============================================

let recognition = null;
let isListening = false;

// Toggle voice input
function toggleVoiceInput() {
  const voiceBtn = document.getElementById('voiceBtn');

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    addMessageToChat('Voice recognition is not supported in your browser.', 'bot');
    return;
  }

  if (isListening) {
    stopVoiceInput();
  } else {
    startVoiceInput();
  }
}

// Start voice recognition
function startVoiceInput() {
  const voiceBtn = document.getElementById('voiceBtn');
  const chatInput = document.getElementById('chatInput');

  // Create speech recognition instance
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    isListening = true;
    voiceBtn.classList.add('active');
    chatInput.placeholder = 'Listening...';
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    chatInput.value = transcript;
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    stopVoiceInput();
    addMessageToChat('Voice recognition error. Please try again.', 'bot');
  };

  recognition.onend = () => {
    stopVoiceInput();
  };

  recognition.start();
}

// Stop voice recognition
function stopVoiceInput() {
  const voiceBtn = document.getElementById('voiceBtn');
  const chatInput = document.getElementById('chatInput');

  if (recognition) {
    recognition.stop();
    recognition = null;
  }

  isListening = false;
  voiceBtn.classList.remove('active');
  chatInput.placeholder = 'Ask me anything about legal, compliance, or tax matters...';
}

// Open upload modal
function openUploadModal() {
  const modal = document.getElementById('uploadModal');

  // Ensure icons are loaded
  initUploadIcons();

  modal.classList.add('show');
}

// Close upload modal
function closeUploadModal() {
  const modal = document.getElementById('uploadModal');
  modal.classList.remove('show');
}

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  closeUploadModal();

  // Show upload in chat
  addMessageToChat(`📄 Uploaded: ${file.name}`, 'user');

  // Read file content
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;

    // Send to AI for processing
    chrome.runtime.sendMessage({
      action: 'processWithAI',
      data: {
        text: `Analyze this document:\n\nFilename: ${file.name}\nContent: ${content.substring(0, 5000)}...`,
        taskType: 'document_analysis'
      }
    }, (response) => {
      if (response && response.success) {
        addMessageToChat(response.result, 'bot');
      } else {
        addMessageToChat('Error processing document. Please try again.', 'bot');
      }
    });
  };

  reader.onerror = () => {
    addMessageToChat('Error reading file. Please try again.', 'bot');
  };

  reader.readAsText(file);
  event.target.value = ''; // Reset input
}

// Handle image upload
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  closeUploadModal();

  // Show upload in chat
  addMessageToChat(`🖼️ Uploaded image: ${file.name}`, 'user');

  // Read image as data URL
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageData = e.target.result;

    // For now, just confirm upload (actual OCR/vision would require external API)
    addMessageToChat('Image uploaded successfully. Image analysis feature coming soon!', 'bot');

    // TODO: Integrate with image analysis API
    // chrome.runtime.sendMessage({
    //   action: 'analyzeImage',
    //   data: { image: imageData, filename: file.name }
    // }, callback);
  };

  reader.onerror = () => {
    addMessageToChat('Error reading image. Please try again.', 'bot');
  };

  reader.readAsDataURL(file);
  event.target.value = ''; // Reset input
}

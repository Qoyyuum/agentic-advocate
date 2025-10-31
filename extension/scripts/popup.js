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

  // Theme toggle icon - initialize based on current theme
  const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
  const themeIconName = currentTheme === 'dark' ? 'moon' : 'sun';
  document.getElementById('themeIcon').appendChild(createIcon(themeIconName, 18));

  // Status icon
  document.getElementById('statusIcon').appendChild(createIcon('sparkles', 20));

  // Chat icons
  document.getElementById('chatIcon').appendChild(createIcon('messageSquare', 16));
  document.getElementById('botMessageIcon').appendChild(createIcon('bot', 16));
  document.getElementById('voiceIcon').appendChild(createIcon('mic', 18));
  document.getElementById('moreIcon').appendChild(createIcon('moreHorizontal', 18));
  document.getElementById('sendIcon').appendChild(createIcon('send', 18));

  // Chat quick action icons - Analyze Page & Legal Summarizer
  document.getElementById('analyzePageIcon').appendChild(createIcon('search', 18));
  document.getElementById('legalDocumenterIcon').appendChild(createIcon('scale', 18));

  // Document summary icons
  document.getElementById('summaryIcon').appendChild(createIcon('fileText', 16));
  document.getElementById('summaryCloseIcon').appendChild(createIcon('x', 14));

  // Documents icon
  document.getElementById('documentsIcon').appendChild(createIcon('fileText', 16));

  // Footer icons
  document.getElementById('configIcon').appendChild(createIcon('settings', 16));
  document.getElementById('teamIcon').appendChild(createIcon('users', 16));
  document.getElementById('helpIcon').appendChild(createIcon('helpCircle', 16));
  document.getElementById('githubIcon').appendChild(createIcon('github', 16));

  // Upload modal icons (initialize immediately, modal is just hidden)
  initUploadIcons();

  // Config modal icons
  initConfigIcons();
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

// Initialize config modal icons
function initConfigIcons() {
  const configCloseIcon = document.getElementById('configCloseIcon');
  const apiKeyToggleIcon = document.getElementById('apiKeyToggleIcon');

  if (configCloseIcon) {
    configCloseIcon.appendChild(createIcon('x', 16));
  }

  if (apiKeyToggleIcon) {
    apiKeyToggleIcon.appendChild(createIcon('eye', 16));
  }
}

// Initialize popup
function initPopup() {
  console.log('Agentic Advocate Popup Initialized');
  // Initialize theme from storage
  chrome.storage.local.get(['theme'], (result) => {
    const savedTheme = result.theme || 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
  });

  // Load configuration from storage
  loadConfiguration();
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

// Toggle theme between light and dark
function toggleTheme() {
  const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Apply theme
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(newTheme);
  
  // Update theme icon
  const themeIcon = document.getElementById('themeIcon');
  themeIcon.innerHTML = '';
  const icon = newTheme === 'dark' ? 
    createIcon('moon', 18) : 
    createIcon('sun', 18);
  themeIcon.appendChild(icon);
  
  // Save preference to storage
  chrome.storage.local.set({ theme: newTheme });
}

// Initialize theme from storage
function initializeTheme() {
  chrome.storage.local.get(['theme'], (result) => {
    const savedTheme = result.theme || 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
    
    // Update theme icon
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.innerHTML = '';
      const icon = savedTheme === 'dark' ? 
        createIcon('moon', 18) : 
        createIcon('sun', 18);
      themeIcon.appendChild(icon);
    }
  });
}

// Open configuration modal
function openConfigModal() {
  document.getElementById('configModal').classList.add('active');
  
  // Load saved configuration
  chrome.storage.local.get(['apiChoice', 'apiKey', 'language'], (result) => {
    if (result.apiChoice) {
      document.getElementById('apiChoice').value = result.apiChoice;
    }
    // Don't populate API key for security reasons
    if (result.language) {
      document.getElementById('language').value = result.language;
    }
  });
}

// Close configuration modal
function closeConfigModal() {
  document.getElementById('configModal').classList.remove('active');
}

// Save configuration
function saveConfiguration() {
  const config = {
    apiChoice: document.getElementById('apiChoice').value,
    // Don't save the API key in plain text - this is just a placeholder
    // In a real implementation, API keys would need to be securely handled
    language: document.getElementById('language').value
  };
  
  chrome.storage.local.set(config, () => {
    closeConfigModal();
    showStatusMessage('Configuration saved successfully!', 'success');
  });
}

// Show status message
function showStatusMessage(message, type = 'info') {
  // Create status message element
  const statusMsg = document.createElement('div');
  statusMsg.className = `status-message ${type}`;
  statusMsg.textContent = message;
  statusMsg.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    background: ${type === 'success' ? 'rgba(0, 200, 100, 0.9)' : 'rgba(255, 159, 67, 0.9)'};
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    font-weight: 500;
    animation: fadeInOut 3s ease-in-out;
  `;

  document.body.appendChild(statusMsg);

  // Remove message after 3 seconds
  setTimeout(() => {
    if (statusMsg.parentNode) {
      statusMsg.parentNode.removeChild(statusMsg);
    }
  }, 3000);
}

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
  // Theme toggle
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  themeToggleBtn.addEventListener('click', toggleTheme);
  themeToggleBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  });

  // Chat input
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const voiceBtn = document.getElementById('voiceBtn');
  const moreBtn = document.getElementById('moreBtn');

  sendBtn.addEventListener('click', () => sendMessage());
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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

  // Chat quick action buttons - Analyze Page & Legal Summarizer
  document.getElementById('analyzePageBtn').addEventListener('click', analyzePage);

  const legalDocumenterBtn = document.getElementById('legalDocumenterBtn');
  legalDocumenterBtn.addEventListener('click', legalDocumenter);
  legalDocumenterBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      legalDocumenter();
    }
  });

  // Document summary close button
  const summaryCloseBtn = document.getElementById('summaryCloseBtn');
  if (summaryCloseBtn) {
    summaryCloseBtn.addEventListener('click', closeSummary);
    summaryCloseBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeSummary();
      }
    });
  }

  // Configuration modal
  document.getElementById('configBtn').addEventListener('click', openConfigModal);
  document.getElementById('configCloseBtn').addEventListener('click', closeConfigModal);
  document.getElementById('configCancelBtn').addEventListener('click', closeConfigModal);
  document.getElementById('configSaveBtn').addEventListener('click', saveConfiguration);

  document.getElementById('teamBtn').addEventListener('click', openTeam);
  document.getElementById('helpBtn').addEventListener('click', openHelp);
  document.getElementById('githubBtn').addEventListener('click', openGithub);
  // API key toggle
  document.getElementById('apiKeyToggle').addEventListener('click', toggleApiKeyVisibility);

  // Close modals on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeUploadModal();
      closeConfigModal();
    }
  });

  // Close modals when clicking outside
  document.getElementById('configModal').addEventListener('click', (e) => {
    if (e.target.id === 'configModal') {
      closeConfigModal();
    }
  });
}

// Debounce helper
let sendMessageTimeout = null;
let isProcessing = false;
let legalDocumenterActive = false;

// Auto-expand textarea
function autoExpandTextarea(event) {
  const textarea = event ? event.target : document.getElementById('chatInput');

  // Reset height to calculate new scrollHeight
  textarea.style.height = 'auto';

  // Calculate new height (min 40px, max 150px)
  const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 150);
  textarea.style.height = newHeight + 'px';
}

async function detectLanguage(message) {
  if ('LanguageDetector' in self) {
    const detector = await LanguageDetector.create({
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Downloaded ${e.loaded * 100}%`);
        });
      },
    });
    const results = await detector.detect(message);
    return results[0].detectedLanguage;
  }
  else {
    console.log('LanguageDetector not available');
    return 'en';
  }
}

async function translateLanguage(sourcelanguage, message) {
  const myconfiglanguage = await chrome.storage.local.get('language');
  if (sourcelanguage === myconfiglanguage.language) {
    return message;
  }

  if (!('Translator' in self)) {
    console.log('Translator not available');
    return message;
  }

  const translator = await Translator.create({
    sourceLanguage: sourcelanguage,
    targetLanguage: myconfiglanguage.language,
    monitor(m) {
      m.addEventListener('downloadprogress', (e) => {
        console.log(`Downloaded ${e.loaded * 100}%`);
      });
    },
  });  

  const result = await translator.translate(message);
  return result;
}

// Send chat message
async function sendMessage(message) {
  const chatInput = document.getElementById('chatInput');
  if (!message) {
     message = chatInput.value.trim();
  }

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
  
  // If Legal Documenter is active, use user's message as Writer input and save file
  if (legalDocumenterActive) {
    try {
      // Request save location immediately to preserve user gesture
      if (!('showSaveFilePicker' in window)) {
        addMessageToChat('File System Access API is not supported in this context.', 'bot');
        // turn off mode and UI, then exit
        legalDocumenterActive = false;
        const legalBtnEarly = document.getElementById('legalDocumenterBtn');
        if (legalBtnEarly) legalBtnEarly.classList.remove('active');
        isProcessing = false;
        return;
      }

      const nowIso = new Date().toISOString();
      const datePart = nowIso.split('T')[0].replace(/-/g, '');
      const timePart = nowIso.split('T')[1].split('.')[0];
      const handle = await window.showSaveFilePicker({
        suggestedName: `legal-document-${datePart}-${timePart}.txt`,
        types: [
          { description: 'Text Files', accept: { 'text/plain': ['.txt'] } },
        ],
      });

      // Safe to await other async work after picker
      const myconfiglanguage = await chrome.storage.local.get('language');

      const writerOptions = {
        sharedContext: 'Agentic Advocate legal document generator.',
        tone: 'formal',
        format: 'plain-text',
        length: 'long',
        outputLanguage: myconfiglanguage.language,
      };

      const writerAvailability = await Writer.availability();
      let writer;
      if (writerAvailability === 'unavailable') {
        addMessageToChat('Writer API is not available.', 'bot');
      } else if (writerAvailability === 'available') {
        writer = await Writer.create(writerOptions);
      } else {
        writer = await Writer.create({
          ...writerOptions,
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              console.log(`Downloaded ${e.loaded * 100}%`);
            });
          }
        });
      }

      if (writer) {
        addMessageToChat('Generating legal document. Please wait...', 'bot');
        const legalDocumenterContent = await writer.write(
          message,
          {
            context: 'Act as a legal documenter. Generate a clear, formal legal document based on the user\'s prompt.'
          }
        );

        const writable = await handle.createWritable();
        await writable.write(legalDocumenterContent);
        await writable.close();

        addMessageToChat('Saved legal document to your chosen location.', 'bot');
      }
    } catch (err) {
      if (err && err.name === 'AbortError') {
        addMessageToChat('Save canceled.', 'bot');
      } else {
        console.error('Legal Documenter error:', err);
        addMessageToChat('Failed to generate or save the legal document.', 'bot');
      }
    } finally {
      // turn off mode and update UI
      legalDocumenterActive = false;
      const legalBtn = document.getElementById('legalDocumenterBtn');
      if (legalBtn) legalBtn.classList.remove('active');
      isProcessing = false;
    }
    return;
  }

  // Process with AI (normal chat flow)
  const { defaultTemperature, maxTemperature, defaultTopK, maxTopK } = await LanguageModel.params();

  const available = await LanguageModel.availability();
  const myconfiglanguage = await chrome.storage.local.get('language');
  if (available !== 'unavailable') {
    const session = await LanguageModel.create({
       initialPrompts: [
        { role: 'system', content: 'You are Agentic Advocate, a helpful and friendly legal assistant advising the user on legal jargons and whether the content that they are reading is safe or risky to the user. Keep your responses formal and professional whilst keeping it short and simple for the user to understand like they are non-legal professionals.' },
    ],
    expectedInputs: [
      { type: 'text' },
      { type: 'image' },
      { type: 'audio' },
    ],
    expectedOutputs: [
      { type: 'text', language: [myconfiglanguage.language] },
    ],
    });
    
    const sourcelanguage = await detectLanguage(message);
    const translatedmessage = await translateLanguage(sourcelanguage, message);


    // Prompt the model 
    const stream = await session.prompt([{ role: 'user', content: translatedmessage }]);
    addMessageToChat(stream, 'bot');
  }
  // Reset processing flag
  isProcessing = false;
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
async function analyzePage() {
  addMessageToChat('Analyzing current page...', 'bot');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab) {
      addMessageToChat('No active tab found.', 'bot');
      return;
    }
    console.log(tab.id);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const clean = (text) => {
          if (!text) return '';
          return text
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n\n')
            .trim();
        };

        const selectors = [
          'article',
          '[role="main"]',
          '.content',
          '.post-content',
          '.entry-content',
          '.article-content',
          'main'
        ];

        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (el) {
            const txt = el.innerText || el.textContent || '';
            return clean(txt).slice(0, 2000);
          }
        }

        const bodyTxt = (document.body && (document.body.innerText || document.body.textContent)) || '';
        return clean(bodyTxt).slice(0, 2000);
      }
    }, (results) => {
      if (results && results[0] && results[0].result) {
        const content = results[0].result;
        sendMessage(content);
      } else {
        addMessageToChat('Failed to capture page content.', 'bot');
      }
    });
  });
}

// Quick action: Legal Documenter (toggle mode to use next chat input)
async function legalDocumenter() {
  const btn = document.getElementById('legalDocumenterBtn');
  legalDocumenterActive = !legalDocumenterActive;
  if (btn) btn.classList.toggle('active', legalDocumenterActive);

  if (legalDocumenterActive) {
    addMessageToChat('Legal Documenter enabled. Send your prompt in chat and I will generate a document and prompt you to save it.', 'bot');
  } else {
    addMessageToChat('Legal Documenter disabled.', 'bot');
  }
}


// Open team page
function openTeam() {
  chrome.tabs.create({ url: 'https://github.com/Qoyyuum' });
}

// Open help
function openHelp() {
  chrome.runtime.openOptionsPage();
}

// Open Github repo
function openGithub() {
  chrome.tabs.create({ url: 'https://github.com/Qoyyuum/agentic-advocate' });
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
        // Show document summary
        showSummary(response.result);
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

// ============================================
// THEME SWITCHING
// ============================================

// Toggle theme between light and dark
function toggleTheme() {
  const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  // Apply theme with smooth transition
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(newTheme);

  // Update theme icon
  const themeIcon = document.getElementById('themeIcon');
  themeIcon.innerHTML = '';
  const iconName = newTheme === 'dark' ? 'moon' : 'sun';
  themeIcon.appendChild(createIcon(iconName, 18));

  // Save preference to storage
  chrome.storage.local.set({ theme: newTheme });
}

// ============================================
// DOCUMENT SUMMARY
// ============================================

// Show document summary
function showSummary(summary) {
  const summaryElement = document.getElementById('documentSummary');
  const summaryContent = document.getElementById('summaryContent');

  summaryContent.innerHTML = `<p>${summary}</p>`;
  summaryElement.style.display = 'block';
}

// Close document summary
function closeSummary() {
  const summaryElement = document.getElementById('documentSummary');
  summaryElement.style.display = 'none';
}

// ============================================
// CONFIGURATION MODAL
// ============================================

// Open configuration modal
function openConfigModal() {
  console.log("Open Config Modal")
  const modal = document.getElementById('configModal');
  modal.classList.add('show');

  // Set focus to first input for accessibility
  setTimeout(() => {
    document.getElementById('apiChoice').focus();
  }, 100);
}

// Close configuration modal
function closeConfigModal() {
  const modal = document.getElementById('configModal');
  modal.classList.remove('show');
}

// Load configuration from storage
function loadConfiguration() {
  chrome.storage.local.get(['apiChoice', 'apiKey', 'language'], (result) => {
    if (result.apiChoice) {
      document.getElementById('apiChoice').value = result.apiChoice;
    }
    // Don't populate API key for security
    if (result.language) {
      document.getElementById('languageChoice').value = result.language;
    }
  });
}

// Save configuration
function saveConfiguration() {
  const apiChoice = document.getElementById('apiChoice').value;
  const apiKey = document.getElementById('apiKey').value;
  const language = document.getElementById('languageChoice').value;

  // Validate inputs
  if (!apiChoice) {
    showStatusMessage('Please select an AI provider', 'error');
    return;
  }

  // Save to storage (API key should be encrypted in production)
  chrome.storage.local.set({
    apiChoice: apiChoice,
    apiKey: apiKey, // In production, encrypt this
    language: language
  }, () => {
    showStatusMessage('Configuration saved successfully!', 'success');
    closeConfigModal();

    // Update any UI elements that depend on language
    // This is a placeholder for future internationalization
    console.log('Language set to:', language);
  });
}

// Toggle API key visibility
function toggleApiKeyVisibility() {
  const apiKeyInput = document.getElementById('apiKey');
  const toggleIcon = document.getElementById('apiKeyToggleIcon');

  if (apiKeyInput.type === 'password') {
    apiKeyInput.type = 'text';
    toggleIcon.innerHTML = '';
    toggleIcon.appendChild(createIcon('eyeOff', 16));
  } else {
    apiKeyInput.type = 'password';
    toggleIcon.innerHTML = '';
    toggleIcon.appendChild(createIcon('eye', 16));
  }
}

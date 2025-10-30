// Options Page Script for Agentic Advocate Extension

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  loadSettings();
  setupEventListeners();
});

// Initialize all Lucide icons
function initIcons() {
  // Header icon
  document.getElementById('headerIcon').appendChild(createIcon('settings', 40));

  // Section icons
  document.getElementById('aiIcon').appendChild(createIcon('bot', 24));
  document.getElementById('privacyIcon').appendChild(createIcon('shield', 24));
  document.getElementById('featuresIcon').appendChild(createIcon('zap', 24));
  document.getElementById('userIcon').appendChild(createIcon('sparkles', 24));
  document.getElementById('aboutIcon').appendChild(createIcon('info', 24));

  // Checkbox icons (check marks)
  document.getElementById('aiCheckIcon').appendChild(createIcon('checkCircle', 16));
  document.getElementById('storageCheckIcon').appendChild(createIcon('checkCircle', 16));
  document.getElementById('chatCheckIcon').appendChild(createIcon('checkCircle', 16));
  document.getElementById('legalCheckIcon').appendChild(createIcon('checkCircle', 16));
  document.getElementById('taxCheckIcon').appendChild(createIcon('checkCircle', 16));
  document.getElementById('autoFillCheckIcon').appendChild(createIcon('checkCircle', 16));
  document.getElementById('highlightCheckIcon').appendChild(createIcon('checkCircle', 16));

  // Button icons
  document.getElementById('clearIcon').appendChild(createIcon('x', 16));
  document.getElementById('saveIcon').appendChild(createIcon('download', 16));
  document.getElementById('resetIcon').appendChild(createIcon('upload', 16));

  // About link icons
  document.getElementById('githubIcon').appendChild(createIcon('code', 16));
  document.getElementById('privacyLinkIcon').appendChild(createIcon('shield', 16));
  document.getElementById('licenseLinkIcon').appendChild(createIcon('fileText', 16));
}

// Load saved settings
function loadSettings() {
  chrome.storage.local.get([
    'aiMode',
    'enableAI',
    'localStorage',
    'saveChatHistory',
    'legalWorkflows',
    'taxPlanning',
    'autoFill',
    'highlightTerms',
    'userPreferences'
  ], (result) => {
    // AI Settings
    document.getElementById('aiMode').value = result.aiMode || 'local';
    document.getElementById('enableAI').checked = result.enableAI !== false;

    // Privacy Settings
    document.getElementById('localStorage').checked = result.localStorage !== false;
    document.getElementById('saveChatHistory').checked = result.saveChatHistory !== false;

    // Feature Settings
    document.getElementById('legalWorkflows').checked = result.legalWorkflows !== false;
    document.getElementById('taxPlanning').checked = result.taxPlanning !== false;
    document.getElementById('autoFill').checked = result.autoFill !== false;
    document.getElementById('highlightTerms').checked = result.highlightTerms || false;

    // User Information
    const prefs = result.userPreferences || {};
    document.getElementById('fullName').value = prefs.fullName || '';
    document.getElementById('email').value = prefs.email || '';
    document.getElementById('phone').value = prefs.phone || '';
    document.getElementById('address').value = prefs.address || '';
  });
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('saveBtn').addEventListener('click', saveSettings);
  document.getElementById('resetBtn').addEventListener('click', resetSettings);
  document.getElementById('clearDataBtn').addEventListener('click', clearAllData);
}

// Save settings
function saveSettings() {
  const settings = {
    aiMode: document.getElementById('aiMode').value,
    enableAI: document.getElementById('enableAI').checked,
    localStorage: document.getElementById('localStorage').checked,
    saveChatHistory: document.getElementById('saveChatHistory').checked,
    legalWorkflows: document.getElementById('legalWorkflows').checked,
    taxPlanning: document.getElementById('taxPlanning').checked,
    autoFill: document.getElementById('autoFill').checked,
    highlightTerms: document.getElementById('highlightTerms').checked,
    userPreferences: {
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value
    }
  };

  chrome.storage.local.set(settings, () => {
    showStatusMessage('Settings saved successfully!', 'success');
  });
}

// Reset to default settings
function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    const defaults = {
      aiMode: 'local',
      enableAI: true,
      localStorage: true,
      saveChatHistory: true,
      legalWorkflows: true,
      taxPlanning: true,
      autoFill: true,
      highlightTerms: false,
      userPreferences: {
        fullName: '',
        email: '',
        phone: '',
        address: ''
      }
    };

    chrome.storage.local.set(defaults, () => {
      loadSettings();
      showStatusMessage('Settings reset to defaults', 'success');
    });
  }
}

// Clear all data
function clearAllData() {
  if (confirm('Are you sure you want to clear all stored data? This action cannot be undone.')) {
    chrome.storage.local.clear(() => {
      // Also clear IndexedDB
      const request = indexedDB.deleteDatabase('AgenticAdvocateDB');

      request.onsuccess = () => {
        showStatusMessage('All data cleared successfully', 'success');
        setTimeout(() => {
          loadSettings();
        }, 1000);
      };

      request.onerror = () => {
        showStatusMessage('Error clearing data', 'error');
      };
    });
  }
}

// Show status message
function showStatusMessage(message, type) {
  const statusElement = document.getElementById('statusMessage');
  statusElement.textContent = message;
  statusElement.className = `status-message show ${type}`;

  setTimeout(() => {
    statusElement.classList.remove('show');
  }, 3000);
}

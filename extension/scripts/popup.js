/**
 * @fileoverview Popup Script for Agentic Advocate Extension.
 * Refactored for testability by separating DOM manipulation from Chrome API interactions.
 */

// ===================================================================================
// DOM & UI Helper Functions (No `chrome` API dependency)
// These can be tested in a JSDOM environment without mocking chrome APIs.
// ===================================================================================

/**
 * Creates a Lucide icon element.
 * @param {string} iconName - The name of the Lucide icon.
 * @param {number} size - The size of the icon in pixels.
 * @returns {HTMLElement} The icon element.
 */
function createIcon(iconName, size) {
  const icon = document.createElement('i');
  icon.setAttribute('data-lucide', iconName);
  icon.setAttribute('width', String(size));
  icon.setAttribute('height', String(size));
  return icon;
}

/**
 * Sets an icon in a container element, clearing it first.
 * @param {string} elementId - The ID of the container element.
 * @param {string} iconName - The name of the Lucide icon.
 * @param {number} size - The size of the icon.
 */
function setIcon(elementId, iconName, size) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '';
    element.appendChild(createIcon(iconName, size));
  } else {
    console.warn(`Element with ID '${elementId}' not found for icon setting.`);
  }
}

/**
 * Initializes all Lucide icons in the popup.
 */
function initIcons() {
  // Header
  setIcon('logoIcon', 'bot', 32);
  setIcon('statusIcon', 'sparkles', 20);

  // Chat
  setIcon('chatIcon', 'messageSquare', 16);
  setIcon('botMessageIcon', 'bot', 16);
  setIcon('voiceIcon', 'mic', 18);
  setIcon('moreIcon', 'moreHorizontal', 18);
  setIcon('sendIcon', 'send', 18);
  setIcon('analyzePageIcon', 'search', 18);
  setIcon('legalSummarizerIcon', 'scale', 18);

  // Documents
  setIcon('summaryIcon', 'fileText', 16);
  setIcon('summaryCloseIcon', 'x', 14);
  setIcon('documentsIcon', 'fileText', 16);
  setIcon('docGenIcon', 'fileText', 16);

  // Footer
  setIcon('configIcon', 'settings', 16);
  setIcon('teamIcon', 'users', 16);
  setIcon('helpIcon', 'helpCircle', 16);
  setIcon('githubIcon', 'github', 16);

  // Modals
  setIcon('fileUploadIcon', 'file', 20);
  setIcon('imageUploadIcon', 'image', 20);
  setIcon('configCloseIcon', 'x', 16);
  setIcon('apiKeyToggleIcon', 'eye', 16);

  // Finalize icon creation
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/**
 * Updates the theme toggle icon based on the current theme.
 * @param {('light' | 'dark')} theme - The current theme.
 */
function updateThemeUI(theme) {
  const iconName = theme === 'dark' ? 'moon' : 'sun';
  setIcon('themeIcon', iconName, 18);
}

/**
 * Updates the AI status UI elements.
 * @param {{available: boolean, mode?: string, message?: string}} status - The AI status object.
 */
function updateStatusUI(status) {
  const statusText = document.getElementById('statusText');
  const statusMode = document.getElementById('statusMode');
  if (!statusText || !statusMode) return;

  if (status.available) {
    statusText.textContent = 'AI Ready';
    statusMode.textContent = `Mode: ${status.mode === 'local' ? 'Local (Gemini Nano)' : 'Remote Fallback'}`;
  } else {
    statusText.textContent = 'AI Unavailable';
    statusMode.textContent = status.message || 'Could not determine AI status.';
  }
}

/**
 * Opens the configuration modal.
 */
function openConfigModal() {
  const modal = document.getElementById('configModal');
  if (modal) modal.classList.add('active');
}

/**
 * Closes the configuration modal.
 */
function closeConfigModal() {
  const modal = document.getElementById('configModal');
  if (modal) modal.classList.remove('active');
}

// ===================================================================================
// Popup Manager Factory (Handles `chrome` API interactions)
// This factory allows injecting a mock `chrome` object for testing.
// ===================================================================================

const createPopupManager = (chromeAPI) => ({
  /**
   * Initializes the popup: loads theme, checks status, and sets up listeners.
   */
  init() {
    this.initializeTheme();
    initIcons();
    this.checkAIStatus();
    // loadChatHistory(); // Assuming these are defined elsewhere
    // loadRecentDocuments(); // or will be refactored similarly.
    this.setupEventListeners();
  },

  /**
   * Loads the theme from storage and applies it to the UI.
   */
  initializeTheme() {
    chromeAPI.storage.local.get(['theme'], (result) => {
      const savedTheme = result.theme || 'dark';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(savedTheme);
      updateThemeUI(savedTheme);
    });
  },

  /**
   * Toggles the theme, updates the UI, and saves the preference.
   */
  toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    updateThemeUI(newTheme);

    chromeAPI.storage.local.set({ theme: newTheme });
  },

  /**
   * Checks AI capabilities via background script and updates the UI.
   */
  checkAIStatus() {
    updateStatusUI({ available: false, message: 'Checking AI...' }); // Initial loading state
    chromeAPI.runtime.sendMessage({ action: 'getAICapabilities' }, (response) => {
      if (chromeAPI.runtime.lastError) {
        console.error('Error checking AI status:', chromeAPI.runtime.lastError.message);
        updateStatusUI({ available: false, message: 'Error checking AI status.' });
        return;
      }
      updateStatusUI(response || { available: false, message: 'No response from background.' });
    });
  },

  /**
   * Loads configuration from storage and populates the config modal.
   */
  loadConfiguration() {
    chromeAPI.storage.local.get(['apiChoice', 'apiKey', 'language'], (result) => {
      if (result.apiChoice) {
        const choiceEl = document.getElementById('apiChoice');
        if (choiceEl) choiceEl.value = result.apiChoice;
      }
      // ... and so on for other configuration elements
    });
  },

  /**
   * Sets up all event listeners for the popup UI.
   */
  setupEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    const configButton = document.getElementById('configIcon');
    if (configButton) {
      configButton.addEventListener('click', () => {
        openConfigModal();
        this.loadConfiguration();
      });
    }

    const configCloseButton = document.getElementById('configCloseIcon');
    if(configCloseButton) {
      configCloseButton.addEventListener('click', closeConfigModal);
    }

    // Add other event listeners here...
  },
});

// ===================================================================================
// Main Execution Block
// ===================================================================================

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure the script runs only in the extension environment with the `chrome` API.
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      const popupManager = createPopupManager(chrome);
      popupManager.init();
    } else {
      console.error('Chrome API not found. Script must be run in an extension.');
    }
  });
}

// Export for testing in a Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createIcon, initIcons, updateThemeUI, updateStatusUI, createPopupManager };
}
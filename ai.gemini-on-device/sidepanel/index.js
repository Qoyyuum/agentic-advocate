/* Agentic Advocate - Legal AI Assistant Side Panel */
/* global chrome */

import DOMPurify from 'dompurify';
import { marked } from 'marked';

// DOM Elements
const elements = {
  // Status and AI
  statusText: document.querySelector('#status-text'),
  statusDot: document.querySelector('#status-dot'),
  
  // Task Selection
  taskButtons: document.querySelectorAll('.task-btn'),
  
  // Content Capture
  captureSelection: document.querySelector('#capture-selection'),
  capturePage: document.querySelector('#capture-page'),
  detectForms: document.querySelector('#detect-forms'),
  capturedContent: document.querySelector('#captured-content'),
  contentPreview: document.querySelector('#content-preview'),
  clearContent: document.querySelector('#clear-content'),
  
  // Input and Controls
  inputPrompt: document.querySelector('#input-prompt'),
  sliderTemperature: document.querySelector('#temperature'),
  sliderTopK: document.querySelector('#top-k'),
  labelTemperature: document.querySelector('#label-temperature'),
  labelTopK: document.querySelector('#label-top-k'),
  
  // Actions
  buttonProcess: document.querySelector('#button-process'),
  buttonReset: document.querySelector('#button-reset'),
  processIcon: document.querySelector('#process-icon'),
  processText: document.querySelector('#process-text'),
  
  // Response
  loading: document.querySelector('#loading'),
  response: document.querySelector('#response'),
  responseContent: document.querySelector('#response-content'),
  error: document.querySelector('#error'),
  errorContent: document.querySelector('#error-content'),
  
  // Response Actions
  copyResponse: document.querySelector('#copy-response'),
  saveResponse: document.querySelector('#save-response'),
  exportResponse: document.querySelector('#export-response'),
  retryRequest: document.querySelector('#retry-request'),
  reportError: document.querySelector('#report-error'),
  
  // Forms and Quick Actions
  formsSection: document.querySelector('#forms-section'),
  detectedForms: document.querySelector('#detected-forms'),
  quickActions: document.querySelectorAll('.quick-action')
};

// Application State
let currentTask = null;
let capturedText = '';
let lastResponse = '';
let currentRequest = null;

// Initialize Application
async function initializeApp() {
  console.log('Initializing Agentic Advocate...');
  
  // Check AI Status
  await checkAIStatus();
  
  // Setup Event Listeners
  setupEventListeners();
  
  // Initialize UI State
  initializeUIState();
  
  // Load any saved state
  await loadSavedState();
  
  console.log('Agentic Advocate initialized successfully');
}

// Check AI Availability
async function checkAIStatus() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getAIStatus' });
    
    if (response?.success) {
      const { status } = response;
      updateStatusIndicator(status);
    } else {
      updateStatusIndicator({ available: false, error: 'Status check failed' });
    }
  } catch (error) {
    console.error('Failed to check AI status:', error);
    updateStatusIndicator({ available: false, error: error.message });
  }
}

// Update Status Indicator
function updateStatusIndicator(status) {
  if (status.available) {
    elements.statusText.textContent = 'AI Ready';
    elements.statusDot.className = 'status-dot';
  } else if (status.error) {
    elements.statusText.textContent = `AI Unavailable: ${status.error}`;
    elements.statusDot.className = 'status-dot error';
  } else {
    elements.statusText.textContent = 'AI Loading...';
    elements.statusDot.className = 'status-dot warning';
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Task Selection
  elements.taskButtons.forEach(btn => {
    btn.addEventListener('click', () => selectTask(btn.dataset.task));
  });
  
  // Content Capture
  elements.captureSelection?.addEventListener('click', captureSelection);
  elements.capturePage?.addEventListener('click', capturePageContent);
  elements.detectForms?.addEventListener('click', detectLegalForms);
  elements.clearContent?.addEventListener('click', clearCapturedContent);
  
  // Input Handling
  elements.inputPrompt?.addEventListener('input', handleInputChange);
  elements.sliderTemperature?.addEventListener('input', updateTemperatureLabel);
  elements.sliderTopK?.addEventListener('input', updateTopKLabel);
  
  // Main Actions
  elements.buttonProcess?.addEventListener('click', processRequest);
  elements.buttonReset?.addEventListener('click', resetSession);
  
  // Response Actions
  elements.copyResponse?.addEventListener('click', copyResponseToClipboard);
  elements.saveResponse?.addEventListener('click', saveResponseToStorage);
  elements.exportResponse?.addEventListener('click', exportResponseAsDocument);
  elements.retryRequest?.addEventListener('click', retryLastRequest);
  elements.reportError?.addEventListener('click', reportError);
  
  // Quick Actions
  elements.quickActions.forEach(action => {
    action.addEventListener('click', () => executeQuickAction(action.dataset.action));
  });
}

// Initialize UI State
function initializeUIState() {
  // Set default temperature and topK values
  elements.sliderTemperature.value = 0.3;
  elements.sliderTopK.value = 3;
  updateTemperatureLabel();
  updateTopKLabel();
  
  // Set initial placeholder
  elements.inputPrompt.placeholder = 'Describe your legal task, paste text for analysis, or select a task above...';
  
  // Disable process button initially
  elements.buttonProcess.disabled = true;
}

// Load Saved State
async function loadSavedState() {
  try {
    const saved = await chrome.storage.local.get(['lastTask', 'preferences']);
    if (saved.lastTask) {
      selectTask(saved.lastTask);
    }
    
    if (saved.preferences) {
      applyPreferences(saved.preferences);
    }
  } catch (error) {
    console.warn('Failed to load saved state:', error);
  }
}

// Task Selection
function selectTask(taskType) {
  currentTask = taskType;
  
  // Update UI
  elements.taskButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.task === taskType);
  });
  
  // Update input placeholder and process button
  updateTaskUI(taskType);
  
  // Save selection
  chrome.storage.local.set({ lastTask: taskType }).catch(console.warn);
}

// Update UI for Selected Task
function updateTaskUI(taskType) {
  const taskConfigs = {
    legalAnalysis: {
      placeholder: 'Paste legal text or describe the legal issue you need analyzed...',
      buttonText: 'Analyze Legal Text',
      icon: '📋'
    },
    summarize: {
      placeholder: 'Paste the legal document or text you want summarized...',
      buttonText: 'Generate Summary',
      icon: '📄'
    },
    rewrite: {
      placeholder: 'Paste text you want rewritten in professional legal language...',
      buttonText: 'Rewrite Text',
      icon: '✍️'
    },
    proofread: {
      placeholder: 'Paste text you want proofread for legal accuracy and clarity...',
      buttonText: 'Proofread Text',
      icon: '🔍'
    },
    generateDocument: {
      placeholder: 'Describe the legal document you need generated (e.g., "Draft a legal notice for...")...',
      buttonText: 'Generate Document',
      icon: '📝'
    },
    complianceCheck: {
      placeholder: 'Describe the compliance requirements or paste text to check...',
      buttonText: 'Check Compliance',
      icon: '⚖️'
    }
  };
  
  const config = taskConfigs[taskType] || taskConfigs.legalAnalysis;
  elements.inputPrompt.placeholder = config.placeholder;
  elements.processText.textContent = config.buttonText;
  elements.processIcon.textContent = config.icon;
  
  handleInputChange(); // Update button state
}

// Content Capture Functions
async function captureSelection() {
  try {
    showStatus('Capturing selected text...');
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.runtime.sendMessage({
      action: 'capturePageContent'
    });
    
    if (response?.success && response.content) {
      if (response.content.type === 'selection' && response.content.text) {
        setCapturedContent(response.content.text, 'Selected Text');
        showStatus('Text selection captured successfully');
      } else {
        showError('No text selected. Please select some text on the page first.');
      }
    } else {
      showError('Failed to capture selection. Please try again.');
    }
  } catch (error) {
    console.error('Selection capture failed:', error);
    showError('Failed to capture selection: ' + error.message);
  }
}

async function capturePageContent() {
  try {
    showStatus('Capturing page content...');
    
    const response = await chrome.runtime.sendMessage({
      action: 'capturePageContent'
    });
    
    if (response?.success && response.content) {
      setCapturedContent(response.content.text, 'Page Content');
      showStatus('Page content captured successfully');
    } else {
      showError('Failed to capture page content. Please try again.');
    }
  } catch (error) {
    console.error('Page capture failed:', error);
    showError('Failed to capture page content: ' + error.message);
  }
}

async function detectLegalForms() {
  try {
    showStatus('Detecting legal forms...');
    
    // Send message to content script to detect forms
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'highlightLegalForms'
    });
    
    if (response?.success) {
      showStatus('Legal forms detection complete');
      // Update forms section if forms were found
      updateFormsSection();
    } else {
      showStatus('No legal forms detected on this page');
    }
  } catch (error) {
    console.error('Form detection failed:', error);
    showError('Failed to detect forms: ' + error.message);
  }
}

// Set Captured Content
function setCapturedContent(text, title) {
  capturedText = text;
  elements.contentPreview.textContent = text.slice(0, 200) + (text.length > 200 ? '...' : '');
  elements.capturedContent.querySelector('h4').textContent = `Captured Content (${title}):`;
  show(elements.capturedContent);
  
  // Auto-fill input if empty
  if (!elements.inputPrompt.value.trim()) {
    elements.inputPrompt.value = text;
    handleInputChange();
  }
}

// Clear Captured Content
function clearCapturedContent() {
  capturedText = '';
  hide(elements.capturedContent);
  elements.inputPrompt.value = '';
  handleInputChange();
}

// Input Change Handler
function handleInputChange() {
  const hasInput = elements.inputPrompt.value.trim().length > 0;
  elements.buttonProcess.disabled = !hasInput;
}

// Update Label Functions
function updateTemperatureLabel() {
  elements.labelTemperature.textContent = elements.sliderTemperature.value;
}

function updateTopKLabel() {
  elements.labelTopK.textContent = elements.sliderTopK.value;
}

// Process Request
async function processRequest() {
  const input = elements.inputPrompt.value.trim();
  if (!input) return;
  
  if (!currentTask) {
    showError('Please select a task first');
    return;
  }
  
  currentRequest = {
    task: currentTask,
    text: input,
    options: {
      temperature: parseFloat(elements.sliderTemperature.value),
      topK: parseInt(elements.sliderTopK.value)
    }
  };
  
  try {
    showLoading();
    
    const response = await chrome.runtime.sendMessage({
      action: 'processWithAI',
      ...currentRequest
    });
    
    if (response?.success) {
      showResponse(response.result);
      lastResponse = response.result;
    } else {
      showError(response?.error || 'Processing failed');
    }
  } catch (error) {
    console.error('Processing failed:', error);
    showError('Processing failed: ' + error.message);
  }
}

// Reset Session
async function resetSession() {
  try {
    // Clear UI
    elements.inputPrompt.value = '';
    lastResponse = '';
    capturedText = '';
    currentRequest = null;
    
    hide(elements.response);
    hide(elements.error);
    hide(elements.capturedContent);
    
    // Reset task selection
    elements.taskButtons.forEach(btn => btn.classList.remove('active'));
    currentTask = null;
    
    // Reset process button
    elements.processText.textContent = 'Process with AI';
    elements.processIcon.textContent = '🤖';
    elements.buttonProcess.disabled = true;
    
    // Clear storage
    await chrome.storage.local.remove(['lastTask']);
    
    showStatus('Session reset successfully');
  } catch (error) {
    console.error('Reset failed:', error);
    showError('Reset failed: ' + error.message);
  }
}

// Response Actions
async function copyResponseToClipboard() {
  try {
    await navigator.clipboard.writeText(lastResponse);
    showStatus('Response copied to clipboard');
  } catch (error) {
    showError('Failed to copy: ' + error.message);
  }
}

async function saveResponseToStorage() {
  try {
    const timestamp = new Date().toISOString();
    const saved = await chrome.storage.local.get(['savedResponses']) || { savedResponses: [] };
    
    saved.savedResponses.push({
      id: Date.now(),
      timestamp,
      task: currentTask,
      response: lastResponse,
      request: currentRequest?.text || ''
    });
    
    // Keep only last 50 responses
    if (saved.savedResponses.length > 50) {
      saved.savedResponses = saved.savedResponses.slice(-50);
    }
    
    await chrome.storage.local.set(saved);
    showStatus('Response saved to local storage');
  } catch (error) {
    showError('Failed to save: ' + error.message);
  }
}

function exportResponseAsDocument() {
  try {
    const content = `# Agentic Advocate Legal Analysis\n\n**Task:** ${currentTask}\n**Date:** ${new Date().toLocaleDateString()}\n\n## Request\n${currentRequest?.text || ''}\n\n## AI Response\n${lastResponse}`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-analysis-${Date.now()}.md`;
    a.click();
    
    URL.revokeObjectURL(url);
    showStatus('Document exported successfully');
  } catch (error) {
    showError('Failed to export: ' + error.message);
  }
}

function retryLastRequest() {
  if (currentRequest) {
    processRequest();
  } else {
    showError('No previous request to retry');
  }
}

function reportError() {
  // This could open a feedback form or create an issue
  showStatus('Error reporting feature coming soon');
}

// Quick Actions
function executeQuickAction(action) {
  const quickActionPrompts = {
    'rti-help': 'I need help filing an RTI (Right to Information) application. Please provide a template and guidance.',
    'complaint-draft': 'Help me draft a formal complaint. I will provide the details of my grievance.',
    'legal-notice': 'I need to create a legal notice. Please provide a professional template.',
    'tax-planning': 'Provide tax planning advice for optimal tax savings and compliance.',
    'contract-review': 'Help me review and analyze a contract for key terms and potential issues.',
    'compliance-check': 'Check the compliance requirements for my business/situation.'
  };
  
  const prompt = quickActionPrompts[action];
  if (prompt) {
    elements.inputPrompt.value = prompt;
    selectTask('legalAnalysis');
    handleInputChange();
  }
}

// UI Helper Functions
function showLoading() {
  show(elements.loading);
  hide(elements.response);
  hide(elements.error);
  elements.buttonProcess.disabled = true;
  elements.buttonReset.disabled = false;
}

function showResponse(response) {
  hide(elements.loading);
  show(elements.response);
  hide(elements.error);
  
  // Sanitize and render markdown
  elements.responseContent.innerHTML = DOMPurify.sanitize(marked.parse(response));
  
  elements.buttonProcess.disabled = false;
}

function showError(error) {
  hide(elements.loading);
  hide(elements.response);
  show(elements.error);
  
  elements.errorContent.textContent = typeof error === 'string' ? error : error.message;
  elements.buttonProcess.disabled = false;
}

function showStatus(message) {
  console.log('Status:', message);
  // Could add a status bar or toast notification here
}

function show(element) {
  if (element) element.removeAttribute('hidden');
}

function hide(element) {
  if (element) element.setAttribute('hidden', '');
}

// Update Forms Section
function updateFormsSection() {
  // This would be updated with actual form data from content script
  // For now, just show the section
  show(elements.formsSection);
}

// Apply Preferences
function applyPreferences(preferences) {
  if (preferences.temperature !== undefined) {
    elements.sliderTemperature.value = preferences.temperature;
    updateTemperatureLabel();
  }
  
  if (preferences.topK !== undefined) {
    elements.sliderTopK.value = preferences.topK;
    updateTopKLabel();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

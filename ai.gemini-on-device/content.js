// Agentic Advocate - Content Script
// Handles webpage content interaction and form detection

console.log('Agentic Advocate content script loaded');

// Track legal forms and fillable fields
let detectedForms = new Set();
let highlightedElements = [];

// Initialize content script
function initContentScript() {
  detectLegalForms();
  setupTextSelection();
  setupFormDetection();
  createFloatingActionButton();
}

// Detect legal forms on the page
function detectLegalForms() {
  const legalFormPatterns = [
    /rti|right.to.information/i,
    /complaint|grievance/i,
    /legal.notice|notice/i,
    /tax|income.tax|gst/i,
    /application|petition/i,
    /affidavit|declaration/i
  ];
  
  const forms = document.querySelectorAll('form');
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea, select');
  
  forms.forEach(form => {
    const formText = form.innerText || form.textContent || '';
    const isLegalForm = legalFormPatterns.some(pattern => pattern.test(formText));
    
    if (isLegalForm) {
      detectedForms.add(form);
      highlightLegalForm(form);
    }
  });
  
  // Also check individual inputs for legal context
  inputs.forEach(input => {
    const context = getInputContext(input);
    const isLegalField = legalFormPatterns.some(pattern => pattern.test(context));
    
    if (isLegalField && !Array.from(detectedForms).some(form => form.contains(input))) {
      highlightLegalField(input);
    }
  });
  
  if (detectedForms.size > 0) {
    notifyLegalFormsDetected();
  }
}

// Get context around an input field
function getInputContext(input) {
  const label = input.labels?.[0]?.textContent || '';
  const placeholder = input.placeholder || '';
  const nearby = getNearbyText(input, 100);
  
  return `${label} ${placeholder} ${nearby}`.toLowerCase();
}

// Get text content near an element
function getNearbyText(element, charLimit = 200) {
  const parent = element.parentElement;
  if (!parent) return '';
  
  const text = parent.textContent || '';
  const elementIndex = text.indexOf(element.textContent || '');
  const start = Math.max(0, elementIndex - charLimit / 2);
  const end = Math.min(text.length, elementIndex + charLimit / 2);
  
  return text.slice(start, end);
}

// Highlight legal forms
function highlightLegalForm(form) {
  form.style.outline = '2px solid #4CAF50';
  form.style.outlineOffset = '2px';
  form.setAttribute('data-agentic-legal-form', 'true');
  
  // Add helper tooltip
  const tooltip = document.createElement('div');
  tooltip.textContent = 'Legal form detected - Click Agentic Advocate for assistance';
  tooltip.style.cssText = `
    position: absolute;
    background: #4CAF50;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10000;
    pointer-events: none;
    transform: translateY(-100%);
  `;
  
  form.style.position = 'relative';
  form.appendChild(tooltip);
  
  // Remove tooltip after 3 seconds
  setTimeout(() => tooltip.remove(), 3000);
}

// Highlight individual legal fields
function highlightLegalField(input) {
  input.style.borderColor = '#4CAF50';
  input.style.borderWidth = '2px';
  input.setAttribute('data-agentic-legal-field', 'true');
}

// Setup text selection handling
function setupTextSelection() {
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keyup', handleTextSelection);
}

// Handle text selection events
function handleTextSelection() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText.length > 10) {
    showSelectionActions(selection);
  } else {
    hideSelectionActions();
  }
}

// Show actions for selected text
function showSelectionActions(selection) {
  hideSelectionActions(); // Remove existing
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  const actionPanel = document.createElement('div');
  actionPanel.id = 'agentic-selection-actions';
  actionPanel.style.cssText = `
    position: fixed;
    top: ${rect.top - 50}px;
    left: ${rect.left}px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 10001;
    display: flex;
    gap: 8px;
  `;
  
  const actions = [
    { text: 'Analyze', action: 'analyze' },
    { text: 'Summarize', action: 'summarize' },
    { text: 'Rewrite', action: 'rewrite' },
    { text: 'Proofread', action: 'proofread' }
  ];
  
  actions.forEach(({ text, action }) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
      padding: 4px 8px;
      border: 1px solid #ccc;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
    
    button.onclick = () => {
      processSelectedText(selection.toString(), action);
      hideSelectionActions();
    };
    
    actionPanel.appendChild(button);
  });
  
  document.body.appendChild(actionPanel);
  
  // Auto-hide after 10 seconds
  setTimeout(hideSelectionActions, 10000);
}

// Hide selection actions
function hideSelectionActions() {
  const existing = document.getElementById('agentic-selection-actions');
  if (existing) {
    existing.remove();
  }
}

// Process selected text with AI
function processSelectedText(text, action) {
  chrome.runtime.sendMessage({
    action: 'processWithAI',
    task: action === 'analyze' ? 'legalAnalysis' : action,
    text: text,
    options: { source: 'selection' }
  }, response => {
    if (response?.success) {
      showProcessingResult(response.result, action);
    } else {
      console.error('Processing failed:', response?.error);
      showError('Processing failed. Please try again.');
    }
  });
}

// Show processing result
function showProcessingResult(result, action) {
  const modal = document.createElement('div');
  modal.id = 'agentic-result-modal';
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 8px;
    padding: 20px;
    max-width: 600px;
    max-height: 400px;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 10002;
    border: 1px solid #ddd;
  `;
  
  modal.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h3 style="margin: 0; color: #333;">AI ${action.charAt(0).toUpperCase() + action.slice(1)} Result</h3>
      <button onclick="this.parentElement.parentElement.remove()" style="border: none; background: none; font-size: 20px; cursor: pointer;">&times;</button>
    </div>
    <div style="line-height: 1.5; color: #555;">${result.replace(/\n/g, '<br>')}</div>
    <div style="margin-top: 16px; text-align: right;">
      <button onclick="navigator.clipboard.writeText('${result.replace(/'/g, "\\'")}'); this.textContent='Copied!'" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Copy to Clipboard</button>
    </div>
  `;
  
  // Add backdrop
  const backdrop = document.createElement('div');
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 10001;
  `;
  backdrop.onclick = () => {
    modal.remove();
    backdrop.remove();
  };
  
  document.body.appendChild(backdrop);
  document.body.appendChild(modal);
}

// Setup form field detection and autofill
function setupFormDetection() {
  // Watch for form interactions
  document.addEventListener('focus', handleFieldFocus, true);
  document.addEventListener('input', handleFieldInput, true);
}

// Handle field focus events
function handleFieldFocus(event) {
  const field = event.target;
  if (field.matches('input[type="text"], input[type="email"], textarea, select')) {
    const context = getInputContext(field);
    
    // Check if this looks like a legal field that could be auto-filled
    if (isAutofillableField(context)) {
      showAutofillSuggestion(field, context);
    }
  }
}

// Handle field input events
function handleFieldInput(event) {
  // Could implement real-time validation or suggestions here
}

// Check if field can be auto-filled
function isAutofillableField(context) {
  const autofillPatterns = [
    /name|applicant/i,
    /address|location/i,
    /phone|mobile|contact/i,
    /email|mail/i,
    /date.of.birth|dob/i,
    /occupation|profession/i,
    /income|salary/i
  ];
  
  return autofillPatterns.some(pattern => pattern.test(context));
}

// Show autofill suggestion
function showAutofillSuggestion(field, context) {
  // Remove existing suggestions
  const existing = document.querySelector('.agentic-autofill-suggestion');
  if (existing) existing.remove();
  
  const suggestion = document.createElement('div');
  suggestion.className = 'agentic-autofill-suggestion';
  suggestion.textContent = '🤖 Autofill available';
  suggestion.style.cssText = `
    position: absolute;
    background: #2196F3;
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 11px;
    cursor: pointer;
    z-index: 10000;
    transform: translate(0, -100%);
  `;
  
  suggestion.onclick = () => {
    requestAutofill(field, context);
    suggestion.remove();
  };
  
  field.style.position = 'relative';
  field.parentElement.appendChild(suggestion);
  
  // Position relative to field
  const rect = field.getBoundingClientRect();
  suggestion.style.top = `${rect.top - 25}px`;
  suggestion.style.left = `${rect.left}px`;
  suggestion.style.position = 'fixed';
  
  // Auto-hide after 5 seconds
  setTimeout(() => suggestion.remove(), 5000);
}

// Request autofill for field
function requestAutofill(field, context) {
  chrome.runtime.sendMessage({
    action: 'requestAutofill',
    fieldContext: context,
    fieldType: field.type,
    fieldName: field.name || field.id
  }, response => {
    if (response?.success && response.value) {
      field.value = response.value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

// Create floating action button
function createFloatingActionButton() {
  const fab = document.createElement('div');
  fab.id = 'agentic-fab';
  fab.innerHTML = '🤖';
  fab.title = 'Open Agentic Advocate';
  fab.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
    background: #4CAF50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 24px;
    z-index: 9999;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    transition: transform 0.2s;
  `;
  
  fab.onmouseover = () => fab.style.transform = 'scale(1.1)';
  fab.onmouseout = () => fab.style.transform = 'scale(1)';
  fab.onclick = () => chrome.runtime.sendMessage({ action: 'openSidePanel' });
  
  document.body.appendChild(fab);
}

// Notify about detected legal forms
function notifyLegalFormsDetected() {
  chrome.runtime.sendMessage({
    action: 'legalFormsDetected',
    count: detectedForms.size,
    url: window.location.href
  });
}

// Show error message
function showError(message) {
  const error = document.createElement('div');
  error.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f44336;
    color: white;
    padding: 12px 16px;
    border-radius: 4px;
    z-index: 10003;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;
  error.textContent = message;
  
  document.body.appendChild(error);
  setTimeout(() => error.remove(), 4000);
}

// Handle messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'highlightLegalForms':
      detectLegalForms();
      sendResponse({ success: true });
      break;
      
    case 'getPageContent':
      const content = {
        title: document.title,
        url: window.location.href,
        text: document.body.innerText.slice(0, 5000),
        forms: Array.from(detectedForms).map(form => ({
          action: form.action,
          method: form.method,
          fields: Array.from(form.elements).length
        }))
      };
      sendResponse({ success: true, content });
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContentScript);
} else {
  initContentScript();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  hideSelectionActions();
  const fab = document.getElementById('agentic-fab');
  if (fab) fab.remove();
});
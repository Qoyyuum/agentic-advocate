// Content Script for Agentic Advocate Extension

console.log('Agentic Advocate Content Script Loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeText') {
    analyzeSelectedText(request.text);
    sendResponse({ success: true });
  }
  return true;
});

// Analyze selected text
function analyzeSelectedText(text) {
  // Send to background for AI processing
  chrome.runtime.sendMessage({
    action: 'processWithAI',
    data: {
      text: text,
      taskType: 'analysis'
    }
  }, (response) => {
    if (response.success) {
      showInlineResult(response.result);
    }
  });
}

// Show inline result overlay
function showInlineResult(result) {
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.id = 'agentic-advocate-overlay';
  overlay.innerHTML = `
    <div class="agentic-advocate-popup">
      <div class="agentic-advocate-header">
        <span>Agentic Advocate Analysis</span>
        <button class="agentic-advocate-close">&times;</button>
      </div>
      <div class="agentic-advocate-content">
        ${result}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close button handler
  overlay.querySelector('.agentic-advocate-close').addEventListener('click', () => {
    overlay.remove();
  });
}

// Auto-fill detection for legal forms
function detectLegalForms() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    // Check if form contains legal/compliance keywords
    const formText = form.innerText.toLowerCase();
    if (
      formText.includes('rti') ||
      formText.includes('complaint') ||
      formText.includes('legal') ||
      formText.includes('compliance')
    ) {
      addAutoFillButton(form);
    }
  });
}

// Add auto-fill button to detected forms
function addAutoFillButton(form) {
  const button = document.createElement('button');
  button.textContent = '🤖 Auto-fill with Agentic Advocate';
  button.className = 'agentic-advocate-autofill-btn';
  button.type = 'button';

  button.addEventListener('click', (e) => {
    e.preventDefault();
    autoFillForm(form);
  });

  form.insertBefore(button, form.firstChild);
}

// Auto-fill form with stored data
function autoFillForm(form) {
  chrome.storage.local.get(['userPreferences'], (result) => {
    const prefs = result.userPreferences || {};

    // Get form fields and fill based on stored preferences
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const name = input.name.toLowerCase();
      const label = input.placeholder?.toLowerCase() || '';

      // Basic field detection and filling
      if (name.includes('name') || label.includes('name')) {
        input.value = prefs.fullName || '';
      } else if (name.includes('email') || label.includes('email')) {
        input.value = prefs.email || '';
      } else if (name.includes('phone') || label.includes('phone')) {
        input.value = prefs.phone || '';
      } else if (name.includes('address') || label.includes('address')) {
        input.value = prefs.address || '';
      }
    });

    showNotification('Form auto-filled successfully!');
  });
}

// Show notification banner
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'agentic-advocate-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Text highlighting for legal terms
function highlightLegalTerms() {
  const legalTerms = [
    'contract', 'agreement', 'terms', 'conditions', 'liability',
    'warranty', 'indemnity', 'jurisdiction', 'arbitration', 'damages'
  ];

  const textNodes = getTextNodes(document.body);
  textNodes.forEach(node => {
    let text = node.textContent;
    let modified = false;

    legalTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      if (regex.test(text)) {
        modified = true;
        text = text.replace(regex, `<mark class="agentic-advocate-highlight">$&</mark>`);
      }
    });

    if (modified) {
      const span = document.createElement('span');
      span.innerHTML = text;
      node.parentNode.replaceChild(span, node);
    }
  });
}

// Get all text nodes in element
function getTextNodes(element) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Skip script and style tags
        if (node.parentNode.tagName === 'SCRIPT' ||
            node.parentNode.tagName === 'STYLE') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  return textNodes;
}

// Initialize content script features
function init() {
  // Check user preferences before enabling features
  chrome.storage.local.get(['userPreferences'], (result) => {
    const prefs = result.userPreferences || {};

    if (prefs.autoFill) {
      detectLegalForms();
    }

    if (prefs.highlightTerms) {
      highlightLegalTerms();
    }
  });
}

// Run initialization after DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

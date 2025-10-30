// Content Script for Agentic Advocate Extension

console.log('Agentic Advocate Content Script Loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request.action);

  if (request.action === 'ping') {
    // Health check from background script
    sendResponse({ success: true, loaded: true });
  } else if (request.action === 'analyzeText') {
    analyzeSelectedText(request.text);
    sendResponse({ success: true });
  } else if (request.action === 'analyzePage') {
    const text = (document.body && document.body.innerText) || document.documentElement.innerText || '';
    console.log('Agentic Advocate Page Content:', text);
    sendResponse({ success: true, contentLength: text.length });
  }
  return true;
});

// Analyze selected text
async function analyzeSelectedText(text) {
  // Send to background for AI processing
  console.log(text)
  const options = {
    sharedContext: 'This is a legal document. Analyze and summarize if it contains anything risky or unsafe to the user.',
    type: 'tldr',
    format: 'plain-text',
    length: 'medium',
    monitor(m) {
      m.addEventListener('downloadprogress', (e) => {
        console.log(`Downloaded ${e.loaded * 100}%`);
      });
    }
  };

  const availability = await Summarizer.availability();
  if (availability === 'unavailable') {
    // The Summarizer API isn't usable.
    return;
  }

  // Check for user activation before creating the summarizer
  if (navigator.userActivation.isActive) {
    const summarizer = await Summarizer.create(options);
    const result = await summarizer.summarize(text);
    showInlineResult(result);
  }
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

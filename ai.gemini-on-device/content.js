// Content script for capturing selected text from web pages

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    const selectedText = window.getSelection().toString();
    sendResponse({ text: selectedText });
  }
  return true;
});

// Add context menu functionality for quick AI operations
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    // Store selected text for potential use
    chrome.storage.local.set({ lastSelectedText: selectedText });
  }
});

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: true })
      .catch((error) => console.error(error));
    
    // Show welcome notification
    console.log('Agentic Advocate AI extension installed successfully!');
  }
});

// Handle messages from content scripts or side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSidePanel') {
    chrome.sidePanel.open({ windowId: sender.tab.windowId })
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'getCapabilities') {
    // Respond with capability information
    sendResponse({ 
      success: true,
      capabilities: {
        prompt: 'LanguageModel' in self,
        summarizer: 'AISummarizer' in self,
        writer: 'AIWriter' in self,
        rewriter: 'AIRewriter' in self
      }
    });
    return true;
  }
});


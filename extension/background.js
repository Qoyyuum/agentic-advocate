chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage defaults on install
  chrome.storage.sync.get(['aa_settings'], (data) => {
    if (!data || !data.aa_settings) {
      chrome.storage.sync.set({ aa_settings: { provider: 'chrome_built_in', language: 'en' } });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'AA_NOTIFY') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: message.title || 'Agentic Advocate',
      message: message.body || ''
    });
    sendResponse({ ok: true });
    return true;
  }
});



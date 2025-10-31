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
  
  // Check Chrome AI availability from background context
  if (message?.type === 'AA_CHECK_AI_AVAILABLE') {
    try {
      const aiAvailable = typeof self !== 'undefined' && self.ai?.languageModel;
      const aiObj = typeof self !== 'undefined' ? self.ai : null;
      
      sendResponse({ 
        ok: true, 
        available: !!aiAvailable,
        hasLanguageModel: !!(aiObj?.languageModel),
        hasWriter: !!(aiObj?.writer),
        hasRewriter: !!(aiObj?.rewriter),
        hasProofreader: !!(aiObj?.proofreader),
        hasTranslator: !!(aiObj?.translator),
        hasSummarizer: !!(aiObj?.summarizer),
        chromeVersion: navigator.userAgent.match(/Chrome\/(\d+)/)?.[1] || 'unknown'
      });
      return true;
    } catch (error) {
      sendResponse({ ok: false, error: error.message });
      return true;
    }
  }
});



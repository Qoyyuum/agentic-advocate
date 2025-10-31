function extractVisibleText(doc) {
  const walker = doc.createTreeWalker(doc.body || doc, NodeFilter.SHOW_TEXT, null);
  const chunks = [];
  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue.replace(/\s+/g, ' ').trim();
    if (text && text.length > 2) chunks.push(text);
  }
  return chunks.join('\n');
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'AA_EXTRACT_PAGE') {
    try {
      const text = extractVisibleText(document);
      sendResponse({ ok: true, text });
    } catch (e) {
      sendResponse({ ok: false, error: String(e?.message || e) });
    }
    return true;
  }
});



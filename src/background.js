// Handle extension icon click to toggle side panel
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Initialize the LLM engine once
let enginePromise = null;
function getEngine() {
  if (!enginePromise) {
    enginePromise = CreateMLCEngine("Qwen2-1.5B-Instruct-q4f16_1-MLC");
  }
  return enginePromise;
}

// Listen for summarize requests from content script and relay to popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'llm-summarize' && msg.postId && msg.content) {
    console.log('[BG] Forwarding summarize request to popup:', msg);
    chrome.runtime.sendMessage({
      type: 'llm-summarize-popup',
      postId: msg.postId,
      content: msg.content,
      tabId: sender.tab.id
    });
  } else if (msg.type === 'llm-summary-result-popup' && msg.postId && msg.summary && msg.tabId) {
    // Forward the summary result from popup to the correct tab/content script
    console.log('[BG] Forwarding summary result to content script:', msg);
    chrome.tabs.sendMessage(msg.tabId, {
      type: 'llm-summary-result',
      postId: msg.postId,
      summary: msg.summary
    });
  }
}); 
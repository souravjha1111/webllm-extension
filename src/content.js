// Content script to handle text selection and page content
let selectedText = "";

// Listen for text selection changes (for popup functionality)
document.addEventListener('selectionchange', function() {
  selectedText = window.getSelection().toString().trim();
  
  // Send selected text to popup if extension is open
  chrome.runtime.sendMessage({
    type: 'textSelection',
    selectedText: selectedText,
    hasSelection: selectedText.length > 0
  });
});

// Listen for messages from popup
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    // Send both selected text and full page content
    port.postMessage({ 
      contents: document.body.innerText,
      selectedText: selectedText,
      hasSelection: selectedText.length > 0
    });
  });
});

// Also send initial state when popup opens
chrome.runtime.sendMessage({
  type: 'pageLoad',
  selectedText: selectedText,
  hasSelection: selectedText.length > 0
});

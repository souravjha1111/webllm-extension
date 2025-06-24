// Create context menu items when extension loads
chrome.runtime.onInstalled.addListener(() => {
  // Create parent menu item
  chrome.contextMenus.create({
    id: "mlcbot-menu",
    title: "MLCBot AI",
    contexts: ["selection"]
  });

  // Create submenu items
  chrome.contextMenus.create({
    id: "generate-comments",
    parentId: "mlcbot-menu",
    title: "Generate comments for this text",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "ask-followup",
    parentId: "mlcbot-menu",
    title: "Ask followup question using AI",
    contexts: ["selection"]
  });
});

// Handle extension icon click to toggle side panel
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.selectionText) {
    handleContextMenuClick(info.menuItemId, info.selectionText, tab);
  }
});

// Handle context menu clicks
async function handleContextMenuClick(menuItemId, selectedText, tab) {
  try {
    let prompt = "";
    let action = "";

    if (menuItemId === "generate-comments") {
      prompt = `Based on the content: "${selectedText}" please evaluate and generate 1 professional LinkedIn comment that I can use to engage with this post. Make the comment thoughtful, relevant, and add value to the conversation. Strictly provide only 1 comment.`;
      action = "generateComments";
    } else if (menuItemId === "ask-followup") {
      prompt = `Based on the content: "${selectedText}" please evaluate and generate a thoughtful follow-up question or comment that I can ask related to this content. Strictly provide only 1 follow-up question or comment, and nothing else.`;
      action = "askFollowupQuestion";
    }

    if (prompt) {
      // Store the prompt and selected text for the popup
      chrome.storage.local.set({
        pendingPrompt: prompt,
        pendingAction: action,
        selectedText: selectedText
      });

      // Open side panel
      chrome.sidePanel.open({ windowId: tab.windowId });

      // Send message to popup to process the request
      chrome.runtime.sendMessage({
        type: 'processContextMenuRequest',
        prompt: prompt,
        action: action,
        selectedText: selectedText
      });
    }

  } catch (error) {
    console.error('Error handling context menu click:', error);
    
    // Show error notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: 'MLCBot AI Error',
      message: 'Failed to process request. Please try again.'
    });
  }
}

// Handle AI processing requests from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'generateAIResponse') {
    handleAIRequest(message, sender.tab);
  }
});

// Handle AI requests and show results
async function handleAIRequest(message, tab) {
  try {
    // Show loading notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: 'MLCBot AI',
      message: 'Generating response...'
    });

    // For now, we'll use a simple approach - open the side panel with the prompt
    // In a full implementation, you'd want to use the AI engine here
    const prompt = message.prompt;
    const action = message.action;
    
    // Store the prompt in storage so popup can access it
    chrome.storage.local.set({
      pendingPrompt: prompt,
      pendingAction: action,
      selectedText: message.selectedText
    });

    // Open side panel to show results
    chrome.sidePanel.open({ windowId: tab.windowId });
    
    // Send message to popup to process the prompt
    chrome.runtime.sendMessage({
      type: 'processContextMenuRequest',
      prompt: prompt,
      action: action
    });

  } catch (error) {
    console.error('Error handling AI request:', error);
    
    // Show error notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: 'MLCBot AI Error',
      message: 'Failed to generate response. Please try again.'
    });
  }
} 
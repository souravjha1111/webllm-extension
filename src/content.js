// Only the content script is able to access the DOM

// Map to keep track of processed LinkedIn post IDs
const processedPosts = new Map();

// Helper to extract LinkedIn feed posts
function extractLinkedInPosts() {
  // LinkedIn feed posts have a class like 'feed-shared-update-v2' or similar
  // This selector may need adjustment if LinkedIn changes their DOM
  return Array.from(document.querySelectorAll('[data-urn^="urn:li:activity:"]'));
}

// Helper to get unique post ID from a post element
function getPostId(postElem) {
  // The data-urn attribute is unique for each post
  return postElem.getAttribute('data-urn');
}

// Helper to extract text content from a post element
function getPostContent(postElem) {
  // Try to get the main text content of the post
  const mainText = postElem.querySelector('.feed-shared-update-v2__description, .update-components-text, [data-test-post-content]');
  return mainText ? mainText.innerText.trim() : postElem.innerText.trim();
}

// Helper to inject a summary box at the side of a post
function injectSummaryBox(postElem, summary) {
  let box = postElem.querySelector('.llm-summary-box');
  if (!box) {
    box = document.createElement('div');
    box.className = 'llm-summary-box';
    // Style the box to appear at the right side of the post
    box.style.position = 'absolute';
    box.style.top = '10px';
    box.style.right = '-320px';
    box.style.width = '300px';
    box.style.background = '#f3f6f8';
    box.style.border = '1px solid #d1dbe6';
    box.style.borderRadius = '8px';
    box.style.padding = '12px';
    box.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    box.style.fontSize = '14px';
    box.style.color = '#222';
    box.style.zIndex = '9999';
    box.style.overflowWrap = 'break-word';
    box.style.minHeight = '40px';
    box.innerText = summary || 'Summarizing...';
    // Make sure the post is relatively positioned
    postElem.style.position = 'relative';
    postElem.appendChild(box);
  } else {
    box.innerText = summary;
  }
}

// Listen for messages from the extension to update summaries
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'llm-summary-result' && msg.postId && msg.summary) {
    const postElem = document.querySelector(`[data-urn="${msg.postId}"]`);
    if (postElem) {
      injectSummaryBox(postElem, msg.summary);
    }
  }
});

// Main logic to scan and process posts
function processLinkedInFeed() {
  const posts = extractLinkedInPosts();
  for (const postElem of posts) {
    const postId = getPostId(postElem);
    if (!postId || processedPosts.has(postId)) continue;
    const content = getPostContent(postElem);
    if (!content || content.length < 20) continue; // skip empty/short posts
    processedPosts.set(postId, true);
    injectSummaryBox(postElem, 'Summarizing...');
    // Send message to background/popup for LLM summarization
    chrome.runtime.sendMessage({ type: 'llm-summarize', postId, content });
  }
}

// Run initially and on scroll (to catch new posts)
setInterval(processLinkedInFeed, 2000);

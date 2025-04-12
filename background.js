// background.js
chrome.commands.onCommand.addListener((command) => {
  if (command === "copy-url" || command === "copy-url-alt") {
    // Get the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const url = tabs[0].url;
        
        // Always use content script to copy to clipboard
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: copyToClipboard,
          args: [url]
        });
      }
    });
  }
});

// Function to be injected into the page to copy text to clipboard
function copyToClipboard(text) {
  // Try the modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Show notification
        showNotification('URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
        // Fall back to the execCommand method if Clipboard API fails
        fallbackCopyToClipboard(text);
      });
  } else {
    // Use the older execCommand approach as fallback
    fallbackCopyToClipboard(text);
  }
}

// Function to show a notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #323232;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    z-index: 9999;
    font-family: system-ui, sans-serif;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(notification);
  
  // Remove the notification after 1.5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s ease';
    setTimeout(() => notification.remove(), 500);
  }, 1500);
}

// Fallback method using execCommand
function fallbackCopyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';  // Prevent scrolling to bottom
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (!successful) throw new Error('Copy command was unsuccessful');
    
    // Show notification
    showNotification('URL copied to clipboard!');
  } catch (err) {
    console.error('Fallback: Unable to copy URL', err);
    showNotification('Failed to copy URL');
  }
  
  document.body.removeChild(textarea);
}
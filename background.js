// background.js
chrome.commands.onCommand.addListener((command) => {
  if (command === "copy-url" || command === "copy-url-alt") {
    // Get the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const url = tabs[0].url;
        
        // Try to copy directly first using executeScript
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: copyToClipboardAndNotify,
          args: [url]
        }).catch(error => {
          console.error("Script execution failed:", error);
          // If content script fails, try Chrome's notifications API as fallback
          notifyUserWithChromeAPI("URL copied to clipboard!");
        });
      }
    });
  }
});

// Function that handles both copying and notification in the page context
function copyToClipboardAndNotify(text) {
  // Try to copy using Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log("URL copied via Clipboard API");
        showToastNotification("URL copied!");
      })
      .catch(err => {
        console.error("Clipboard API failed:", err);
        // Try fallback
        if (fallbackCopyToClipboard(text)) {
          showToastNotification("URL copied!");
        }
      });
  } else {
    // Use fallback method
    if (fallbackCopyToClipboard(text)) {
      showToastNotification("URL copied!");
    }
  }
}

// Function to show a toast notification
function showToastNotification(message) {
  console.log("Showing notification:", message);
  
  // Create notification element with unique ID to prevent duplicates
  let notification = document.getElementById('url-copier-notification');
  if (notification) {
    notification.remove(); // Remove existing notification if present
  }
  
  notification = document.createElement('div');
  notification.id = 'url-copier-notification';
  notification.textContent = message;
  
  // Add styles directly to the element for maximum compatibility
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = '#4CAF50';
  notification.style.color = 'white';
  notification.style.padding = '12px 24px';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '2147483647'; // Maximum z-index
  notification.style.fontFamily = 'Arial, sans-serif';
  notification.style.fontWeight = 'bold';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  notification.style.transform = 'translateX(0)';
  notification.style.opacity = '1';
  notification.style.transition = 'opacity 0.3s, transform 0.3s';
  
  // Start with it slightly off-screen
  notification.style.transform = 'translateX(100px)';
  notification.style.opacity = '0';
  
  // Add to body
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100px)';
    
    setTimeout(() => {
      if (notification && notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 2000);
  
  return true;
}

// Fallback copy method
function fallbackCopyToClipboard(text) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    return successful;
  } catch (err) {
    console.error("Fallback copy failed:", err);
    return false;
  }
}

// Use Chrome's built-in notifications API as a last resort
function notifyUserWithChromeAPI(message) {
  console.log("Trying Chrome notification API");
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon128.png',
    title: 'URL Copier',
    message: message
  });
}
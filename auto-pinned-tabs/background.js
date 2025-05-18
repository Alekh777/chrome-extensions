// Listen for Chrome startup
chrome.runtime.onStartup.addListener(handleStartup);

// Also handle installation
chrome.runtime.onInstalled.addListener(handleStartup);

async function handleStartup() {
  // Check if we have any windows
  const windows = await chrome.windows.getAll();
  let newTab = null;
  
  if (windows.length === 0) {
    // Only create a new tab if no windows exist
    newTab = await chrome.tabs.create({ url: 'about:blank' });
  }
  
  // Get saved URLs from storage
  const result = await chrome.storage.sync.get('savedUrls');
  const savedUrls = result.savedUrls || [];
  
  if (savedUrls.length === 0) {
    // If no saved URLs and we created a blank tab, close it
    if (newTab) {
      await chrome.tabs.remove(newTab.id);
    }
    return;
  }
  
  // Get all current tabs
  const tabs = await chrome.tabs.query({});
  const currentUrls = new Set(tabs.map(tab => tab.url));
  
  // Process each saved URL
  for (const { url, pinned } of savedUrls) {
    if (currentUrls.has(url)) {
      // URL is already open, check if it needs to be pinned
      const tab = tabs.find(tab => tab.url === url);
      if (pinned && !tab.pinned) {
        await chrome.tabs.update(tab.id, { pinned: true });
      }
    } else {
      // URL is not open, create new tab
      await chrome.tabs.create({ url, pinned });
    }
  }
  
  // Close the initial blank tab if we created one
  if (newTab) {
    await chrome.tabs.remove(newTab.id);
  }
} 
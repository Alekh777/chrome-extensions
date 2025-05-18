document.addEventListener('DOMContentLoaded', () => {
  const newUrlInput = document.getElementById('newUrl');
  const pinNewUrlCheckbox = document.getElementById('pinNewUrl');
  const addUrlButton = document.getElementById('addUrl');
  const urlsList = document.getElementById('urlsList');

  // Load and display saved URLs
  loadUrls();

  // Add new URL
  addUrlButton.addEventListener('click', () => {
    const url = newUrlInput.value.trim();
    if (!url) return;

    // Validate URL
    try {
      new URL(url);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    const shouldPin = pinNewUrlCheckbox.checked;
    addUrlToList(url, shouldPin);
    
    // Clear input
    newUrlInput.value = '';
    pinNewUrlCheckbox.checked = false;
  });

  // Handle Enter key in URL input
  newUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addUrlButton.click();
    }
  });
});

async function loadUrls() {
  const result = await chrome.storage.sync.get('savedUrls');
  const savedUrls = result.savedUrls || [];
  
  const urlsList = document.getElementById('urlsList');
  urlsList.innerHTML = '';
  
  savedUrls.forEach(({ url, pinned }) => {
    addUrlToList(url, pinned, false);
  });
}

function addUrlToList(url, pinned, saveToStorage = true) {
  const urlsList = document.getElementById('urlsList');
  
  const urlItem = document.createElement('div');
  urlItem.className = 'url-item';
  
  const urlSpan = document.createElement('span');
  urlSpan.className = 'url';
  urlSpan.textContent = url;
  
  const actions = document.createElement('div');
  actions.className = 'actions';
  
  const pinCheckbox = document.createElement('input');
  pinCheckbox.type = 'checkbox';
  pinCheckbox.checked = pinned;
  pinCheckbox.addEventListener('change', () => updateUrlPinStatus(url, pinCheckbox.checked));
  
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.textContent = '×';
  deleteButton.addEventListener('click', () => removeUrl(url));
  
  actions.appendChild(pinCheckbox);
  actions.appendChild(deleteButton);
  
  urlItem.appendChild(urlSpan);
  urlItem.appendChild(actions);
  urlsList.appendChild(urlItem);
  
  if (saveToStorage) {
    saveUrl(url, pinned);
  }
}

async function saveUrl(url, pinned) {
  const result = await chrome.storage.sync.get('savedUrls');
  const savedUrls = result.savedUrls || [];
  
  savedUrls.push({ url, pinned });
  await chrome.storage.sync.set({ savedUrls });
}

async function removeUrl(url) {
  const result = await chrome.storage.sync.get('savedUrls');
  const savedUrls = result.savedUrls || [];
  
  const updatedUrls = savedUrls.filter(item => item.url !== url);
  await chrome.storage.sync.set({ savedUrls: updatedUrls });
  
  loadUrls();
}

async function updateUrlPinStatus(url, pinned) {
  const result = await chrome.storage.sync.get('savedUrls');
  const savedUrls = result.savedUrls || [];
  
  const updatedUrls = savedUrls.map(item => {
    if (item.url === url) {
      return { ...item, pinned };
    }
    return item;
  });
  
  await chrome.storage.sync.set({ savedUrls: updatedUrls });
} 
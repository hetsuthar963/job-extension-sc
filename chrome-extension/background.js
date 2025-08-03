// // Background script for Chrome extension
// console.log("AI Web Analyzer background script loaded")

// // Declare chrome variable
// const chrome = window.chrome

// // Handle extension installation
// chrome.runtime.onInstalled.addListener((details) => {
//   if (details.reason === "install") {
//     console.log("Extension installed")

//     // Initialize storage
//     chrome.storage.local.set({
//       pageCount: 0,
//       lastSync: null,
//       settings: {
//         apiUrl: "http://localhost:3000",
//         autoAnalyze: true,
//       },
//     })

//     // Open welcome page
//     chrome.tabs.create({
//       url: "http://localhost:3000",
//     })
//   }
// })

// // Handle browser action click (if popup is not available)
// chrome.action.onClicked.addListener((tab) => {
//   // This will only trigger if no popup is defined
//   console.log("Extension icon clicked", tab)
// })

// // Listen for messages from content scripts or popup
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log("Background received message:", request)

//   if (request.action === "captureCurrentPage") {
//     captureCurrentPage()
//       .then((result) => sendResponse({ success: true, data: result }))
//       .catch((error) => sendResponse({ success: false, error: error.message }))
//     return true // Keep message channel open for async response
//   }
// })

// // Function to capture current page
// async function captureCurrentPage() {
//   try {
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

//     if (!tab) {
//       throw new Error("No active tab found")
//     }

//     // Check if page can be captured
//     if (tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) {
//       throw new Error("Cannot capture system pages")
//     }

//     // Execute content script to extract page data
//     const results = await chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: () => {
//         // This function runs in the page context
//         const title = document.title || "Untitled Page"
//         const content = document.body.innerText || document.body.textContent || ""

//         return {
//           title: title.trim(),
//           content: content.replace(/\s+/g, " ").trim().substring(0, 10000),
//           url: window.location.href,
//         }
//       },
//     })

//     if (!results || !results[0]) {
//       throw new Error("Failed to extract page content")
//     }

//     return results[0].result
//   } catch (error) {
//     console.error("Failed to capture page:", error)
//     throw error
//   }
// }

// // Handle context menu (optional enhancement)
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === "captureSelection") {
//     // Capture selected text
//     chrome.tabs.sendMessage(tab.id, {
//       action: "captureSelection",
//       selection: info.selectionText,
//     })
//   }
// })

// // Create context menu on startup
// chrome.runtime.onStartup.addListener(() => {
//   chrome.contextMenus.create({
//     id: "captureSelection",
//     title: "Capture selected text with AI Analyzer",
//     contexts: ["selection"],
//   })
// })





chrome.runtime.onMessage.addListener((msg, sender, _reply) => {
  if (msg.type !== 'PAGE_HTML' || typeof msg.html !== 'string') {
    console.warn('[BG] Ignored invalid message:', msg);
    return;
  }

  const tabUrl = sender.tab?.url || 'unknown-url';

  const payload = {
    url: tabUrl,
    html: msg.html
  };

  console.log(`[BG] Preparing to POST scraped data from: ${tabUrl}`);
  console.log(`[BG] HTML size: ${msg.html.length} chars`);

  fetch('http://localhost:3000/api/scrape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, url: window.location.href }),
  })
  .then(async (res) => {
    const data = await res.json();
    console.log('[BG] ✅ Server responded with:', data);
  })
  .catch((err) => {
    console.error('[BG] ❌ Error sending data to backend:', err);
  });

});

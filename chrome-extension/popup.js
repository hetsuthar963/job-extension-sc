// Configuration
const API_BASE_URL = "http://localhost:3000" // Change to your deployed URL
const DASHBOARD_URL = `${API_BASE_URL}`

// DOM elements
const captureBtn = document.getElementById("captureBtn")
const status = document.getElementById("status")
const pageTitle = document.getElementById("pageTitle")
const pageUrl = document.getElementById("pageUrl")
const pageCount = document.getElementById("pageCount")
const lastSync = document.getElementById("lastSync")
const openDashboard = document.getElementById("openDashboard")

// Declare chrome variable
const chrome = window.chrome

// Initialize popup
document.addEventListener("DOMContentLoaded", async () => {
  await loadCurrentPageInfo()
  await loadStats()
  setupEventListeners()
})

// Load current page information
async function loadCurrentPageInfo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (tab) {
      pageTitle.textContent = tab.title || "Untitled Page"
      pageUrl.textContent = tab.url || ""

      // Check if page is capturable
      if (tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) {
        captureBtn.disabled = true
        captureBtn.textContent = "❌ Cannot capture this page"
        showStatus("This page cannot be captured", "error")
      }
    }
  } catch (error) {
    console.error("Failed to load page info:", error)
    showStatus("Failed to load page info", "error")
  }
}

// Load statistics
async function loadStats() {
  try {
    const result = await chrome.storage.local.get(["pageCount", "lastSync"])
    pageCount.textContent = result.pageCount || 0

    if (result.lastSync) {
      const date = new Date(result.lastSync)
      lastSync.textContent = date.toLocaleTimeString()
    }
  } catch (error) {
    console.error("Failed to load stats:", error)
  }
}

// Setup event listeners
function setupEventListeners() {
  captureBtn.addEventListener("click", capturePage)
  openDashboard.addEventListener("click", () => {
    chrome.tabs.create({ url: DASHBOARD_URL })
  })
}

// Main capture function
async function capturePage() {
  if (captureBtn.disabled) return

  try {
    captureBtn.disabled = true
    captureBtn.innerHTML = '<span class="loading-spinner"></span>Capturing...'
    showStatus("Extracting page content...", "loading")

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (!tab) {
      throw new Error("No active tab found")
    }

    // Inject content script and extract data
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractPageContent,
    })

    if (!results || !results[0] || !results[0].result) {
      throw new Error("Failed to extract page content")
    }

    const pageData = results[0].result

    showStatus("Sending to AI analyzer...", "loading")

    // Send to backend API
    const response = await fetch(`${API_BASE_URL}/api/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: tab.url,
        title: pageData.title,
        content: pageData.content,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to save page")
    }

    const savedPage = await response.json()

    // Update local storage stats
    const currentCount = await chrome.storage.local.get(["pageCount"])
    await chrome.storage.local.set({
      pageCount: (currentCount.pageCount || 0) + 1,
      lastSync: new Date().toISOString(),
    })

    await loadStats()
    showStatus("✅ Page captured successfully!", "success")

    // Auto-close popup after success
    setTimeout(() => {
      window.close()
    }, 2000)
  } catch (error) {
    console.error("Capture failed:", error)
    showStatus(`❌ ${error.message}`, "error")
  } finally {
    captureBtn.disabled = false
    captureBtn.textContent = "📄 Capture This Page"
  }
}

// Content extraction function (runs in page context)
function extractPageContent() {
  // Remove script and style elements
  const scripts = document.querySelectorAll("script, style, noscript")
  scripts.forEach((el) => el.remove())

  // Get page title
  const title = document.title || document.querySelector("h1")?.textContent || "Untitled Page"

  // Extract main content
  let content = ""

  // Try to find main content areas
  const contentSelectors = [
    "main",
    '[role="main"]',
    ".main-content",
    "#main-content",
    ".content",
    "#content",
    "article",
    ".post-content",
    ".entry-content",
  ]

  let mainContent = null
  for (const selector of contentSelectors) {
    mainContent = document.querySelector(selector)
    if (mainContent) break
  }

  if (mainContent) {
    content = mainContent.innerText || mainContent.textContent || ""
  } else {
    // Fallback to body content
    content = document.body.innerText || document.body.textContent || ""
  }

  // Clean up content
  content = content
    .replace(/\s+/g, " ") // Replace multiple whitespace with single space
    .replace(/\n\s*\n/g, "\n") // Remove empty lines
    .trim()

  // Limit content length (API limits)
  if (content.length > 10000) {
    content = content.substring(0, 10000) + "..."
  }

  return {
    title: title.trim(),
    content: content,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  }
}

// Show status message
function showStatus(message, type) {
  status.textContent = message
  status.className = `status ${type}`
  status.style.display = "block"

  if (type === "success") {
    setTimeout(() => {
      status.style.display = "none"
    }, 3000)
  }
}

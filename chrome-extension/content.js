// // Content script for additional page interaction if needed
// console.log("AI Web Analyzer content script loaded")

// // Declare chrome variable
// const chrome = window.chrome

// // Listen for messages from popup or background script
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "extractContent") {
//     try {
//       const content = extractPageContent()
//       sendResponse({ success: true, data: content })
//     } catch (error) {
//       sendResponse({ success: false, error: error.message })
//     }
//   }
// })

// // Enhanced content extraction function
// function extractPageContent() {
//   // Remove unwanted elements
//   const unwantedSelectors = [
//     "script",
//     "style",
//     "noscript",
//     "iframe",
//     ".advertisement",
//     ".ads",
//     ".sidebar",
//     ".navigation",
//     ".nav",
//     ".menu",
//     ".footer",
//     ".header",
//     ".cookie-banner",
//   ]

//   unwantedSelectors.forEach((selector) => {
//     const elements = document.querySelectorAll(selector)
//     elements.forEach((el) => el.remove())
//   })

//   // Get structured content
//   const result = {
//     title: document.title,
//     url: window.location.href,
//     content: "",
//     metadata: {
//       description: document.querySelector('meta[name="description"]')?.content || "",
//       keywords: document.querySelector('meta[name="keywords"]')?.content || "",
//       author: document.querySelector('meta[name="author"]')?.content || "",
//       publishedTime: document.querySelector('meta[property="article:published_time"]')?.content || "",
//       modifiedTime: document.querySelector('meta[property="article:modified_time"]')?.content || "",
//     },
//   }

//   // Extract main content with priority order
//   const contentSelectors = [
//     "main",
//     '[role="main"]',
//     "article",
//     ".main-content",
//     "#main-content",
//     ".content",
//     "#content",
//     ".post-content",
//     ".entry-content",
//     ".job-description",
//     ".job-details",
//     ".company-info",
//     ".profile-content",
//   ]

//   let mainElement = null
//   for (const selector of contentSelectors) {
//     mainElement = document.querySelector(selector)
//     if (mainElement && mainElement.innerText.trim().length > 100) {
//       break
//     }
//   }

//   if (mainElement) {
//     result.content = mainElement.innerText || mainElement.textContent || ""
//   } else {
//     // Fallback to body, but try to exclude navigation and footer
//     const bodyClone = document.body.cloneNode(true)
//     const excludeSelectors = ["nav", ".nav", ".navigation", "footer", ".footer", "header", ".header"]
//     excludeSelectors.forEach((selector) => {
//       const elements = bodyClone.querySelectorAll(selector)
//       elements.forEach((el) => el.remove())
//     })
//     result.content = bodyClone.innerText || bodyClone.textContent || ""
//   }

//   // Clean and format content
//   result.content = result.content
//     .replace(/\s+/g, " ")
//     .replace(/\n\s*\n/g, "\n")
//     .trim()

//   // Limit content size
//   if (result.content.length > 15000) {
//     result.content = result.content.substring(0, 15000) + "..."
//   }

//   return result
// }

// // Auto-detect page type for better categorization
// function detectPageType() {
//   const url = window.location.href.toLowerCase()
//   const title = document.title.toLowerCase()
//   const content = document.body.textContent.toLowerCase()

//   // Job-related detection
//   const jobIndicators = [
//     "job",
//     "career",
//     "position",
//     "hiring",
//     "employment",
//     "developer",
//     "engineer",
//     "manager",
//     "analyst",
//     "salary",
//     "benefits",
//     "apply now",
//     "job description",
//   ]

//   // Business/company detection
//   const businessIndicators = [
//     "company",
//     "about us",
//     "leadership",
//     "team",
//     "ceo",
//     "founder",
//     "executive",
//     "management",
//     "revenue",
//     "funding",
//     "investors",
//     "portfolio",
//   ]

//   const jobScore = jobIndicators.reduce((score, indicator) => {
//     if (url.includes(indicator) || title.includes(indicator)) score += 2
//     if (content.includes(indicator)) score += 1
//     return score
//   }, 0)

//   const businessScore = businessIndicators.reduce((score, indicator) => {
//     if (url.includes(indicator) || title.includes(indicator)) score += 2
//     if (content.includes(indicator)) score += 1
//     return score
//   }, 0)

//   if (jobScore > businessScore && jobScore > 3) return "job"
//   if (businessScore > jobScore && businessScore > 3) return "business"
//   return "other"
// }








console.log("✅ Content script loaded:", window.location.href);

function injectScraperWidget() {
  if (document.getElementById('scraper-widget')) return;

  // Create the widget container
  const container = document.createElement('div');
  container.id = 'scraper-widget';
  Object.assign(container.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '9999',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    color: '#ffffff',
    borderRadius: '12px',
    padding: '16px',
    width: '240px',
    fontFamily: 'Segoe UI, sans-serif',
    fontSize: '14px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  });

  container.innerHTML = `
    <div style="font-weight: 600; font-size: 16px;">⚙️ Scraper Tools</div>
    <button id="scrape-now" style="
      padding: 8px 12px;
      background-color: white;
      color: #1e3a8a;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
    ">🔍 Scrape This Job</button>
    <div id="scrape-status" style="min-height: 18px; font-size: 13px; color: #d1d5db;"></div>
  `;

  document.body.appendChild(container);

  const button = document.getElementById('scrape-now');
  const statusEl = document.getElementById('scrape-status');

  button?.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#e0e7ff';
    button.style.color = '#1d4ed8';
  });
  button?.addEventListener('mouseleave', () => {
    button.style.backgroundColor = 'white';
    button.style.color = '#1e3a8a';
  });

  button?.addEventListener('click', () => {
    if (statusEl) statusEl.textContent = '⏳ Scraping...';

    const selectorMap = {
      'linkedin.com': '.jobs-description__container',
      'naukri.com': '.job-desc',
      'indeed.com': '#jobDescriptionText',
      'glassdoor.com': '.jobDescriptionContent',
      'monsterindia.com': '.job-description',
      'x-vertice.com': 'main'
    };

    const hostname = window.location.hostname;
    const matchedSelector = Object.entries(selectorMap).find(([domain]) =>
      hostname.includes(domain)
    )?.[1];

    let jobElement = matchedSelector ? document.querySelector(matchedSelector) : null;

    if (!jobElement) {
      console.warn('[ScrapeIt] Fallback: using <main> or <body>');
      jobElement = document.querySelector('main') || document.body;
    }

    if (!jobElement) {
      console.error('[ScrapeIt] No HTML content found to scrape.');
      if (statusEl) statusEl.textContent = '❌ Failed: No content found';
      return;
    }

    const html = jobElement.outerHTML;
    console.log('[ScrapeIt] HTML length:', html.length);

    chrome.runtime.sendMessage({ type: 'PAGE_HTML', html }, () => {
      if (statusEl) statusEl.textContent = '✅ Scraped!';
      setTimeout(() => (statusEl.textContent = ''), 3000);
    });
  });
}

injectScraperWidget();

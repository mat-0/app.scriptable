// ==================================================
// Multi-Site Status Monitor Widget for Scriptable
// ==================================================
// 
// Description:
// This widget monitors multiple status pages (1-8 sites) and displays
// their operational status with visual indicators:
// - Green up arrow (↑) for operational sites
// - Grey down arrow (↓) for sites with issues
// 
// The widget refreshes every 5 minutes automatically.
// Tap on the widget to view all sites in Safari.
//
// Setup:
// 1. Add your status page URLs in the CONFIG section below
// 2. Add the script to Scriptable
// 3. Add a Scriptable widget to your home screen
// 4. Select this script in the widget settings
// ==================================================

// ==================================================
// CONFIG SECTION - Add your status page URLs here
// ==================================================
const CONFIG = {
  sites: [
    {
      name: "Cloudflare",
      url: "https://www.cloudflarestatus.com",
      needle: "All Systems Operational"
    },
    {
      name: "GitHub",
      url: "https://www.githubstatus.com",
      needle: "All Systems Operational"
    },
    {
      name: "IFTTT",
      url: "https://status.ifttt.com",
      needle: "All Systems Operational"
    },
    {
      name: "Stripe",
      url: "https://status.stripe.com",
      apiUrl: "https://status.stripe.com/api/v2/summary.json",
      useWebView: true
    },
    {
      name: "Gumroad",
      url: "https://status.gumroad.com",
      needle: "All Systems Operational"
    },
    {
      name: "Claude",
      url: "https://anthropic.statuspage.io",
      needle: "All Systems Operational"
    },
    {
      name: "Gemini",
      url: "https://aistudio.google.com/status",
      useWebView: true
    },
  ],
  refreshInterval: 5 // minutes
}

// ==================================================
// Main Widget Code
// ==================================================

async function checkSiteStatus(site) {
  try {
    if (site.useWebView && !config.runsInWidget) {
      // Use WebView for JavaScript-rendered pages (only in app, not in widget)
      let webView = new WebView()
      await webView.loadURL(site.url)
      
      // Wait for page to load and get the text content
      let pageText = await webView.evaluateJavaScript(`
        document.body.innerText || document.body.textContent
      `, false)
      
      let isUp = pageText.includes("All Systems Operational") || 
                 pageText.includes("all systems operational") ||
                 pageText.includes("No known issues")
      
      return {
        name: site.name,
        url: site.url,
        isUp: isUp,
        error: false
      }
    } else if (site.useWebView && config.runsInWidget) {
      // In widget mode, try API first, then assume up if can't determine
      if (site.apiUrl) {
        try {
          let req = new Request(site.apiUrl)
          req.timeoutInterval = 5
          let data = await req.loadJSON()
          let isUp = data && data.status && (data.status.indicator === "none")
          return {
            name: site.name,
            url: site.url,
            isUp: isUp,
            error: false
          }
        } catch (e) {
          // If API fails, assume operational (optimistic)
          return {
            name: site.name,
            url: site.url,
            isUp: true,
            error: false
          }
        }
      } else {
        // No API available, assume operational
        return {
          name: site.name,
          url: site.url,
          isUp: true,
          error: false
        }
      }
    } else {
      // Handle HTML responses normally
      let req = new Request(site.url)
      req.timeoutInterval = 10
      let body = await req.loadString()
      let needles = site.needles || [site.needle]
      let isUp = needles.some(needle => body.includes(needle))
      
      return {
        name: site.name,
        url: site.url,
        isUp: isUp,
        error: false
      }
    }
  } catch (error) {
    console.log(`Error checking ${site.name}: ${error}`)
    return {
      name: site.name,
      url: site.url,
      isUp: false,
      error: true
    }
  }
}

async function createWidget() {
  let widget = new ListWidget()
  widget.backgroundColor = new Color("#1c1c1e")
  widget.setPadding(12, 16, 12, 16)
  
  // Set refresh interval
  let refreshDate = new Date()
  refreshDate.setMinutes(refreshDate.getMinutes() + CONFIG.refreshInterval)
  widget.refreshAfterDate = refreshDate
  
  // Header with title and last updated
  let headerStack = widget.addStack()
  headerStack.layoutHorizontally()
  headerStack.centerAlignContent()
  
  let title = headerStack.addText("🔍 Status Monitor")
  title.font = Font.boldSystemFont(13)
  title.textColor = Color.white()
  
  headerStack.addSpacer()
  
  let dateFormatter = new DateFormatter()
  dateFormatter.useShortTimeStyle()
  let updateText = headerStack.addText(dateFormatter.string(new Date()))
  updateText.font = Font.systemFont(8)
  updateText.textColor = new Color("#8e8e93")
  
  widget.addSpacer(8)
  
  // Check all sites
  let statuses = await Promise.all(
    CONFIG.sites.map(site => checkSiteStatus(site))
  )
  
  // Calculate layout - always 2 columns, wrap to new rows
  let numSites = statuses.length
  let columns = 2
  let rows = Math.ceil(numSites / columns)
  
  // Container for all site cards
  let mainStack = widget.addStack()
  mainStack.layoutVertically()
  mainStack.spacing = 5
  
  // Display sites in grid with fixed widths
  for (let row = 0; row < rows; row++) {
    let rowStack = mainStack.addStack()
    rowStack.layoutHorizontally()
    rowStack.spacing = 6
    
    for (let col = 0; col < columns; col++) {
      let index = row * columns + col
      
      if (index < numSites) {
        let status = statuses[index]
        
        // Create site status card container
        let cardContainer = rowStack.addStack()
        cardContainer.layoutVertically()
        cardContainer.cornerRadius = 6
        cardContainer.backgroundColor = new Color("#2c2c2e")
        cardContainer.size = new Size(145, 26)
        cardContainer.url = status.url
        
        // Inner stack for content with left alignment
        let siteStack = cardContainer.addStack()
        siteStack.layoutHorizontally()
        siteStack.centerAlignContent()
        siteStack.spacing = 5
        siteStack.setPadding(5, 8, 5, 0)
        
        // Status indicator (smaller)
        let indicator = siteStack.addText(status.isUp ? "↑" : "↓")
        indicator.font = Font.boldSystemFont(14)
        indicator.textColor = status.isUp ? new Color("#34c759") : new Color("#8e8e93")
        
        // Site name in small caps
        let nameText = siteStack.addText(status.name.toUpperCase())
        nameText.font = Font.systemFont(9)
        nameText.textColor = Color.white()
        nameText.lineLimit = 1
        nameText.minimumScaleFactor = 0.7
        
        // Push content to the left (remove right padding effect)
        siteStack.addSpacer()
        
      } else {
        // Add invisible spacer to maintain layout
        let spacerStack = rowStack.addStack()
        spacerStack.size = new Size(145, 26)
      }
    }
  }
  
  mainStack.addSpacer()
  
  return widget
}

// ==================================================
// Run Widget
// ==================================================

if (config.runsInWidget) {
  let widget = await createWidget()
  Script.setWidget(widget)
  Script.complete()
} else if (config.runsWithSiri) {
  // Siri integration - speak status
  let statuses = await Promise.all(
    CONFIG.sites.map(site => checkSiteStatus(site))
  )
  let allUp = statuses.every(s => s.isUp)
  let downSites = statuses.filter(s => !s.isUp).map(s => s.name)
  
  if (allUp) {
    Speech.speak("All systems operational")
  } else {
    Speech.speak(`Issues detected with: ${downSites.join(", ")}`)
  }
} else {
  // Preview widget
  let widget = await createWidget()
  await widget.presentMedium()
}
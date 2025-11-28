// ===== CONFIGURATION =====
const YAML_URL =
    "https://raw.githubusercontent.com/mat-0/uk.thechels/refs/heads/main/_data/quotes.yml";

const CACHE_DURATION = 12;
const AUTO_REFRESH_MINUTES = 5;

const themes = {
    minimal: {
        bg1: "#010101",
        bg2: "#232323",
        text: "#f1f1f1",
        accent: "#95a5a6",
    },
};

const THEME = themes.minimal;

async function fetchQuotes() {
    let quotes = [];
    try {
        let req = new Request(YAML_URL);
        let yaml = await req.loadString();
        let lines = yaml.split("\n");
        for (let line of lines) {
            line = line.trim();
            if (line && !line.startsWith("#")) {
                line = line.replace(/^-\s*/, "");
                line = line.replace(/^["'](.*)["']$/, "$1");
                if (line) {
                    let parts = line.split(" - ");
                    let quoteObj = {
                        text: parts[0].trim(),
                        author: parts.length > 1 ? parts[1].trim() : "",
                    };
                    quotes.push(quoteObj);
                }
            }
        }
    } catch (error) {
        console.error("Error: " + error);
        quotes = [{ text: "Error loading quotes", author: "" }];
    }
    return quotes;
}

async function getQuotes() {
    let fm = FileManager.local();
    let cacheDir = fm.joinPath(fm.documentsDirectory(), "quote-cache");
    let cachePath = fm.joinPath(cacheDir, "quotes-v2.json");
    if (!fm.fileExists(cacheDir)) {
        fm.createDirectory(cacheDir);
    }
    if (fm.fileExists(cachePath)) {
        let cacheDate = fm.modificationDate(cachePath);
        let now = new Date();
        let hoursSinceCached = (now - cacheDate) / (1000 * 60 * 60);
        if (hoursSinceCached < CACHE_DURATION) {
            let cached = fm.readString(cachePath);
            return JSON.parse(cached);
        }
    }
    let quotes = await fetchQuotes();
    fm.writeString(cachePath, JSON.stringify(quotes));
    return quotes;
}

function getRandomQuote(quotes) {
    if (quotes.length === 0) {
        return { text: "No quotes available", author: "" };
    }
    let now = new Date();
    let minutesSinceEpoch = Math.floor(now.getTime() / 1000 / 60);
    let seed = Math.floor(minutesSinceEpoch / AUTO_REFRESH_MINUTES);
    let index = seed % quotes.length;
    return quotes[index];
}

let widget = new ListWidget();
let quotes = await getQuotes();
let quote = getRandomQuote(quotes);

let gradient = new LinearGradient();
gradient.colors = [new Color(THEME.bg1), new Color(THEME.bg2)];
gradient.locations = [0.0, 1.0];
widget.backgroundGradient = gradient;
widget.setPadding(10, 14, 10, 14);

widget.addSpacer();

let quoteText = widget.addText(quote.text);
quoteText.font = Font.regularSystemFont(15);
quoteText.textColor = new Color(THEME.text);
quoteText.centerAlignText();

widget.addSpacer(6);

if (quote.author) {
    let authorText = widget.addText("— " + quote.author);
    authorText.font = Font.italicSystemFont(12);
    authorText.textColor = new Color(THEME.text);
    authorText.textOpacity = 0.8;
    authorText.centerAlignText();
}

widget.addSpacer();

let nextRefresh = new Date();
nextRefresh.setMinutes(nextRefresh.getMinutes() + AUTO_REFRESH_MINUTES);
widget.refreshAfterDate = nextRefresh;

if (config.runsInWidget) {
    Script.setWidget(widget);
} else {
    widget.presentMedium();
}

Script.complete();

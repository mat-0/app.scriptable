let items = await loadItems();

if (config.runsInWidget) {
    let widget = createWidget(items);
    Script.setWidget(widget);
    Script.complete();
} else {
    let item = items[0];
    Safari.open(item.url);
}

function createWidget(items) {
    let item = items[0];
    let authors = item.authors
        .map((a) => {
            return a.name;
        })
        .join(", ");
    let rawDate = item["date_published"];
    let date = new Date(Date.parse(rawDate));
    let df = new DateFormatter();
    df.useFullDateStyle();
    df.useShortTimeStyle();
    let strDate = df.string(date);
    let w = new ListWidget();
    w.backgroundColor = new Color("#b00a0f");
    w.centerAlignContent();
    let titleTxt = w.addText(item.title);
    titleTxt.applyHeadlineTextStyling();
    titleTxt.textColor = Color.white();
    let authorsTxt = w.addText("by " + authors);
    authorsTxt.applyBodyTextStyling();
    authorsTxt.textColor = Color.white();
    authorsTxt.textOpacity = 0.8;
    let dateTxt = w.addText(strDate);
    dateTxt.applyBodyTextStyling();
    dateTxt.textColor = Color.white();
    dateTxt.textOpacity = 0.8;
    return w;
}

async function loadItems() {
    let url = "https://macstories.net/feed/json";
    let req = new Request(url);
    let json = await req.loadJSON();
    return json.items;
}

function extractImageURL(item) {
    let regex = /<img src="(.*)" alt="/;
    let html = item["content_html"];
    let matches = html.match(regex);
    if (matches && matches.length >= 2) {
        return matches[1];
    } else {
        return null;
    }
}

function decode(str) {
    let regex = /&#(\d+);/g;
    return str.replace(regex, (match, dec) => {
        return String.fromCharCode(dec);
    });
}

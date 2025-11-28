// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: graduation-cap;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: user-md;
let url_feed = "https://wordsmith.org/awad/rss1.xml";
let r = new Request(url_feed);
let xml = await r.loadString();

function getOutput(xml) {
    xml.items.forEach((item) => {
        let title = clean(item.title);
        let desc = clean(item.description);
        output = title + desc;
    });
    return output;
}

if (config.runsWithSiri) {
    Speech.speak(output);
}

if (config.runsInWidget) {
    // create and show widget
    let widget = createWidget("Word of the day", `${output}`, "#F26419");
    Script.setWidget(widget);
    Script.complete();
}

function createWidget(pre_title, output_string, color) {
    let w = new ListWidget();
    w.backgroundColor = new Color(color);
    let preTxt = w.addText(pre_title);
    preTxt.textColor = Color.white();
    preTxt.textOpacity = 0.9;
    preTxt.font = Font.systemFont(16);
    w.addSpacer(3);
    let titleTxt = w.addText(output_string);
    titleTxt.textColor = Color.white();
    titleTxt.font = Font.systemFont(10);
    w.addSpacer(3);
    return w;
}

function clean(str) {
    str = str.replace("&amp;#8221;", "'");
    str = str.replace("&amp;#8220;", "'");
    str = unescapeHTML(str);
    str = str.replace(/<[^>]*>?/gm, "");
    str = str.replace(/<img[^>]*>/g, "");
    let regex = /&#(\d+);/g;
    str = str.replace(regex, (match, dec) => {
        String.fromCharCode(dec);
    });

    return str;
}

function unescapeHTML(escapedHTML) {
    return escapedHTML
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");
}

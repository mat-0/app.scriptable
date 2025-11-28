// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: quote-right;
const url =
    "https://raw.githubusercontent.com/Mat-0/morning.thechels.uk/main/config/quotes.json";
let req = new Request(url);
let json = await req.loadJSON();

out_s = json[Math.floor(Math.random() * json.length)];

console.log(out_s);

function createWidget(pretitle, out_s, color) {
    let w = new ListWidget();
    w.backgroundColor = new Color(color);
    let preTxt = w.addText(pretitle);
    preTxt.textColor = Color.white();
    preTxt.textOpacity = 0.9;
    preTxt.font = Font.systemFont(16);
    w.addSpacer(2);
    let titleTxt = w.addText(out_s);
    titleTxt.textColor = Color.white();
    titleTxt.font = Font.systemFont(10);
    w.addSpacer(2);
    return w;
}

let widget = createWidget("Agile Quotes", `${out_s}`, "#0B4F6C");

//  the widget
if (config.runsInWidget) {
    // create and show widget
    Script.setWidget(widget);
}

// preview the widget if in app
if (!config.runsInWidget) {
    await widget.presentSmall();
}

Script.complete();

// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: user-secret;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: user-md;
let url_feed = "https://www.mi5.gov.uk/UKThreatLevel/UKThreatLevel.xml";
let r = new Request(url_feed);
let xml = await r.loadString();

let start = xml.split("<description>");
let content = start[2];
let end = content.split("</description>");
let output = end[0];

if (config.runsWithSiri) {
    Speech.speak(output);
}
console.log(output);

if (config.runsInWidget) {
    // create and show widget
    let widget = createWidget("Threat level", `${output}`, "#B22222");
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

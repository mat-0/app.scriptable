// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: user-md;
let url_feed = "http://thechels.uk/feed/";
let r = new Request(url_feed);
let xml = await r.loadString();

n1 = getDesc(xml, 0);
n2 = getDesc(xml, 1);
n3 = getDesc(xml, 2);
n4 = getDesc(xml, 3);

let o = n1 + "\n" + n2 + "\n" + n3 + "\n" + n4;

if (config.runsWithSiri) {
    Speech.speak(o);
}

console.log(o);

if (config.runsInWidget) {
    // create and show widget
    let widget = createWidget("thechelsuk latest", `${o}`, "#034694");
    Script.setWidget(widget);
    Script.complete();
}

function createWidget(pretitle, output_string, color) {
    let w = new ListWidget();
    w.backgroundColor = new Color(color);
    let preTxt = w.addText(pretitle);
    preTxt.textColor = Color.white();
    preTxt.textOpacity = 0.9;
    preTxt.font = Font.systemFont(16);
    w.addSpacer(3);
    let titleTxt = w.addText(output_string);
    titleTxt.textColor = Color.white();
    titleTxt.font = Font.systemFont(12);
    w.addSpacer(3);
    return w;
}

function getDesc(string, count) {
    let a1 = string.split("<item>");
    a1 = a1[count + 1];
    a1 = a1.split("</item>")[0];

    a1 = a1.split("<description>");
    a1 = a1[1];
    a1 = a1.split("</description>")[0];

    let o = "• " + a1;
    return o;
}

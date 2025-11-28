let list = [
    "Bodyweight squats",
    "Kettlebell swings",
    "Plank",
    "Kettlebell rows",
    "Walking jacks",
    "Dead bugs",
    "Bench dips",
    "Calf raises",
    "Shadow boxing",
];

// get random item from list and return the string
function getRandomItem(list) {
    let randomIndex = Math.floor(Math.random() * list.length);

    return list[randomIndex];
}

let output = getRandomItem(list);

console.log(output);

if (config.runsWithSiri) {
    Speech.speak(output);
}

if (config.runsInWidget) {
    // create and show widget
    let widget = createWidget("Exercise of the day", `${output}`, "#F26419");
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

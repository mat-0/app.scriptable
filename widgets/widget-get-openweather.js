// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: cloud;

// Widget Params
// Don't edit this, those are default values for debugging (location for Cupertino).
// You need to give your locations parameters through the widget params, more info below.
const widgetParams = JSON.parse(
    args.widgetParameter != null
        ? args.widgetParameter
        : '{ "LAT" : "37.32" , "LON" : "-122.03" , "LOC_NAME" : "Cupertino, US" }'
);

// WEATHER API PARAMETERS !important
// API KEY, you need an Open Weather API Key
// You can get one for free at: https://home.openweathermap.org/api_keys (account needed).
const API_KEY = "[key]";

// Latitude and Longitude of the location where you get the weather of.
// You can get those from the Open Weather website while searching for a city, etc.
// This values are getted from the widget parameters, the widget parameters is a JSON string that looks like this:
// { "LAT" : "<latitude>" , "LON" : "<longitude>" , "LOC_NAME" : "<name to display>" }
// This to allow multiple instances of the widget with different locations, if you will only use one instance (1 widget), you can "hardcode" the values here.
// Note: To debug the widget you need to place the values here, because when playing the script in-app the widget parameters are null (= crash).
const LAT = widgetParams.LAT;
const LON = widgetParams.LON;
const LOCATION_NAME = widgetParams.LOC_NAME;

// Looking settings
// This are settings to customize the looking of the widgets, because this was made an iPhone SE (2016) screen, I can't test for bigger screens.
// So feel free to modify this to your taste.

// units : string > Defines the unit used to measure the temps, for temperatures in Fahrenheit use "imperial", "metric" for Celcius and "standard" for Kelvin (Default: "metric").
const units = "metric";
// roundedGraph : true|false > true (Use rounded values to draw the graph) | false (Draws the graph using decimal values, this can be used to draw an smoother line).
const roundedGraph = true;
// roundedTemp : true|false > true (Displays the temps rounding the values (29.8 = 30 | 29.3 = 29).
const roundedTemp = true;
// hoursToShow : number > Number of predicted hours to show, Eg: 3 = a total of 4 hours in the widget (Default: 3 for the small widget and 11 for the medium one).
const hoursToShow = config.widgetFamily == "small" ? 3 : 11;
// spaceBetweenDays : number > Size of the space between the temps in the graph in pixels. (Default: 60 for the small widget and 44 for the medium one).
const spaceBetweenDays = config.widgetFamily == "small" ? 60 : 44;

// Widget Size !important.
// Since the widget works "making" an image and displaying it as the widget background, you need to specify the exact size of the widget to
// get an 1:1 display ratio, if you specify an smaller size than the widget itself it will be displayed blurry.
// You can get the size simply taking an screenshot of your widgets on the home screen and measuring them in an image-proccessing software.
// contextSize : number > Height of the widget in screen pixels, this depends on you screen size (for an 4 inch display the small widget is 282 * 282 pixels on the home screen)
const contextSize = 282;
// mediumWidgetWidth : number > Width of the medium widget in pixels, this depends on you screen size (for an 4 inch display the medium widget is 584 pixels long on the home screen)
const mediumWidgetWidth = 584;

// accentColor : Color > Accent color of some elements (Graph lines and the location label).
const accentColor = new Color("#EB6E4E", 1);
// backgroundColor : Color > Background color of the widgets.
const backgroundColor = new Color("#1C1C1E", 1);

// Position and size of the elements on the widget.
// All coordinates make reference to the top-left of the element.
// locationNameCoords : Point > Define the position in pixels of the location label.
const locationNameCoords = new Point(30, 30);
// locationNameFontSize : number > Size in pixels of the font of the location label.
const locationNameFontSize = 24;
// weatherDescriptionCoords : Point > Position of the weather description label in pixels.
const weatherDescriptionCoords = new Point(30, 52);
// weatherDescriptionFontSize : number > Font size of the weather description label.
const weatherDescriptionFontSize = 18;
//footerFontSize : number > Font size of the footer labels (feels like... and last update time).
const footerFontSize = 20;
//feelsLikeCoords : Point > Coordinates of the "feels like" label.
const feelsLikeCoords = new Point(30, 230);
//lastUpdateTimePosAndSize : Rect > Defines the coordinates and size of the last updated time label.
const lastUpdateTimePosAndSize = new Rect(
    config.widgetFamily == "small" ? 150 : 450,
    230,
    100,
    footerFontSize + 1
);

// Prepare for the SFSymbol request by getting sunset/sunrise times.
const date = new Date();
const sunData = await new Request(
    "https://api.sunrise-sunset.org/json?lat=" +
        LAT +
        "&lng=" +
        LON +
        "&formatted=0&date=" +
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate()
).loadJSON();

//From here proceed with caution.
let fm = FileManager.iCloud();
let cachePath = fm.joinPath(fm.documentsDirectory(), "weatherCache");
if (!fm.fileExists(cachePath)) {
    fm.createDirectory(cachePath);
}

let weatherData;
let usingCachedData = false;
let drawContext = new DrawContext();

drawContext.size = new Size(
    config.widgetFamily == "small" ? contextSize : mediumWidgetWidth,
    contextSize
);
drawContext.opaque = false;
drawContext.setTextAlignedCenter();

try {
    weatherData = await new Request(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            LAT +
            "&lon=" +
            LON +
            "&exclude=daily,minutely,alerts&units=" +
            units +
            "&lang=en&appid=" +
            API_KEY
    ).loadJSON();
    fm.writeString(
        fm.joinPath(cachePath, "lastread"),
        JSON.stringify(weatherData)
    );
} catch (e) {
    console.log("Offline mode");
    try {
        let raw = fm.readString(fm.joinPath(cachePath, "lastread"));
        weatherData = JSON.parse(raw);
        usingCachedData = true;
    } catch (e2) {
        console.log("Error: No offline data cached");
    }
}

let widget = new ListWidget();
widget.setPadding(0, 0, 0, 0);
widget.backgroundColor = backgroundColor;

drawText(
    LOCATION_NAME,
    locationNameFontSize,
    locationNameCoords.x,
    locationNameCoords.y,
    accentColor
);
drawText(
    weatherData.current.weather[0].description,
    weatherDescriptionFontSize,
    weatherDescriptionCoords.x,
    weatherDescriptionCoords.y,
    Color.white()
);

let min, max, diff;
for (let i = 0; i <= hoursToShow; i++) {
    let temp = shouldRound(roundedGraph, weatherData.hourly[i].temp);
    min = temp < min || min == undefined ? temp : min;
    max = temp > max || max == undefined ? temp : max;
}
diff = max - min;

for (let i = 0; i <= hoursToShow; i++) {
    let hourData = weatherData.hourly[i];
    let nextHourTemp = shouldRound(
        roundedGraph,
        weatherData.hourly[i + 1].temp
    );
    let hour = epochToDate(hourData.dt).getHours();
    hour =
        hour > 12 ? hour - 12 : hour == 0 ? "12a" : hour == 12 ? "12p" : hour;
    let temp = i == 0 ? weatherData.current.temp : hourData.temp;
    let delta = diff > 0 ? (shouldRound(roundedGraph, temp) - min) / diff : 0.5;
    let nextDelta = diff > 0 ? (nextHourTemp - min) / diff : 0.5;

    if (i < hoursToShow)
        drawLine(
            spaceBetweenDays * i + 50,
            175 - 50 * delta,
            spaceBetweenDays * (i + 1) + 50,
            175 - 50 * nextDelta,
            4,
            hourData.dt > weatherData.current.sunset
                ? Color.gray()
                : accentColor
        );

    drawTextC(
        shouldRound(roundedTemp, temp) + "°",
        20,
        spaceBetweenDays * i + 30,
        135 - 50 * delta,
        50,
        21,
        Color.white()
    );

    // The next three lines were modified for SFSymbol support.
    const condition =
        i == 0 ? weatherData.current.weather[0].id : hourData.weather[0].id;
    const condDate = i == 0 ? weatherData.current.dt : hourData.dt;
    drawImage(
        symbolForCondition(condition, condDate),
        spaceBetweenDays * i + 40,
        165 - 50 * delta
    );

    drawTextC(
        i == 0 ? "Now" : hour,
        18,
        spaceBetweenDays * i + 25,
        200,
        50,
        21,
        Color.gray()
    );

    previousDelta = delta;
}

drawText(
    "feels like " + Math.round(weatherData.current.feels_like) + "°",
    footerFontSize,
    feelsLikeCoords.x,
    feelsLikeCoords.y,
    Color.gray()
);

drawContext.setTextAlignedRight();
drawTextC(
    epochToDate(weatherData.current.dt).toLocaleTimeString(),
    footerFontSize,
    lastUpdateTimePosAndSize.x,
    lastUpdateTimePosAndSize.y,
    lastUpdateTimePosAndSize.width,
    lastUpdateTimePosAndSize.height,
    Color.gray()
);

widget.backgroundImage = drawContext.getImage();
widget.presentMedium();

async function loadImage(imgName) {
    if (fm.fileExists(fm.joinPath(cachePath, imgName))) {
        return Image.fromData(Data.fromFile(fm.joinPath(cachePath, imgName)));
    } else {
        let imgdata = await new Request(
            "https://openweathermap.org/img/wn/" + imgName + ".png"
        ).load();
        let img = Image.fromData(imgdata);
        fm.write(fm.joinPath(cachePath, imgName), imgdata);
        return img;
    }
}

function epochToDate(epoch) {
    return new Date(epoch * 1000);
}

function drawText(text, fontSize, x, y, color = Color.black()) {
    drawContext.setFont(Font.boldSystemFont(fontSize));
    drawContext.setTextColor(color);
    drawContext.drawText(new String(text).toString(), new Point(x, y));
}

function drawImage(image, x, y) {
    drawContext.drawImageAtPoint(image, new Point(x, y));
}

function drawTextC(text, fontSize, x, y, w, h, color = Color.black()) {
    drawContext.setFont(Font.boldSystemFont(fontSize));
    drawContext.setTextColor(color);
    drawContext.drawTextInRect(
        new String(text).toString(),
        new Rect(x, y, w, h)
    );
}

function drawLine(x1, y1, x2, y2, width, color) {
    const path = new Path();
    path.move(new Point(x1, y1));
    path.addLine(new Point(x2, y2));
    drawContext.addPath(path);
    drawContext.setStrokeColor(color);
    drawContext.setLineWidth(width);
    drawContext.strokePath();
}

function shouldRound(should, value) {
    return should ? Math.round(value) : value;
}

// This function returns an SFSymbol image for a weather condition.
function symbolForCondition(cond, condDate) {
    const sunrise = new Date(sunData.results.sunrise).getTime();
    const sunset = new Date(sunData.results.sunset).getTime();
    const timeValue = condDate * 1000;

    // Is it night at the provided date?
    const night = timeValue < sunrise || timeValue > sunset;

    // Define our symbol equivalencies.
    let symbols = {
        // Thunderstorm
        2: function () {
            return "cloud.bolt.rain.fill";
        },

        // Drizzle
        3: function () {
            return "cloud.drizzle.fill";
        },

        // Rain
        5: function () {
            return cond == 511 ? "cloud.sleet.fill" : "cloud.rain.fill";
        },

        // Snow
        6: function () {
            return cond >= 611 && cond <= 613 ? "cloud.snow.fill" : "snow";
        },

        // Atmosphere
        7: function () {
            if (cond == 781) {
                return "tornado";
            }
            if (cond == 701 || cond == 741) {
                return "cloud.fog.fill";
            }
            return night ? "cloud.fog.fill" : "sun.haze.fill";
        },

        // Clear and clouds
        8: function () {
            if (cond == 800) {
                return night ? "moon.stars.fill" : "sun.max.fill";
            }
            if (cond == 802 || cond == 803) {
                return night ? "cloud.moon.fill" : "cloud.sun.fill";
            }
            return "cloud.fill";
        },
    };

    // Find out the first digit.
    let conditionDigit = Math.floor(cond / 100);

    // Get the symbol.
    return SFSymbol.named(symbols[conditionDigit]()).image;
}

Script.complete();

// This Scriptable uses the Cache module by @evandcoleman
// https://github.com/yaylinda/scriptable/blob/main/Cache.js
// For a detailed guide on importing modules, visit https://docs.scriptable.app/importmodule/
const Cache = importModule('Cache');
const cache = new Cache('github-heatmap');

// Configuration and constants
const GITHUB_USERNAME = args.widgetParameter || "your_github_username";
const GITHUB_TOKEN = "GITHUB_TOKEN";
const GITHUB_API_URL = "https://api.github.com/graphql";

const DAY_COLOR = config.runsInAccessoryWidget ? "#ffffff" : null;
const COLUMNS = 16;
const ROWS = 7;
const CELL_SIZE = 8;
const PADDING = 2;
const BORDER_RADIUS = 2;

// Fetch heatmap data from GitHub or cache
async function getHeatmap() {
    // Attempt to read data from cache
    let data = await cache.read(GITHUB_USERNAME, 30);
    if (data) return data;

    // GraphQL query to fetch contribution data
    const graphqlQuery = `
    {
      user(login: "${GITHUB_USERNAME}") {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionLevel,
                color
              }
            }
          }
        }
      }
    }
  `;

    const request = new Request(GITHUB_API_URL);
    request.body = JSON.stringify({ query: graphqlQuery });
    request.headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + GITHUB_TOKEN
    };
    request.method = "POST";

    // Fetch data from GitHub API and cache it
    data = await request.loadJSON();
    await cache.write(GITHUB_USERNAME, data);
    return data;
}

// Remap function to convert one range of numbers to another
function remap(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// Map GitHub's contribution levels to opacity values
function getLevel(level) {
    const levelMap = {
        "NONE": 0,
        "FIRST_QUARTILE": 1,
        "SECOND_QUARTILE": 2,
        "THIRD_QUARTILE": 3,
        "FOURTH_QUARTILE": 4
    };
    return remap(levelMap[level], 0, 4, 0.1, 1);
}

// Create and configure the widget with the heatmap
async function createWidget() {
    const contributionsData = (await getHeatmap()).data.user.contributionsCollection.contributionCalendar;

    const widget = new ListWidget();
    widget.setPadding(0, 0, 0, 0);
    const weekOffset = contributionsData.weeks.length - COLUMNS;

    // Generate the heatmap grid
    for (let row = 0; row < ROWS; row++) {
        const rowStack = widget.addStack();
        rowStack.spacing = PADDING;
        rowStack.layoutHorizontally();

        for (let col = 0; col < COLUMNS; col++) {
            const day = contributionsData.weeks[col + weekOffset]?.contributionDays[row];
            if (!day) break;

            const boxStack = rowStack.addStack();
            boxStack.backgroundColor = new Color(DAY_COLOR || day.color, getLevel(day.contributionLevel));
            boxStack.cornerRadius = BORDER_RADIUS;
            boxStack.size = new Size(CELL_SIZE, CELL_SIZE);
        }

        widget.addStack(rowStack);
        if (row < ROWS - 1) {
            widget.addSpacer(PADDING);
        }
    }

    return widget;
}


const widget = await createWidget();
if (config.runsInAccessoryWidget) {
    Script.setWidget(widget);
} else {
    widget.presentMedium();
}
Script.complete();

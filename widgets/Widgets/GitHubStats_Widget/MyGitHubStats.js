// icon-color: deep-blue; icon-glyph: chalkboard-teacher;

const username = "rushhiii"; // replace with your github username
const token = Keychain.get("github_token_here"); // replace this with you token
// const size = config.widgetFamily || "large";
// const size = config.widgetFamily || "medium";
const size = config.widgetFamily || "small";


const themePresets = {
  auto: Device.isUsingDarkAppearance()
    ? { colors: ["#000244", "#000233", "#000000"], locations: [0.0, 0.5, 1.0], head: "#ffffff", text: "#909692", acc: "#3094ff" }
    : { colors: ["#e6f2f1", "#bff2c2"], locations: [0, 1], head: "#000000", text: "#5a615c", acc: "#006edb" },



  // auto: Device.isUsingDarkAppearance()
  //   ? {
  //           colors: [
  //       "#E1F5FE", // Very light sky blue
  //       "#B3E5FC", // Soft cyan
  //       "#81D4FA", // True sky blue
  //       "#4FC3F7", // Deeper cyan
  //       "#29B6F6"  // iOS-like vibrant blue
  //     ],
  //     locations: [0.0, 0.25, 0.5, 0.75, 1.0],
  //     head: "#000000",        // dark title/icon
  //     text: "#32555f",         // bluish-gray text
  //     acc: "#007AFF"          // standard iOS accent blue
  
        
  //     // colors: ["#000244", "#000233", "#000000"],
  //     // locations: [0, 0.5, 1],
  //     // head: "#ffffff", text: "#909692", acc: "#ffffff"
        
  //   }
  //   : {
  //           colors: ["#000244", "#000233", "#000000"],
  //     locations: [0, 0.5, 1],
  //     head: "#ffffff", text: "#909692", acc: "#ffffff"

  //     // colors: [
  //     //   "#E1F5FE", // Very light sky blue
  //     //   "#B3E5FC", // Soft cyan
  //     //   "#81D4FA", // True sky blue
  //     //   "#4FC3F7", // Deeper cyan
  //     //   "#29B6F6"  // iOS-like vibrant blue
  //     // ],
  //     // locations: [0.0, 0.25, 0.5, 0.75, 1.0],
  //     // head: "#000000",        // dark title/icon
  //     // text: "#32555f",         // bluish-gray text
  //     // acc: "#007AFF"          // standard iOS accent blue
  //   },


  blue: {
    // colors: ["#0d1117", "#1E2838", "#1f6feb"],
    // locations: [1.0, 0.5, 0.0],
    // head: "#ffffff", text: "#c0c0c0", acc: "#58a6ff"
    colors: ["#0A0C1C", "#121C3C", "#263B73"],
    locations: [0, 0.5, 1],
    head: "#ffffff",
    text: "#c0c0c0",
    acc: "#8ac7ff"

  },
  gray: {
    colors: [
      "#202631", // Cloudy navy gray
      "#2D3440", // Muted slate
      "#3C4454", // Blue-gray storm cloud
      "#525D6F", // Electric gray blue
      "#7A8699"  // Lighter edge storm sky
    ],
    locations: [0.0, 0.25, 0.5, 0.75, 1.0],
    head: "#EAEAEA",       // soft lightning white
    text: "#C7CCD5",       // light gray
    acc: "#8AB4F8"         // stormy blue accent

  },
  night: {
    colors: [
      "#000000", // Pure black
      "#04050A", // Subtle hint of navy
      "#0A0F1A", // Faint cool midnight
      "#111827"  // Deep twilight blue-gray
    ],
    locations: [0.0, 0.4, 0.75, 1.0],
    head: "#ffffff",        // bright title/icon
    text: "#B0B8C0",        // soft gray text
    acc: "#42A5F5"
  },
  day: {
    colors: [
      "#E1F5FE", // Very light sky blue
      "#B3E5FC", // Soft cyan
      "#81D4FA", // True sky blue
      "#4FC3F7", // Deeper cyan
      "#29B6F6"  // iOS-like vibrant blue
    ],
    locations: [0.0, 0.25, 0.5, 0.75, 1.0],
    head: "#000000",        // dark title/icon
    text: "#32555f",         // bluish-gray text
    acc: "#007AFF"          // standard iOS accent blue

  },

  gitgreen: {
    colors: ["#defefa", "#bfffd1"],
    locations: [0, 1],
    head: "#000000", text: "#5a615c", acc: "#000000"
  },
  green: {
    colors: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    locations: [0.0, 0.25, 0.5, 0.75, 1.0],
    head: "#0a0e27", // 0a0e27
    text: "#000000",
    acc: "#216e39"
  },
  indigo: {
    colors: ["#000244", "#000233", "#000000"],
    locations: [0, 0.5, 1],
    head: "#ffffff", text: "#909692", acc: "#ffffff"
  },
  dark: {
    colors: ["#101411", "#101411"],
    locations: [0, 1],
    head: "#ffffff", text: "#909692", acc: "#3094ff"
  }...
let url = "https://status.ifttt.com"
let r = new Request(url)
let body = await r.loadString()
if (config.runsWithSiri) {
	  let needle = "All Systems Operational"
	  if (body.includes(needle)) {
	    Speech.speak("All Systems Operational")
	  } else {
	    Speech.speak("uh oh")
	  }
}
Safari.openInApp(url)

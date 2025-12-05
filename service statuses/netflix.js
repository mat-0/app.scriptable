let url = "https://help.netflix.com/en/is-netflix-down"
let r = new Request(url)
let body = await r.loadString()
if (config.runsWithSiri) {
	  let needle = "Netflix is up!"
	  if (body.includes(needle)) {
	    Speech.speak("Netflix is up!")
	  } else {
	    Speech.speak("uh oh")
	  }
}
Safari.openInApp(url)

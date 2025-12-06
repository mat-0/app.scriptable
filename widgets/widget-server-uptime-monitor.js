// https://gist.github.com/dioncodes/cd4554d8593814a94925735cbcdea0c8

const initialData = {
	servers: [
		{
			url: 'https://thechels.uk',
			title: 'thechels.uk',
			online: null,
		},
		{
			url: 'https://2.example.com/',
			title: 'Server 2',
			online: null,
		},
		{
			url: 'https://3.example.com/',
			title: 'Server 3',
			online: null,
		},
	],
	lastUpdate: null
}

// Refresh Interval in seconds
const refreshInterval = 300

const widget = await createWidget()

if (!config.runsInWidget) {
	await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
	const data = await refresh()
	const list = new ListWidget()
	
//	uncomment the lines below if you want to show the header (not working with more than ~5 servers)
	
// 	const header = list.addText("Server Status")
// 	header.font = Font.mediumSystemFont(13)
// 	list.addSpacer()

	data.servers.forEach((server) => {
		const label = list.addText((server.online ? '🟢' : (server.online === false ? '🔴' : '❔')) + ' ' + server.title)
		label.font = Font.boldSystemFont(12)
		label.textColor = Color.gray()
		list.refreshAfterDate = new Date(Date.now() + refreshInterval)
		list.addSpacer(3)
	})

	if (data.lastUpdate) {
		list.addSpacer()
		const lastRefreshLabel = list.addText('Last refresh: ' + data.lastUpdate)
		lastRefreshLabel.font = Font.mediumSystemFont(8)
	}

	return list
}

async function refresh() {
	let data = initialData

	for (let server of data.servers) {
		try {
			let response = await new Request(server.url).loadString()
			server.online = response && response.length > 0
		} catch (e) {
			server.online = false
		}
	}

	let now = new Date()
	
	let hours = now.getHours()
	let mins = now.getMinutes()

	data.lastUpdate = (hours > 9 ? hours : '0' + hours) + ':' + (mins > 9 ? mins : '0' + mins)
	return data
}
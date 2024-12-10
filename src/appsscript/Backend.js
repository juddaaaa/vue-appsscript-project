function doGet() {
	const template = HtmlService.createTemplateFromFile("index")
	const html = HtmlService.createHtmlOutput(template.evaluate())

	html.addMetaTag("viewport", "width=device-width, initial-scale=1.0")
	html.setTitle("vue-appsscript-project")
	html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)

	return html
}

function helloWorld() {
	return JSON.stringify({
		message: "Hello, World!"
	})
}

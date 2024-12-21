const CONFIG = {
	attachments: "1hZ-r1xTgRoN_X0essLHPGl-ha9PDJwIb",
	spreadsheet: SpreadsheetApp.openById("1TqBdEHtXHOY9whpomMAaxTJvFgzYLqFITuGk5oMHyjY"),

	get changesSheet() {
		const sheet = this.spreadsheet.getSheetByName("Changes")
		const lastColumn = sheet.getLastColumn()
		const lastRow = sheet.getLastRow()
		const nextRow = lastRow + 1
		const table = sheet.getDataRange().getValues()
		const [headers, ...data] = table

		return {
			data,
			headers,
			lastColumn,
			lastRow,
			nextRow,
			sheet,
			table
		}
	}
}

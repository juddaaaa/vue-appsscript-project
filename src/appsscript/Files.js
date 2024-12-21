/**
 * Handles file uploads from the Web App.
 *
 * @param {object} formObject - The form data from the Web App form submission.
 * @param {object} formObject.attachment - The file sent from the form submission.
 * @param {string} formObject.attachment.contents - The contents of the file.
 * @param {function} formObject.attachment.getAs - Function that converts the file to a Blob with the given Mime Type.
 * @param {string} formObject.attachment.type - The Mime Type of the file as it was sent.
 * @returns {string} - JSON object containing the URL and name of the uploaded file.
 */
function $uploadPdf({ attachment: { contents, getAs, type }, mr_number }) {
	try {
		// Convert mrNumber to a number.
		mr_number = Number(mr_number)

		// Get the destination folder for the uploaded file.
		const folder = DriveApp.getFolderById(CONFIG.attachments)

		// Get the Changes sheet from the config.
		const sheet = CONFIG.changesSheet.sheet

		// Initialize variables for file URL and name.
		let file_url, file_name

		// Continue if a file was uploaded.
		if (contents.length && type === MimeType.PDF) {
			// Convert file to a Blob with the given Mime Type.
			const blob = getAs(type)

			// Create the file in the destination folder.
			const file = folder.createFile(blob)
			file.setName(`MR ${mr_number} - ${file.getName()}`)

			// Define the file URL and name.
			file_url = file.getUrl()
			file_name = file.getName()

			// Retrieve the existing record from the Changes sheet and update the attachments column.
			let [{ attachments }] = JSON.parse($read(({ mr_number: mr }) => mr === mr_number))
			attachments = JSON.parse(attachments)
			attachments.push({ mr_number, file_name, file_url })

			return $update({ mr_number, columns: { attachments: JSON.stringify(attachments) } })

			// // Return JSON object containing the file name and URL.
			// return JSON.stringify({ file_name, file_url, mr_number })
		} else {
			throw new Error("File must be a PDF.")
		}
	} catch (error) {
		// Handle errors.
		throw new Error(error.message)
	}
}

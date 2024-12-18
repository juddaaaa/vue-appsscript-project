const CONFIG = {
    spreadsheet: SpreadsheetApp.openById("1TqBdEHtXHOY9whpomMAaxTJvFgzYLqFITuGk5oMHyjY"),

    get changesSheet() {
      const sheet = this.spreadsheet.getSheetByName("Changes")
      const lastColumn = sheet.getLastColumn()
      const lastRow = sheet.getLastRow()
      const nextRow = lastRow + 1
      const table = sheet.getDataRange().getValues()
      const [ headers, ...data ] = table

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

/**
 * Triggered on the GET request from the web.
 * 
 * @param {object} event - The event object from the request.
 * @param {string} event.page - The name of the page to send in the response.
 * @returns {string} The evaluated HTML for the response.
 */
function doGet ({ parameter: { page = "index" } }) {
    // Evaluate the template and create the HTML.
    const template = HtmlService.createTemplateFromFile(page)
    const pageHtml = HtmlService.createHtmlOutput(template.evaluate())

    // Add meta tags and set page title etc.
    pageHtml.addMetaTag("viewport", "width=device-width, initial-scale=1.0")
    pageHtml.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    pageHtml.setTitle("Design Manager")

    // Return the HTML for the response.
    return pageHtml
}

/**
 * Takes in an optional object for a record and adds a new row to the Changes table.
 * If no object is passed in, a blank row with only mr_number and status columns set.
 * 
 * @param {object} record - The details of the record to add to the table (optional).
 * @param {number} record.change_type - The type of change.
 * @param {number} record.change_title - The title for the change.
 * @param {number} record.change_description - The description for the change.
 * @param {number} record.change_part - The parts that are changing. 
 * @param {number} record.change_notes - Any other notes about the change. 
 * @param {number} record.version - The new vesion for the part (if applicable) 
 * @param {number} record.manufacturer - The manufacturer requesting the change. 
 * @param {number} record.requested_by - The person requesting the change.  
 * @param {number} record.wip_check - Wheather or not the Work in Progress has been checked. 
 * @param {number} record.wip_notes - Any notes about the Work in Progress. 
 * @param {number} record.design_completed_by - The person who completed the design.  
 * @param {number} record.design_imapact - The impact of the design on the business. 
 * @param {number} record.cost_completed_by - The person who completed the costing. 
 * @param {number} record.business_impact - The impact of the costs on the business.
 * @param {number} record.change_requested_at - The date of the change request.  
 * @param {number} record.design_completed_at - The date the design was completed.
 * @param {number} record.cost_completed_at - The date the costing was completed.
 * @returns {array} Array of objects returned from the read function.
 */
function $create ({
    change_type,
    change_title,
    change_description,
    change_part,
    change_notes,
    version,
    manufacturer,
    requested_by,
    wip_check,
    wip_notes,
    design_completed_by,
    design_impact,
    cost_completed_by,
    business_impact,
    change_requested_at,
    design_completed_at,
    cost_completed_at
} = {}) {
    // Attempt to lock the script (throws an error if the lock is not aquired).
    const lock = LockService.getScriptLock()
    lock.waitLock(30000)

    // Get the Changes sheet from the config.
    const sheet = CONFIG.changesSheet.sheet

    // Calculate the next available MR Number.
    const mr_number = Math.max(
        ...sheet
            .getRange(2, 1, sheet.getLastRow() - 1, 1)
            .getValues()
            .flat()
    ) + 1

    // Set the default status, attachments and created date.
    const status = "open"
    const attachments = JSON.stringify([])
    const created_at = new Date()

    // Make the new array to add to the table.
    const newRow = [
        mr_number,
        change_type,
        change_title,
        change_description,
        change_part,
        change_notes,
        version,
        manufacturer,
        requested_by,
        wip_check,
        wip_notes,
        design_completed_by,
        design_impact,
        cost_completed_by,
        business_impact,
        change_requested_at,
        design_completed_at,
        cost_completed_at,
        status,
        attachments,
        created_at
        ]

    // Append the new row.
    sheet.appendRow(newRow)

    // Release the script lock.
    lock.releaseLock()

    // Return the newly created row.
    return $read(({ mr_number: mr }) => mr === mr_number)
}

/**
 * Retrieves data from the Changes table.
 * Data can be filtered by providing a filter function.
 * 
 * @param {function} filterFunc - A function that returns a boolean when run on each row of data.
 * @returns {array} An array of objects. Each object represents a row of data.
 */
function $read (filterFunc = null) {
    // Attempt to lock the script (throws an error if the lock is not aquired).
    const lock = LockService.getScriptLock()
    lock.waitLock(30000)

    // Get the headers and data from the Changes table.
    let [ headers, ...data ] = CONFIG.changesSheet.table

    // Reduce the data to an array of objects. Iterate over the data and create an object for each row, using the headers as keys.
    data = data.reduce((result, row) => {
        // Create the object to store the row data.
        const object = {}

        // Iterate over each column and add to the object, using the value at the matching index in the headers array.
        row.forEach((column, i) => {
            object[headers[i]] = column
        })

        // Add the object to the array.
        result.push(object)

        // Return the array to the next iteration.
        return result
    }, [])

    // If a filter function was provided, use it to filter the array.
    if (filterFunc && typeof filterFunc === "function") {
        data = data.filter(filterFunc)
    }

    // Release the script lock.
    lock.releaseLock()

    // Return the data (excluding deleted records).
    return data.filter(row => !row.deleted_at)
}

/**
 * Updates a record in the Changes table with the matching mr_number.
 * 
 * @param {object} changes - An object containing details of the record to change.
 * @param {number} changes.mr_number - The MR Number of the record to change.
 * @param {object} changes.columns - An object containing the columns for the record, complete with any changes.
 * @returns {array} - The updated row in an array.
 */
function $update ({ mr_number, columns }) {
    // Throw an error if any required data is not provided.
    if ((!mr_number || typeof mr_number !== "number") || (!columns || typeof columns !== "object"))
        throw new Error("Parameters missing or provided parameters do not meet requirements to update the record.")

    // Attempt to lock the script (throws an error if the lock is not aquired).
    const lock = LockService.getScriptLock()
    lock.waitLock(30000)

    // Retrieve the existing record.
    const [ record ] = $read(({ mr_number: mr }) => mr === mr_number)

    // Throw an error if the record couldn't be found.
    if (!record) throw new Error(`There are no records with MR number ${mr_number}`)

    // Merge in the changed columns provided and set updated date.
    columns = { ...record, ...columns, updated_at: new Date() }

    // Get the Changes sheet from the config.
    const sheet = CONFIG.changesSheet.sheet

    // Find the record with the matching MR number.
    const mrSheetRow = sheet.createTextFinder(mr_number).findNext()?.getRow()

    // Update the record in the table.
    sheet.getRange(mrSheetRow, 1, 1, CONFIG.changesSheet.lastColumn).setValues([Object.values(columns)])

    // Release the script lock.
    lock.releaseLock()

    // Return the newly updated row in an array.
    return [columns]
}

/**
 * Set a record in the Cahnges table as [soft] deleted.
 * 
 * @param {object} changes - An object containing details of the record to change.
 * @param {number} changes.mr_number - The MR Number of the record to change.
 * @returns {array} - The deleted row in an array.
 */
function $delete ({ mr_number }) {
    // Throw an error if MR number is missing or is not a number.
    if (!mr_number || typeof mr_number !== "number") throw new Error("MR number is missing or not a number.")

    // Attempt to lock the script (throws an error if the lock is not aquired).
    const lock = LockService.getScriptLock()
    lock.waitLock(30000)

    // Retrieve the existing record and set deleted date.
    const [ record ] = $read(({ mr_number: mr }) => mr === mr_number)
    
    // Throw an error if the record couldn't be found.
    if (!record) throw new Error(`There are no records with MR number ${mr_number}`)

    // Merge in the changed columns provided and set deleted date.
    columns = { ...record, deleted_at: new Date() }

    // Get the Changes sheet from the config.
    const sheet = CONFIG.changesSheet.sheet

    // Find the record with the matching MR number.
    const mrSheetRow = sheet.createTextFinder(mr_number).findNext()?.getRow()

    // Throw an error if the record couldn't be found.
    if (!mrSheetRow) throw new Error(`There are no records with MR number ${mr_number}`)

    // Update the record in the table.
    sheet.getRange(mrSheetRow, 1, 1, CONFIG.changesSheet.lastColumn).setValues([Object.values(columns)])

    // Release the script lock.
    lock.releaseLock()

    // Return the newly deleted row in an array.
    return [columns]
}




function dev () {
    /* console.log($create()) */
    console.log($read(row => row.mr_number === 6618))
    /* console.log($update({ mr_number: 6618, columns: { wip_check: true } })) */
    /* console.log($delete({ mr_number: 6619 })) */
}
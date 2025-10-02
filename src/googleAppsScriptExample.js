// This is a sample Google Apps Script code that you would deploy as a web app
// Copy this to your Google Apps Script project
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    // Open the Google Sheet (replace with your sheet ID)
    const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getSheetByName('Responses');
    // Search for existing entry with the same guest name
    const guestName = data.guestName;
    const dataRows = sheet.getDataRange().getValues();
    let rowIndex = -1;
    // Check if guest already exists (skip header row)
    for (let i = 1; i < dataRows.length; i++) {
      if (dataRows[i][0] === guestName) {
        rowIndex = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }
    const timestamp = new Date();
    const rowData = [data.guestName, data.rsvp, data.giftOption, data.notes, timestamp];
    if (rowIndex > 0) {
      // Update existing row
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      // Add new row
      sheet.appendRow(rowData);
    }
    return ContentService.createTextOutput(JSON.stringify({
      success: true
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'Service is running'
  })).setMimeType(ContentService.MimeType.JSON);
}
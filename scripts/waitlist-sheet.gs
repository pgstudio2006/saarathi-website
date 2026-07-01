/**
 * Google Apps Script backend for the Saarathi waitlist.
 *
 * Setup:
 * 1. Create a Google Sheet named "Saarathi Waitlist".
 * 2. Open Extensions > Apps Script.
 * 3. Delete any code in the editor and paste this whole file.
 * 4. Save the project (Ctrl+S / Cmd+S).
 * 5. Click Deploy > New deployment.
 * 6. Choose type: Web app.
 * 7. Set "Execute as: Me" and "Who has access: Anyone".
 * 8. Click Deploy and copy the Web App URL.
 * 9. Paste that URL into the .env file as VITE_WAITLIST_ENDPOINT.
 */

const SHEET_NAME = 'Waitlist';

function doPost(e) {
  const sheet = getOrCreateSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
  }

  if (!data.email || !data.email.includes('@')) {
    return jsonResponse({ success: false, error: 'Valid email is required' }, 400);
  }

  const timestamp = data.timestamp || new Date().toISOString();
  const source = data.source || '';

  const row = [timestamp, data.email.trim().toLowerCase(), source];

  if (headers.length === 0 || headers[0] !== 'Timestamp') {
    sheet.clear();
    sheet.appendRow(['Timestamp', 'Email', 'Source']);
  }

  sheet.appendRow(row);

  return jsonResponse({ success: true, email: data.email });
}

function doGet(e) {
  return jsonResponse({ message: 'Saarathi waitlist endpoint. Use POST.' });
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Email', 'Source']);
  }
  return sheet;
}

function jsonResponse(payload, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
    .setHttpResponseCode(statusCode);
}

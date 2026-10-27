/**
 * Kyowa Taiko performance inquiry form -> Google Sheets
 *
 * SETUP:
 * 1. Create a Google Sheet for inquiries.
 * 2. In the Sheet, choose Extensions > Apps Script.
 * 3. Replace the editor contents with this file's code.
 * 4. Set SPREADSHEET_ID below to the ID in the Sheet URL.
 * 5. Save, then Deploy > New deployment > Web app.
 * 6. Execute as: Me. Access: Anyone (or the least permissive setting that
 *    works for your audience and organizational policy).
 * 7. Copy the deployed web app URL into SCRIPT_URL in script.js.
 * 8. Submit a test inquiry and confirm it appears in the private spreadsheet.
 *
 * IMPORTANT: Public web apps can be abused. Add stronger spam/rate limiting
 * before widely sharing the form, and review the deployment's access settings.
 */
const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Performance inquiries";

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};
    if (params.website) {
      return jsonResponse({ ok: true });
    }

    const name = clean(params.name, 120);
    const email = clean(params.email, 200);
    const details = clean(params.details, 5000);
    if (!name || !email || !details || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ ok: false, error: "Please provide a name, valid email, and event details." });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Submitted at", "Name", "Organization / host", "Email", "Phone",
        "Event date", "Location", "Event type", "Audience size", "Details"
      ]);
      sheet.setFrozenRows(1);
    }

    // Prefix user-provided values beginning with formula characters to reduce
    // spreadsheet formula injection risk.
    const safe = (value) => {
      const v = clean(value, 5000);
      return /^[=+\-@]/.test(v) ? "'" + v : v;
    };
    sheet.appendRow([
      new Date(), safe(name), safe(params.organization), safe(email),
      safe(params.phone), safe(params.eventDate), safe(params.location),
      safe(params.eventType), safe(params.audienceSize), safe(details)
    ]);
    return jsonResponse({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonResponse({ ok: false, error: "Unable to save inquiry." });
  }
}

function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

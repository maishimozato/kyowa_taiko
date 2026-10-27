# Kyowa Taiko website starter

A responsive, static HTML/CSS/JavaScript website using the Kyowa Taiko logo and a burgundy/white colour palette.

## Included pages

- `index.html` — homepage, featured YouTube video, Instagram/JCCC links
- `about.html` — group introduction and member-photo placeholders
- `performances.html` — performance inquiry form
- `workshops.html` — link to the JCCC taiko drumming classes page
- `styles.css` — shared styles and responsive layout
- `script.js` — mobile navigation, footer year, and form submission
- `google-apps-script.gs` — starter Google Apps Script backend for Google Sheets
- `assets/kyowa-taiko-logo.png` — supplied logo

## Preview locally on your Mac

1. Unzip the folder.
2. Open the `kyowa-taiko-website` folder in Visual Studio Code.
3. Open `index.html` in a browser. For a smoother development workflow, install the VS Code Live Server extension and choose **Open with Live Server**.

## Connect the performance form to Google Sheets

1. Create a new Google Sheet. Keep it private to the group.
2. Copy the spreadsheet ID from its URL. In a URL like `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`, it is the portion between `/d/` and `/edit`.
3. In the sheet, select **Extensions → Apps Script**.
4. Copy the code from `google-apps-script.gs` into the Apps Script editor.
5. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with your spreadsheet ID. Save.
6. Select **Deploy → New deployment → Web app**. Execute as **Me**. Choose access carefully; a public form generally needs an endpoint accessible to visitors, but public access can invite spam. Follow your organization's Google Workspace policies.
7. Deploy and authorize it. Copy the web app URL (usually ends in `/exec`).
8. Open `script.js` and set `SCRIPT_URL` to that exact URL.
9. Submit a test inquiry and verify the row was added to the private sheet. Also test invalid email, missing required fields, and mobile layout.

### Important note about browser submission

The starter form uses `fetch(..., { mode: "no-cors" })` because Apps Script web apps can have cross-origin constraints. In this mode, the browser cannot verify the HTTP response; the success message only means the request was sent by the browser, not that the row was definitely saved. Test the whole flow carefully before using it for real booking requests. For stronger reliability, use a form service or a small backend with explicit response handling and spam controls.

Avoid collecting sensitive personal information. Add stronger anti-spam protection before broadly promoting the form.

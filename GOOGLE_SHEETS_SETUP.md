# Vanam Soaps - Google Sheets Order System Setup Guide

## CONTEXT FOR AI ASSISTANT
This is the Vanam Soaps e-commerce project at D:\Projects_K\vanam-soaps.
It's a React + Vite app that sells handmade soaps online.
Orders are saved to Google Sheets via Google Apps Script.
The Apps Script code is in: D:\Projects_K\vanam-soaps\google-apps-script.js
The frontend code is in: D:\Projects_K\vanam-soaps\src\App.jsx
The Google Script URL in App.jsx needs to be updated after deployment.

---

## STEP 1: Create Google Sheet

1. Go to https://sheets.google.com
2. Click "+ Blank spreadsheet"
3. Rename it to "Vanam Soaps Orders"
4. In Row 1, type these headers (one per column, A through O):
   - A1: Order ID
   - B1: Date
   - C1: Name
   - D1: Phone
   - E1: Email
   - F1: Address
   - G1: City
   - H1: State
   - I1: Pincode
   - J1: Landmark
   - K1: Items
   - L1: Subtotal
   - M1: Shipping
   - N1: Total
   - O1: Status
5. Select Row 1 → Bold it (Ctrl+B)
6. Go to View → Freeze → 1 row

---

## STEP 2: Open Apps Script Editor

1. In the Google Sheet, click: Extensions → Apps Script
2. A new tab opens with code editor
3. Delete ALL the default code in Code.gs
4. Copy-paste the ENTIRE content from this file:
   D:\Projects_K\vanam-soaps\google-apps-script.js
5. Click the Save icon (💾) or Ctrl+S
6. Rename the project to "Vanam Orders Script" (click "Untitled project" at top)

---

## STEP 3: Deploy as Web App

1. Click "Deploy" button (top right) → "New deployment"
2. Click the gear icon ⚙️ next to "Select type" → choose "Web app"
3. Fill in:
   - Description: "Vanam Soaps Order API"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click "Deploy"
5. It will ask for permissions → Click "Authorize access"
6. If you see "Google hasn't verified this app":
   - Click "Advanced" (bottom left)
   - Click "Go to Vanam Orders Script (unsafe)"
   - Click "Allow"
7. COPY THE WEB APP URL — it looks like:
   https://script.google.com/macros/s/XXXXXXXXXXXXXXX/exec

---

## STEP 4: Update Frontend with New URL

1. Open D:\Projects_K\vanam-soaps\src\App.jsx
2. Find this line (near top, line 6):
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/..../exec'
3. Replace the URL with YOUR new deployed URL from Step 3

---

## STEP 5: Test the Setup

1. Open your deployed URL in browser and add ?test=true at the end:
   https://script.google.com/macros/s/XXXXXXX/exec?test=true
2. It should say: "✅ Test order saved and emails sent! Check your sheet and inbox."
3. Check your Google Sheet — a test row should appear
4. Check vanamsoaps@gmail.com inbox — you should get a test email

---

## STEP 6: Run the Frontend

1. Open terminal in D:\Projects_K\vanam-soaps
2. Run: npm run dev
3. Try placing a test order on the website
4. Check if the order appears in your Google Sheet

---

## TROUBLESHOOTING

- If test URL shows error: Re-deploy (Deploy → Manage deployments → Edit → New version → Deploy)
- If no email received: Check spam folder
- If sheet doesn't update: Make sure the sheet tab is named "Sheet1" (default name)
- If permissions error: Re-authorize (Run → doGet from Apps Script editor first)

---

## IMPORTANT NOTES

- Every time you EDIT the Apps Script code, you must create a NEW deployment version
  (Deploy → Manage deployments → Edit pencil icon → Version: New version → Deploy)
- The sheet name must be "Sheet1" (or change SHEET_NAME in the script)
- Owner email is set to vanamsoaps@gmail.com in the script
- Orders will have status "Pending" by default — manually update to "Paid"/"Shipped" etc.

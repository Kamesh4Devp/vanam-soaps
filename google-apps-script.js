// ============================================================
// GOOGLE APPS SCRIPT — Paste this in your Google Sheet
// ============================================================
// AFTER PASTING:
// 1. Click Deploy > New Deployment > Web app
// 2. Execute as: Me | Who has access: Anyone
// 3. Click "Review Permissions" > Allow ALL permissions
// 4. Copy the URL
//
// TO TEST: Open this in browser after deploying:
// YOUR_URL?test=true
// It should add a test row and send you an email.
// ============================================================

const OWNER_EMAIL = 'vanamsoaps@gmail.com';
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  try {
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter && e.parameter.payload) {
      data = JSON.parse(e.parameter.payload);
    } else {
      throw new Error('No data received');
    }

    saveOrderAndNotify(data);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Test endpoint: add ?test=true to your URL to test
  if (e && e.parameter && e.parameter.test === 'true') {
    var testData = {
      orderId: 'VNM-TEST-001',
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name: 'Test Customer',
      phone: '9876543210',
      email: OWNER_EMAIL,
      address: '123 Test Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      landmark: 'Near Test Temple',
      items: 'Kuppameni Soap x1',
      total: 120
    };
    saveOrderAndNotify(testData);
    return ContentService.createTextOutput('✅ Test order saved and emails sent! Check your sheet and inbox.')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  return ContentService.createTextOutput('Vanam Soaps Order API is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function saveOrderAndNotify(data) {
  // Server-side validation
  if (!data.name || !data.phone || !data.address || !data.city || !data.state || !data.pincode) {
    throw new Error('Missing required fields');
  }
  if (!/^[6-9][0-9]{9}$/.test(data.phone)) {
    throw new Error('Invalid phone number');
  }
  if (!/^[1-9][0-9]{5}$/.test(data.pincode)) {
    throw new Error('Invalid pincode');
  }
  if (typeof data.total !== 'number' || data.total <= 0) {
    throw new Error('Invalid order total');
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  }

  // Append order row
  sheet.appendRow([
    data.orderId,
    data.date,
    data.name,
    data.phone,
    data.email || '',
    data.address,
    data.city,
    data.state,
    data.pincode,
    data.landmark || '',
    data.items,
    data.subtotal || data.total,
    data.shipping || 0,
    data.total,
    'Pending'
  ]);

  // Send email to owner
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: '🛒 New Order: ' + data.orderId,
    body: 'New order received!\n\n' +
      'Order ID: ' + data.orderId + '\n' +
      'Date: ' + data.date + '\n\n' +
      'Customer: ' + data.name + '\n' +
      'Phone: ' + data.phone + '\n' +
      'Email: ' + (data.email || 'Not provided') + '\n\n' +
      'Address:\n' + data.address + '\n' +
      data.city + ', ' + data.state + ' - ' + data.pincode + '\n' +
      'Landmark: ' + (data.landmark || 'Not provided') + '\n\n' +
      'Items: ' + data.items + '\n' +
      'Total: Rs.' + data.total + '\n\n' +
      '---\nPlease verify payment and process the order.'
  });

  // Send confirmation email to customer
  if (data.email && data.email !== '') {
    MailApp.sendEmail({
      to: data.email,
      subject: '✅ Order Confirmed - ' + data.orderId + ' | Vanam Soaps',
      body: 'Hi ' + data.name + '!\n\n' +
        'Thank you for ordering from Vanam Soaps!\n\n' +
        'Your Order Details:\n' +
        '─────────────────\n' +
        'Order ID: ' + data.orderId + '\n' +
        'Items: ' + data.items + '\n' +
        'Total: Rs.' + data.total + '\n\n' +
        'Delivery Address:\n' +
        data.address + ', ' + data.city + ', ' + data.state + ' - ' + data.pincode + '\n\n' +
        'Expected Delivery: 5-7 business days\n\n' +
        '─────────────────\n' +
        'Please complete the payment via UPI and send the screenshot on WhatsApp.\n\n' +
        'For any queries, WhatsApp us at 9176188117\n\n' +
        'Thank you!\n' +
        'Team Vanam'
    });
  }
}

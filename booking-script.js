/**
 * Booking Form Handler
 * Handles form validation and submission for the booking page
 * Sends form data to Google Apps Script which emails the details
 */

// ============================================
// SETUP INSTRUCTIONS:
// ============================================
// 1. Go to: https://script.google.com
// 2. Create a new Apps Script project
// 3. Replace ALL code with the Google Apps Script code below:
// 
// ----------- COPY THIS CODE TO GOOGLE APPS SCRIPT -----------
// function doPost(e) {
//   try {
//     var data = JSON.parse(e.postData.contents);
//     
//     var emailRecipient = 'modhubonresort@gmail.com';
//     var subject = 'New Room Booking Inquiry - ' + data.name;
//     var body = 'Name: ' + data.name + '\n' +
//                'Phone: ' + data.phone + '\n' +
//                'Email: ' + data.email + '\n' +
//                'Service: ' + data.service + '\n' +
//                'Date: ' + data.date + '\n' +
//                'Time: ' + data.time + '\n' +
//                'Notes: ' + data.notes + '\n' +
//                'Submitted: ' + data.timestamp;
//     
//     MailApp.sendEmail(emailRecipient, subject, body);
//     
//     return ContentService.createTextOutput(JSON.stringify({success: true}))
//       .setMimeType(ContentService.MimeType.JSON);
//   } catch(error) {
//     return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
//       .setMimeType(ContentService.MimeType.JSON);
//   }
// }
// 
// 4. Click Deploy > New deployment > Type: Web app
// 5. Execute as: Your Gmail account
// 6. Who has access: Anyone
// 7. Copy the deployment URL
// 8. Paste it in SCRIPT_URL below (replace YOUR_GOOGLE_SCRIPT_URL_HERE)
// ============================================

const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

const form = document.getElementById('bookingForm');
const msg = document.getElementById('formMsg');

if (form) {
    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();

        const formData = {
            name: form.name.value.trim(),
            phone: form.phone.value.trim(),
            email: form.email.value.trim(),
            service: form.service.value,
            date: form.date.value,
            time: form.time.value || "Not specified",
            notes: form.notes.value || "No additional details",
            timestamp: new Date().toLocaleString()
        };

        if (!formData.name || !formData.phone || !formData.email || !formData.service || !formData.date) {
            msg.style.color = "crimson";
            msg.textContent = "Please fill all required fields.";
            return;
        }

        msg.style.color = "green";
        msg.textContent = "Sending inquiry...";

        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            msg.textContent = "Inquiry sent successfully! We'll contact you soon.";
            form.reset();

            setTimeout(() => {
                msg.textContent = "";
            }, 5000);

        } catch (error) {
            msg.style.color = "crimson";
            msg.textContent = "Failed to send inquiry. Please try again.";
            console.error('Error:', error);
        }
    });
}

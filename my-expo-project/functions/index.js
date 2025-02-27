const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Set SendGrid API key
sgMail.setApiKey('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'); // Replace with your SendGrid API Key

// Firebase function to send email
exports.sendEmail = functions.https.onCall(async (data, context) => {
  const { to, subject, message } = data;

  const msg = {
    to: to,
    from: 'winneronezohaib@gmail.com', // Use your verified SendGrid email address
    subject: subject,
    text: message,
  };

  try {
    // Send email using SendGrid
    await sgMail.send(msg);
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error('Error sending email: ', error);
    return { success: false, message: 'Error sending email.' };
  }
});

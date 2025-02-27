const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Retrieve SendGrid API key from Firebase environment variables
const sendGridKey = functions.config().sendgrid.key;
sgMail.setApiKey(sendGridKey);

// Firebase function to send email
exports.sendEmail = functions.https.onCall(async (data, context) => {
  const { to, subject, message } = data;

  const msg = {
    to: to,
    from: 'winneronezohaib@gmail.com', // Use your verified SendGrid email
    subject: subject,
    text: message,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Error sending email.' };
  }
});

const { onCall } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2/options");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
require("dotenv").config(); // Load environment variables

admin.initializeApp();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendEmail = onCall({ enforceAppCheck: false }, async (request) => {
  const { to, subject, message } = request.data;

  const msg = {
    to: to,
    from: "winneronezohaib@gmail.com",
    subject: subject,
    text: message,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Error sending email." };
  }
});

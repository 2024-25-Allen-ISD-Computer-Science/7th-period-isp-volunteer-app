const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

// Define SendGrid API Key as a secret with the new name
const SENDGRID_API_KEY_SECRET = defineSecret("SENDGRID_API_KEY_SECRET");

exports.sendEmail = onCall(
  { enforceAppCheck: false, secrets: [SENDGRID_API_KEY_SECRET] },
  async (request) => {
    const { to, subject, message } = request.data;

    // Retrieve API Key securely
    sgMail.setApiKey(SENDGRID_API_KEY_SECRET.value());

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
      return { success: false, message: `Error sending email: ${error.message}` };
    }
  }
);

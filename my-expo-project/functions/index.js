const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");

// Get SendGrid API Key from environment variables
sgMail.setApiKey(functions.config().sendgrid.apikey);

// Cloud function to send email
exports.sendEmail = functions.https.onRequest((req, res) => {
  const {to, subject, text} = req.body;

  const msg = {
    to: to, // recipient's email
    from: "your-email@example.com", // your verified sender email on SendGrid
    subject: subject,
    text: text,
  };

  sgMail
      .send(msg)
      .then(() => {
        res.status(200).send("Email sent successfully");
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Failed to send email");
      });
});

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "helphiveend@gmail.com", // Replace with your email
    pass: "tcwp xsmo eqvz htli", // Replace with your email password or use an environment variable for better security
  },
});

exports.sendEmail = functions.https.onCall(async (data, context) => {
  const { to, subject, message } = data;

  const mailOptions = {
    from: "helphiveend@gmail.com", // Replace with your email
    to,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
});

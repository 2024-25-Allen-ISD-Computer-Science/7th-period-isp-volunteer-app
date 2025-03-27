exports.sendEmail = functions.https.onCall(async (data, context) => {
  console.log("Received email request:", data); // Debugging line
  const { to, subject, message } = data;

  if (!to) {
    console.error("Error: No recipient defined.");
    return { success: false, error: "No recipient defined." };
  }

  const mailOptions = {
    from: "helphiveend@gmail.com",
    to: to,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
});

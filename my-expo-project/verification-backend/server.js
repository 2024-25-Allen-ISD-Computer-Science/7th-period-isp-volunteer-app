const express = require('express');
const bodyParser = require('body-parser');
const SparkPost = require('sparkpost');

const app = express();
const port = process.env.PORT || 3000;

// Initialize SparkPost with your API key
const client = new SparkPost('YOUR_SPARKPOST_API_KEY'); // Replace with your actual API Key

app.use(bodyParser.json());

// API endpoint to send verification email
app.post('/send-verification', (req, res) => {
  const { contactEmail, studentName, communityName, hoursLogged, verificationLink } = req.body;

  const message = {
    content: {
      from: 'your-email@example.com',  // Replace with your sender email
      subject: `${studentName} Requests Verification of Hours`,
      text: `Hello,\n\n${studentName} has logged ${hoursLogged} hours in the community "${communityName}" and requests your verification.\n\nPlease verify the hours by clicking the link below:\n${verificationLink}`,
      html: `<p>Hello,</p><p>${studentName} has logged <strong>${hoursLogged}</strong> hours in the community <em>"${communityName}"</em> and requests your verification.</p><p>Please verify the hours by clicking the link below:</p><p><a href="${verificationLink}">Verify Hours</a></p>`,
    },
    recipients: [{ address: contactEmail }],
  };

  // Send email via SparkPost
  client.transmissions.send(message)
    .then(response => {
      console.log('Verification email sent:', response);
      res.status(200).send('Verification email sent successfully!');
    })
    .catch(error => {
      console.error('Error sending verification email:', error);
      res.status(500).send('Failed to send verification email.');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const MAP_API_KEY = 'AIzaSyD2KhZTRrfMXNpJpvdFXA2f-g-feqEjvac';

const express = require('express');
const bodyParser = require('body-parser');
const SparkPost = require('sparkpost');

const app = express();
const port = process.env.PORT || 3000;


const cors = require('cors');
app.use(cors());


// Initialize SparkPost
const client = new SparkPost('YOUR_SPARKPOST_API_KEY');

app.use(bodyParser.json());

// API endpoint to send verification email
app.post('/send-verification', (req, res) => {
  const { contactEmail, studentName, communityName, hoursLogged, verificationLink } = req.body;

  const message = {
    content: {
      from: 'your-email@example.com', 
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

const axios = require('axios');


app.get('/places/place/autocomplete/json', async (req, res) => {

  try {
    const params = new URLSearchParams(req.query);
    params.set('key', MAP_API_KEY);

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`;
    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Places proxy failed' });
  }
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




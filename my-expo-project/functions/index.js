const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Resend } = require('resend');

admin.initializeApp();
const resend = new Resend(functions.config().resend.key);

// When a user logs hours, this function sends a verification email
exports.sendVerificationEmail = functions.firestore
  .document('pendingHours/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const docId = context.params.docId;

    const activity = data.activityName || 'Volunteer Activity';
    const date = data.date?.toDate?.().toDateString?.() || 'a recent date';
    const hours = data.hours || 0;
    const contactEmail = data.contactEmail;

    if (!contactEmail) {
      console.error('Missing contact email!');
      return;
    }

    const verifyUrl = `https://yourdomain.com/verify?docId=${docId}`; // Replace with real domain

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: contactEmail,
            subject: 'Verify Volunteer Hours',
            html: `
              <p>Hello,</p>
              <p>Please verify the following volunteer activity:</p>
              <ul>
                <li><strong>Activity:</strong> ${activity}</li>
                <li><strong>Date:</strong> ${date}</li>
                <li><strong>Hours:</strong> ${hours}</li>
              </ul>
              <p><a href="${verifyUrl}">Click here to verify the hours</a></p>
              <p>Thank you!</p>
            `,
          });          

      console.log(`Email sent to ${contactEmail}`);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  });

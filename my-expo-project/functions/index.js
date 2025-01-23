// Import required packages
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Set up SendGrid API Key
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');  // Replace with your SendGrid API key

// Function to send email when a new opportunity is submitted
exports.sendOpportunityEmail = functions.firestore
  .document('opportunities/{opportunityId}')
  .onCreate(async (snap, context) => {
    const opportunity = snap.data();
    const createdByUser = await admin.auth().getUser(opportunity.createdBy);
    const createdByEmail = createdByUser.email;

    const msg = {
      to: opportunity.contactEmail, // The email of the contact to verify the opportunity
      from: 'no-reply@yourapp.com', // Your verified sender email
      subject: 'Opportunity Submitted - Verification Needed',
      text: `A new opportunity has been submitted. Please verify the details:
              \nActivity Name: ${opportunity.name}
              \nDate: ${opportunity.date}
              \nTime: ${opportunity.time}
              \nDescription: ${opportunity.description}
              \nPlease verify the opportunity and let us know if everything is correct.`,
    };

    try {
      // Send email to the contact
      await sgMail.send(msg);

      // Email to the creator of the opportunity
      const createdByMsg = {
        to: createdByEmail,
        from: 'no-reply@yourapp.com',
        subject: 'Your Opportunity Was Submitted Successfully',
        text: `Your opportunity has been submitted and is awaiting verification.
                \nActivity Name: ${opportunity.name}
                \nDate: ${opportunity.date}
                \nTime: ${opportunity.time}
                \nDescription: ${opportunity.description}`,
      };

      await sgMail.send(createdByMsg);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });

// Function to send email when hours are logged by a student
exports.sendHourLogEmail = functions.firestore
  .document('hourLogs/{logId}')
  .onCreate(async (snap, context) => {
    const logData = snap.data();
    const opportunityRef = await admin.firestore()
      .collection('opportunities')
      .doc(logData.opportunityId)
      .get();
    const opportunity = opportunityRef.data();
    const createdByUser = await admin.auth().getUser(opportunity.createdBy);
    const createdByEmail = createdByUser.email;

    // Email to the contact to verify the hours
    const msg = {
      to: opportunity.contactEmail,
      from: 'no-reply@yourapp.com',
      subject: 'Hours Log Submitted for Verification',
      text: `A student has logged hours for your opportunity. Please verify the details:
              \nActivity Name: ${opportunity.name}
              \nDate: ${opportunity.date}
              \nTime: ${opportunity.time}
              \nLogged Hours: ${logData.hours}
              \nStudent: ${logData.userId}
              \nPlease verify the hours and approve them if accurate.`,
    };

    try {
      // Send email to the contact
      await sgMail.send(msg);

      // Email to the creator of the opportunity
      const createdByMsg = {
        to: createdByEmail,
        from: 'no-reply@yourapp.com',
        subject: 'Student Logged Hours for Your Opportunity',
        text: `A student has logged hours for your opportunity. Please verify the hours:
                \nActivity Name: ${opportunity.name}
                \nLogged Hours: ${logData.hours}
                \nStudent: ${logData.userId}
                \nPlease verify and approve the hours if correct.`,
      };

      await sgMail.send(createdByMsg);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });

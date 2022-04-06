require("dotenv").config();
console.log(process.env.SENDGRID_API_KEY);

const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'miklo14@gmail.com', // Change to your recipient
  from: 'jpdesignz@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

sgMail
  .send(msg)
  .then(() => {
    console.log("Email success!");
  })
  .catch((error) => {
    console.error(error)
  });

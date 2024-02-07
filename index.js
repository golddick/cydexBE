const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = 4000;

app.use(cors());
// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle contact form submissions
app.post('/submit-form', async (req, res) => {
    // Extract form data from the request body
    const formDataArray = req.body;

    // Convert the array of arrays to an object
    const formDataObject = Object.fromEntries(formDataArray);

    // Now you can access individual form fields
    const { name, orgName, email, message } = formDataObject;

    console.log('Received form data:', name);

    try {
      // const emailBody = <Email/>;
      const transporter = nodemailer.createTransport({
        service: 'gmail',  
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: 'dickgoldd@gmail.com,  Cydexlogistics@gmail.com',
        subject: 'Cydex Contact Form Submission',
        html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: orange;
                font-size:20px;
              }
              .label {
                font-weight: bold;
                font-size:15;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Email from Cydex Contact Form</h1>
              <p>Here is the information submitted through Cydex form:</p>
              
              <p class="label"> Name:</p>
              <p>${name}</p>
              
              <p class="label">Organization :</p>
              <p>${orgName}</p>
              
              <p class="label">Email:</p>
              <p>${email}</p>
              
             
              <p class="label">Message:</p>
              <p>${message}</p>
            </div>
          </body>
        </html>
      `,
        //  text: JSON.stringify(req.body, null, 2),
      };
  
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending contact form email:', error);
      res.status(500).json({ message: 'Failed to send contact form email.' });
    }
  });
   

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const nodemailer = require('nodemailer');

const saleRouter = express.Router();

// Step 1: Create a transporter object
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'gm24139@gmail.com',
      pass: 'ezodvxedzowuxtel'
    }
});

saleRouter.post('/send-email', (req, res) => {
    // Step 2: Define the email options
    const mailOptions = {
      from: 'gm24139@gmail.com',
      to: req.body.email,
      subject: req.body.name,
      text: `Hi, there! \n\nYou\'re recieving this message because you have signed up to use ${req.body.name}. \n\n` +
      `You are invited to pay your sale ${req.body.id} for an amount of ${req.body.price} USD \n\n` +
      `In order to proced with the payment, please click on the link below, and follow the instructions: \n\n` +
      req.body.link + `\n\n Thank You for Using NoCode3 \n\n Best Regards, \n\n ${req.body.name}\'s team` 
    };
  
    // Step 3: Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).send('Email sending failed');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent successfully');
      }
    });
  });

module.exports = saleRouter;

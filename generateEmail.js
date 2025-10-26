const OTPgenerator = require('./generateOTP');
require('dotenv').config();
const nodemailer = require('nodemailer');
const User = require('./schema');
const { text } = require('express');



const generateEmail = async (req, res) => {
  try {
    // Get email from query or body
    const emailInput = req.query.email || req.body?.email;
    if (!emailInput) {
      return res.status(400).json({ message: 'Please provide an email.' });
    }

    // Find user
    const user = await User.findOne({ Email: emailInput });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    //hcyr jaft hsxz kbf
    // Generate OTP
    const OTP = OTPgenerator.generateOTP();
    user.OTP = OTP.secret;
    await user.save();

    // Send email via SendGrid
    // const msg = {
    //   to: user.Email,
    //   from: `Expense tracker <${process.env.GMAIL_USER}>`, // verified sender
    //   subject: `Your OTP Code: ${OTP.token}`,
    //   html: `<p>Hello,</p>
    //          <p>Your OTP is: <b>${OTP.token}</b>. It will expire in 60 seconds.</p>`
    // };

    const transporter = nodemailer.createTransport({
      host: process.env.GMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    })

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: emailInput,
      subject: `Expense tracker OTP sent`,
      text: `your otp is ${OTP.token} `
    }

    transporter.sendMail(mailOptions, (err, info)=>{
      err ? console.error(err) : console.log(info.response);
    })

    return res.status(200).json({ message: 'OTP email sent successfully😁😁😁😁😁😁' });

  } catch (err) {
    console.error('Error sending OTP email:', err);
    return res.status(500).json({ message: 'Server error sending OTP.' });
  }
};

module.exports = generateEmail;

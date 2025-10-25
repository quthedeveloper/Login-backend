const OTPgenerator = require('./generateOTP');
require('dotenv').config();
const nodemailer = require('nodemailer');
const User = require('./schema');

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

    // Generate OTP
    const OTP = OTPgenerator.generateOTP();
    user.OTP = OTP.secret; // Save secret
    await user.save();

    // Set up Nodemailer
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
      connectionTimeout: 40000,
      logger: true,
      debug: true
    });

    // Verify SMTP connection
    await transport.verify();
    console.log("SMTP server ready to send emails");

    // Send email
    await transport.sendMail({
      from: `"Your App Name" <${process.env.GMAIL_USER}>`,
      to: user.Email,
      subject: `Your OTP Code: ${OTP.token}`,
      html: `<p>Hello,</p>
             <p>Your OTP is: <b>${OTP.token}</b>. It will expire in 60 seconds.</p>`
    });

    return res.status(200).json({ message: 'OTP email sent successfully.' });

  } catch (err) {
    console.error('Error sending OTP email:', err);
    return res.status(500).json({ message: 'Server error sending OTP.' });
  }
};

module.exports = generateEmail;

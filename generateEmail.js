const OTPgenerator = require('./generateOTP');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const User = require('./schema');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    user.OTP = OTP.secret;
    await user.save();

    // Send email via SendGrid
    const msg = {
      to: user.Email,
      from: `Expense tracker <${process.env.GMAIL_USER}>`, // verified sender
      subject: `Your OTP Code: ${OTP.token}`,
      html: `<p>Hello,</p>
             <p>Your OTP is: <b>${OTP.token}</b>. It will expire in 60 seconds.</p>`
    };

    await sgMail.send(msg);

    return res.status(200).json({ message: 'OTP email sent successfully😁😁😁😁' });

  } catch (err) {
    console.error('Error sending OTP email:', err);
    return res.status(500).json({ message: 'Server error sending OTP.' });
  }
};

module.exports = generateEmail;

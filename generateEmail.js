const { Resend } = require('resend');
const OTPgenerator = require('./generateOTP');
require('dotenv').config();
const User = require('./schema');

const resend = new Resend(process.env.RESEND_API_KEY);

const generateEmail = async(req, res) => {
  try {
    const emailInput = req.query.email || req.body?.email;
    if (!emailInput) {
      return res.status(400).json({ message: 'Please provide an email.' });
    }

    const user = await User.findOne({ Email: emailInput });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const OTP = OTPgenerator.generateOTP();
    user.OTP = OTP.secret;
    await user.save();

    // Send the email via Resend
    await resend.emails.send({
      from: 'Expense Tracker <onboarding@resend.dev>', // Resend shared sender (no domain needed)
      to: emailInput,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is <b>${OTP.token}</b>. It expires in 60 seconds.</p>`
    });

    return res.status(200).json({ message: 'OTP email sent successfully 🎉' });
  } catch (err) {
    console.error('Error sending OTP email:', err);
    return res.status(500).json({ message: 'Server error sending OTP.' });
  }
};

module.exports = generateEmail;

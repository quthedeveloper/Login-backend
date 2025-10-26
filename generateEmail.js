// brevoEmail.js
const brevo = require('@getbrevo/brevo');
const OTPgenerator = require('./generateOTP');
require('dotenv').config();
const User = require('./schema');

// Initialize Brevo client
const client = brevo.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
const transactionalApi = new brevo.TransactionalEmailsApi();

const generateEmail = async (req, res) => {
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

    // Send the email via Brevo
    const sendSmtpEmail = {
      sender: { name: 'Expense Tracker', email: 'papafiobryan@gmail.com' }, 
      to: [{ email: emailInput }],
      subject: 'Your OTP Code',
      htmlContent: `<p>Your OTP is <b>${OTP.token}</b>. It expires in 60 seconds.</p>`
    };

    await transactionalApi.sendTransacEmail(sendSmtpEmail);

    return res.status(200).json({ message: 'OTP email sent successfully 🎉' });
  } catch (err) {
    console.error('Error sending OTP email:', err);
    return res.status(500).json({ message: 'Server error sending OTP.' });
  }
};

module.exports = generateEmail;

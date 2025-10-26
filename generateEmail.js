// generateEmail.js
const Brevo = require('@getbrevo/brevo');
const OTPgenerator = require('./generateOTP');
require('dotenv').config();
const User = require('./schema');

// ✅ Correct initialization for Brevo SDK (v3+)
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications['apiKey'] = { apiKey: process.env.BREVO_API_KEY };

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

    const sendSmtpEmail = {
      sender: { name: 'Expense Tracker', email: 'papafiobryan@gmail.com' },
      to: [{ email: emailInput }],
      subject: 'Your OTP Code',
      htmlContent: `<p>Your OTP is <b>${OTP.token}</b>. It expires in 60 seconds.</p>`
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return res.status(200).json({ message: 'OTP email sent successfully 🎉' });

  } catch (err) {
    console.error('Error sending OTP email:', err.response?.text || err.message);
    return res.status(500).json({ message: 'Server error sending OTP.' });
  }
};

module.exports = generateEmail;

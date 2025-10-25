const OTPgenerator = require('./generateOTP');
require('dotenv').config();
const nodemailer = require('nodemailer');
const User = require('./schema');


const generateEmail = async(req, res) => {
//otp email will be sent from front-end in a req.body
if (!req.query.email){
    return res.status(400).json({message: 'provide email please'});
}

const userEmail = await User.findOne({Email: req.query.email});
if(!userEmail){
    return res.status(404).json({message: 'User not available'});
}

const email = userEmail.Email;

let OTP = OTPgenerator.generateOTP();
userEmail.OTP = OTP.secret
userEmail.save();

// set email up
const transport =  nodemailer.createTransport({
  service: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

try{
  // transport email
   await transport.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: `Your OTP: ${OTP.token}`,
    html: `<p>This is your OTP: <b>${OTP.token}</b>. This OTP will expire in 60 seconds.</p>`
  });


  
  res.status(200).json({message: 'email recieved'});

}
catch(err){
  console.log(`This code has an error: ${err}`);
  res.status(500).json({message: 'server error'})
}
}

module.exports = generateEmail;

const speakeasy = require('speakeasy');
const User = require('./schema');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyOTP = async(req, res) => {
const otp = req.body.otp;
const email = req.body.email;

try{
const user = await User.findOne({Email:email});
const secret = user.OTP;
const verify = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: otp,
    time: 5,
    step: 60
})

if(!verify){
  return res.status(404).json({message: 'verification unsuccesful'});
}
if(verify){
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_CREATE, {'expiresIn': '15m'})
    const refreshToken = jwt.sign({ email },process.env.REFRESH_TOKEN_CREATE,  {'expiresIn': '7d'})

    const user = await User.findOne({Email:email})
    if (!user){
        res.json({message: 'could not deliver refreshtoken'})
    }
    if(user){
        user.RequestHash = refreshToken;
        await user.save();
    }
    res.cookie('refreshToken', refreshToken,{
        httpOnly: true,
        maxAge: 604800000,
        secure: true,
        sameSite: 'None'
    }).status(200).json({ accessToken });
}
}
catch(err){
    res.status(500).json({message: 'server error'})
}
}

module.exports = verifyOTP;
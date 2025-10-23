const User = require("./schema");
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const handleLogin = async(req, res) => {
const { email, password } = req.body;
try{
const existingUser = await User.findOne({ Email:email })

if(!existingUser){
   return res.status(401).json({message: 'user does not exist'});
}

const Match = await bcrypt.compare(password, existingUser.Password);
if(!Match){
    return res.status(404).json({message: 'incorrect password'})
}

const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_CREATE, {expiresIn: '1m'});
const refreshToken = jwt.sign({ email },  process.env.REFRESH_TOKEN_CREATE, {expiresIn: '10d'});

const cookie = res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 1000 * 60 * 600
});
existingUser.RequestHash = refreshToken;
await existingUser.save();
res.status(200).json({accessToken, email});
}
catch(err){
    res.status(500).json({message: `server is down`})
}
}

module.exports = handleLogin;
const User = require('./schema');
require("dotenv").config();


const logOut = async(req, res)=>{
const { user } = req;
try{
const existingUser = await User.findOne({ Email:user });

if(!existingUser){
    return res.status(401).json({message: "You are not allowed here"});
}
const expired = "Expired";
existingUser.RequestHash = "";
await existingUser.save();

 res.cookie('expiredToken', expired, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 10000
}).status(200).json({ message: 'Cookie set' });

}catch(err){
    return res.status(500).json({err, message: "server error"});
}
}

module.exports = logOut;
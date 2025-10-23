const jwt  = require('jsonwebtoken');
const User = require('./schema');
require('dotenv').config();


const refresh = async(req, res) =>{
 const token = req.cookies;

try{

const existingUser = await User.findOne({RequestHash: token.refreshToken});

if(!existingUser){ return res.status(400).json({message: "you don't exist"})}

jwt.verify(
    token.refreshToken,
    process.env.REFRESH_TOKEN_CREATE,
    (err, decoded) => {
        console.log(decoded);
         if(err || existingUser.Email !== decoded.email) {return res.status(403).json({message: 'go back to login'})}
        const email =  decoded.email;
        console.log(email);
         const accessToken = jwt.sign(
             {email},
             process.env.ACCESS_TOKEN_CREATE,
             {expiresIn: '15m'})

          return res.status(200).json({accessToken, email});
    }
)

 }catch(err){
  if(err){
     res.status(500).json({message: 'server is down'});
  }
}
 }

module.exports = refresh
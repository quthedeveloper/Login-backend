require('dotenv').config();
const jwt = require('jsonwebtoken');

// for token verification
const verifyJWT = (req, res, next) =>{
const authHeader = req.headers['authorization'];

if(!authHeader) return res.status(404).json({message: "you are not authorized to come here"});
const token = authHeader.split(' ')[1];
jwt.verify(
    token,
    process.env.ACCESS_TOKEN_CREATE,
    (err, decoded) => {
        if(err) return res.status(401).json({message: "something went wrong"});
        req.user = decoded.email;
        next();
    }
)
}

module.exports = verifyJWT;

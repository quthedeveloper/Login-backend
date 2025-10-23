const User = require('./schema');
const bcrypt = require('bcrypt');
let newUser;

const handleUser = async(req, res) => {
    const {firstName, lastName, email, password, confirmPassword} = req.body;

    try{
    const existingUser = await User.findOne({Email: email});
    if(existingUser){
        return res.status(409).json({message: 'User already exists'})
    }
    if(password !== confirmPassword){
        return res.status(400).json({message: 'bad request'})
    }
    


    const hashedPassword = await bcrypt.hash(password, 10);

     newUser = new User({
        Firstname: firstName,
        Lastname: lastName,
        Email: email, 
        Password: hashedPassword
    });


    await newUser.save();
   return res.status(201).json({email}); 
}
catch(err){
    res.status(500).json({
        message: `sorry, server error`
    })
}
}

module.exports = handleUser;
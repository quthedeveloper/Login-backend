const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
    Firstname: String,
    Lastname: String,
    Email: String,
    Password: String,
    RequestHash: String,
    OTP: String
});

const User = mongoose.model('user', userSchema);

module.exports = User


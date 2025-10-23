const {default: mongoose} = require('mongoose')


const UserData = new mongoose.Schema({
    Email: String,
    Income: [
        {
        Date: String,
        Description: String,
        paymentMethod: String,
        Amount: { type: Number, default: 0 },
        Source:String
        }
    ],
    Expenses: [
        {
        Date: String,
        Description: String,
        Category: String,
        Amount: { type: Number, default: 0 }
        }
    ],
    Total: { type: Number, default: 0 }
}) 

const userData = mongoose.model('userData', UserData);


module.exports = userData;
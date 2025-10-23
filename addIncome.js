const userData  = require('./UserFinanceSchema');

const addExpense = async(req, res) => {
const { source, date, paymentMethod, description} = req.body;
const { user } = req;
const amount = req.body.amount;
try{
let total = 0;
if(isNaN(amount)){
    return res.status(400).json({message: "not a number"});
}
const existingUser = await userData.findOne({ Email: user});
console.log(existingUser);
if(description.split(" ").length >= 5){
    return res.status(400).json({message: "Words are too much"})
}

if (!existingUser){
    const newUser = userData.create({
        Email: user
    })
    
    total = (await newUser).Total;
    const newEntry = {
        Date: date,
        Description: description,
        paymentMethod:paymentMethod,
        Amount:amount,
        Source:source
    }

    ;(await newUser).Income.push(newEntry);
    (await newUser).Total = amount + total;
    const incomeArr = (await newUser).Income;
    (await newUser).save();

    return res.status(201).json({message: "inputed in succesully"});
}
else{
total = existingUser.Total;
const newEntry = {
        Date: date,
        Description: description,
        paymentMethod:paymentMethod,
        Amount:amount,
        Source:source
    }
console.log(newEntry);
existingUser.Income.push(newEntry);
existingUser.Total = amount + total;
existingUser.save();

return res.status(201).json({message: "inputed in succesully"});
}
}
catch(err){
    res.status(500).json({message: "server error"});
}
}

module.exports = addExpense;
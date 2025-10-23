const userData = require('./UserFinanceSchema');

const addExpense = async(req, res) =>{
const {date, description, category,  amount} = req.body
const { user } = req;
try{
let money = 0;
const existingUser = await userData.findOne({ Email: user });
const entries = {
    Date: date,
    Description: description,
    Category: category,
   Amount: amount
}
if(!existingUser){
return res.status(403).json({message: 'cant make an expense'}); 
}

if (existingUser.Total === 0){
return res.status(400).json({message: 'you dont have funds'});
}


if (existingUser.Total < amount) {
  return res.status(400).json({ message: 'insufficient funds' });
}

money = existingUser.Total 
 existingUser.Expenses.push(entries);
console.log(existingUser.Expenses);
existingUser.Total = money - amount;

await existingUser.save();


res.status(201).json({message: "expense added"});
}

catch(err){
return res.status(500).json({messages: "server is down at the moment"});
}
}

module.exports = addExpense;
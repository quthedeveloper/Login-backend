const userData = require('./UserFinanceSchema');

const deleteEntry = async(req, res) => {
const id = req.query.id; 
const { user } = req
let total = 0;
try{
const existingUser = await userData.findOne({ Email: user });

if(!existingUser){
    return res.status(404).json({message: "not authorized"})
}

const income = existingUser.Income;
const  IncomeArr = income.filter((entry,_)=>{
    return entry._id.toString() !== id
})
IncomeArr.forEach((entry,_)=>{
total += entry.Amount;
})
existingUser.Income = IncomeArr;
existingUser.Total = total;
await existingUser.save();
res.status(200).json({message: "deleted"});

}catch(err){
res.status(500).json({message: "server is down", err});
}
} 

module.exports = deleteEntry
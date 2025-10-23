const userData = require('./UserFinanceSchema');


const deleteExpenseEntry = async(req, res) => {
const id = req.query.id; 
const { user } = req
try{
const existingUser = await userData.findOne({ Email: user });

if(!existingUser){
    return res.status(404).json({message: "not authorized"})
}

const expense = existingUser.Expenses;
const delObj = expense.find((entry,_)=>{
return entry._id.toString() === id
})
existingUser.Total += Number(delObj.Amount);
const  ExpenseArr = expense.filter((entry,_)=>{
    return entry._id.toString() !== id
})
console.log(ExpenseArr);
existingUser.Expenses = ExpenseArr;
await existingUser.save();
res.status(200).json({message: "deleted"});

}catch(err){
res.status(500).json({message: "server is down", err});
}
} 

module.exports = deleteExpenseEntry
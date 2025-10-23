const userData = require('./UserFinanceSchema');

const dashboardInfo = async(req, res) => {
const { user } = req;
let food = 0;
let utilities = 0;
let entertainment = 0;
let healthcare = 0;
let transportation = 0;
let others = 0;
let shopping = 0;
let total = 0;
let incomeTotal = 0;
try{


     let dashboard = {
        Transportation: 0,
        Shopping: 0,
        Healthcare: 0,
        Others: 0,
        Food: 0,
        Utilities: 0,
        Entertainment: 0,
        Balance: 0.00,
        TotalIncome: 0.00,
        TotalExpense: 0.00,
        recentIncome: [],
        recentExpense: []
    };

    const existingUser = await userData.findOne({Email: user});
    if(!existingUser){
       return res.status(200).json({dashboard});
    }

    const expense = existingUser.Expenses;
    const income  =  existingUser.Income;
    const balance = existingUser.Total;

    
    income.forEach((entry,_)=>{
        incomeTotal += entry.Amount
    })

    const lastIncome = income.length
    const RecentIncome = income.slice(lastIncome - 2, lastIncome) 
    const lastExpense = expense.length;
    const RecentExpense = expense.slice(lastExpense - 2, lastExpense);

    expense.forEach((entry,_)=>{
        total += entry.Amount; 
        if(entry.Category === "Transportation"){
            transportation += entry.Amount;
        }
       else if(entry.Category === "Utilities"){
            utilities += entry.Amount;
        }
        else if(entry.Category === "Entertainment"){
            entertainment  += entry.Amount;
        }
        else if(entry.Category === "Other"){
            others += entry.Amount;
        }
        else if(entry.Category === "Food & Dinning"){
            food += entry.Amount;
        }
        else if(entry.Category === "Healthcare"){
            healthcare += entry.Amount;
        }
        else if(entry.Category === "Shopping"){
            shopping += entry.Amount;
        }
    })
    const safeDivide = (a, b) => (b === 0 ? 0 : (a / b) * 100);

    dashboard = {
        Transportation: safeDivide(transportation, total),
        Shopping: safeDivide(shopping, total),
        Healthcare: safeDivide(healthcare, total),
        Others: safeDivide(others, total),
        Food: safeDivide(food, total),
        Utilities: safeDivide(utilities, total),
        Entertainment: safeDivide(entertainment, total),
        Balance: balance,
        TotalIncome: incomeTotal,
        TotalExpense: total,
        recentIncome: RecentIncome,
        recentExpense: RecentExpense
    };

    res.status(200).json({dashboard});

}catch(err){
    res.status(500).json({message: "server error"});
}
}

module.exports = dashboardInfo;
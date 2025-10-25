const express =  require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const cors = require('cors');
const uri = 'mongodb://127.0.0.1:27017/myDatabase';
const mongoose = require('mongoose');
const registerRouter =  require('./registerRoute');
const cookieParser = require('cookie-parser');
const logRouter = require('./loginRouter');
const geRouter = require('./generateEmailRoute');
const vRouter = require('./verifyRouter');
const names = require('./generateEmail');
const refreshRouter = require('./refreshJWTroute');
const expenseRouter =  require('./addexpenseroute');
const Irouter = require('./addIncomeroute');
const getallRoute = require('./getIncomeroute');
const delRouter = require("./deleteRoute");
const getErouter = require('./getExpenseroute');
const delExpense = require('./deleteExpenseroute');
const dashboardRoute = require('./dashboardInforoute');
const logOutroute = require('./logoutroute');

app.use(cookieParser());
app.use(cors({
    origin: [
    "https://register-page-umber.vercel.app",
    "https://register-git-fed084-bryan-quartey-papafio-1700841144s-projects.vercel.app",
    "https://register-page-m1do4r9ty.vercel.app",
    "http://localhost:5173",
    ],
    credentials: true,
    optionsSuccessStatus: 200
}));

mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log('connected to mongoDB')})
.catch((err)=> console.error(err))

mongoose.connection.on('connected', ()=>{
    console.log("Render has successfully connected to Atlas");
})

//https://login-backend-izl3.onrender.com
app.use(express.json());


// registration router
app.use('/reg', registerRouter);

//Login router
app.use('/login', logRouter);

//otp router
app.use('/otp', geRouter);

//verifyotp router
 app.use('/key', vRouter);

//refresh jwt
app.use('/refresh', refreshRouter);

//add expense
app.use('/add', expenseRouter);

//add Income
app.use('/add', Irouter);

//get incomes
app.use('/get', getallRoute); 

// delete income
app.use('/delete', delRouter);

//get expense
app.use('/get', getErouter);

//delete expense
app.use('/delete', delExpense);

//dashboardInfo
app.use('/dashboard', dashboardRoute);

//logout 
app.use('/log', logOutroute);

app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`)
    console.log("connected to https://register-page-umber.vercel.app")
})
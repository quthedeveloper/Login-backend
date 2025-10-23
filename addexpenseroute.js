const express = require('express');
const expenseRouter = express.Router();
const addExpense = require('./addExpense');
const verifyJWT = require('./verifyJWT');


expenseRouter.post('/expense', verifyJWT, addExpense);

module.exports = expenseRouter;
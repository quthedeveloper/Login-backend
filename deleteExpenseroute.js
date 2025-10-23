const express = require('express');
const delExpense = express.Router();
const verifyJWT = require('./verifyJWT');
const deleteExpenseEntry = require('./deleteExpenseEntry');

delExpense.post('/expense', verifyJWT, deleteExpenseEntry);

module.exports = delExpense;
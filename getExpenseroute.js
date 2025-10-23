const express = require('express');
const getErouter = express.Router();
const verifyJWT = require('./verifyJWT');
const getExpensePage = require('./getExpensecontroller');

getErouter.get('/expense', verifyJWT, getExpensePage);


module.exports = getErouter;
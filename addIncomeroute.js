const express = require('express');
const Irouter = express.Router();
const verifyJWT = require('./verifyJWT');
const addIncome = require('./addIncome');

Irouter.post('/income', verifyJWT, addIncome);


module.exports = Irouter;
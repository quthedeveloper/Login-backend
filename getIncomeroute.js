const express = require('express');
const getallRoute = express.Router();
const verifyJWT = require('./verifyJWT');
const getIncome = require('./getIncomecontroller');


getallRoute.get('/entries', verifyJWT, getIncome);

module.exports = getallRoute;

const express = require('express');
const dashboardRoute = express.Router();
const verifyJWT = require('./verifyJWT');
const dashboardInfocontroller = require('./dashboardInfocontroller');


dashboardRoute.get('/info', verifyJWT, dashboardInfocontroller);


module.exports = dashboardRoute;
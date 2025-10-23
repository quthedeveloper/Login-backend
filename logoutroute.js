const express = require("express");
const logOutroute = express.Router();
const verifyJWT = require('./verifyJWT');
const logOut = require('./logoutController');


logOutroute.get('/out', verifyJWT, logOut);

module.exports = logOutroute;
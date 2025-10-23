const express = require('express');
const vRouter = express.Router();
const verifyOTP = require('./VerifyOTP')

vRouter.post('/verify', verifyOTP);

module.exports = vRouter;
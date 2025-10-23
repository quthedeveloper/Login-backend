const express = require('express');
const geRouter = express.Router();
const getEmail = require('./generateEmail');
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 70 * 1000,  
  max: 6,
  keyGenerator: (req, res) => {
    return req.query.email;  
  },
  message: { message: "Too many OTP requests for this email" }
});

geRouter.get('/sendotp', otpLimiter, getEmail);


module.exports = geRouter;


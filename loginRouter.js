const express = require('express')
const logRouter = express.Router();
const handleLogin = require('./logincontroller');


logRouter.post('/log', handleLogin);


module.exports = logRouter;
const express = require('express');
const rRouter = express.Router();
const handleUser = require('./registercontroller');

rRouter.post('/register', handleUser);


module.exports = rRouter;
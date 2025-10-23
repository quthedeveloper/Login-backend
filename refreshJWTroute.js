const express = require('express');
const refreshRouter = express.Router();
const refresh = require('./refreshJWTcontroller');


refreshRouter.get('/jwt', refresh);

module.exports = refreshRouter;
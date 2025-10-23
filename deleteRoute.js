const express = require('express');
const delRouter = express.Router();
const verifyJWT = require("./verifyJWT");
const deleteEntry = require('./deleteEntrycontroller');


delRouter.post('/entry',verifyJWT, deleteEntry);

module.exports = delRouter;

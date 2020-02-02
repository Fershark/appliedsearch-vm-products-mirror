const express = require('express');
const routers = express.Router();
// const isAuth = require('../util/auth');
const digitalOceanController = require('../controllers/digitalOceanController');
// ALL ROUTES OF DIGITAL OCEAN API
// prefix: /do

//get all distributions
routers.get('/distributions', digitalOceanController.getAllDistributions);
routers.get('/sizes', digitalOceanController.getAllSizes);


module.exports = routers;
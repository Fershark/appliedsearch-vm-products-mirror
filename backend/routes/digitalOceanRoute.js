const express = require('express');
const routers = express.Router();
// const isAuth = require('../util/auth');
const digitalOceanController = require('../controllers/digitalOceanController');
// ALL ROUTES OF DIGITAL OCEAN API
// prefix: /api/do

//get all distributions
routers.get('/distributions', digitalOceanController.getAllDistributions);
routers.get('/sizes', digitalOceanController.getAllSizes);
routers.get('/regions', digitalOceanController.getAllRegions);

routers.post('/create-vms', digitalOceanController.createVMs)

routers.delete('/delete-vms-by-tags/:tags', digitalOceanController.deleteVMsByTags)

module.exports = routers;
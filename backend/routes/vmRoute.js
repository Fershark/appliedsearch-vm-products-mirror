const express = require('express');
const routers = express.Router();
// const isAuth = require('../util/auth');
const vmController = require('../controllers/vmController');
const isAuth = require('../utils/auth');
// ALL ROUTES OF DIGITAL OCEAN API
// prefix: /api/vms

//GET VM CONFIG OPTIONS
routers.get('/distributions', vmController.getAllDistributions);
routers.get('/sizes', vmController.getAllSizes);
routers.get('/regions', vmController.getAllRegions);

//get vm info
routers.get('/', isAuth, vmController.getVMS);
routers.get('/:id', isAuth, vmController.getVM);

//create a vm
routers.post('/', isAuth, vmController.createVM);

//delete all vms of a user: /api/vms?user_id=1
// routers.delete('/', isAuth, vmController.deleteAllVMsOfUser)

routers.delete('/:id', isAuth, vmController.deleteVM)


module.exports = routers;
const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');
const isAuth = require('../utils/auth');
// ALL ROUTES OF ACTIONS
// prefix: /actions

router.post('/', isAuth, actionController.create);

//TODO: need security here
router.put('/', actionController.updateStatus);
router.get('/', actionController.getNewActions)

module.exports = router;

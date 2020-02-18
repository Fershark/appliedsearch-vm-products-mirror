const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');
const isAuth = require('../utils/auth');
// ALL ROUTES OF ACTIONS
// prefix: /actions

router.post('/create', isAuth, actionController.create);

module.exports = router;

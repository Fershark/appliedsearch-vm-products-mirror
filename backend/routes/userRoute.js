const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');
const isAuth = require('../utils/auth');
// ALL ROUTES OF USERS
// prefix: /users

router.get('/', isAuth, usersController.getAllUsers);
router.post('/create', usersController.create);
router.post('/edit', isAuth, usersController.edit);

module.exports = router;

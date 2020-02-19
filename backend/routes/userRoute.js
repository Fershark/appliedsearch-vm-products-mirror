const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');
const isAuth = require('../utils/auth');
// ALL ROUTES OF USERS
// prefix: /users

router.post('/create', usersController.create);

router.put('/edit', isAuth, usersController.edit);
router.get('/', isAuth, usersController.getUser);

module.exports = router;

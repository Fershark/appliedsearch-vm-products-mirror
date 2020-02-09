const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
// ALL ROUTES OF USERS
// prefix: /users

router.post('/login', authController.loginUser);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;

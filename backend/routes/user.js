const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const isAuth = require('../util/auth');
// ALL ROUTES OF USERS
// prefix: /users

router.get('/', isAuth, usersController.getAllUsers);
router.get('/items', isAuth, usersController.getAllItemsOfUser);
router.post('/create', usersController.create);
router.post('/edit', isAuth, usersController.edit);
router.get('/wishlist', isAuth, usersController.getWishlistOfUser);
router.get('/bookings', isAuth, usersController.getBookingsOfUser);
router.get('/requests', isAuth, usersController.getRequestsOfUser);

module.exports = router;

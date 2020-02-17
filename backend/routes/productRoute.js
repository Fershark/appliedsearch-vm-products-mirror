const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const isAuth = require('../utils/auth');
// ALL ROUTES OF USERS
// prefix: /products

router.get('/', productController.getAll);
router.get('/:id', productController.getById);

module.exports = router;

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateUser } = require('../middleware/auth');

router.post('/', authenticateUser, orderController.createOrder);
router.post('/verify-payment', authenticateUser, orderController.verifyPayment);
router.get('/my-orders', authenticateUser, orderController.getUserOrders);

module.exports = router;

import express from 'express';
const router = express.Router();
import * as orderController from '../controllers/orderController.js';
import * as auth from '../middleware/auth.js';
const { authenticateUser } = auth;

router.post('/', authenticateUser, orderController.createOrder);
router.post('/verify-payment', authenticateUser, orderController.verifyPayment);
router.get('/my-orders', authenticateUser, orderController.getUserOrders);

export default router;
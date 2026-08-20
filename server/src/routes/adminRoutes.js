const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(authenticateAdmin);

// Orders
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// Pizzas
router.post('/pizzas', adminController.createPizza);
router.put('/pizzas/:id', adminController.updatePizza);
router.delete('/pizzas/:id', adminController.deletePizza);

// Ingredients
router.post('/ingredients', adminController.createIngredient);
router.put('/ingredients/:id', adminController.updateIngredient);

module.exports = router;

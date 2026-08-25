import express from 'express';
const router = express.Router();
import * as adminController from '../controllers/adminController';
import * as inventoryController from '../controllers/inventoryController';
import * as auth from '../middleware/auth';
const { authenticateAdmin } = auth;
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
// Inventory
router.get('/inventory', inventoryController.getAllInventory);
router.get('/inventory/history', inventoryController.getInventoryHistory);
router.get('/inventory/:id', inventoryController.getInventoryById);
router.patch('/inventory/:id', inventoryController.updateInventoryItem);
router.post('/inventory/adjust', inventoryController.adjustStock);
export default router;

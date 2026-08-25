import express from 'express';
const router = express.Router();
import * as pizzaController from '../controllers/pizzaController.js';

router.get('/', pizzaController.getAllPizzas);
router.get('/featured', pizzaController.getFeaturedPizzas);
router.get('/:id', pizzaController.getPizzaById);

export default router;
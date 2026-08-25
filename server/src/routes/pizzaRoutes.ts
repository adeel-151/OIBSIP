const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/pizzaController');

router.get('/', pizzaController.getAllPizzas);
router.get('/featured', pizzaController.getFeaturedPizzas);
router.get('/:id', pizzaController.getPizzaById);

module.exports = router;

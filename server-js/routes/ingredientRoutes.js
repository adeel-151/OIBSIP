import express from 'express';
const router = express.Router();
import * as ingredientController from '../controllers/ingredientController';
router.get('/', ingredientController.getAllIngredients);
router.get('/:category', ingredientController.getIngredientsByCategory);
export default router;

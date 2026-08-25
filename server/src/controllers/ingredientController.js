import Ingredient from '../models/Ingredient.js';
import { getCache, setCache } from '../utils/redis.js';

export const getAllIngredients = async (req, res, next) => {
  try {
    const cacheKey = 'ingredients:all';
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json({ success: true, data: cachedData, source: 'cache' });
    }

    const ingredients = await Ingredient.find({ isAvailable: true });
    await setCache(cacheKey, ingredients, 3600);
    res.status(200).json({ success: true, data: ingredients });
  } catch (error) {
    next(error);
  }
};

export const getIngredientsByCategory = async (req, res, next) => {
  try {
    const category = req.params.category.toUpperCase();
    const cacheKey = `ingredients:category:${category}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json({ success: true, data: cachedData, source: 'cache' });
    }

    const ingredients = await Ingredient.find({
      category: category,
      isAvailable: true
    });
    await setCache(cacheKey, ingredients, 3600);
    res.status(200).json({ success: true, data: ingredients });
  } catch (error) {
    next(error);
  }
};
const Ingredient = require('../models/Ingredient');

exports.getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find({ isAvailable: true });
    res.status(200).json({ success: true, data: ingredients });
  } catch (error) {
    next(error);
  }
};

exports.getIngredientsByCategory = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find({ 
      category: req.params.category.toUpperCase(),
      isAvailable: true 
    });
    res.status(200).json({ success: true, data: ingredients });
  } catch (error) {
    next(error);
  }
};

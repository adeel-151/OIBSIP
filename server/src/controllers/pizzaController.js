const Pizza = require('../models/Pizza');

exports.getAllPizzas = async (req, res, next) => {
  try {
    const pizzas = await Pizza.find({ isAvailable: true }).populate('ingredients');
    res.status(200).json({ success: true, data: pizzas });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedPizzas = async (req, res, next) => {
  try {
    const pizzas = await Pizza.find({ isFeatured: true, isAvailable: true }).populate('ingredients');
    res.status(200).json({ success: true, data: pizzas });
  } catch (error) {
    next(error);
  }
};

exports.getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id).populate('ingredients');
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }
    res.status(200).json({ success: true, data: pizza });
  } catch (error) {
    next(error);
  }
};

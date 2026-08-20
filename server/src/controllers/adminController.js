const Order = require('../models/Order');
const Pizza = require('../models/Pizza');
const Ingredient = require('../models/Ingredient');

// --- ORDERS ---
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.pizza')
      .populate('items.customIngredients.base')
      .populate('items.customIngredients.sauce')
      .populate('items.customIngredients.cheese')
      .populate('items.customIngredients.vegetables')
      .sort('-createdAt');
      
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// --- PIZZAS ---
exports.createPizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.create(req.body);
    res.status(201).json({ success: true, data: pizza });
  } catch (error) {
    next(error);
  }
};

exports.updatePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found' });
    res.status(200).json({ success: true, data: pizza });
  } catch (error) {
    next(error);
  }
};

exports.deletePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found' });
    res.status(200).json({ success: true, message: 'Pizza deleted' });
  } catch (error) {
    next(error);
  }
};

// --- INGREDIENTS ---
exports.createIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).json({ success: true, data: ingredient });
  } catch (error) {
    next(error);
  }
};

exports.updateIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ingredient) return res.status(404).json({ success: false, message: 'Ingredient not found' });
    res.status(200).json({ success: true, data: ingredient });
  } catch (error) {
    next(error);
  }
};

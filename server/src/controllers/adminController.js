import Order from '../models/Order';
import Pizza from '../models/Pizza';
import Ingredient from '../models/Ingredient';
import socketUtils from '../utils/socket';
const { getIO } = socketUtils;
import { clearCachePrefix, clearExactCache } from '../utils/redis';

// --- ORDERS ---
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().
    populate('user', 'name email').
    populate('items.pizza').
    populate('items.customIngredients.base').
    populate('items.customIngredients.sauce').
    populate('items.customIngredients.cheese').
    populate('items.customIngredients.vegetables').
    sort('-createdAt');

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
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

    // Emit real-time events
    try {
      const io = getIO();
      // Notify the specific user
      io.to(`user_${order.user.toString()}`).emit('order_status_updated', order);
      // Notify all admins to update their dashboard
      io.to('admin_room').emit('order_updated', order);
    } catch (socketError) {
      console.error('Socket error in updateOrderStatus:', socketError);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// --- PIZZAS ---
export const createPizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.create(req.body);
    await clearCachePrefix('pizzas');
    res.status(201).json({ success: true, data: pizza });
  } catch (error) {
    next(error);
  }
};

export const updatePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found' });
    await clearCachePrefix('pizzas');
    await clearExactCache(`pizza:${req.params.id}`);
    res.status(200).json({ success: true, data: pizza });
  } catch (error) {
    next(error);
  }
};

export const deletePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found' });
    await clearCachePrefix('pizzas');
    await clearExactCache(`pizza:${req.params.id}`);
    res.status(200).json({ success: true, message: 'Pizza deleted' });
  } catch (error) {
    next(error);
  }
};

// --- INGREDIENTS ---
export const createIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    await clearCachePrefix('ingredients');
    res.status(201).json({ success: true, data: ingredient });
  } catch (error) {
    next(error);
  }
};

export const updateIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ingredient) return res.status(404).json({ success: false, message: 'Ingredient not found' });
    await clearCachePrefix('ingredients');
    res.status(200).json({ success: true, data: ingredient });
  } catch (error) {
    next(error);
  }
};
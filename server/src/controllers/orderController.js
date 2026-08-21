const Order = require('../models/Order');
const Pizza = require('../models/Pizza');
const Ingredient = require('../models/Ingredient');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { getIO } = require('../utils/socket');
const mongoose = require('mongoose');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, paymentMethod, deliveryMode, couponCode, specialInstructions, deliveryTimeSlot } = req.body;

    // Securely calculate totalAmount and clean up mock IDs
    let calculatedTotal = 0;
    const cleanItems = [];
    
    for (const item of items) {
      let cleanItem = { ...item };
      
      if (item.isCustom) {
        // Fetch all custom ingredients
        const { base, sauce, cheese, vegetables } = item.customIngredients;
        const allIngredientIds = [base, sauce, cheese, ...(vegetables || [])].filter(Boolean);
        
        // Filter out mock string IDs to prevent Mongoose CastErrors
        const validObjectIds = allIngredientIds.filter(id => mongoose.Types.ObjectId.isValid(id));
        const ingredients = await Ingredient.find({ _id: { $in: validObjectIds } });
        
        let itemTotal = ingredients.reduce((sum, ing) => sum + (ing.price || 0), 0);
        
        // Fallback for mock ingredients
        if (itemTotal === 0 && item.price) {
          itemTotal = item.price;
        }
        
        // Clean up invalid custom ingredient IDs
        if (cleanItem.customIngredients) {
          if (!mongoose.Types.ObjectId.isValid(cleanItem.customIngredients.base)) delete cleanItem.customIngredients.base;
          if (!mongoose.Types.ObjectId.isValid(cleanItem.customIngredients.sauce)) delete cleanItem.customIngredients.sauce;
          if (!mongoose.Types.ObjectId.isValid(cleanItem.customIngredients.cheese)) delete cleanItem.customIngredients.cheese;
          if (cleanItem.customIngredients.vegetables) {
            cleanItem.customIngredients.vegetables = cleanItem.customIngredients.vegetables.filter(id => mongoose.Types.ObjectId.isValid(id));
          }
        }
        
        calculatedTotal += itemTotal * (item.quantity || 1);
      } else {
        let itemTotal = 0;
        if (mongoose.Types.ObjectId.isValid(item.pizza)) {
          const pizza = await Pizza.findById(item.pizza);
          if (pizza) itemTotal = pizza.price;
        } else {
          // Remove invalid pizza ID to prevent CastError
          delete cleanItem.pizza;
        }
        
        // Fallback for mock pizzas
        if (itemTotal === 0 && item.price) {
          itemTotal = item.price;
        }
        
        calculatedTotal += itemTotal * (item.quantity || 1);
      }
      
      cleanItems.push(cleanItem);
    }

    // Add Delivery Fee
    if (deliveryMode === 'delivery' && calculatedTotal > 0) {
      calculatedTotal += 50;
    }

    // Add Coupon Discount (Mock Logic for portfolio)
    if (couponCode) {
      const code = couponCode.toUpperCase();
      if (code === 'PIZZA20') calculatedTotal -= 20;
      else if (code === 'WELCOME50') calculatedTotal -= 50;
      else if (code === 'FLAT100') calculatedTotal -= 100;
    }

    // Ensure total is never negative or 0 (Razorpay requires minimum 1 INR)
    if (calculatedTotal <= 0) calculatedTotal = 1;

    const order = new Order({
      user: req.user.id || req.user._id, // Support both depending on jwt payload
      items: cleanItems,
      totalAmount: calculatedTotal,
      deliveryAddress,
      paymentMethod,
      deliveryMode,
      specialInstructions,
      deliveryTimeSlot,
      couponCode,
    });

    if (paymentMethod === 'ONLINE') {
      // Create Razorpay order
      const options = {
        amount: calculatedTotal * 100, // amount in smallest currency unit (paise for INR)
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);
      
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();
      
      try {
        const orderPopulated = await Order.findById(order._id).populate('user', 'name email');
        getIO().to('admin_room').emit('new_order', orderPopulated);
      } catch(err) { console.error('Socket error emitting new_order', err) }

      return res.status(201).json({
        success: true,
        data: order,
        razorpayOrder,
      });
    }

    // Cash on Delivery
    await order.save();
    
    try {
      const orderPopulated = await Order.findById(order._id).populate('user', 'name email');
      getIO().to('admin_room').emit('new_order', orderPopulated);
    } catch(err) { console.error('Socket error emitting new_order', err) }
    
    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Update order status
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { 
          paymentStatus: 'COMPLETED',
          razorpayPaymentId: razorpay_payment_id
        },
        { new: true }
      );

      return res.status(200).json({ success: true, data: order });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    next(error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
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

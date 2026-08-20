const Order = require('../models/Order');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    const order = new Order({
      user: req.user.userId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
    });

    if (paymentMethod === 'ONLINE') {
      // Create Razorpay order
      const options = {
        amount: totalAmount * 100, // amount in smallest currency unit (paise for INR)
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);
      
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      return res.status(201).json({
        success: true,
        data: order,
        razorpayOrder,
      });
    }

    // Cash on Delivery
    await order.save();
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
    const orders = await Order.find({ user: req.user.userId })
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

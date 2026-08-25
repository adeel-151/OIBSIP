import mongoose from 'mongoose';
const orderItemSchema = new mongoose.Schema({
    pizza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pizza',
    },
    isCustom: {
        type: Boolean,
        default: false,
    },
    customIngredients: {
        base: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
        sauce: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
        cheese: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
        vegetables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }]
    },
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
    }
});
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        phone: String,
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'ONLINE'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING',
    },
    deliveryMode: {
        type: String,
        enum: ['delivery', 'pickup'],
        default: 'delivery',
    },
    specialInstructions: {
        type: String,
    },
    deliveryTimeSlot: {
        type: String,
    },
    couponCode: {
        type: String,
    },
    razorpayOrderId: {
        type: String,
    },
    razorpayPaymentId: {
        type: String,
    },
    orderStatus: {
        type: String,
        enum: ['RECEIVED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
        default: 'RECEIVED',
    },
}, {
    timestamps: true,
});
export default mongoose.model('Order', orderSchema);

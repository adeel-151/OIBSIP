import mongoose from 'mongoose';
const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['BASE', 'SAUCE', 'CHEESE', 'VEGETABLE'],
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: String,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
ingredientSchema.index({ category: 1 });
export default mongoose.model('Ingredient', ingredientSchema);

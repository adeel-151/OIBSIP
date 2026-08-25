const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    threshold: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'g', 'l', 'ml', 'pcs', 'slices'],
      default: 'pcs',
    },
    lowStockAlertSent: {
      type: Boolean,
      default: false,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ quantity: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);

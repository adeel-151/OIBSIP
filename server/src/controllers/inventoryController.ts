import Inventory from '../models/Inventory';
import Ingredient from '../models/Ingredient';
import socketUtils from '../utils/socket';
const { getIO } = socketUtils;

export const getAllInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.find().populate('ingredientId', 'name category image');
    res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    next(error);
  }
};

export const getInventoryById = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id).populate('ingredientId', 'name category image');
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const updateInventoryItem = async (req, res, next) => {
  try {
    const { quantity, threshold, unit } = req.body;
    
    const updateData = { lastUpdatedBy: req.user._id };
    if (quantity !== undefined) updateData.quantity = quantity;
    if (threshold !== undefined) updateData.threshold = threshold;
    if (unit !== undefined) updateData.unit = unit;

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('ingredientId', 'name category');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    
    // Reset low stock alert flag if stock is back to normal
    if (item.quantity > item.threshold && item.lowStockAlertSent) {
      item.lowStockAlertSent = false;
      await item.save();
    }

    try {
      getIO().to('admin_room').emit('inventory_updated', item);
    } catch (err) {
      console.error('Socket emit error for inventory:', err);
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const { ingredientId, quantityChange, reason } = req.body;
    
    if (!ingredientId || quantityChange === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let inventory = await Inventory.findOne({ ingredientId });
    
    if (!inventory) {
      // Create if it doesn't exist yet
      inventory = new Inventory({
        ingredientId,
        quantity: quantityChange > 0 ? quantityChange : 0,
        lastUpdatedBy: req.user._id
      });
    } else {
      inventory.quantity += quantityChange;
      inventory.lastUpdatedBy = req.user._id;
      
      // Prevent negative stock
      if (inventory.quantity < 0) {
        return res.status(400).json({ success: false, message: 'Insufficient stock to perform this deduction' });
      }
    }

    // Reset alert flag if stock is restored
    if (inventory.quantity > inventory.threshold && inventory.lowStockAlertSent) {
      inventory.lowStockAlertSent = false;
    }

    await inventory.save();
    await inventory.populate('ingredientId', 'name category');

    try {
      getIO().to('admin_room').emit('inventory_updated', inventory);
    } catch (err) {
      console.error('Socket emit error for inventory:', err);
    }

    // Optionally: Save adjustment history here if we had an InventoryHistory model (reason)

    res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    next(error);
  }
};

export const getInventoryHistory = async (req, res, next) => {
  // Mock history endpoint for portfolio purposes
  res.status(200).json({ success: true, data: [] });
};

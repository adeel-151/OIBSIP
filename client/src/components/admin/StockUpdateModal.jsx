import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import Button from '../ui/Button';

const StockUpdateModal = ({ item, onClose, token }) => {
  const [adjustmentType, setAdjustmentType] = useState('Add Stock');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    let quantityChange = Number(quantity);
    if (adjustmentType === 'Remove Stock') {
      quantityChange = -quantityChange;
      if (item.quantity + quantityChange < 0) {
        toast.error('Cannot remove more stock than currently available');
        return;
      }
    } else if (adjustmentType === 'Set Exact Quantity') {
      quantityChange = Number(quantity) - item.quantity;
    }

    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/admin/inventory/adjust',
        {
          ingredientId: item.ingredientId._id,
          quantityChange,
          reason
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Stock updated successfully');
      onClose(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-border/50 bg-muted/20">
          <h2 className="text-xl font-bold font-heading">Update Stock</h2>
          <button onClick={() => onClose(false)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-1">Ingredient</p>
            <p className="font-semibold text-lg">{item.ingredientId?.name}</p>
            <p className="text-xs text-muted-foreground mt-1">Current Stock: {item.quantity} {item.unit}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Adjustment Type</label>
              <select 
                value={adjustmentType} 
                onChange={(e) => setAdjustmentType(e.target.value)}
                className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>Add Stock</option>
                <option>Remove Stock</option>
                <option>Set Exact Quantity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quantity ({item.unit})</label>
              <input 
                type="number" 
                min="0"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. 50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reason (Optional)</label>
              <input 
                type="text" 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Restock from supplier"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockUpdateModal;

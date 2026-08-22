import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import StockUpdateModal from '../../components/admin/StockUpdateModal';
import { toast } from 'sonner';

const Inventory = () => {
  const { token } = useAuthStore();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [token]);

  const handleUpdateClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = (updated) => {
    setIsModalOpen(false);
    setSelectedItem(null);
    if (updated) {
      fetchInventory();
    }
  };

  const getStatusBadge = (stock, threshold) => {
    if (stock <= threshold * 0.5) return <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-xs font-bold">Critical</span>;
    if (stock <= threshold) return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs font-bold">Low</span>;
    return <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-bold">Healthy</span>;
  };

  if (loading) {
    return <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-heading">Inventory Management</h1>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="p-4 font-semibold">Item</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Stock</th>
              <th className="p-4 font-semibold">Threshold</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {inventory.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-muted-foreground">No inventory data available. Ensure ingredients are added.</td></tr>
            ) : (
              inventory.map((item) => (
                <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{item.ingredientId?.name || 'Unknown'}</td>
                  <td className="p-4"><span className="text-xs uppercase tracking-wider">{item.ingredientId?.category || 'N/A'}</span></td>
                  <td className="p-4 font-bold">{item.quantity} <span className="text-xs text-muted-foreground font-normal">{item.unit}</span></td>
                  <td className="p-4 text-muted-foreground">{item.threshold} <span className="text-xs">{item.unit}</span></td>
                  <td className="p-4">{getStatusBadge(item.quantity, item.threshold)}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleUpdateClick(item)}
                      className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <StockUpdateModal 
          item={selectedItem} 
          onClose={handleModalClose} 
          token={token} 
        />
      )}
    </div>
  );
};

export default Inventory;

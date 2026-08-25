import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import StockUpdateModal from '../../components/admin/StockUpdateModal';
import { toast } from 'sonner';
import { socket } from '../../services/socket';

const Inventory = () => {
  const { token } = useAuthStore();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/admin/inventory');
      setInventory(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();

    // Setup Socket
    socket.connect();
    socket.emit('join_admin_room');

    const handleInventoryUpdate = () => {
      fetchInventory();
    };

    socket.on('inventory_updated', handleInventoryUpdate);

    return () => {
      socket.off('inventory_updated', handleInventoryUpdate);
    };
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
    if (stock <= threshold * 0.5) return <span className="px-3 py-1.5 bg-[#fca5a5] border-2 border-foreground text-foreground rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">Critical</span>;
    if (stock <= threshold) return <span className="px-3 py-1.5 bg-[#fef08a] border-2 border-foreground text-foreground rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">Low</span>;
    return <span className="px-3 py-1.5 bg-[#86efac] border-2 border-foreground text-foreground rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">Healthy</span>;
  };

  if (loading) {
    return <div className="flex justify-center p-20"><div className="w-12 h-12 border-4 border-foreground border-t-primary rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="pb-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-['Chewy'] tracking-wide text-foreground">Inventory Management</h1>
        <div className="inline-flex items-center gap-3 bg-card border-4 border-foreground px-4 py-2 rounded-full shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse border-2 border-foreground"></span>
          <span className="font-black text-sm uppercase tracking-wider text-muted-foreground">Live Sync Active</span>
        </div>
      </div>

      <div className="bg-card border-4 border-foreground rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_0px_hsl(var(--foreground))]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary text-foreground border-b-4 border-foreground">
              <tr>
                <th className="p-5 font-black uppercase tracking-wider text-sm border-r-4 border-foreground/20">Item</th>
                <th className="p-5 font-black uppercase tracking-wider text-sm border-r-4 border-foreground/20">Category</th>
                <th className="p-5 font-black uppercase tracking-wider text-sm border-r-4 border-foreground/20">Stock</th>
                <th className="p-5 font-black uppercase tracking-wider text-sm border-r-4 border-foreground/20">Threshold</th>
                <th className="p-5 font-black uppercase tracking-wider text-sm border-r-4 border-foreground/20">Status</th>
                <th className="p-5 font-black uppercase tracking-wider text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-foreground/20">
              {inventory.length === 0 ?
              <tr><td colSpan="6" className="p-10 text-center font-bold text-muted-foreground text-lg">No inventory data available. Ensure ingredients are added.</td></tr> :

              inventory.map((item) =>
              <tr key={item._id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-5 font-bold text-lg border-r-4 border-foreground/10">{item.ingredientId?.name || 'Unknown'}</td>
                    <td className="p-5 border-r-4 border-foreground/10"><span className="text-xs font-black bg-foreground text-background px-3 py-1.5 rounded-lg uppercase tracking-wider">{item.ingredientId?.category || 'N/A'}</span></td>
                    <td className="p-5 font-black text-2xl text-primary border-r-4 border-foreground/10">{item.quantity} <span className="text-sm text-foreground font-bold">{item.unit}</span></td>
                    <td className="p-5 font-bold text-muted-foreground border-r-4 border-foreground/10">{item.threshold} <span className="text-sm">{item.unit}</span></td>
                    <td className="p-5 border-r-4 border-foreground/10">{getStatusBadge(item.quantity, item.threshold)}</td>
                    <td className="p-5">
                      <button
                    onClick={() => handleUpdateClick(item)}
                    className="bg-primary hover:bg-primary/90 text-white font-black px-4 py-2 rounded-xl border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-y-1 hover:shadow-none transition-all">
                    
                        Update
                      </button>
                    </td>
                  </tr>
              )
              }
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen &&
      <StockUpdateModal
        item={selectedItem}
        onClose={handleModalClose}
        token={token} />

      }
    </div>);

};

export default Inventory;
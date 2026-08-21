import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { socket } from '../../services/socket';
import { toast } from 'sonner';
import { Search, Filter, Package, Clock, Utensils, CheckCircle2, ChevronDown, Bell } from 'lucide-react';
import SEO from '../../components/SEO';

const STATUS_CONFIG = {
  RECEIVED: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Package },
  PREPARING: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Utensils },
  OUT_FOR_DELIVERY: { color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: Clock },
  DELIVERED: { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle2 },
  CANCELLED: { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: Package }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchOrders();

    // Socket.io Real-Time Admin Updates
    socket.connect();
    socket.emit('join_admin_room');

    socket.on('new_order', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
      toast.success(`New Order Received! #${newOrder._id.substring(0, 8)}`, {
        icon: '🔔',
        style: { background: 'var(--color-primary)', color: 'white' }
      });
      // Play a notification sound
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed (browser policy)', e));
      } catch (e) {}
    });

    socket.on('order_updated', (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    return () => {
      socket.off('new_order');
      socket.off('order_updated');
      socket.disconnect();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      // Optimistic UI update
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: newStatus } : o));
      
      await api.patch(`/admin/orders/${id}/status`, { orderStatus: newStatus });
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
      fetchOrders(); // revert on failure
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (order.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || order.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Manage Orders | Admin" />
      
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black font-heading tracking-tight mb-2">Live Orders</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Real-time synchronization active
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/30 outline-none w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/30 outline-none appearance-none w-full sm:w-48"
            >
              <option value="ALL">All Statuses</option>
              {Object.keys(STATUS_CONFIG).map(status => (
                <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map(order => {
              const config = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.RECEIVED;
              const StatusIcon = config.icon;
              
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={order._id}
                  className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Card Header */}
                  <div className={`p-4 border-b border-border flex justify-between items-center ${order.orderStatus === 'RECEIVED' ? 'bg-primary/5' : 'bg-secondary/30'}`}>
                    <div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Order ID</span>
                      <span className="font-mono font-bold text-foreground">#{order._id.substring(0, 8)}</span>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-bold ${config.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {order.orderStatus.replace(/_/g, ' ')}
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-5 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-lg">{order.user?.name || 'Guest User'}</p>
                        <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-primary">Rs.{order.totalAmount}</p>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">{order.paymentMethod}</p>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/50 rounded-xl p-3 mb-4">
                      <p className="text-sm font-medium leading-relaxed line-clamp-2">
                        {order.items.map(i => `${i.quantity}x ${i.name || 'Pizza'}`).join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Card Footer Actions */}
                  <div className="p-4 bg-secondary/20 border-t border-border flex items-center gap-3">
                    <select 
                      value={order.orderStatus} 
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="RECEIVED">Received</option>
                      <option value="PREPARING">Preparing</option>
                      <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <button className="px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-colors text-sm">
                      Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filteredOrders.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold">No orders found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

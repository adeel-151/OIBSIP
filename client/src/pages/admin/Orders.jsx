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
  const [selectedOrder, setSelectedOrder] = useState(null);

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
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedOrder(order);
                      }}
                      className="px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-colors text-sm"
                    >
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

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh] z-10"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
                <div>
                  <h3 className="text-2xl font-black font-heading tracking-tight mb-1">Order Details</h3>
                  <p className="text-sm text-muted-foreground font-mono">#{selectedOrder._id}</p>
                </div>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedOrder(null);
                  }}
                  className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-8">
                
                {/* Customer Info */}
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Name</p>
                      <p className="font-bold">{selectedOrder.user?.name || 'Guest User'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Email</p>
                      <p className="font-bold">{selectedOrder.user?.email || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Delivery Address</p>
                      <p className="font-medium bg-secondary/30 p-3 rounded-xl border border-border/50">
                        {typeof selectedOrder.deliveryAddress === 'object' 
                          ? `${selectedOrder.deliveryAddress?.street || ''}, ${selectedOrder.deliveryAddress?.city || ''}, ${selectedOrder.deliveryAddress?.state || ''} ${selectedOrder.deliveryAddress?.zipCode || ''}`.replace(/(^[,\s]+)|([,\s]+$)/g, '')
                          : (selectedOrder.deliveryAddress || 'No address provided')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Logistics */}
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">Logistics</h4>
                  <div className="grid grid-cols-2 gap-4 bg-secondary/10 p-4 rounded-xl border border-border/30">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Delivery Mode</p>
                      <p className="font-bold uppercase">{selectedOrder.deliveryMode || 'delivery'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Time Slot</p>
                      <p className="font-bold">{selectedOrder.deliveryTimeSlot || 'ASAP'}</p>
                    </div>
                    {selectedOrder.specialInstructions && (
                      <div className="col-span-2 mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Special Instructions</p>
                        <p className="text-sm font-medium italic text-amber-500 bg-amber-500/10 p-3 rounded-lg">
                          "{selectedOrder.specialInstructions}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">Items Ordered</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-secondary/20 p-3 rounded-xl border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                            {item.quantity}x
                          </div>
                          <div>
                            <p className="font-bold text-sm">{item.name || 'Custom Pizza'}</p>
                            {item.isCustom && <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-sm">Custom Built</span>}
                          </div>
                        </div>
                        <p className="font-bold text-sm">Rs.{item.price || 0}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
              
              {/* Modal Footer */}
              <div className="p-6 border-t border-border bg-secondary/30 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Payment</p>
                  <p className="font-bold text-sm flex items-center gap-2">
                    {selectedOrder.paymentMethod} 
                    <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase ${
                      selectedOrder.paymentStatus === 'COMPLETED' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-2xl font-black text-primary">Rs.{selectedOrder.totalAmount}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;

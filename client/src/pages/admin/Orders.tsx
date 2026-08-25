import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { socket } from '../../services/socket';
import { toast } from 'sonner';
import { Search, Filter, Package, Clock, Utensils, CheckCircle2, ChevronDown, Bell, Download } from 'lucide-react';
import SEO from '../../components/SEO';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const STATUS_CONFIG = {
  RECEIVED: { color: 'bg-[#bfdbfe] text-blue-700', icon: Package },
  PREPARING: { color: 'bg-[#fef08a] text-yellow-700', icon: Utensils },
  OUT_FOR_DELIVERY: { color: 'bg-[#e9d5ff] text-purple-700', icon: Clock },
  DELIVERED: { color: 'bg-[#86efac] text-green-700', icon: CheckCircle2 },
  CANCELLED: { color: 'bg-[#fca5a5] text-red-700', icon: Package }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();

    socket.connect();
    socket.emit('join_admin_room');

    socket.on('new_order', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
      toast.success(`New Order Received! #${newOrder._id.substring(0, 8)}`, {
        icon: '🔔',
        style: { background: 'var(--color-primary)', color: 'white', border: '4px solid black', borderRadius: '1rem', fontWeight: 'bold' }
      });
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
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: newStatus } : o));
      await api.patch(`/admin/orders/${id}/status`, { orderStatus: newStatus });
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
      fetchOrders(); 
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (order.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || order.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38); // Red
    doc.text('PIZZARO', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Crafted Your Way', 14, 25);
    
    // Invoice Title
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('INVOICE', 160, 20);
    doc.setFontSize(10);
    doc.text(`Order ID: #${order._id.substring(0, 8)}`, 160, 26);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 160, 31);
    
    // Customer Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Billed To:', 14, 45);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Name: ${order.user?.name || 'Guest User'}`, 14, 52);
    doc.text(`Email: ${order.user?.email || 'N/A'}`, 14, 58);
    const address = typeof order.deliveryAddress === 'object' 
      ? `${order.deliveryAddress?.street || ''}, ${order.deliveryAddress?.city || ''}`
      : (order.deliveryAddress || 'N/A');
    doc.text(`Address: ${address}`, 14, 64);
    
    // Items Table
    const tableColumn = ["Item", "Qty", "Unit Price", "Total"];
    const tableRows = [];
    
    order.items.forEach(item => {
      const itemData = [
        item.name || 'Custom Pizza',
        item.quantity,
        `Rs.${item.price}`,
        `Rs.${item.price * item.quantity}`
      ];
      tableRows.push(itemData);
    });
    
    doc.autoTable({
      startY: 75,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 4 }
    });
    
    const finalY = doc.lastAutoTable.finalY || 75;
    
    // Totals
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Amount: Rs.${order.totalAmount}`, 140, finalY + 15);
    doc.text(`Payment: ${order.paymentMethod} (${order.paymentStatus})`, 14, finalY + 15);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Thank you for choosing Pizzaro!', 105, finalY + 40, { align: 'center' });
    
    doc.save(`Invoice_${order._id.substring(0,8)}.pdf`);
  };

  return (
    <div className="pb-10 max-w-7xl mx-auto">
      <SEO title="Manage Orders | Admin" />
      
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-['Chewy'] tracking-wide text-foreground mb-3">Live Orders</h2>
          <div className="inline-flex items-center gap-3 bg-card border-4 border-foreground px-4 py-2 rounded-full shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse border-2 border-foreground"></span>
            <span className="font-black text-sm uppercase tracking-wider text-muted-foreground">Real-time sync active</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-card border-4 border-foreground rounded-2xl font-bold focus:ring-4 focus:ring-primary/30 outline-none w-full sm:w-72 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-12 pr-10 py-3 bg-card border-4 border-foreground rounded-2xl font-black uppercase tracking-wider text-sm focus:ring-4 focus:ring-primary/30 outline-none appearance-none w-full sm:w-56 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all"
            >
              <option value="ALL">All Statuses</option>
              {Object.keys(STATUS_CONFIG).map(status => (
                <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground pointer-events-none font-bold" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-foreground border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
                  className="bg-card rounded-[2rem] border-4 border-foreground overflow-hidden shadow-[8px_8px_0px_0px_hsl(var(--foreground))] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_hsl(var(--foreground))] transition-all flex flex-col group"
                >
                  {/* Card Header */}
                  <div className={`p-5 border-b-4 border-foreground flex justify-between items-center ${order.orderStatus === 'RECEIVED' ? 'bg-[#bfdbfe]' : 'bg-secondary/50'}`}>
                    <div>
                      <span className="text-xs font-black text-foreground/70 uppercase tracking-widest block mb-1">Order ID</span>
                      <span className="font-mono font-black text-foreground text-lg">#{order._id.substring(0, 8)}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border-2 border-foreground flex items-center gap-2 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_hsl(var(--foreground))] ${config.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {order.orderStatus.replace(/_/g, ' ')}
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="font-black text-xl text-foreground">{order.user?.name || 'Guest User'}</p>
                        <p className="text-sm font-bold text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-['Chewy'] text-3xl tracking-wide text-primary">Rs.{order.totalAmount}</p>
                        <p className="text-xs font-black text-foreground/60 uppercase tracking-widest mt-1 bg-secondary inline-block px-2 py-1 rounded-md border-2 border-foreground/10">{order.paymentMethod}</p>
                      </div>
                    </div>
                    
                    <div className="bg-background border-4 border-dashed border-foreground/20 rounded-2xl p-4">
                      <p className="font-bold text-foreground leading-relaxed line-clamp-2">
                        {order.items.map(i => `${i.quantity}x ${i.name || 'Pizza'}`).join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Card Footer Actions */}
                  <div className="p-5 bg-secondary/30 border-t-4 border-foreground flex flex-col gap-3">
                    <div className="relative">
                      <select 
                        value={order.orderStatus} 
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="w-full px-4 py-3 bg-background border-4 border-foreground rounded-xl text-sm font-black uppercase tracking-wider focus:outline-none focus:ring-4 focus:ring-primary/30 appearance-none shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
                      >
                        <option value="RECEIVED">Received</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground pointer-events-none font-bold" />
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedOrder(order);
                      }}
                      className="w-full px-4 py-3 bg-primary text-white border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-y-1 hover:shadow-none font-black text-lg rounded-xl transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filteredOrders.length === 0 && (
            <div className="col-span-full py-20 text-center bg-card border-4 border-dashed border-foreground/30 rounded-[2rem]">
              <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-3xl font-['Chewy'] tracking-wide text-foreground mb-2">No orders found</h3>
              <p className="text-muted-foreground font-bold text-lg">Try adjusting your filters or search query.</p>
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
              className="relative w-full max-w-2xl bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_hsl(var(--foreground))] rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh] z-10"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-8 border-b-4 border-foreground bg-primary flex justify-between items-center">
                <div>
                  <h3 className="text-4xl font-['Chewy'] tracking-wide text-foreground mb-1">Order Details</h3>
                  <p className="font-mono font-black text-foreground/80 text-lg bg-background/30 inline-block px-3 py-1 rounded-lg border-2 border-foreground/20">#{selectedOrder._id}</p>
                </div>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedOrder(null);
                  }}
                  className="w-12 h-12 rounded-full bg-background border-2 border-foreground flex items-center justify-center hover:bg-destructive hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-grow space-y-10">
                
                {/* Customer Info */}
                <div>
                  <h4 className="text-lg font-black text-foreground uppercase tracking-wider mb-4 border-b-4 border-foreground pb-2 inline-block">Customer Info</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-secondary/30 p-4 rounded-2xl border-2 border-foreground/10">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Name</p>
                      <p className="font-black text-lg text-foreground">{selectedOrder.user?.name || 'Guest User'}</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-2xl border-2 border-foreground/10">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Email</p>
                      <p className="font-bold text-foreground truncate" title={selectedOrder.user?.email}>{selectedOrder.user?.email || 'N/A'}</p>
                    </div>
                    <div className="col-span-2 bg-[#bfdbfe] p-5 rounded-2xl border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                      <p className="text-xs font-black text-foreground uppercase tracking-widest mb-1">Delivery Address</p>
                      <p className="font-bold text-lg text-foreground">
                        {typeof selectedOrder.deliveryAddress === 'object' 
                          ? `${selectedOrder.deliveryAddress?.street || ''}, ${selectedOrder.deliveryAddress?.city || ''}, ${selectedOrder.deliveryAddress?.state || ''} ${selectedOrder.deliveryAddress?.zipCode || ''}`.replace(/(^[,\s]+)|([,\s]+$)/g, '')
                          : (selectedOrder.deliveryAddress || 'No address provided')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Logistics */}
                <div>
                  <h4 className="text-lg font-black text-foreground uppercase tracking-wider mb-4 border-b-4 border-foreground pb-2 inline-block">Logistics</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-secondary/30 p-4 rounded-2xl border-2 border-foreground/10">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Delivery Mode</p>
                      <p className="font-black text-lg text-foreground uppercase">{selectedOrder.deliveryMode || 'delivery'}</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-2xl border-2 border-foreground/10">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Time Slot</p>
                      <p className="font-black text-lg text-foreground">{selectedOrder.deliveryTimeSlot || 'ASAP'}</p>
                    </div>
                    {selectedOrder.specialInstructions && (
                      <div className="col-span-2 mt-2 bg-[#fef08a] p-5 rounded-2xl border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                        <p className="text-xs font-black text-foreground uppercase tracking-widest mb-2">Special Instructions</p>
                        <p className="font-bold text-lg text-foreground italic">
                          "{selectedOrder.specialInstructions}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Order Items */}
                <div>
                  <h4 className="text-lg font-black text-foreground uppercase tracking-wider mb-4 border-b-4 border-foreground pb-2 inline-block">Items Ordered</h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-background p-4 rounded-2xl border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-black text-white text-base border-2 border-foreground">
                            {item.quantity}x
                          </div>
                          <div>
                            <p className="font-black text-lg text-foreground">{item.name || 'Custom Pizza'}</p>
                            {item.isCustom && <span className="inline-block mt-1 text-xs uppercase font-black text-foreground bg-[#86efac] border-2 border-foreground px-2 py-0.5 rounded-md shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">Custom Built</span>}
                          </div>
                        </div>
                        <p className="font-['Chewy'] text-2xl tracking-wide text-foreground">Rs.{item.price || 0}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
              
              {/* Modal Footer */}
              <div className="p-4 sm:p-8 border-t-4 border-foreground bg-secondary flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Payment</p>
                  <p className="font-black text-lg text-foreground flex items-center gap-3">
                    {selectedOrder.paymentMethod} 
                    <span className={`px-3 py-1 text-xs border-2 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] rounded-full uppercase ${
                      selectedOrder.paymentStatus === 'COMPLETED' ? 'bg-[#86efac] text-foreground' : 'bg-[#fef08a] text-foreground'
                    }`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-5xl font-['Chewy'] tracking-wide text-primary drop-shadow-[2px_2px_0px_hsl(var(--foreground))]">Rs.{selectedOrder.totalAmount}</p>
                  <button 
                    onClick={() => generateInvoice(selectedOrder)}
                    className="mt-2 flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl font-bold hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_hsl(var(--primary))]"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
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

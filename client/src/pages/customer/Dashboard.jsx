import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { socket } from '../../services/socket';
import { toast } from 'sonner';
import { 
  Package, Clock, CheckCircle2, MapPin, Bell, User, History, ArrowRight, Truck, Utensils
} from 'lucide-react';
import SEO from '../../components/SEO';
import Button from '../../components/ui/Button';

const ORDER_STATUSES = [
  { id: 'RECEIVED', label: 'Received', icon: Package },
  { id: 'PREPARING', label: 'Preparing', icon: Utensils },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 }
];

const Dashboard = () => {
  const { user } = useAuthStore();
  const [activeOrder, setActiveOrder] = useState(null);
  const [pastOrders, setPastOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        const orders = response.data.data || [];
        
        const active = orders.find(o => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED');
        const past = orders.filter(o => o.orderStatus === 'DELIVERED' || o.orderStatus === 'CANCELLED');
        
        setActiveOrder(active || null);
        setPastOrders(past);
      } catch (error) {
        toast.error('Failed to load orders.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

    // Socket.io Real-Time Updates
    if (user?._id) {
      socket.connect();
      socket.emit('join_user_room', user._id);

      socket.on('order_status_updated', (updatedOrder) => {
        if (updatedOrder.orderStatus === 'DELIVERED' || updatedOrder.orderStatus === 'CANCELLED') {
          setActiveOrder(null);
          setPastOrders(prev => [updatedOrder, ...prev.filter(o => o._id !== updatedOrder._id)]);
          toast.success(`Order ${updatedOrder.orderStatus.toLowerCase()}`);
        } else {
          setActiveOrder(updatedOrder);
          toast.info(`Your order status is now: ${updatedOrder.orderStatus.replace(/_/g, ' ')}`);
        }
      });
    }

    return () => {
      socket.off('order_status_updated');
      socket.disconnect();
    };
  }, [user]);

  const getStatusIndex = (status) => {
    return ORDER_STATUSES.findIndex(s => s.id === status) !== -1 ? ORDER_STATUSES.findIndex(s => s.id === status) : 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background py-8 lg:py-12 relative overflow-hidden">
      <SEO title="My Dashboard" />
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 rotate-3">
                <User className="w-10 h-10 -rotate-3" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black font-heading tracking-tight">Welcome, {user?.name?.split(' ')[0] || 'Pizza Lover'}!</h1>
              <p className="text-muted-foreground flex items-center gap-1.5 mt-2 font-medium">
                <MapPin className="w-4 h-4 text-primary" /> Delivery ready to {user?.email}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center hover:border-primary/50 transition-all relative group">
              <Bell className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full animate-pulse border-2 border-card"></span>
            </button>
            <Link to="/build">
              <Button variant="premium" className="rounded-xl shadow-lg shadow-primary/20 h-12 px-8 text-base">
                New Order
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Active Order Tracker */}
        <AnimatePresence mode="wait">
          {activeOrder && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-16 relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-rose-500 to-accent rounded-[32px] blur opacity-20 animate-pulse"></div>
              <div className="relative bg-card/80 backdrop-blur-xl rounded-[28px] border border-border/50 shadow-xl overflow-hidden">
                
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-border/50 flex flex-wrap justify-between items-center gap-6 bg-gradient-to-r from-secondary/50 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary animate-[spin_3s_linear_infinite]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-heading">Order in Progress</h2>
                      <p className="text-sm text-muted-foreground font-mono">#{activeOrder._id.substring(0, 10)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Estimated Arrival</p>
                    <p className="text-2xl font-black text-foreground">
                      {activeOrder.deliveryMode === 'pickup' ? '15-20' : '25-35'} <span className="text-sm font-medium text-muted-foreground">mins</span>
                    </p>
                  </div>
                </div>
                
                {/* Progress Tracker */}
                <div className="p-8 md:p-12">
                  <div className="relative max-w-4xl mx-auto">
                    {/* Track Line */}
                    <div className="absolute top-8 left-[10%] right-[10%] h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        className="absolute top-0 left-0 bottom-0 bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(getStatusIndex(activeOrder.orderStatus) / (ORDER_STATUSES.length - 1)) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    
                    {/* Steps */}
                    <div className="flex justify-between relative z-10">
                      {ORDER_STATUSES.map((status, index) => {
                        const currentIndex = getStatusIndex(activeOrder.orderStatus);
                        const isActive = index === currentIndex;
                        const isCompleted = index < currentIndex;
                        const Icon = status.icon;
                        
                        return (
                          <div key={status.id} className="flex flex-col items-center w-1/4">
                            <motion.div 
                              initial={false}
                              animate={{ 
                                scale: isActive ? 1.2 : 1,
                                backgroundColor: isActive || isCompleted ? 'var(--color-primary)' : 'var(--color-secondary)'
                              }}
                              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors shadow-lg
                                ${isActive ? 'shadow-primary/40 text-primary-foreground' : 
                                  isCompleted ? 'text-primary-foreground' : 'text-muted-foreground border-2 border-border shadow-none'}`}
                            >
                              <Icon className={`w-7 h-7 ${isActive ? 'animate-bounce' : ''}`} />
                            </motion.div>
                            <span className={`text-sm md:text-base text-center transition-colors
                              ${isActive ? 'font-bold text-primary' : 
                                isCompleted ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>
                              {status.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black font-heading flex items-center gap-3">
                <History className="w-6 h-6 text-primary" /> Past Orders
              </h2>
              <p className="text-muted-foreground mt-1">Review and reorder your favorites.</p>
            </div>
            <Link to="/menu" className="hidden sm:flex text-sm font-bold text-primary hover:text-primary/80 items-center transition-colors">
              Browse Menu <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {pastOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastOrders.map((order) => (
                <motion.div 
                  key={order._id} 
                  whileHover={{ y: -5 }}
                  className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
                >
                  <div className="p-5 border-b border-border bg-secondary/20 flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide
                      ${order.orderStatus === 'DELIVERED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
                    `}>
                      {order.orderStatus}
                    </span>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="mb-6">
                      <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed">
                        {order.items.map(i => `${i.quantity}x ${i.name || 'Pizza'}`).join(', ')}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-black text-primary">Rs.{order.totalAmount}</span>
                      <Button variant="outline" size="sm" className="rounded-lg font-bold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Reorder
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-3xl border border-dashed border-border p-12 text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Utensils className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-2">No past orders yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you haven't ordered anything yet. Let's change that and get some delicious pizza to your door!
              </p>
              <Link to="/menu">
                <Button variant="premium" className="rounded-full shadow-lg h-12 px-8">
                  Explore Menu
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

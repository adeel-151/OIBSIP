import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { socket } from '../../services/socket';
import { toast } from 'sonner';
import { 
  Package, Clock, CheckCircle2, MapPin, Bell, History, ArrowRight, Truck, Utensils, Pizza
} from 'lucide-react';
import SEO from '../../components/SEO';

const ORDER_STATUSES = [
  { id: 'RECEIVED', label: 'Received', icon: Package },
  { id: 'PREPARING', label: 'Preparing', icon: Utensils },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 }
];

const TrackOrder = () => {
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



  return (
    <div className="min-h-screen bg-background py-16 lg:py-24 relative overflow-hidden">
      <SEO title="Track Order | Pizzaro" />
      
      {/* Background decorations */}
      <div className="absolute top-10 right-10 text-primary/10 rotate-45 pointer-events-none">
        <Pizza size={200} fill="currentColor" />
      </div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
        >
          <div>
            <h1 className="text-5xl lg:text-7xl font-['Chewy'] tracking-wide text-foreground mb-2">Track Order</h1>
            <p className="text-muted-foreground font-bold text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Delivery ready to {user?.email}
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link to="/build">
              <button className="bg-primary hover:bg-primary/90 text-foreground font-bold text-lg px-8 py-3 rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                New Order
              </button>
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
              className="mb-20"
            >
              <div className="bg-card rounded-[3rem] border-4 border-foreground shadow-[12px_12px_0px_0px_hsl(var(--foreground))] overflow-hidden">
                
                {/* Header */}
                <div className="p-8 md:p-10 border-b-4 border-foreground bg-primary flex flex-wrap justify-between items-center gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-background border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] flex items-center justify-center">
                      <Clock className="w-8 h-8 text-foreground animate-[spin_3s_linear_infinite]" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-['Chewy'] text-foreground tracking-wide">Order in Progress</h2>
                      <p className="text-lg font-bold text-foreground/80 font-mono">#{activeOrder._id.substring(0, 10)}</p>
                    </div>
                  </div>
                  <div className="text-right bg-background px-6 py-3 rounded-2xl border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                    <p className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Estimated Arrival</p>
                    <p className="text-3xl font-black font-['Chewy'] text-primary tracking-wide">
                      {activeOrder.deliveryMode === 'pickup' ? '15-20' : '25-35'} <span className="text-lg font-bold text-muted-foreground font-sans">mins</span>
                    </p>
                  </div>
                </div>
                
                {/* Progress Tracker */}
                <div className="p-10 md:p-16 bg-background">
                  <div className="relative max-w-4xl mx-auto">
                    {/* Track Line */}
                    <div className="absolute top-10 left-[10%] right-[10%] h-4 bg-card border-4 border-foreground rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        className="absolute top-0 left-0 bottom-0 bg-primary border-r-4 border-foreground"
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
                                scale: isActive ? 1.1 : 1,
                              }}
                              className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-all border-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]
                                ${isActive ? 'bg-primary text-foreground border-foreground shadow-[6px_6px_0px_0px_hsl(var(--foreground))] -translate-y-2' : 
                                  isCompleted ? 'bg-foreground text-background border-foreground' : 'bg-card text-muted-foreground border-foreground/20 shadow-none'}`}
                            >
                              <Icon className={`w-10 h-10 ${isActive ? 'animate-bounce' : ''}`} />
                            </motion.div>
                            <span className={`text-lg md:text-xl text-center transition-colors font-['Chewy'] tracking-wide
                              ${isActive ? 'text-primary' : 
                                isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
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
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-4xl font-['Chewy'] tracking-wide flex items-center gap-4 text-foreground">
                <History className="w-10 h-10 text-primary" /> Past Orders
              </h2>
              <p className="text-muted-foreground font-bold text-lg mt-2">Review and reorder your favorites.</p>
            </div>
            <Link to="/menu" className="hidden sm:flex text-xl font-['Chewy'] tracking-wide text-primary hover:text-foreground items-center transition-colors">
              Browse Menu <ArrowRight className="w-6 h-6 ml-2" />
            </Link>
          </div>
          
          {pastOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastOrders.map((order) => (
                <motion.div 
                  key={order._id} 
                  whileHover={{ y: -5 }}
                  className="bg-card rounded-3xl border-4 border-foreground shadow-[6px_6px_0px_0px_hsl(var(--foreground))] overflow-hidden flex flex-col hover:shadow-none hover:translate-y-1 transition-all duration-300"
                >
                  <div className="p-5 border-b-4 border-foreground bg-primary/20 flex justify-between items-center">
                    <span className="text-sm font-bold text-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-black tracking-widest border-2
                      ${order.orderStatus === 'DELIVERED' ? 'bg-green-500 text-white border-green-700' : 'bg-red-500 text-white border-red-700'}
                    `}>
                      {order.orderStatus}
                    </span>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col justify-between bg-background">
                    <div className="mb-8">
                      <p className="text-lg font-bold text-foreground line-clamp-2 leading-relaxed">
                        {order.items.map(i => `${i.quantity}x ${i.name || 'Pizza'}`).join(', ')}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-['Chewy'] tracking-wide text-primary">Rs.{order.totalAmount}</span>
                      <button className="px-6 py-2 rounded-full font-bold text-lg bg-foreground text-background hover:bg-primary hover:text-foreground shadow-xl hover:scale-105 transition-all">
                        Reorder
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-[3rem] border-4 border-dashed border-foreground/40 p-16 text-center">
              <div className="w-24 h-24 bg-background border-4 border-foreground rounded-full flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                <Utensils className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-3xl font-['Chewy'] text-foreground tracking-wide mb-4">No past orders yet</h3>
              <p className="text-muted-foreground font-bold text-lg mb-10 max-w-md mx-auto">
                Looks like you haven't ordered anything yet. Let's change that and get some delicious pizza to your door!
              </p>
              <Link to="/menu">
                <button className="bg-primary hover:bg-primary/90 text-foreground font-bold text-xl px-10 py-4 rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                  Explore Menu
                </button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TrackOrder;

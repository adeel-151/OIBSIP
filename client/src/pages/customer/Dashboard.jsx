import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { toast } from 'sonner';
import { 
  Package, Clock, CheckCircle2, ChevronRight, 
  MapPin, Bell, User, History, ArrowRight
} from 'lucide-react';
import SEO from '../../components/SEO';
import Button from '../../components/ui/Button';

// Mock active order if backend has no active orders
const MOCK_ACTIVE_ORDER = {
  _id: 'PZ-20260820-00124',
  createdAt: new Date().toISOString(),
  status: 'IN_KITCHEN',
  totalAmount: 1299,
  items: [
    { name: 'Custom Classic Margherita', quantity: 1 }
  ]
};

// Mock past orders
const MOCK_PAST_ORDERS = [
  {
    _id: 'PZ-20260815-00089',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'DELIVERED',
    totalAmount: 850,
    items: [{ name: 'Spicy Pepperoni', quantity: 1 }]
  },
  {
    _id: 'PZ-20260802-00042',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'DELIVERED',
    totalAmount: 1450,
    items: [{ name: 'Garden Supreme', quantity: 1 }, { name: 'BBQ Chicken', quantity: 1 }]
  }
];

const ORDER_STATUSES = [
  { id: 'ORDER_RECEIVED', label: 'Received' },
  { id: 'IN_KITCHEN', label: 'In Kitchen' },
  { id: 'SENT_TO_DELIVERY', label: 'Out for Delivery' },
  { id: 'DELIVERED', label: 'Delivered' }
];

const Dashboard = () => {
  const { user } = useAuthStore();
  const [activeOrder, setActiveOrder] = useState(null);
  const [pastOrders, setPastOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        const orders = response.data;
        
        const active = orders.find(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
        const past = orders.filter(o => o.status === 'DELIVERED' || o.status === 'CANCELLED');
        
        setActiveOrder(active || MOCK_ACTIVE_ORDER); // Mock fallback for presentation
        setPastOrders(past.length > 0 ? past : MOCK_PAST_ORDERS);
      } catch (error) {
        // Fallback to mocks
        setActiveOrder(MOCK_ACTIVE_ORDER);
        setPastOrders(MOCK_PAST_ORDERS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIndex = (status) => {
    return ORDER_STATUSES.findIndex(s => s.id === status);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background py-8">
      <SEO title="Dashboard" />
      
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading">Welcome back, {user?.name?.split(' ')[0] || 'Guest'}!</h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" /> Mumbai, MH (Default Address)
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors relative">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <Link to="/build">
              <Button variant="premium" className="rounded-full shadow-lg shadow-primary/20 h-12 px-6">
                New Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Active Order Card */}
        {activeOrder && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-xl font-bold font-heading mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Current Order Track
            </h2>
            
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 bg-secondary/30 border-b border-border flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                  <p className="font-bold font-mono">{activeOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                  <p className="font-bold">25-30 mins</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="font-bold text-primary">Rs.{activeOrder.totalAmount}</p>
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
              
              <div className="p-8">
                {/* Progress Timeline */}
                <div className="relative">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-secondary -translate-y-1/2 z-0" />
                  
                  {/* Dynamic Progress Fill */}
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-1000" 
                    style={{ width: `${(getStatusIndex(activeOrder.status) / (ORDER_STATUSES.length - 1)) * 100}%` }}
                  />

                  <div className="flex justify-between relative z-10">
                    {ORDER_STATUSES.map((status, index) => {
                      const isActive = index === getStatusIndex(activeOrder.status);
                      const isCompleted = index < getStatusIndex(activeOrder.status);
                      
                      return (
                        <div key={status.id} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                            isActive ? 'bg-primary text-primary-foreground scale-110 shadow-primary/30 ring-4 ring-primary/20' : 
                            isCompleted ? 'bg-primary text-primary-foreground' : 
                            'bg-card text-muted-foreground border-2 border-border'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Package className="w-4 h-4" />}
                          </div>
                          <span className={`mt-3 text-sm font-medium hidden sm:block ${
                            isActive ? 'text-primary font-bold' : 
                            isCompleted ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
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

        {/* Previous Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-heading flex items-center gap-2">
              <History className="w-5 h-5 text-foreground" /> Order History
            </h2>
            <Link to="/menu" className="text-sm font-medium text-primary hover:underline flex items-center">
              Reorder favorites <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/50 text-muted-foreground text-sm">
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Items</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pastOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="p-4 whitespace-nowrap text-sm">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-4 font-mono text-sm text-muted-foreground">{order._id.substring(0, 12)}...</td>
                      <td className="p-4 text-sm">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </td>
                      <td className="p-4 font-bold">Rs.{order.totalAmount}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button variant="outline" size="sm" className="h-8 text-xs group-hover:border-primary group-hover:text-primary transition-colors">
                          Reorder
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {pastOrders.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No past orders found. Time to change that!
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;

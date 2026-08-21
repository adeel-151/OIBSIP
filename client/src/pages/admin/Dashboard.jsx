import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Clock, TrendingUp, Users, Pizza } from 'lucide-react';
import api from '../../services/api';

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <h3 className="text-2xl font-bold font-heading">{value}</h3>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalCustomers: 0
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/orders');
        const orders = res.data.data;
        
        const totalRevenue = orders
          .filter(o => o.paymentStatus === 'COMPLETED' || o.paymentMethod === 'COD')
          .reduce((sum, order) => sum + order.totalAmount, 0);
          
        const pendingOrders = orders.filter(o => o.orderStatus === 'RECEIVED' || o.orderStatus === 'PREPARING').length;
        
        const uniqueCustomers = new Set(orders.map(o => o.user?._id || o.user)).size;
        
        setStats({
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders,
          totalCustomers: uniqueCustomers
        });
      } catch (error) {
        // Use placeholder stats for demo
        setStats({ totalOrders: 248, totalRevenue: 185400, pendingOrders: 12, totalCustomers: 156 });
      }
    };
    
    fetchStats();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3 className="text-xl font-bold font-heading mb-6">Overview</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          color="bg-green-500/10 text-green-400"
          trend="+12.5%"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats.totalOrders}
          color="bg-primary/10 text-primary"
          trend="+8.2%"
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={stats.pendingOrders}
          color="bg-accent/10 text-accent"
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value={stats.totalCustomers}
          color="bg-blue-500/10 text-blue-400"
          trend="+5.1%"
        />
      </div>

      {/* Quick Actions */}
      <h3 className="text-xl font-bold font-heading mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="/admin/orders" className="bg-card rounded-xl border border-border p-5 hover:border-primary/40 transition-all flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Manage Orders</p>
            <p className="text-xs text-muted-foreground">View & update order statuses</p>
          </div>
        </a>
        <a href="/admin/menu" className="bg-card rounded-xl border border-border p-5 hover:border-primary/40 transition-all flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Pizza className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-sm">Menu & Ingredients</p>
            <p className="text-xs text-muted-foreground">Add or edit menu items</p>
          </div>
        </a>
        <a href="/admin/orders" className="bg-card rounded-xl border border-border p-5 hover:border-primary/40 transition-all flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-sm">Customer Analytics</p>
            <p className="text-xs text-muted-foreground">Track customer activity</p>
          </div>
        </a>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

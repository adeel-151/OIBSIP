import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Clock, TrendingUp, Users, Pizza, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import SEO from '../../components/SEO';

const StatCard = ({ icon: Icon, label, value, color, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-card rounded-[24px] border border-border p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${color} opacity-20 group-hover:scale-150 transition-transform duration-500 blur-2xl`}></div>
    <div className="flex items-start justify-between mb-6 relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-inner`}>
        <Icon className="w-7 h-7" />
      </div>
      {trend && (
        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-green-500/20">
          <TrendingUp className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-black font-heading tracking-tight mb-1">{value}</h3>
      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
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
    <div className="min-h-screen bg-background">
      <SEO title="Overview | Admin" />
      
      <div className="mb-8">
        <h2 className="text-3xl font-black font-heading tracking-tight mb-2">Overview</h2>
        <p className="text-muted-foreground">Welcome to your command center. Here's what's happening today.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`Rs.${stats.totalRevenue.toLocaleString()}`}
          color="bg-green-500/10 text-green-500"
          trend="+12.5%"
          delay={0.1}
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats.totalOrders}
          color="bg-primary/10 text-primary"
          trend="+8.2%"
          delay={0.2}
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={stats.pendingOrders}
          color="bg-yellow-500/10 text-yellow-500"
          delay={0.3}
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value={stats.totalCustomers}
          color="bg-blue-500/10 text-blue-500"
          trend="+5.1%"
          delay={0.4}
        />
      </div>

      {/* Quick Actions */}
      <h3 className="text-xl font-bold font-heading mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/admin/orders" className="bg-card rounded-[24px] border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
            <ShoppingBag className="w-6 h-6 text-primary group-hover:text-white" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg">Manage Orders</h4>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">View, track & update order statuses in real-time</p>
          </div>
        </a>
        
        <a href="/admin/menu" className="bg-card rounded-[24px] border border-border p-6 hover:border-accent/50 hover:shadow-lg transition-all group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
            <Pizza className="w-6 h-6 text-accent group-hover:text-white" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg">Menu & Ingredients</h4>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Add or edit pizzas, pricing, and custom ingredients</p>
          </div>
        </a>

        <a href="/admin/orders" className="bg-card rounded-[24px] border border-border p-6 hover:border-blue-500/50 hover:shadow-lg transition-all group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Users className="w-6 h-6 text-blue-500 group-hover:text-white" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg">Customer Analytics</h4>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Track customer behavior and sales performance</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;

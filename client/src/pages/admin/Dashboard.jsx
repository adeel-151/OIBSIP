import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Clock, TrendingUp, Users, Pizza, ChevronRight, Activity } from 'lucide-react';
import api from '../../services/api';
import { socket } from '../../services/socket';
import SEO from '../../components/SEO';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#FFC700', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444']; // Theme matched colors

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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border-2 border-foreground p-3 rounded-xl shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
        <p className="font-bold text-sm mb-1 text-foreground">{label}</p>
        <p className="font-black text-primary font-heading">
          Rs.{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [rawOrders, setRawOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/orders');
        setRawOrders(res.data.data);
      } catch (error) {
        console.error("Failed to load initial orders");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();

    // Setup Socket.io for Real-Time Updates
    socket.connect();
    socket.emit('join_admin_room');

    socket.on('new_order', (newOrder) => {
      setRawOrders(prev => [newOrder, ...prev]);
    });

    socket.on('order_updated', (updatedOrder) => {
      setRawOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    return () => {
      socket.off('new_order');
      socket.off('order_updated');
      // Intentionally not disconnecting entirely as Orders.jsx might need it,
      // but disconnecting here is safe if we strictly manage per-component.
    };
  }, []);

  const { stats, chartData, statusData } = useMemo(() => {
    // Core Stats
    const totalRevenue = rawOrders
      .filter(o => o.paymentStatus === 'COMPLETED' || o.paymentMethod === 'COD')
      .reduce((sum, order) => sum + order.totalAmount, 0);
      
    const pendingOrders = rawOrders.filter(o => o.orderStatus === 'RECEIVED' || o.orderStatus === 'PREPARING').length;
    const uniqueCustomers = new Set(rawOrders.map(o => o.user?._id || o.user)).size;

    // Revenue Trend (Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: 0,
        fullDate: d.toISOString().split('T')[0]
      };
    }).reverse();

    // Order Status Distribution
    const statusCounts = { RECEIVED: 0, PREPARING: 0, OUT_FOR_DELIVERY: 0, DELIVERED: 0, CANCELLED: 0 };

    rawOrders.forEach(o => {
      if (statusCounts[o.orderStatus] !== undefined) {
        statusCounts[o.orderStatus]++;
      }
      
      // We only count successful/pending cash orders as revenue generated for the timeline
      if (o.paymentStatus === 'COMPLETED' || o.paymentMethod === 'COD') {
        const orderDateStr = new Date(o.createdAt).toISOString().split('T')[0];
        const day = last7Days.find(d => d.fullDate === orderDateStr);
        if (day) {
          day.revenue += o.totalAmount;
        }
      }
    });

    const statusDataFormatted = Object.keys(statusCounts)
      .filter(k => statusCounts[k] > 0)
      .map(k => ({ name: k.replace(/_/g, ' '), value: statusCounts[k] }));

    return {
      stats: { totalOrders: rawOrders.length, totalRevenue, pendingOrders, totalCustomers: uniqueCustomers },
      chartData: last7Days,
      statusData: statusDataFormatted
    };
  }, [rawOrders]);

  return (
    <div className="min-h-screen bg-background pb-10">
      <SEO title="Overview | Admin" />
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black font-heading tracking-tight mb-2">Live Dashboard</h2>
          <p className="text-muted-foreground flex items-center gap-2 font-medium">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Real-time synchronization active
          </p>
        </div>
      </div>
      
      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`Rs.${stats.totalRevenue.toLocaleString()}`}
          color="bg-green-500/10 text-green-500"
          trend={isLoading ? "" : "+12.5%"}
          delay={0.1}
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats.totalOrders}
          color="bg-primary/10 text-primary"
          trend={isLoading ? "" : "+8.2%"}
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
          trend={isLoading ? "" : "+5.1%"}
          delay={0.4}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Revenue Area Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-card rounded-[24px] border border-border p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold font-heading">Revenue Trend</h3>
              <p className="text-sm text-muted-foreground">Last 7 days performance</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Order Status Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-[24px] border border-border p-6 shadow-sm flex flex-col"
        >
          <div className="mb-2">
            <h3 className="text-xl font-bold font-heading">Order Status</h3>
            <p className="text-sm text-muted-foreground">Current distribution</p>
          </div>
          <div className="flex-grow flex items-center justify-center min-h-[250px]">
            {stats.totalOrders > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: '2px solid hsl(var(--foreground))', fontWeight: 'bold' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No order data available.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <h3 className="text-2xl font-bold font-heading mb-6">Quick Tools</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/admin/orders" className="bg-card rounded-[24px] border border-border p-6 hover:border-primary hover:shadow-[4px_4px_0px_0px_hsl(var(--primary))] transition-all group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-foreground transition-colors border-2 border-transparent group-hover:border-foreground">
            <ShoppingBag className="w-6 h-6 text-primary group-hover:text-foreground" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg font-heading tracking-wide">Manage Orders</h4>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">View, track & update live orders.</p>
          </div>
        </a>
        
        <a href="/admin/menu" className="bg-card rounded-[24px] border border-border p-6 hover:border-blue-500 hover:shadow-[4px_4px_0px_0px_#3b82f6] transition-all group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors border-2 border-transparent group-hover:border-foreground">
            <Pizza className="w-6 h-6 text-blue-500 group-hover:text-white" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg font-heading tracking-wide">Menu Config</h4>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Add pizzas & custom ingredients.</p>
          </div>
        </a>

        <a href="/admin/inventory" className="bg-card rounded-[24px] border border-border p-6 hover:border-purple-500 hover:shadow-[4px_4px_0px_0px_#8b5cf6] transition-all group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors border-2 border-transparent group-hover:border-foreground">
            <Users className="w-6 h-6 text-purple-500 group-hover:text-white" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg font-heading tracking-wide">Stock Inventory</h4>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Track ingredient stock automatically.</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;

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
import { Link } from 'react-router-dom';

const COLORS = ['#FFC700', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444']; 

const StatCard = ({ icon: Icon, label, value, color, bgClass, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`${bgClass} rounded-[2rem] border-4 border-foreground p-6 shadow-[6px_6px_0px_0px_hsl(var(--foreground))] hover:-translate-y-2 transition-transform relative overflow-hidden group`}
  >
    <div className="flex items-start justify-between mb-4 relative z-10">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-background border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]`}>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
      {trend && (
        <span className="text-sm font-black bg-background border-4 border-foreground px-3 py-1.5 rounded-full flex items-center gap-1 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
          <TrendingUp className="w-4 h-4 text-green-500" /> {trend}
        </span>
      )}
    </div>
    <div className="relative z-10 mt-6">
      <h3 className="text-4xl md:text-5xl font-['Chewy'] tracking-wide text-foreground mb-1">{value}</h3>
      <p className="text-sm font-black text-foreground/80 uppercase tracking-widest">{label}</p>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border-4 border-foreground p-4 rounded-2xl shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
        <p className="font-black text-muted-foreground mb-1 uppercase tracking-wider text-sm">{label}</p>
        <p className="text-2xl font-['Chewy'] tracking-wide text-primary">
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
    <div className="pb-10 max-w-7xl mx-auto">
      <SEO title="Overview | Admin" />
      
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-5xl font-['Chewy'] tracking-wide text-foreground mb-3">Live Dashboard</h2>
          <div className="inline-flex items-center gap-3 bg-card border-4 border-foreground px-4 py-2 rounded-full shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-foreground"></span>
            </span>
            <span className="font-black text-sm uppercase tracking-wider text-muted-foreground">Real-time sync active</span>
          </div>
        </div>
      </div>
      
      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`Rs.${stats.totalRevenue.toLocaleString()}`}
          color="text-green-500"
          bgClass="bg-[#86efac]"
          trend={isLoading ? "" : "+12.5%"}
          delay={0.1}
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats.totalOrders}
          color="text-primary"
          bgClass="bg-[#fca5a5]"
          trend={isLoading ? "" : "+8.2%"}
          delay={0.2}
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={stats.pendingOrders}
          color="text-yellow-600"
          bgClass="bg-[#fef08a]"
          delay={0.3}
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value={stats.totalCustomers}
          color="text-blue-500"
          bgClass="bg-[#bfdbfe]"
          trend={isLoading ? "" : "+5.1%"}
          delay={0.4}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Revenue Area Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-card rounded-[2.5rem] border-4 border-foreground p-6 md:p-8 shadow-[8px_8px_0px_0px_hsl(var(--foreground))]"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-['Chewy'] tracking-wide text-foreground">Revenue Trend</h3>
              <p className="text-lg font-bold text-muted-foreground mt-1">Last 7 days performance</p>
            </div>
            <div className="w-14 h-14 bg-primary rounded-full border-4 border-foreground flex items-center justify-center shadow-[4px_4px_0px_0px_hsl(var(--foreground))] text-white">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div className="overflow-x-auto pb-4">
            <div className="h-[300px] min-w-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--foreground))" strokeOpacity={0.2} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 14, fontWeight: 'bold' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 14, fontWeight: 'bold' }} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--foreground))" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    activeDot={{ r: 8, stroke: "hsl(var(--foreground))", strokeWidth: 4, fill: "hsl(var(--primary))" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Order Status Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-[2.5rem] border-4 border-foreground p-6 md:p-8 shadow-[8px_8px_0px_0px_hsl(var(--foreground))] flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-3xl font-['Chewy'] tracking-wide text-foreground">Order Status</h3>
            <p className="text-lg font-bold text-muted-foreground mt-1">Current distribution</p>
          </div>
          <div className="flex-grow flex items-center justify-center min-h-[250px]">
            {stats.totalOrders > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={4}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: '4px solid hsl(var(--foreground))', fontWeight: 'bold', padding: '12px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '14px', fontWeight: '900' }}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center bg-background border-4 border-dashed border-foreground/40 rounded-[2rem] p-8 w-full">
                <Pizza className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-bold text-lg">No orders yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-4xl font-['Chewy'] tracking-wide text-foreground">Quick Tools</h3>
        <div className="h-1 flex-1 bg-foreground/10 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/orders" className="bg-[#fca5a5] rounded-[2rem] border-4 border-foreground p-8 shadow-[6px_6px_0px_0px_hsl(var(--foreground))] hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_hsl(var(--foreground))] transition-all group flex flex-col justify-between min-h-[200px]">
          <div className="w-16 h-16 rounded-2xl bg-background border-4 border-foreground flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
            <ShoppingBag className="w-8 h-8 text-foreground" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-black text-2xl uppercase tracking-wider text-foreground">Orders</h4>
              <ChevronRight className="w-8 h-8 text-foreground group-hover:translate-x-2 transition-transform" />
            </div>
            <p className="font-bold text-foreground/80">View, track & update live orders.</p>
          </div>
        </Link>
        
        <Link to="/admin/menu" className="bg-[#fef08a] rounded-[2rem] border-4 border-foreground p-8 shadow-[6px_6px_0px_0px_hsl(var(--foreground))] hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_hsl(var(--foreground))] transition-all group flex flex-col justify-between min-h-[200px]">
          <div className="w-16 h-16 rounded-2xl bg-background border-4 border-foreground flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
            <Pizza className="w-8 h-8 text-foreground" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-black text-2xl uppercase tracking-wider text-foreground">Menu</h4>
              <ChevronRight className="w-8 h-8 text-foreground group-hover:translate-x-2 transition-transform" />
            </div>
            <p className="font-bold text-foreground/80">Add pizzas & custom ingredients.</p>
          </div>
        </Link>

        <Link to="/admin/inventory" className="bg-[#bfdbfe] rounded-[2rem] border-4 border-foreground p-8 shadow-[6px_6px_0px_0px_hsl(var(--foreground))] hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_hsl(var(--foreground))] transition-all group flex flex-col justify-between min-h-[200px]">
          <div className="w-16 h-16 rounded-2xl bg-background border-4 border-foreground flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
            <Users className="w-8 h-8 text-foreground" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-black text-2xl uppercase tracking-wider text-foreground">Inventory</h4>
              <ChevronRight className="w-8 h-8 text-foreground group-hover:translate-x-2 transition-transform" />
            </div>
            <p className="font-bold text-foreground/80">Track ingredient stock automatically.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

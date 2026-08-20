import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import styles from './Admin.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
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
        
        setStats({
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders
        });
      } catch (error) {
        console.error('Failed to load dashboard stats');
      }
    };
    
    fetchStats();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Overview</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'var(--color-text-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Total Revenue</p>
          <h2 style={{ color: 'var(--color-accent)', margin: 0 }}>₹{stats.totalRevenue.toLocaleString()}</h2>
        </div>
        
        <div style={{ background: 'var(--color-text-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Total Orders</p>
          <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>{stats.totalOrders}</h2>
        </div>
        
        <div style={{ background: 'var(--color-text-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Pending Orders</p>
          <h2 style={{ color: 'var(--color-premium)', margin: 0 }}>{stats.pendingOrders}</h2>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './Admin.module.css';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
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
      await api.patch(`/admin/orders/${id}/status`, { orderStatus: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Recent Orders</h3>
      
      <table className={styles.adminTable}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id.substring(0, 8)}...</td>
              <td>{order.user?.name || 'Unknown'}</td>
              <td>{order.items.length} items</td>
              <td>Rs.{order.totalAmount}</td>
              <td>
                <div className="text-xs font-semibold mb-1 text-muted-foreground">{order.paymentMethod}</div>
                <span className={`${styles.statusBadge} ${
                  order.paymentStatus === 'COMPLETED' ? styles['status-completed'] : 
                  order.paymentStatus === 'FAILED' ? styles['status-failed'] : 
                  styles['status-pending']
                }`}>
                  {order.paymentStatus}
                </span>
              </td>
              <td>
                <select 
                  value={order.orderStatus} 
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="px-2 py-1 text-sm bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="RECEIVED">Received</option>
                  <option value="PREPARING">Preparing</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </td>
              <td>
                <button 
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default AdminOrders;

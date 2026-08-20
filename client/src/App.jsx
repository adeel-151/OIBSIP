import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Menu from './pages/customer/Menu';
import PizzaBuilder from './pages/customer/PizzaBuilder';
import Cart from './pages/customer/Cart';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import './App.css';

// Placeholder Home component
const Home = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
    <h1>Pizzaro - Crafted Your Way</h1>
    <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>The premium pizza platform.</p>
    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
      <a href="/login" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-accent)', color: 'white', borderRadius: 'var(--radius-md)' }}>Login</a>
      <a href="/register" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-neutral)', color: 'var(--color-text-main)', borderRadius: 'var(--radius-md)', border: '1px solid #ccc' }}>Register</a>
      <a href="/menu" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-premium)', color: 'var(--color-text-main)', borderRadius: 'var(--radius-md)' }}>Menu</a>
      <a href="/build" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)' }}>Build Pizza</a>
      <a href="/cart" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-secondary)', color: 'var(--color-text-main)', borderRadius: 'var(--radius-md)' }}>Cart</a>
      <a href="/admin/dashboard" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-text-main)', color: 'var(--color-text-light)', borderRadius: 'var(--radius-md)' }}>Admin</a>
    </div>
  </div>
);

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/build" element={<PizzaBuilder />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menu" element={<div>Menu Inventory (Coming Soon)</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

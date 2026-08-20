import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import SEO from './components/SEO';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Menu from './pages/customer/Menu';
import PizzaBuilder from './pages/customer/PizzaBuilder';
import Cart from './pages/customer/Cart';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import './App.css';

import { Link } from 'react-router-dom';

// Placeholder Home component
const Home = () => (
  <div className="flex justify-center items-center h-screen flex-col bg-background text-foreground">
    <SEO title="Home" />
    <h1 className="text-4xl font-bold mb-4">Pizzaro - Crafted Your Way</h1>
    <p className="mb-8 text-muted-foreground">The premium pizza platform.</p>
    <div className="flex flex-wrap gap-4 justify-center">
      <Link to="/login" className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Login</Link>
      <Link to="/register" className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">Register</Link>
      <Link to="/menu" className="px-6 py-3 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors">Menu</Link>
      <Link to="/build" className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Build Pizza</Link>
      <Link to="/cart" className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">Cart</Link>
      <Link to="/admin/dashboard" className="px-6 py-3 border border-border text-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">Admin</Link>
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

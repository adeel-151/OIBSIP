import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/customer/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Menu from './pages/customer/Menu';
import PizzaBuilder from './pages/customer/PizzaBuilder';
import Cart from './pages/customer/Cart';
import Dashboard from './pages/customer/Dashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import './App.css';

// A wrapper for customer pages to include Navbar and Footer
const CustomerLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/menu" element={<CustomerLayout><Menu /></CustomerLayout>} />
        <Route path="/build" element={<CustomerLayout><PizzaBuilder /></CustomerLayout>} />
        <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
        <Route path="/dashboard" element={<CustomerLayout><Dashboard /></CustomerLayout>} />
        
        {/* Auth Routes (No Navbar/Footer usually, or can add them if preferred) */}
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

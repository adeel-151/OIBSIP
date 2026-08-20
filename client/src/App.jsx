import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Menu from './pages/customer/Menu';
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;

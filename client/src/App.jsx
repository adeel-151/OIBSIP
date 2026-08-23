import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import PageLoader from './components/PageLoader';
import { ThemeProvider } from './contexts/ThemeContext';


// Lazy-loaded pages for code splitting
const Home = lazy(() => import('./pages/customer/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Menu = lazy(() => import('./pages/customer/Menu'));
const PizzaBuilder = lazy(() => import('./pages/customer/PizzaBuilder'));
const Cart = lazy(() => import('./pages/customer/Cart'));
const About = lazy(() => import('./pages/customer/About'));
const TrackOrder = lazy(() => import('./pages/customer/TrackOrder'));
const Profile = lazy(() => import('./pages/customer/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminMenu = lazy(() => import('./pages/admin/MenuManagement'));
const AdminInventory = lazy(() => import('./pages/admin/Inventory'));

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
    <ThemeProvider>
      <ErrorBoundary>
        <Toaster position="top-center" />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Customer Routes */}
            <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
            <Route path="/menu" element={<CustomerLayout><Menu /></CustomerLayout>} />
            <Route path="/build" element={<CustomerLayout><PizzaBuilder /></CustomerLayout>} />
            <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
            
            {/* Protected Customer Routes */}
            <Route path="/cart" element={
              <CustomerLayout>
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              </CustomerLayout>
            } />
            <Route path="/track-order" element={
              <CustomerLayout>
                <ProtectedRoute>
                  <TrackOrder />
                </ProtectedRoute>
              </CustomerLayout>
            } />
            <Route path="/profile" element={
              <CustomerLayout>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </CustomerLayout>
            } />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes (Role-protected) */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="inventory" element={<AdminInventory />} />
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;

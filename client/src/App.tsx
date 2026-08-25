import React, { Suspense, useState, lazy } from 'react';
import { Routes, Route, useLocation, useOutlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import PageLoader from './components/PageLoader';
import { ThemeProvider } from './contexts/ThemeContext';

// Standard lazy loading (no artificial delay on page transitions)
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
const AdminHistory = lazy(() => import('./pages/admin/OrderHistory'));
const AdminMenu = lazy(() => import('./pages/admin/MenuManagement'));
const AdminInventory = lazy(() => import('./pages/admin/Inventory'));

// Smooth animated outlet for page transitions
const AnimatedOutlet = () => {
  const location = useLocation();
  const element = useOutlet();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full h-full"
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
};

// A wrapper for customer pages to include Navbar and Footer
const CustomerLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow relative">
      <AnimatedOutlet />
    </main>
    <Footer />
  </div>
);

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Toaster position="top-center" />
        
        {/* The 0-100% Initial App Loader */}
        <AnimatePresence>
          {isInitialLoading && (
            <PageLoader key="initial-loader" onComplete={() => setIsInitialLoading(false)} />
          )}
        </AnimatePresence>

        {/* The rest of the app renders in the background to ensure it is ready when loader finishes */}
        <Suspense fallback={null}>
          <Routes>
            {/* Public Customer Routes (Wrapped in Layout + Animation) */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/build" element={<PizzaBuilder />} />
              <Route path="/about" element={<About />} />
              
              {/* Protected Customer Routes */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/track-order" element={
                <ProtectedRoute>
                  <TrackOrder />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Route>

            {/* Auth & Other Routes (Only Animation, No Navbar/Footer) */}
            <Route element={<AnimatedOutlet />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Admin Routes (Role-protected, Layout handles its own content/animations if needed) */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="history" element={<AdminHistory />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="inventory" element={<AdminInventory />} />
            </Route>

          </Routes>
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;

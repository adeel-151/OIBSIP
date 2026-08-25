import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { LayoutDashboard, ShoppingBag, Pizza, LogOut, Package, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user || user.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-8">
        <div className="w-24 h-24 bg-card border-4 border-foreground rounded-full flex items-center justify-center mb-6 shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
           <Pizza className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-5xl font-['Chewy'] text-foreground tracking-wide mb-4">Unauthorized Access</h2>
        <p className="text-muted-foreground font-bold text-xl mb-10 max-w-md">Oops! Looks like you stumbled into the kitchen without a chef's hat. You must be an admin to view this page.</p>
        <Link to="/">
          <button className="bg-primary hover:bg-primary/90 text-foreground font-black text-xl px-10 py-4 rounded-full shadow-[6px_6px_0px_0px_hsl(var(--foreground))] border-4 border-foreground hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-all">
            Go Back Home
          </button>
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/admin/menu', icon: Pizza, label: 'Menu' },
    { to: '/admin/inventory', icon: Package, label: 'Inventory' }
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b-4 border-foreground bg-primary flex items-center justify-between">
        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 group">
          <div className="bg-background rounded-full p-2 border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] group-hover:-translate-y-1 transition-transform">
             <Pizza className="w-6 h-6 text-foreground" />
          </div>
          <h2 className="font-['Chewy'] text-3xl tracking-wide text-foreground pt-1">Admin</h2>
        </Link>
        <button 
          className="md:hidden p-2 bg-background border-2 border-foreground rounded-full"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="flex-1 p-5 flex flex-col gap-3 overflow-y-auto">
        {navItems.map((item) => (
          <Link 
            key={item.to}
            to={item.to} 
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-lg transition-all border-4 ${
              location.pathname === item.to 
                ? 'bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_hsl(var(--primary))] -translate-y-1' 
                : 'bg-background text-muted-foreground border-transparent hover:border-foreground/20 hover:bg-secondary/50'
            }`}
          >
            <item.icon size={22} className={location.pathname === item.to ? "text-primary" : ""} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-5 border-t-4 border-foreground bg-secondary/30">
        <button 
          onClick={handleLogout} 
          className="flex items-center justify-center gap-3 w-full px-5 py-4 rounded-2xl font-black text-lg text-foreground bg-background hover:bg-destructive hover:text-white border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-y-1 hover:shadow-none transition-all"
        >
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <SEO title="Admin | Pizzaro" />
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r-4 border-foreground flex-col fixed inset-y-0 left-0 z-40 shadow-[4px_0_0_0_hsl(var(--foreground))]">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-foreground/80 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-card border-r-4 border-foreground flex flex-col z-50 shadow-[4px_0_0_0_hsl(var(--foreground))]"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col bg-secondary/10 min-h-screen">
        {/* Top Header */}
        <header className="h-20 sm:h-24 bg-card border-b-4 border-foreground flex justify-between items-center px-4 sm:px-10 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 bg-background border-2 border-foreground rounded-full hover:bg-primary transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-['Chewy'] text-3xl sm:text-4xl tracking-wide text-foreground">Control Panel</h2>
          </div>
          
          <div className="flex items-center gap-4 bg-background border-4 border-foreground px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center border-4 border-foreground">
              <span className="font-black text-sm sm:text-lg text-foreground">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <span className="font-black text-foreground hidden sm:block">Hey, {user.name}</span>
          </div>
        </header>
        
        <div className="p-4 sm:p-10 flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

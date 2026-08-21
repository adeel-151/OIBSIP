import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, LogOut, Pizza, Menu as MenuIcon, X, ChevronRight, Trash2, Settings, UserPlus, Info, Phone } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

const navLinks = [
  { label: 'Menu', path: '/menu' },
  { label: 'Build Pizza', path: '/build' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'About', path: '/about' },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items, removeFromCart, updateQuantity, getTotalAmount } = useCartStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const miniCartRef = useRef(null);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setShowMiniCart(false);
  }, [location.pathname]);

  // Close mini cart on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (miniCartRef.current && !miniCartRef.current.contains(e.target)) {
        setShowMiniCart(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className={`fixed z-50 w-full transition-all duration-500 ease-in-out ${
        scrolled
          ? 'top-4'
          : 'top-0'
      }`}>
        <div className={`mx-auto transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'w-[95%] max-w-7xl glass rounded-full shadow-2xl shadow-background/50 border border-border/50 px-6 py-2.5' 
            : 'w-full px-4 md:px-8 py-4 bg-gradient-to-b from-background/90 to-transparent border-b border-transparent'
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <Pizza className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold font-heading tracking-tight">PIZZARO</span>
            </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2.5 text-[15px] font-bold font-heading rounded-full transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-foreground hover:bg-secondary/80'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 border-2 border-primary/20 rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart with Mini Preview */}
            <div className="relative" ref={miniCartRef}>
              <button
                onClick={() => setShowMiniCart(!showMiniCart)}
                className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                  isActive('/cart')
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-foreground hover:bg-secondary/80'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background"
                  >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </motion.span>
                )}
              </button>

              {/* Mini Cart Dropdown */}
              <AnimatePresence>
                {showMiniCart && items.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-3 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border bg-secondary/30">
                      <h3 className="font-bold text-sm">Cart ({cartItemCount} items)</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-border/50">
                      {items.slice(0, 4).map(item => (
                        <div key={item.cartItemId} className="p-3 flex items-center gap-3">
                          <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=100'} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.quantity}x Rs.{item.price}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {items.length > 4 && (
                        <p className="p-3 text-center text-xs text-muted-foreground">
                          +{items.length - 4} more item(s)
                        </p>
                      )}
                    </div>
                    <div className="p-4 border-t border-border">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                        <span className="font-bold text-primary">Rs.{getTotalAmount()}</span>
                      </div>
                      <Link
                        to="/cart"
                        onClick={() => setShowMiniCart(false)}
                        className="block w-full text-center py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                      >
                        View Cart & Checkout
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2 pl-2 border-l border-border/50">
                <Link
                  to={user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/dashboard'}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold font-heading text-foreground/80 hover:text-foreground hover:bg-secondary/80 rounded-full transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary border border-primary/20">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name?.split(' ')[0] || 'Account'}</span>
                </Link>
                <Link
                  to="/profile"
                  className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
                  title="Settings"
                >
                  <Settings className="h-5 w-5" />
                </Link>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-border/50">
                <Link
                  to="/login"
                  className="flex items-center text-sm font-bold font-heading text-foreground/80 hover:text-foreground px-5 py-2.5 rounded-full border border-border/50 hover:bg-secondary/80 hover:border-border transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 text-sm font-bold font-heading bg-gradient-to-r from-primary to-rose-600 text-white hover:shadow-lg hover:shadow-primary/25 px-6 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95"
                >
                  <UserPlus className="w-4 h-4" /> Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2.5 rounded-xl text-foreground/70 hover:bg-secondary/80 transition-all"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-[80vw] max-w-sm bg-card border-l border-border shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Pizza className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold font-heading">PIZZARO</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="space-y-1">
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold font-heading transition-all ${
                        isActive(link.path)
                          ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary border-l-4 border-primary'
                          : 'text-foreground/80 hover:bg-secondary/80 border-l-4 border-transparent'
                      }`}
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <Link
                      to="/profile"
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-all ${
                        isActive('/profile')
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/80 hover:bg-secondary/80'
                      }`}
                    >
                      Profile & Settings
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-border space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-secondary/60 rounded-xl mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{user?.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center justify-center px-4 py-3.5 rounded-2xl text-sm font-bold font-heading border-2 border-border hover:bg-secondary/80 transition-all"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-bold font-heading bg-gradient-to-r from-primary to-rose-600 text-white hover:shadow-lg transition-all"
                    >
                      <UserPlus className="w-4 h-4" /> Sign Up Free
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

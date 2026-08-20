import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, LogOut, Pizza, Menu as MenuIcon, X, ChevronRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

const navLinks = [
  { label: 'Menu', path: '/menu' },
  { label: 'Build Pizza', path: '/build' },
  { label: 'Dashboard', path: '/dashboard' },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
  }, [location.pathname]);

  return (
    <>
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-lg shadow-background/20'
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="container mx-auto px-4 h-18 flex items-center justify-between py-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center group-hover:glow-primary transition-shadow">
              <Pizza className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-heading tracking-tight">PIZZARO</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-foreground hover:bg-secondary/80'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/cart"
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
            </Link>

            {/* Desktop Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to={user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/dashboard'}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary/80 rounded-xl transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0] || 'Account'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-foreground/70 hover:text-foreground px-4 py-2.5 rounded-xl hover:bg-secondary/80 transition-all"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/20"
                >
                  Sign up
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
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-all ${
                        isActive(link.path)
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/80 hover:bg-secondary/80'
                      }`}
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
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
                      className="block text-center px-4 py-3 rounded-xl text-sm font-medium border border-border hover:bg-secondary/80 transition-all"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="block text-center px-4 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      Sign up free
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

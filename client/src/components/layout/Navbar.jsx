import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, LogOut, Pizza, Menu as MenuIcon, X, ChevronRight, ChevronDown, Trash2, Settings, UserPlus, Info, Phone, Sun, Moon } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items, removeFromCart, updateQuantity, getTotalAmount } = useCartStore();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const miniCartRef = useRef(null);
  const profileMenuRef = useRef(null);

  const navLinks = [
    { label: 'Menu', path: '/menu' },
    { label: 'Build Pizza', path: '/build' },
    { label: 'Dashboard', path: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/dashboard' },
    { label: 'About', path: '/about' },
  ];

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
    setShowProfileMenu(false);
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (miniCartRef.current && !miniCartRef.current.contains(e.target)) {
        setShowMiniCart(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className={`fixed z-50 w-full transition-all duration-300 ease-in-out ${
        scrolled
          ? 'top-0 bg-[#1C1A1A] shadow-xl shadow-black/20 py-3'
          : 'top-0 bg-[#1C1A1A] py-5'
      }`}>
        <div className="mx-auto w-full px-6 md:px-12 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-[#FFC700] rounded-full flex items-center justify-center shadow-lg group-hover:-rotate-12 transition-transform duration-300 border-4 border-[#1C1A1A] ring-2 ring-[#FFC700]">
                <Pizza className="h-6 w-6 text-[#1C1A1A]" />
              </div>
              <span className="text-4xl font-['Chewy'] text-white tracking-wide mt-1 group-hover:text-[#FFC700] transition-colors">PIZZARO</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-xl font-['Chewy'] tracking-wider transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-[#FFC700]'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-[#FFC700] rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              
              {/* Theme Toggle (Keeping it for functionality, but matching style) */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-300 hover:text-[#FFC700] hover:bg-white/10 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>

              {/* Cart with Mini Preview */}
              <div className="relative" ref={miniCartRef}>
                <button
                  onClick={() => {
                    setShowMiniCart(!showMiniCart);
                    setShowProfileMenu(false);
                  }}
                  className={`relative p-3 rounded-full transition-colors ${
                    isActive('/cart') || showMiniCart
                      ? 'bg-[#FFC700] text-[#1C1A1A]'
                      : 'bg-white/10 text-white hover:bg-[#FFC700] hover:text-[#1C1A1A]'
                  }`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white border-2 border-[#1C1A1A]"
                    >
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </motion.span>
                  )}
                </button>

                {/* Mini Cart Dropdown - Solid Style */}
                <AnimatePresence>
                  {showMiniCart && items.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-4 w-80 bg-[#FFF6EA] border-4 border-[#1C1A1A] rounded-2xl shadow-[8px_8px_0px_0px_rgba(28,26,26,1)] z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b-4 border-[#1C1A1A] bg-[#FFC700]">
                        <h3 className="font-['Chewy'] text-2xl text-[#1C1A1A] tracking-wide">Your Cart ({cartItemCount})</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y-2 divide-[#1C1A1A]/10 bg-white">
                        {items.slice(0, 4).map(item => (
                          <div key={item.cartItemId} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border-2 border-[#1C1A1A]">
                              <img src={item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=100'} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-bold text-[#1C1A1A] truncate font-['Chewy'] tracking-wide">{item.name}</p>
                              <p className="text-sm font-semibold text-gray-600">{item.quantity}x <span className="text-[#e53935]">Rs.{item.price}</span></p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        {items.length > 4 && (
                          <p className="p-3 text-center text-sm font-bold text-gray-500 bg-gray-50">
                            +{items.length - 4} more item(s)
                          </p>
                        )}
                      </div>
                      <div className="p-4 border-t-4 border-[#1C1A1A] bg-[#FFF6EA]">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-bold text-gray-600 font-['Chewy']">Subtotal</span>
                          <span className="font-bold text-2xl text-[#e53935] font-['Chewy']">Rs.{getTotalAmount()}</span>
                        </div>
                        <Link
                          to="/cart"
                          onClick={() => setShowMiniCart(false)}
                          className="block w-full text-center py-3 bg-[#1C1A1A] text-white rounded-xl text-lg font-['Chewy'] tracking-wide hover:bg-[#FFC700] hover:text-[#1C1A1A] transition-colors border-2 border-[#1C1A1A]"
                        >
                          Checkout Now!
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop Auth */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2 relative" ref={profileMenuRef}>
                  <button
                    onClick={() => {
                      setShowProfileMenu(!showProfileMenu);
                      setShowMiniCart(false);
                    }}
                    className="flex items-center gap-2 pl-4 py-2 border-l-2 border-white/20 text-white hover:text-[#FFC700] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FFC700] flex items-center justify-center text-[#1C1A1A] border-2 border-[#1C1A1A] font-bold text-lg">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-['Chewy'] text-xl tracking-wide hidden lg:block">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-4 w-64 bg-white border-4 border-[#1C1A1A] rounded-2xl shadow-[8px_8px_0px_0px_rgba(28,26,26,1)] z-50 overflow-hidden"
                      >
                        <div className="px-5 py-4 border-b-4 border-[#1C1A1A] bg-[#FFF6EA]">
                          <p className="font-bold text-lg text-[#1C1A1A] truncate font-['Chewy'] tracking-wide">{user?.name}</p>
                          <p className="text-sm font-semibold text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="p-2 space-y-1">
                          <Link
                            to={user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/dashboard'}
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-base font-bold text-gray-700 hover:bg-[#FFC700] hover:text-[#1C1A1A] rounded-xl transition-colors"
                          >
                            <User className="w-5 h-5" /> My Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-base font-bold text-gray-700 hover:bg-[#FFC700] hover:text-[#1C1A1A] rounded-xl transition-colors"
                          >
                            <Settings className="w-5 h-5" /> Settings
                          </Link>
                        </div>
                        <div className="p-2 border-t-4 border-[#1C1A1A]">
                          <button
                            onClick={() => {
                              logout();
                              setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-base font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors border-2 border-transparent hover:border-[#1C1A1A]"
                          >
                            <LogOut className="w-5 h-5" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-4 pl-4 border-l-2 border-white/20">
                  <Link
                    to="/login"
                    className="text-xl font-['Chewy'] text-white hover:text-[#FFC700] transition-colors tracking-wide"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-xl font-['Chewy'] bg-[#FFC700] text-[#1C1A1A] px-6 py-2.5 rounded-full hover:bg-white hover:-translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.4)] tracking-wide"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 text-white hover:text-[#FFC700] transition-colors"
              >
                <MenuIcon className="h-8 w-8" />
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
              className="fixed inset-0 z-[60] bg-[#1C1A1A]/80 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-sm bg-[#FFF6EA] border-l-8 border-[#1C1A1A] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b-4 border-[#1C1A1A] bg-[#FFC700]">
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1C1A1A] rounded-full flex items-center justify-center">
                    <Pizza className="h-5 w-5 text-[#FFC700]" />
                  </div>
                  <span className="text-3xl font-['Chewy'] mt-1 text-[#1C1A1A] tracking-wide">PIZZARO</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 bg-[#1C1A1A] text-white rounded-full hover:bg-red-500 transition-colors border-2 border-transparent hover:border-[#1C1A1A]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4 bg-[#FFF6EA]">
                <div className="space-y-3">
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl text-2xl font-['Chewy'] transition-all border-4 ${
                        isActive(link.path)
                          ? 'bg-[#FFC700] text-[#1C1A1A] border-[#1C1A1A] shadow-[4px_4px_0px_0px_rgba(28,26,26,1)]'
                          : 'bg-white text-gray-700 border-transparent hover:border-[#1C1A1A] hover:shadow-[4px_4px_0px_0px_rgba(28,26,26,1)]'
                      }`}
                    >
                      {link.label}
                      <ChevronRight className="w-6 h-6" />
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <Link
                      to="/profile"
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl text-2xl font-['Chewy'] transition-all border-4 ${
                        isActive('/profile')
                          ? 'bg-[#FFC700] text-[#1C1A1A] border-[#1C1A1A] shadow-[4px_4px_0px_0px_rgba(28,26,26,1)]'
                          : 'bg-white text-gray-700 border-transparent hover:border-[#1C1A1A] hover:shadow-[4px_4px_0px_0px_rgba(28,26,26,1)]'
                      }`}
                    >
                      Settings
                      <Settings className="w-6 h-6" />
                    </Link>
                  )}
                </div>
              </div>

              <div className="p-6 border-t-4 border-[#1C1A1A] bg-white">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-4 px-5 py-4 bg-[#FFF6EA] border-2 border-gray-200 rounded-2xl mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#FFC700] flex items-center justify-center text-[#1C1A1A] border-2 border-[#1C1A1A] font-bold text-xl">
                         {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-['Chewy'] text-xl text-[#1C1A1A] tracking-wide">{user?.name || 'User'}</p>
                        <p className="text-sm font-semibold text-gray-500">{user?.email || ''}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-xl font-['Chewy'] text-white bg-red-500 border-4 border-[#1C1A1A] shadow-[4px_4px_0px_0px_rgba(28,26,26,1)] hover:bg-red-600 hover:translate-y-1 hover:shadow-none transition-all tracking-wide"
                    >
                      <LogOut className="h-6 w-6" /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <Link
                      to="/login"
                      className="flex items-center justify-center px-4 py-4 rounded-2xl text-2xl font-['Chewy'] text-[#1C1A1A] bg-white border-4 border-[#1C1A1A] shadow-[4px_4px_0px_0px_rgba(28,26,26,1)] hover:bg-gray-50 hover:translate-y-1 hover:shadow-none transition-all tracking-wide"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-2xl font-['Chewy'] text-[#1C1A1A] bg-[#FFC700] border-4 border-[#1C1A1A] shadow-[4px_4px_0px_0px_rgba(28,26,26,1)] hover:bg-[#EBB336] hover:translate-y-1 hover:shadow-none transition-all tracking-wide"
                    >
                      <UserPlus className="w-6 h-6" /> Sign Up Free
                    </Link>
                  </div>
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

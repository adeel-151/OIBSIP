import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Pizza, Menu as MenuIcon } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  const location = useLocation();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Pizza className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold font-heading tracking-tight">PIZZARO</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/menu" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/menu') ? 'text-primary' : 'text-foreground/80'}`}
          >
            Menu
          </Link>
          <Link 
            to="/build" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/build') ? 'text-primary' : 'text-foreground/80'}`}
          >
            Build Pizza
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative p-2 text-foreground/80 hover:text-primary transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartItemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link 
                to={user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/dashboard'} 
                className="hidden md:flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                <User className="h-4 w-4" />
                <span>{user?.name || 'Account'}</span>
              </Link>
              <button 
                onClick={logout}
                className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Log in
              </Link>
              <Link to="/register" className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors">
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-foreground/80">
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import styles from './Admin.module.css';
import { LayoutDashboard, ShoppingBag, Pizza, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user || user.role !== 'SUPER_ADMIN') {
    return (
      <div className={styles.unauthorized}>
        <h2>Unauthorized Access</h2>
        <p>You must be an admin to view this page.</p>
        <Link to="/">Go Home</Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Pizzaro Admin</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <Link 
            to="/admin/dashboard" 
            className={`${styles.navItem} ${location.pathname === '/admin/dashboard' ? styles.active : ''}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/admin/orders" 
            className={`${styles.navItem} ${location.pathname === '/admin/orders' ? styles.active : ''}`}
          >
            <ShoppingBag size={20} />
            <span>Orders</span>
          </Link>
          <Link 
            to="/admin/menu" 
            className={`${styles.navItem} ${location.pathname === '/admin/menu' ? styles.active : ''}`}
          >
            <Pizza size={20} />
            <span>Menu & Inventory</span>
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <h2>Admin Panel</h2>
          <div className={styles.userInfo}>
            <span>Welcome, {user.name}</span>
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

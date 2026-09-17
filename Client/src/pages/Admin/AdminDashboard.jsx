import { useState, useEffect } from 'react';
import {
  LayoutGrid, Tags, Package, ShoppingCart, Users,
  Boxes, MessageSquare, LogOut, Moon, ChevronRight,
  ChevronLeft, Plus, Wrench, ClipboardList, ShieldCheck, MessageCircle
} from 'lucide-react';
import Header from '../../components/Header';
import './AdminDashboard.css';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeNav, setActiveNav] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setAdmin(JSON.parse(storedUser));
      } catch (e) {
        setAdmin(null);
      }
    } else {
      const name = localStorage.getItem('name');
      const email = localStorage.getItem('email');
      if (name) {
        setAdmin({ name, email: email || 'admin@softpro.com' });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('adminId');
    navigate('/admin/login');
  };

  const initials = admin?.name
    ? admin.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'WA';

  const navItems = [
    { label: 'Overview', icon: <LayoutGrid size={18} /> ,link:'/admin'},
    { label: 'Categories', icon: <Tags size={18} /> ,link:'/admin/category'},
    { label: 'Products', icon: <Package size={18} /> ,link:'/admin/product'},
    { label: 'Orders', icon: <ShoppingCart size={18} />,link:'/admin/orders' },
    { label: 'Users List', icon: <Users size={18} /> ,link:'/admin/users'},
    { label: 'Inventory', icon: <Boxes size={18} /> ,link:'/admin/inventory'},
    { label: 'Complaints', icon: <MessageSquare size={18} />,link:'/admin/complaints' },
  ];

  return (
    <div className="admin-layout">
      <Header />
      <div className="admin-body">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <div className="admin-profile">
            <div className="avatar">{initials}</div>
            <p className="admin-name">{admin?.name ?? 'Administrator'}</p>
            <p className="admin-email">{admin?.email ?? 'Not logged in'}</p>
            <span className="admin-badge">ADMIN</span>
          </div>

<p className="nav-section-label">ADMIN CONTROLS</p>

<nav className="sidebar-nav">
  {navItems.map((item) => (
    <Link
      to={item.link}
      key={item.label}
      className={`sidebar-link ${
        location.pathname === item.link ? "active" : ""
      }`}
    >
      {item.icon}
      <span>{item.label}</span>
    </Link>
  ))}
</nav>

          <button className="logout-link" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </aside>

        <button
          className="sidebar-collapse-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Main content */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
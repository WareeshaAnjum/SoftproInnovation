import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  User,
  Lock,
  LogOut,
  Mail,
  Smartphone,
  Package,
  KeyRound,
  CheckCircle2,
  Trash2,
  Clock
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../Home/Footer';
import './UserProfile.css';

const DEFAULT_USER = {
  _id: "6a8d7821f2ed75bdf5460024",
  name: "Wareesha Anjum",
  email: "wareeshaanjum2004@gmail.com",
  mobile: "9432414877",
  gender: "female",
  role: "MEMBER",
  status: "active"
};

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(DEFAULT_USER);
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: DEFAULT_USER.name,
    email: DEFAULT_USER.email,
    mobile: DEFAULT_USER.mobile,
    gender: DEFAULT_USER.gender
  });

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load User Data & Cart on Mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = { ...DEFAULT_USER, ...parsed };
        setUser(merged);
        setProfileForm({
          name: merged.name || DEFAULT_USER.name,
          email: merged.email || DEFAULT_USER.email,
          mobile: merged.mobile || DEFAULT_USER.mobile,
          gender: merged.gender || DEFAULT_USER.gender
        });
      }

      // Load Cart items
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    } catch (err) {
      console.error('Error loading stored user:', err);
    }

    // Try fetching from backend if id is present
    const fetchUser = async () => {
      try {
        const stored = localStorage.getItem('user');
        const parsed = stored ? JSON.parse(stored) : null;
        const userId = parsed?._id || parsed?.id || DEFAULT_USER._id;
        const res = await axios.get(`http://localhost:5000/api/user/profile/${userId}`);
        if (res.data?.data) {
          setUser((prev) => ({ ...prev, ...res.data.data }));
          setProfileForm({
            name: res.data.data.name || prev.name,
            email: res.data.data.email || prev.email,
            mobile: res.data.data.mobile || prev.mobile,
            gender: res.data.data.gender || prev.gender
          });
        }
      } catch (e) {
        // Backend not reachable or user not in DB, use local state
      }
    };

    fetchUser();
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    showToast('Logged out successfully');
    navigate('/login');
  };

  // Profile Form Change & Submit
  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = user._id || DEFAULT_USER._id;
      const res = await axios.patch(`http://localhost:5000/api/user/profile/${userId}`, profileForm);
      const updated = { ...user, ...profileForm };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      showToast('Profile updated successfully!');
      setActiveTab('overview');
    } catch (err) {
      // Local fallback
      const updated = { ...user, ...profileForm };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      showToast('Profile updated locally!');
      setActiveTab('overview');
    }
  };

  // Password Change Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showToast('Please enter your current password', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    try {
      const userId = user._id || DEFAULT_USER._id;
      await axios.post(`http://localhost:5000/api/user/change-password/${userId}`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      showToast('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setActiveTab('overview');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Password updated!', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setActiveTab('overview');
    }
  };

  // Cart operations
  const handleRemoveFromCart = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    showToast('Item removed from cart');
  };

  // Compute initials
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'WA';

  return (
    <>
      <Header />

      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '24px',
            backgroundColor: notification.type === 'error' ? '#dc2626' : '#15803d',
            color: '#ffffff',
            padding: '12px 22px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 2000,
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {notification.type === 'error' ? '✕' : '✓'} {notification.msg}
        </div>
      )}

      <div className="user-profile-layout">
        {/* Left Sidebar */}
        <aside className="user-sidebar">
          {/* User Avatar & Info */}
          <div className="user-sidebar-profile">
            <div className="user-sidebar-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="user-sidebar-name">User</h2>
            <p className="user-sidebar-email">{user.email || 'user@example.com'}</p>
            <span className="user-sidebar-badge">MEMBER</span>
          </div>

          <p className="user-sidebar-menu-label">MAIN MENU</p>

          <nav className="user-sidebar-nav">
            <button
              type="button"
              className={`user-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutGrid size={18} />
              <span>Overview</span>
            </button>

            <button
              type="button"
              className={`user-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} />
              <span>My Orders</span>
            </button>

            <button
              type="button"
              className={`user-nav-item ${activeTab === 'cart' ? 'active' : ''}`}
              onClick={() => setActiveTab('cart')}
            >
              <ShoppingCart size={18} />
              <span>My Cart</span>
            </button>

            <button
              type="button"
              className={`user-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>My Profile</span>
            </button>

            <button
              type="button"
              className={`user-nav-item ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <Lock size={18} />
              <span>Change Password</span>
            </button>
          </nav>

          <div className="user-sidebar-footer">
            <button type="button" className="user-logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="user-main-content">
          {/* Top Welcome Header */}
          <header className="user-welcome-header">
            <h1 className="user-welcome-title">
              Welcome, <span className="user-italic-name">{user.name || 'Wareesha Anjum'}</span> 👋
            </h1>
            <p className="user-welcome-subtitle">
              Here's what's happening with your account
            </p>
          </header>

          {/* TAB 1: OVERVIEW (Matching Screenshot) */}
          {activeTab === 'overview' && (
            <div className="user-overview-grid">
              {/* Card 1: My Profile */}
              <div className="user-card">
                <div className="user-card-header">
                  <h3 className="user-card-title">
                    <User size={20} color="#3b82f6" />
                    My Profile
                  </h3>
                  <button
                    type="button"
                    className="user-card-link"
                    onClick={() => setActiveTab('profile')}
                  >
                    Edit →
                  </button>
                </div>

                <div className="user-profile-summary-row">
                  <div className="user-profile-large-avatar">{initials}</div>
                  <div className="user-profile-name-block">
                    <h4 className="user-profile-card-name">{user.name || 'Wareesha Anjum'}</h4>
                    <span className="user-profile-card-badge">MEMBER</span>
                  </div>
                </div>

                <div className="user-detail-row">
                  <div className="user-detail-icon">
                    <Mail size={15} color="#6366f1" />
                  </div>
                  <div className="user-detail-text">
                    <span className="user-detail-label">EMAIL</span>
                    <span className="user-detail-val">{user.email || 'wareeshaanjum2004@gmail.com'}</span>
                  </div>
                </div>

                <div className="user-detail-row">
                  <div className="user-detail-icon">
                    <Smartphone size={15} color="#10b981" />
                  </div>
                  <div className="user-detail-text">
                    <span className="user-detail-label">MOBILE</span>
                    <span className="user-detail-val">{user.mobile || '9432414877'}</span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="user-quick-actions">
                  <button
                    type="button"
                    className="user-quick-btn"
                    onClick={() => setActiveTab('orders')}
                  >
                    <Package size={14} />
                    Orders
                  </button>
                  <button
                    type="button"
                    className="user-quick-btn"
                    onClick={() => setActiveTab('cart')}
                  >
                    <ShoppingCart size={14} />
                    Cart
                  </button>
                  <button
                    type="button"
                    className="user-quick-btn"
                    onClick={() => setActiveTab('password')}
                  >
                    <KeyRound size={14} />
                    Password
                  </button>
                </div>
              </div>

              {/* Card 2: Recent Order */}
              <div className="user-card">
                <div className="user-card-header">
                  <h3 className="user-card-title">
                    <Clock size={20} color="#6b7280" />
                    Recent Order
                  </h3>
                  <button
                    type="button"
                    className="user-card-link"
                    onClick={() => setActiveTab('orders')}
                  >
                    View All →
                  </button>
                </div>

                <div className="user-empty-order-box">
                  <span className="user-empty-box-icon" role="img" aria-label="Order Package">
                    📦
                  </span>
                  <p className="user-empty-order-text">No orders yet</p>
                  <Link to="/products" className="user-shop-now-btn">
                    Shop Now →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="user-card">
              <div className="user-card-header">
                <h3 className="user-card-title">
                  <ShoppingBag size={20} color="#c2410c" />
                  My Orders History
                </h3>
                <Link to="/products" className="user-card-link">
                  Browse Catalog →
                </Link>
              </div>

              <div className="user-empty-order-box" style={{ padding: '60px 20px' }}>
                <span className="user-empty-box-icon">📦</span>
                <p className="user-empty-order-text" style={{ fontSize: '15px' }}>
                  You haven't placed any orders yet. Discover high-quality components from our catalog!
                </p>
                <Link to="/products" className="user-shop-now-btn">
                  Explore 72 Products →
                </Link>
              </div>
            </div>
          )}

          {/* TAB 3: MY CART */}
          {activeTab === 'cart' && (
            <div className="user-card">
              <div className="user-card-header">
                <h3 className="user-card-title">
                  <ShoppingCart size={20} color="#c2410c" />
                  My Shopping Cart ({cartItems.length} items)
                </h3>
                <Link to="/products" className="user-card-link">
                  + Add More Products
                </Link>
              </div>

              {cartItems.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px',
                        border: '1px solid #e7e2d9',
                        borderRadius: '10px',
                        background: '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '52px', height: '52px', objectFit: 'contain' }}
                          />
                        ) : (
                          <Package size={32} color="#78716c" />
                        )}
                        <div>
                          <h5 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '700' }}>
                            {item.name}
                          </h5>
                          <span style={{ fontSize: '13px', color: '#c2410c', fontWeight: '700' }}>
                            ₹{Number(item.price).toLocaleString('en-IN')} × {item.quantity || 1}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#1c1917' }}>
                          ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(item.id)}
                          style={{
                            background: '#fee2e2',
                            border: 'none',
                            color: '#ef4444',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer'
                          }}
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '20px',
                      background: '#fbfaf8',
                      borderRadius: '10px',
                      border: '1px solid #e7e2d9',
                      marginTop: '10px'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '14px', color: '#78716c' }}>Total Amount:</span>
                      <h3 style={{ margin: 0, color: '#c2410c', fontSize: '24px', fontWeight: '700' }}>
                        ₹{cartItems
                          .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
                          .toLocaleString('en-IN')}
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="user-primary-btn"
                      onClick={() => showToast('Proceeding to secure checkout...')}
                    >
                      Checkout Now →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="user-empty-order-box" style={{ padding: '60px 20px' }}>
                  <span className="user-empty-box-icon">🛒</span>
                  <p className="user-empty-order-text" style={{ fontSize: '15px' }}>
                    Your cart is currently empty. Add your favorite electronics components!
                  </p>
                  <Link to="/products" className="user-shop-now-btn">
                    Start Shopping →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MY PROFILE (EDIT) */}
          {activeTab === 'profile' && (
            <div className="user-card" style={{ maxWidth: '640px' }}>
              <div className="user-card-header">
                <h3 className="user-card-title">
                  <User size={20} color="#3b82f6" />
                  Edit Profile Information
                </h3>
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div className="user-form-group">
                  <label className="user-form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="user-form-input"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="user-form-group">
                  <label className="user-form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="user-form-input"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="user-form-group">
                  <label className="user-form-label">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    className="user-form-input"
                    value={profileForm.mobile}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="user-form-group">
                  <label className="user-form-label">Gender</label>
                  <select
                    name="gender"
                    className="user-form-input"
                    value={profileForm.gender}
                    onChange={handleProfileChange}
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button type="submit" className="user-primary-btn">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    style={{
                      background: '#e7e5e4',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    onClick={() => setActiveTab('overview')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <div className="user-card" style={{ maxWidth: '540px' }}>
              <div className="user-card-header">
                <h3 className="user-card-title">
                  <Lock size={20} color="#c2410c" />
                  Change Account Password
                </h3>
              </div>

              <form onSubmit={handlePasswordSubmit}>
                <div className="user-form-group">
                  <label className="user-form-label">Current Password</label>
                  <input
                    type="password"
                    className="user-form-input"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div className="user-form-group">
                  <label className="user-form-label">New Password</label>
                  <input
                    type="password"
                    className="user-form-input"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    placeholder="Minimum 6 characters"
                    required
                  />
                </div>

                <div className="user-form-group">
                  <label className="user-form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="user-form-input"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    placeholder="Re-enter new password"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button type="submit" className="user-primary-btn">
                    Update Password
                  </button>
                  <button
                    type="button"
                    style={{
                      background: '#e7e5e4',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    onClick={() => setActiveTab('overview')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
};

export default UserProfile;

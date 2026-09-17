import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../Home/Footer';
import { ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {
        email: data.email.trim(),
        password: data.password,
      });

      if (res.data && res.data.success) {
        const adminUser = {
          name: res.data.name || 'Administrator',
          email: res.data.email || data.email,
          role: 'Admin',
          token: res.data.token,
          adminId: res.data.adminId,
        };
        localStorage.setItem('user', JSON.stringify(adminUser));
        localStorage.setItem('name', adminUser.name);
        localStorage.setItem('email', adminUser.email);
        localStorage.setItem('role', 'Admin');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('adminId', res.data.adminId);

        navigate('/admin');
      } else {
        setError(res.data?.msg || 'Invalid administrator credentials.');
      }
    } catch (er) {
      console.error('Admin login error:', er);
      setError(
        er.response?.data?.msg ||
        'Authentication failed. Please verify admin email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div id="logpg">
        <div id="login" style={{ maxWidth: '440px' }}>
          <div className="log-head text-center">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--spi-orange-light)',
                color: 'var(--spi-orange)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                border: '1px solid var(--spi-orange-border)',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <h2 className="browse-title" style={{ fontSize: '26px', margin: '0 0 6px 0' }}>
              Admin <span className="in">Portal</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', margin: 0 }}>
              Authorized administrators only
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px',
                fontWeight: '500',
              }}
            >
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="log-text" htmlFor="admin-email">Admin Email *</label>
              <input
                id="admin-email"
                type="email"
                name="email"
                className="user-form-input"
                style={{ width: '100%' }}
                placeholder="admin@softpro.com"
                value={data.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="log-text" htmlFor="admin-pass">Security Password *</label>
              <input
                id="admin-pass"
                type="password"
                name="password"
                className="user-form-input"
                style={{ width: '100%' }}
                placeholder="••••••••"
                value={data.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-orangered signbtn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '20px', marginBottom: 0 }}>
              Return to{' '}
              <Link to="/" style={{ color: 'var(--spi-orange)', fontWeight: '600', textDecoration: 'none' }}>
                Storefront
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
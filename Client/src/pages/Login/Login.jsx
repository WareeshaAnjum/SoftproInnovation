import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../Home/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/user/login', {
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res.data && res.data.success) {
        const user = res.data.user;
        const token = res.data.token;

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        localStorage.setItem('name', user.name);
        localStorage.setItem('email', user.email);
        localStorage.setItem('role', 'Customer');

        navigate('/profile');
      } else {
        setError(res.data?.msg || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.msg ||
        'Authentication failed. Please verify your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div id="logpg">
        <div id="login">
          <div className="log-head">
            <h2 className="browse-title" style={{ fontSize: '28px', margin: '0 0 6px 0' }}>
              Welcome <span className="in">Back</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', margin: 0 }}>
              Sign in with your registered account
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
                fontSize: '13.5px',
                marginBottom: '18px',
                fontWeight: '500',
              }}
            >
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="log-text" htmlFor="email-input">Email address *</label>
              <input
                id="email-input"
                type="email"
                name="email"
                className="user-form-input"
                style={{ width: '100%' }}
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="log-text" htmlFor="password-input">Password *</label>
              <input
                id="password-input"
                type="password"
                name="password"
                className="user-form-input"
                style={{ width: '100%' }}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-flex align-items-center justify-content-between mb-4">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--spi-orange)' }}
                />
                Remember Me
              </label>

              <a href="#" style={{ fontSize: '13px', color: 'var(--spi-orange)', textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn btn-orangered signbtn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '20px', marginBottom: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--spi-orange)', fontWeight: '600', textDecoration: 'none' }}>
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;

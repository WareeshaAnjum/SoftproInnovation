import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../Home/Footer';
import { ShieldCheck, UserPlus, LogIn, Eye, EyeOff, User, Mail, Lock, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'forgot'
  
  // Login Form State
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register Form State
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Forgot Password State
  const [forgotStep, setForgotStep] = useState(1); // 1: Send Code, 2: Verify Code, 3: Reset Password
  const [forgotData, setForgotData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [demoCode, setDemoCode] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterChange = (e) => {
    setRegisterData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleForgotChange = (e) => {
    setForgotData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {
        email: loginData.email.trim(),
        password: loginData.password,
      });

      if (res.data && res.data.success) {
        const adminUser = {
          name: res.data.name || 'Administrator',
          email: res.data.email || loginData.email,
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

        setSuccess('Authentication successful! Opening dashboard...');
        setTimeout(() => {
          navigate('/admin');
        }, 800);
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.password) {
      setError('Please fill out all required registration fields.');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/admin/register', {
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
      });

      if (res.data && res.data.success) {
        const adminUser = {
          name: res.data.name || registerData.name.trim(),
          email: res.data.email || registerData.email.trim(),
          role: 'Admin',
          token: res.data.token,
          adminId: res.data.adminId,
        };
        localStorage.setItem('user', JSON.stringify(adminUser));
        localStorage.setItem('name', adminUser.name);
        localStorage.setItem('email', adminUser.email);
        localStorage.setItem('role', 'Admin');
        if (res.data.token) localStorage.setItem('token', res.data.token);
        if (res.data.adminId) localStorage.setItem('adminId', res.data.adminId);

        setSuccess('Admin account created & credentials saved in database! Accessing dashboard...');
        setTimeout(() => {
          navigate('/admin');
        }, 1200);
      } else {
        setError(res.data?.msg || 'Registration failed.');
      }
    } catch (er) {
      console.error('Admin register error:', er);
      setError(
        er.response?.data?.msg ||
        'Failed to register admin account. Email might already exist in database.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Steps
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotData.email.trim()) {
      setError('Please enter your administrator email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/forgot-password', {
        email: forgotData.email.trim(),
      });

      if (res.data && res.data.success) {
        setSuccess(res.data.msg);
        if (res.data.recoveryCode) {
          setDemoCode(res.data.recoveryCode);
        }
        setForgotStep(2);
      } else {
        setError(res.data?.msg || 'Failed to send recovery code.');
      }
    } catch (er) {
      setError(er.response?.data?.msg || 'Unable to send recovery code. Ensure email is registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotData.code.trim()) {
      setError('Please enter the 6-digit code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/verify-reset-code', {
        email: forgotData.email.trim(),
        code: forgotData.code.trim(),
      });

      if (res.data && res.data.success) {
        setSuccess('Code verified! Please enter your new password.');
        setForgotStep(3);
      } else {
        setError(res.data?.msg || 'Invalid recovery code.');
      }
    } catch (er) {
      setError(er.response?.data?.msg || 'Invalid or expired recovery code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotData.newPassword) {
      setError('Please enter your new password.');
      return;
    }

    if (forgotData.newPassword !== forgotData.confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (forgotData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/reset-password', {
        email: forgotData.email.trim(),
        code: forgotData.code.trim(),
        newPassword: forgotData.newPassword,
      });

      if (res.data && res.data.success) {
        setSuccess('Password changed successfully! You can now log in.');
        setLoginData({
          email: forgotData.email.trim(),
          password: forgotData.newPassword,
        });
        setTimeout(() => {
          setActiveTab('login');
          setForgotStep(1);
          setForgotData({ email: '', code: '', newPassword: '', confirmNewPassword: '' });
          setDemoCode('');
        }, 1500);
      } else {
        setError(res.data?.msg || 'Failed to update password.');
      }
    } catch (er) {
      setError(er.response?.data?.msg || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div id="logpg">
        <div id="login" style={{ maxWidth: '460px' }}>
          <div className="log-head text-center">
            <div
              style={{
                width: '52px',
                height: '52px',
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
              <ShieldCheck size={26} />
            </div>
            <h2 className="browse-title" style={{ fontSize: '26px', margin: '0 0 6px 0' }}>
              Admin <span className="in">Portal</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', margin: 0 }}>
              Authorized administrators authentication
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          {activeTab !== 'forgot' && (
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--bg-surface-secondary)',
                padding: '4px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                marginBottom: '20px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError('');
                  setSuccess('');
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: activeTab === 'login' ? 'var(--bg-surface)' : 'transparent',
                  color: activeTab === 'login' ? 'var(--spi-orange)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'login' ? '700' : '500',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: activeTab === 'login' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <LogIn size={15} /> Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setError('');
                  setSuccess('');
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: activeTab === 'register' ? 'var(--bg-surface)' : 'transparent',
                  color: activeTab === 'register' ? 'var(--spi-orange)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'register' ? '700' : '500',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: activeTab === 'register' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <UserPlus size={15} /> Register Admin
              </button>
            </div>
          )}

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

          {success && (
            <div
              style={{
                backgroundColor: 'rgba(22, 163, 74, 0.12)',
                border: '1px solid rgba(22, 163, 74, 0.3)',
                color: '#16a34a',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px',
                fontWeight: '600',
              }}
            >
              ✓ {success}
            </div>
          )}

          {activeTab === 'login' && (
            /* Sign In Form */
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="log-text" htmlFor="admin-email">Admin Email *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    className="user-form-input"
                    style={{ width: '100%', paddingLeft: '38px' }}
                    placeholder="admin@softpro.com"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                  />
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="log-text" htmlFor="admin-pass">Security Password *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setForgotStep(1);
                      setError('');
                      setSuccess('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--spi-orange)',
                      fontSize: '12.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="admin-pass"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="user-form-input"
                    style={{ width: '100%', paddingLeft: '38px', paddingRight: '38px' }}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-orangered signbtn mt-4" disabled={loading}>
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            /* Register Admin Form */
            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-3">
                <label className="log-text" htmlFor="reg-name">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-name"
                    type="text"
                    name="name"
                    className="user-form-input"
                    style={{ width: '100%', paddingLeft: '38px' }}
                    placeholder="e.g. Administrator"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                  />
                  <User
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="log-text" htmlFor="reg-email">Admin Email *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    className="user-form-input"
                    style={{ width: '100%', paddingLeft: '38px' }}
                    placeholder="admin@softpro.com"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                  />
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="log-text" htmlFor="reg-pass">Create Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-pass"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="user-form-input"
                    style={{ width: '100%', paddingLeft: '38px', paddingRight: '38px' }}
                    placeholder="Minimum 6 characters"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                  />
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="log-text" htmlFor="reg-confirm">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-confirm"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="user-form-input"
                    style={{ width: '100%', paddingLeft: '38px' }}
                    placeholder="Re-enter password"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                  />
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-orangered signbtn" disabled={loading}>
                {loading ? 'Saving to Database...' : 'Register & Access Dashboard'}
              </button>
            </form>
          )}

          {activeTab === 'forgot' && (
            /* Forgot Password Flow */
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                    setSuccess('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--spi-orange)',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </button>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                  STEP {forgotStep} OF 3
                </span>
              </div>

              {forgotStep === 1 && (
                <form onSubmit={handleSendCode}>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                    Reset Admin Password
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                    Enter your registered email address. We will generate and send a 6-digit recovery code to your email.
                  </p>

                  <div className="mb-4">
                    <label className="log-text" htmlFor="forgot-email">Admin Registered Email *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="forgot-email"
                        type="email"
                        name="email"
                        className="user-form-input"
                        style={{ width: '100%', paddingLeft: '38px' }}
                        placeholder="admin@softpro.com"
                        value={forgotData.email}
                        onChange={handleForgotChange}
                        required
                      />
                      <Mail
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-muted)',
                        }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-orangered signbtn" disabled={loading}>
                    {loading ? 'Sending Code...' : 'Send Recovery Code'}
                  </button>
                </form>
              )}

              {forgotStep === 2 && (
                <form onSubmit={handleVerifyCode}>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                    Verify Recovery Code
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Enter the 6-digit recovery code sent to <strong>{forgotData.email}</strong>.
                  </p>

                  {demoCode && (
                    <div
                      style={{
                        backgroundColor: 'var(--spi-orange-light)',
                        border: '1px solid var(--spi-orange-border)',
                        color: 'var(--spi-orange)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        marginBottom: '16px',
                        textAlign: 'center',
                        fontWeight: '600',
                      }}
                    >
                      🔑 Code sent: <span style={{ letterSpacing: '2px', fontSize: '16px' }}>{demoCode}</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="log-text" htmlFor="forgot-code">6-Digit Recovery Code *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="forgot-code"
                        type="text"
                        name="code"
                        maxLength={6}
                        className="user-form-input text-center fw-bold"
                        style={{ width: '100%', letterSpacing: '4px', fontSize: '18px' }}
                        placeholder="123456"
                        value={forgotData.code}
                        onChange={handleForgotChange}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-orangered signbtn" disabled={loading}>
                    {loading ? 'Verifying Code...' : 'Verify Code & Proceed'}
                  </button>
                </form>
              )}

              {forgotStep === 3 && (
                <form onSubmit={handleResetPassword}>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                    Create New Password
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                    Choose a strong security password for administrator account <strong>{forgotData.email}</strong>.
                  </p>

                  <div className="mb-3">
                    <label className="log-text" htmlFor="new-pass">New Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="new-pass"
                        type={showPassword ? 'text' : 'password'}
                        name="newPassword"
                        className="user-form-input"
                        style={{ width: '100%', paddingLeft: '38px', paddingRight: '38px' }}
                        placeholder="Minimum 6 characters"
                        value={forgotData.newPassword}
                        onChange={handleForgotChange}
                        required
                      />
                      <Lock
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-muted)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="log-text" htmlFor="confirm-new-pass">Confirm New Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="confirm-new-pass"
                        type={showPassword ? 'text' : 'password'}
                        name="confirmNewPassword"
                        className="user-form-input"
                        style={{ width: '100%', paddingLeft: '38px' }}
                        placeholder="Re-enter new password"
                        value={forgotData.confirmNewPassword}
                        onChange={handleForgotChange}
                        required
                      />
                      <Lock
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-muted)',
                        }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-orangered signbtn" disabled={loading}>
                    {loading ? 'Updating Password...' : 'Reset & Save Password'}
                  </button>
                </form>
              )}
            </div>
          )}

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '20px', marginBottom: 0 }}>
            Return to{' '}
            <Link to="/" style={{ color: 'var(--spi-orange)', fontWeight: '600', textDecoration: 'none' }}>
              Storefront
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
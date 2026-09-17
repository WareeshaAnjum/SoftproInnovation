import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Smartphone, Mail, Eye, EyeOff } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../Home/Footer';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    gender: 'other',
    agreed: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!formData.agreed) {
      setError('Please agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/user/register', {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        password: formData.password,
        gender: formData.gender || 'other',
        status: 'active',
      });

      if (res.data && res.data.success) {
        setSuccess('Account created successfully! Redirecting to sign in...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(res.data?.msg || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.msg ||
        'Unable to connect to server. Please ensure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="register-container">
        <div className="register-card">
          <h1 className="register-title">
            Create an <span className="italic-accent">account</span>
          </h1>
          <p className="register-subtitle">
            Join thousands of makers — it's free and takes 30 seconds
          </p>

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

          {success && (
            <div
              style={{
                backgroundColor: 'rgba(22, 163, 74, 0.12)',
                border: '1px solid rgba(22, 163, 74, 0.3)',
                color: '#16a34a',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13.5px',
                marginBottom: '18px',
                fontWeight: '600',
              }}
            >
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <div className="input-wrapper">
                  <input
                    id="fullName"
                    name="fullName"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                  <User size={18} className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <div className="input-wrapper">
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                  <Smartphone size={18} className="input-icon" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Mail size={18} className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Create Password *</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="input-icon clickable"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            <div className="form-checkbox">
              <input
                id="agreed"
                name="agreed"
                type="checkbox"
                checked={formData.agreed}
                onChange={handleChange}
                required
              />
              <label htmlFor="agreed" style={{ fontSize: '13px', margin: 0, cursor: 'pointer' }}>
                I agree to the <a href="#">Terms &amp; Conditions</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="divider">
              <span>already a member?</span>
            </div>

            <p className="signin-link">
              Have an account? <Link to="/login">Sign in →</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
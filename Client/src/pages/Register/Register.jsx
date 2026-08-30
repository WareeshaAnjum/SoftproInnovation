import { useState } from 'react';
import { User, Smartphone, Mail, Eye, EyeOff } from 'lucide-react';
import './Register.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert('Please agree to the Terms & Conditions.');
      return;
    }
    console.log('Registering:', formData);
    // TODO: connect to your backend / API call here
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">
          Create an <span className="italic-accent">account</span>
        </h1>
        <p className="register-subtitle">
          Join thousands of makers — it's free and takes 30 seconds
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-wrapper">
                <input
                  id="fullName"
                  name="fullName"
                  placeholder="john doe"
                  value={formData.fullName}
                  onChange={handleChange}
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
                  placeholder="+91 99999 99999"
                  value={formData.mobile}
                  onChange={handleChange}
                />
                <Smartphone size={18} className="input-icon" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <Mail size={18} className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Create Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className="input-icon clickable"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>
            
          

          <button type="submit" className="register-btn">
            Create Account
          </button>

          <div className="divider">
            <span>already a member?</span>
          </div>

          <p className="signin-link">
            Have an account? <a href="/login">Sign in →</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
import React, { useState } from 'react';
import { X, UserPlus, LogIn, Lock, AlertCircle, Check, Mail, Eye, EyeOff } from 'lucide-react';

export default function AuthModal({ onClose, onRegister, onLogin, showToast }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  // Register form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [referralCode, setReferralCode] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const tabStyle = (tab) => ({
    flex: 1,
    padding: '14px',
    background: activeTab === tab ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
    border: 'none',
    borderBottom: activeTab === tab ? '2px solid #10B981' : '2px solid transparent',
    color: activeTab === tab ? '#10B981' : '#9CA3AF',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg('Email and password are required.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onLogin(loginEmail.trim(), loginPassword);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !mobile || !country) {
      setErrorMsg('All marked fields are required.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onRegister({
        full_name: fullName,
        email,
        password,
        mobile,
        country,
        referral_code: referralCode.trim(),
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-icon" style={{ width: '32px', height: '32px' }}>
              {activeTab === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h3 className="modal-title">
                {activeTab === 'login' ? 'Sign In to AdPulse' : 'Create Account'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                {activeTab === 'login'
                  ? 'Enter your credentials to access your account'
                  : 'Register with password to secure your earnings'}
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <button style={tabStyle('login')} onClick={() => { setActiveTab('login'); setErrorMsg(''); }}>
            <LogIn size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Sign In
          </button>
          <button style={tabStyle('register')} onClick={() => { setActiveTab('register'); setErrorMsg(''); }}>
            <UserPlus size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Register
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="standard-form">
              <div className="form-group">
                <label>
                  <Mail size={13} style={{ display: 'inline', marginRight: '5px' }} />
                  Registered Email Address *
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. asad.ali@example.com"
                  className="form-input"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>
                  <Lock size={13} style={{ display: 'inline', marginRight: '5px' }} />
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div style={{ color: '#EF4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button type="submit" className="primary-gradient-btn full-width-btn" disabled={isSubmitting}>
                <LogIn size={16} />
                <span>{isSubmitting ? 'Signing In...' : 'Sign In to My Account'}</span>
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#9CA3AF', marginTop: '12px' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                  style={{ background: 'none', border: 'none', color: '#10B981', fontWeight: 700, cursor: 'pointer' }}
                >
                  Register here →
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="standard-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Asad Ali"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. asad.ali@example.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="03XXXXXXXXX"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Country *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Referral Code (Optional)</label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. EARN9482"
                  className="form-input"
                />
              </div>

              {errorMsg && (
                <div style={{ color: '#EF4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button type="submit" className="primary-gradient-btn full-width-btn" disabled={isSubmitting}>
                <UserPlus size={16} />
                <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

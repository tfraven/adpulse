import React, { useState } from 'react';
import { X, UserPlus, LogIn, Lock, AlertCircle, Check, Mail } from 'lucide-react';

export default function AuthModal({ onClose, onRegister, onLogin, showToast }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  // Register form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [referralCode, setReferralCode] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');

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
    if (!loginEmail.trim()) {
      setErrorMsg('Email address is required.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onLogin(loginEmail.trim());
    } catch (err) {
      setErrorMsg(err.message || 'Sign in failed. Check your email and try again.');
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !mobile || !country) {
      setErrorMsg('All marked fields are required.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onRegister({
        full_name: fullName,
        email,
        mobile,
        country,
        referral_code: referralCode.trim(),
      });
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
                  ? 'Enter your registered email to access your account'
                  : 'Register to start earning by watching ads'}
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
                <span className="form-hint">
                  Enter the email address you used when creating your account.
                </span>
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
                <label>
                  Email Address *
                  <span className="locked-badge">
                    <Lock size={10} style={{ display: 'inline', marginRight: '3px' }} />
                    Permanently Uneditable Once Set
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. asad.ali@example.com"
                  className="form-input"
                  required
                />
                <span className="form-hint">Email cannot be modified after registration.</span>
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="03001234567"
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
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Malaysia">Malaysia</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Optional Referral Code</label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="e.g. EARN9482 (Optional)"
                  className="form-input"
                />
                <span className="form-hint">Enter your inviter's referral code to receive ₨ 100 Welcome Bonus!</span>
              </div>

              {errorMsg && (
                <div style={{ color: '#EF4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button type="submit" className="primary-gradient-btn full-width-btn" disabled={isSubmitting}>
                <Check size={16} />
                <span>{isSubmitting ? 'Creating Account...' : 'Register & Generate Unique Referral Code'}</span>
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#9CA3AF', marginTop: '12px' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                  style={{ background: 'none', border: 'none', color: '#10B981', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign in →
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

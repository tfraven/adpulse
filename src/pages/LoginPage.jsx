import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogIn, Mail, Lock, AlertCircle, Zap, Eye, EyeOff,
  Shield, TrendingUp, Users, Wallet
} from 'lucide-react';
import { apiLogin } from '../api';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await apiLogin(cleanEmail, password);
      if (!res.success) throw new Error(res.message);
      onLogin(res.user, res.token);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password. Please verify and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-layout">
      {/* Background Glows */}
      <div className="ambient-glow glow-1" style={{ top: '-10%', left: '-5%' }}></div>
      <div className="ambient-glow glow-2" style={{ bottom: '-10%', right: '-5%' }}></div>

      {/* Left Panel — Branding */}
      <div className="auth-brand-panel">
        <div className="auth-brand-inner">
          <div className="brand-logo" style={{ marginBottom: '40px' }}>
            <div className="logo-icon" style={{ width: '52px', height: '52px' }}>
              <Zap size={28} fill="white" />
            </div>
            <div>
              <span className="brand-title" style={{ fontSize: '2rem' }}>
                Ad<span className="highlight">Pulse</span>
              </span>
              <span className="brand-badge">PRO</span>
            </div>
          </div>

          <h2 className="auth-brand-heading">
            Earn Real Money<br />Watching Ads
          </h2>
          <p className="auth-brand-sub">
            Pakistan's premier high-yield PTC earning platform. 
            Watch verified sponsored ads and get paid directly to your wallet.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="auth-feature-title">Earn Up to ₨ 45/Ad</div>
                <div className="auth-feature-sub">Highest payouts across 6 tiered subscription plans</div>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>
                <Wallet size={20} />
              </div>
              <div>
                <div className="auth-feature-title">4 Segregated Wallets</div>
                <div className="auth-feature-sub">Deposit, Earning, Referral & Rewards</div>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}>
                <Users size={20} />
              </div>
              <div>
                <div className="auth-feature-title">10% Referral Commission</div>
                <div className="auth-feature-sub">Instant cash credit on every team plan activation</div>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                <Shield size={20} />
              </div>
              <div>
                <div className="auth-feature-title">Instant Payouts</div>
                <div className="auth-feature-sub">JazzCash & EasyPaisa straight to your mobile account</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="auth-form-panel">
        <div className="auth-form-box">
          {/* Mobile Logo */}
          <div className="auth-mobile-logo">
            <div className="logo-icon" style={{ width: '36px', height: '36px' }}>
              <Zap size={20} fill="white" />
            </div>
            <span className="brand-title">Ad<span className="highlight">Pulse</span></span>
          </div>

          <div className="auth-form-header">
            <h1 className="auth-form-title">Welcome Back</h1>
            <p className="auth-form-subtitle">
              Sign in with your email and password to access your earnings
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-field-group">
              <label className="auth-label">
                <Mail size={14} />
                Registered Email Address
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                  placeholder="e.g. yourname@example.com"
                  className="auth-input"
                  autoComplete="email"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-label">
                <Lock size={14} />
                Account Password
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                  placeholder="Enter your account password"
                  className="auth-input"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span className="auth-field-hint">
                Demo accounts: default password is <strong>password123</strong>
              </span>
            </div>

            {errorMsg && (
              <div className="auth-error-box">
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="auth-spinner"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In to My Account</span>
                </>
              )}
            </button>

            <div className="auth-divider">
              <span>New to AdPulse?</span>
            </div>

            <Link to="/register" className="auth-secondary-btn">
              Create a Free Account →
            </Link>
          </form>

          <p className="auth-legal-text">
            By signing in, you agree to AdPulse's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

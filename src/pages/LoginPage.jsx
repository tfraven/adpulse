import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogIn, Mail, AlertCircle, Zap, Eye, EyeOff,
  Shield, TrendingUp, Users, Wallet
} from 'lucide-react';
import { apiLogin } from '../api';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await apiLogin(trimmed);
      if (!res.success) throw new Error(res.message);
      onLogin(res.user);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Sign in failed. Please check your email and try again.');
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
            Pakistan's most transparent PTC earning platform. 
            Watch sponsored ads and get paid directly to your wallet.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="auth-feature-title">Earn Up to ₨ 45/Ad</div>
                <div className="auth-feature-sub">Highest rates across 6 subscription tiers</div>
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
                <div className="auth-feature-sub">Instant credit on every plan activation</div>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                <Shield size={20} />
              </div>
              <div>
                <div className="auth-feature-title">Instant Withdrawals</div>
                <div className="auth-feature-sub">JazzCash & EasyPaisa in minutes</div>
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
              Sign in to your AdPulse account to continue earning
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
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowHint(!showHint)}
                  tabIndex={-1}
                >
                  {showHint ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {showHint && (
                <span className="auth-field-hint">
                  Enter the exact email you used during registration.
                </span>
              )}
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
            Your email is your permanent account identity and cannot be changed.
          </p>
        </div>
      </div>
    </div>
  );
}

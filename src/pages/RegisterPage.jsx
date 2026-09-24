import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  UserPlus, Lock, AlertCircle, Zap, Check,
  Mail, Phone, Globe, Gift, ChevronRight
} from 'lucide-react';
import { apiRegister } from '../api';

const COUNTRIES = [
  'Pakistan', 'United Arab Emirates', 'Saudi Arabia', 'United Kingdom',
  'United States', 'Bangladesh', 'India', 'Canada', 'Australia', 'Malaysia',
  'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Germany', 'France', 'Turkey',
  'Egypt', 'Nigeria', 'South Africa'
];

export default function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [step, setStep] = useState(1); // Multi-step form

  // Step 1 validation
  const validateStep1 = () => {
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMsg('Please enter your full name (at least 3 characters).');
      return false;
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mobile.trim()) {
      setErrorMsg('Mobile number is required.');
      return;
    }
    if (!country) {
      setErrorMsg('Please select your country.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await apiRegister({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        country,
        referral_code: referralCode.trim().toUpperCase(),
      });

      if (!res.success) throw new Error(res.message);

      // Auto-login after registration
      onLogin(res.user);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const progressPct = step === 1 ? 50 : 100;

  return (
    <div className="auth-page-layout">
      {/* Background Glows */}
      <div className="ambient-glow glow-1" style={{ top: '-10%', left: '-5%' }}></div>
      <div className="ambient-glow glow-2" style={{ bottom: '-10%', right: '-5%' }}></div>

      {/* Left Panel — Steps overview */}
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
            Start Earning<br />in 2 Minutes
          </h2>
          <p className="auth-brand-sub">
            Create your free AdPulse account and receive a ₨ 100 welcome bonus instantly upon registration.
          </p>

          {/* Steps */}
          <div className="auth-steps-list">
            <div className={`auth-step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
              <div className="auth-step-num">
                {step > 1 ? <Check size={14} /> : '1'}
              </div>
              <div>
                <div className="auth-step-title">Account Identity</div>
                <div className="auth-step-sub">Full name & email address</div>
              </div>
            </div>
            <div className="auth-step-connector"></div>
            <div className={`auth-step-item ${step >= 2 ? 'active' : ''}`}>
              <div className="auth-step-num">2</div>
              <div>
                <div className="auth-step-title">Contact & Location</div>
                <div className="auth-step-sub">Mobile number & country</div>
              </div>
            </div>
          </div>

          {/* Perks */}
          <div className="auth-perks-box">
            <div className="auth-perk">
              <Check size={14} style={{ color: '#10B981', flexShrink: 0 }} />
              <span>Free to join — zero registration fee</span>
            </div>
            <div className="auth-perk">
              <Check size={14} style={{ color: '#10B981', flexShrink: 0 }} />
              <span>₨ 100 welcome bonus on signup</span>
            </div>
            <div className="auth-perk">
              <Check size={14} style={{ color: '#10B981', flexShrink: 0 }} />
              <span>Unique referral code assigned instantly</span>
            </div>
            <div className="auth-perk">
              <Check size={14} style={{ color: '#10B981', flexShrink: 0 }} />
              <span>Earn from day one with any plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Registration Form */}
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
            <h1 className="auth-form-title">Create Account</h1>
            <p className="auth-form-subtitle">
              {step === 1
                ? 'Step 1 of 2 — Your account identity'
                : 'Step 2 of 2 — Contact details'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="auth-progress-bar">
            <div className="auth-progress-fill" style={{ width: `${progressPct}%` }}></div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleNext} className="auth-form" noValidate>
              <div className="auth-field-group">
                <label className="auth-label">
                  <UserPlus size={14} />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setErrorMsg(''); }}
                  placeholder="e.g. Muhammad Ali"
                  className="auth-input"
                  autoFocus
                  required
                />
              </div>

              <div className="auth-field-group">
                <label className="auth-label">
                  <Mail size={14} />
                  Email Address *
                  <span className="auth-locked-tag">
                    <Lock size={10} />
                    Permanent — Cannot be changed
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                  placeholder="e.g. ali@example.com"
                  className="auth-input"
                  autoComplete="email"
                  required
                />
                <span className="auth-field-hint">
                  Your email is your permanent account identifier and financial ledger key.
                </span>
              </div>

              {errorMsg && (
                <div className="auth-error-box">
                  <AlertCircle size={15} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button type="submit" className="auth-submit-btn">
                <span>Continue to Step 2</span>
                <ChevronRight size={18} />
              </button>

              <div className="auth-divider"><span>Already have an account?</span></div>
              <Link to="/login" className="auth-secondary-btn">Sign In →</Link>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {/* Summary of Step 1 */}
              <div className="auth-step-summary">
                <div className="auth-step-summary-row">
                  <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>Name</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{fullName}</span>
                </div>
                <div className="auth-step-summary-row">
                  <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>Email</span>
                  <span style={{ color: '#10B981', fontWeight: 600 }}>{email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none', border: 'none', color: '#6B7280',
                    fontSize: '0.75rem', cursor: 'pointer', marginTop: '4px'
                  }}
                >
                  ← Edit Step 1
                </button>
              </div>

              <div className="auth-field-group">
                <label className="auth-label">
                  <Phone size={14} />
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => { setMobile(e.target.value); setErrorMsg(''); }}
                  placeholder="e.g. 03001234567"
                  className="auth-input"
                  autoFocus
                  required
                />
              </div>

              <div className="auth-field-group">
                <label className="auth-label">
                  <Globe size={14} />
                  Country *
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="auth-input auth-select"
                  required
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="auth-field-group">
                <label className="auth-label">
                  <Gift size={14} />
                  Referral Code
                  <span className="auth-optional-tag">Optional</span>
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. EARN9482"
                  className="auth-input"
                  maxLength={8}
                />
                <span className="auth-field-hint">
                  Got an invite? Enter the referral code to claim ₨ 50 welcome bonus!
                </span>
              </div>

              {errorMsg && (
                <div className="auth-error-box">
                  <AlertCircle size={15} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="auth-spinner"></span>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Create Account &amp; Start Earning</span>
                  </>
                )}
              </button>

              <p className="auth-legal-text" style={{ marginTop: '16px' }}>
                By registering, you confirm you are 18+ years old and agree to our Terms of Service.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

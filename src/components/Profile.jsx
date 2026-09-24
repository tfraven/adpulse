import React, { useState } from 'react';
import { User, Lock, Save, ShieldCheck, LogOut } from 'lucide-react';

export default function Profile({ 
  user, 
  activePlan, 
  onUpdateProfile, 
  onSignOut,
  showToast 
}) {
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [country, setCountry] = useState(user?.country || 'Pakistan');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onUpdateProfile({ full_name: fullName, mobile, country });
    setIsSaving(false);
  };

  return (
    <div>
      <div className="hero-welcome-card" style={{ gridTemplateColumns: '1.2fr 1fr', marginBottom: '28px' }}>
        <div>
          <div className="hero-badge">
            <User size={14} />
            <span>Profile Management</span>
          </div>
          <h2 className="hero-heading">Account & Security Settings</h2>
          <p className="hero-description" style={{ marginBottom: 0 }}>
            Manage your personal profile details. Note that per system policy, your email address is permanently bound to your account and remains unchangeable.
          </p>
        </div>

        <div className="hero-plan-card" style={{ alignItems: 'center', textAlign: 'center' }}>
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.8rem',
              color: '#fff',
              margin: '0 auto 10px',
            }}
          >
            {(user?.full_name || 'U')[0].toUpperCase()}
          </div>
          <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>{user?.full_name}</h4>
          <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>
            ✓ Verified Account
          </span>
          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#9CA3AF' }}>
            Plan: <strong style={{ color: '#fff' }}>{activePlan?.plan_name || 'Free Tier'}</strong>
          </div>
        </div>
      </div>

      <div className="content-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="panel-header">
          <div>
            <h4 className="panel-title">Personal Information</h4>
            <span className="panel-subtitle">Update your personal contact details</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="standard-form">
          <div className="form-row two-col">
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="form-input" 
                required 
              />
            </div>

            {/* Email Address - STRICTLY LOCKED PER REQUIREMENT */}
            <div className="form-group">
              <label>
                Email Address
                <span className="locked-badge" title="Per requirement, email addresses remain uneditable after registration">
                  <Lock size={11} style={{ display: 'inline', marginRight: '3px' }} />
                  Permanently Uneditable
                </span>
              </label>
              <input 
                type="email" 
                value={user?.email || ''} 
                readOnly 
                disabled 
                className="form-input locked-input" 
                title="Email addresses cannot be modified after registration" 
              />
              <span className="form-hint">Email is linked to your financial ledger identity.</span>
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label>Mobile Number *</label>
              <input 
                type="tel" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)} 
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
                <option value="Pakistan">Pakistan (🇵🇰)</option>
                <option value="United Arab Emirates">United Arab Emirates (🇦🇪)</option>
                <option value="Saudi Arabia">Saudi Arabia (🇸🇦)</option>
                <option value="United Kingdom">United Kingdom (🇬🇧)</option>
                <option value="United States">United States (🇺🇸)</option>
              </select>
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label>Assigned Unique Referral Code</label>
              <input 
                type="text" 
                value={user?.referral_code || ''} 
                readOnly 
                disabled 
                className="form-input locked-input" 
                style={{ fontWeight: 800, color: '#10B981' }} 
              />
            </div>

            <div className="form-group">
              <label>Registered Date</label>
              <input 
                type="text" 
                value={new Date(user?.created_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} 
                readOnly 
                disabled 
                className="form-input locked-input" 
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <button 
              type="button" 
              className="outline-glass-btn" 
              style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              onClick={onSignOut}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>

            <button type="submit" className="primary-gradient-btn" disabled={isSaving}>
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

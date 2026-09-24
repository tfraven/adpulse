import React, { useState } from 'react';
import { X, UserPlus, Users, Lock, AlertCircle, Check } from 'lucide-react';

export default function AuthModal({ 
  allUsers, 
  onClose, 
  onRegister, 
  onSwitchUser, 
  showToast 
}) {
  const [activeTab, setActiveTab] = useState('register'); // 'register' or 'switch'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
        referral_code: referralCode.trim()
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
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="modal-title">Account Management</h3>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                Create a new profile or switch existing accounts
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            style={{
              flex: 1,
              padding: '14px',
              background: activeTab === 'register' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'register' ? '2px solid #10B981' : 'none',
              color: activeTab === 'register' ? '#10B981' : '#9CA3AF',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('register')}
          >
            Create New Account
          </button>
          <button
            style={{
              flex: 1,
              padding: '14px',
              background: activeTab === 'switch' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'switch' ? '2px solid #10B981' : 'none',
              color: activeTab === 'switch' ? '#10B981' : '#9CA3AF',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('switch')}
          >
            Switch User ({allUsers.length})
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'register' ? (
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
                <span className="form-hint">Note: Email addresses cannot be modified after registration.</span>
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
                <span>{isSubmitting ? 'Registering...' : 'Register & Generate Unique Referral Code'}</span>
              </button>
            </form>
          ) : (
            <div>
              <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '16px' }}>
                Select an existing registered profile to switch session instantly:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {allUsers.map((u) => (
                  <div 
                    key={u.id}
                    onClick={() => { onSwitchUser(u.id); onClose(); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{u.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{u.email}</div>
                    </div>
                    <span className="code-badge">{u.referral_code}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

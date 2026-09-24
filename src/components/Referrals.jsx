import React, { useState } from 'react';
import { Users, Copy, Check, Sparkles, UserPlus } from 'lucide-react';

export default function Referrals({ 
  user, 
  wallets, 
  stats, 
  onSimulateReferral, 
  showToast 
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralCode = user?.referral_code || 'EARN9482';
  const referralLink = `https://adpulse.network/register?ref=${referralCode}`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
    showToast('Copied to clipboard!', 'success');
  };

  const fmt = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      {/* Referral Hero Card */}
      <div className="hero-welcome-card" style={{ gridTemplateColumns: '1.2fr 1fr', marginBottom: '28px' }}>
        <div>
          <div className="hero-badge">
            <Users size={14} />
            <span>Affiliate Referral Program</span>
          </div>
          <h2 className="hero-heading">Invite Friends & Earn Instant Commissions</h2>
          <p className="hero-description" style={{ marginBottom: 0 }}>
            Earn an instant <strong>10% cash commission</strong> credited directly to your <strong>Referral Wallet</strong> whenever someone registers with your unique referral code and purchases any subscription plan.
          </p>
        </div>

        {/* Share Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: '#9CA3AF', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Your Unique Referral Code
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={referralCode} 
                readOnly 
                className="form-input locked-input" 
                style={{ fontWeight: 800, letterSpacing: '1px', color: '#10B981' }} 
              />
              <button 
                className="primary-gradient-btn" 
                onClick={() => copyToClipboard(referralCode, 'code')}
                style={{ flexShrink: 0 }}
              >
                {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#9CA3AF', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Direct Invitation URL
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={referralLink} 
                readOnly 
                className="form-input locked-input" 
                style={{ fontSize: '0.8rem', color: '#9CA3AF' }} 
              />
              <button 
                className="outline-glass-btn" 
                onClick={() => copyToClipboard(referralLink, 'link')}
                style={{ flexShrink: 0 }}
              >
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="kpi-metrics-grid">
        <div className="kpi-card">
          <div className="kpi-top"><span className="kpi-title">Direct Referrals</span></div>
          <div className="kpi-value-row">
            <span className="kpi-value">{stats?.directReferrals || 14}</span>
            <span className="kpi-unit">Members</span>
          </div>
          <div className="kpi-foot">Active team network</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top"><span className="kpi-title">Total Referral Commission</span></div>
          <div className="kpi-value-row">
            <span className="kpi-symbol">₨</span>
            <span className="kpi-value">{fmt(wallets?.referral_balance)}</span>
          </div>
          <div className="kpi-foot">Disbursed to Referral Wallet</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top"><span className="kpi-title">Commission Rate</span></div>
          <div className="kpi-value-row">
            <span className="kpi-value">10%</span>
            <span className="kpi-unit">Per Plan</span>
          </div>
          <div className="kpi-foot">Instant automatic credit</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top"><span className="kpi-title">Referral Wallet Balance</span></div>
          <div className="kpi-value-row">
            <span className="kpi-symbol">₨</span>
            <span className="kpi-value">{fmt(wallets?.referral_balance)}</span>
          </div>
          <div className="kpi-foot">Available in your ledger</div>
        </div>
      </div>

      {/* Direct Referrals List */}
      <div className="content-panel">
        <div className="panel-header">
          <div>
            <h4 className="panel-title">Direct Team Members</h4>
            <span className="panel-subtitle">Users who registered through your personal invite code</span>
          </div>
          <button className="outline-glass-btn" onClick={onSimulateReferral} style={{ fontSize: '0.8rem' }}>
            <UserPlus size={14} />
            <span>+ Simulate New Referral</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Email Address</th>
                <th>Joined Date</th>
                <th>Current Tier</th>
                <th>Commission Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.referralsList && stats.referralsList.length > 0 ? (
                stats.referralsList.map((ref, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: '#fff' }}>{ref.full_name}</td>
                    <td style={{ color: '#9CA3AF' }}>{ref.email}</td>
                    <td style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                      {new Date(ref.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <span className="plan-badge-pill" style={{ fontSize: '0.7rem' }}>{ref.plan_name || 'Free Member'}</span>
                    </td>
                    <td>
                      <span style={{ color: '#10B981', fontWeight: 600, fontSize: '0.8rem' }}>● Credited (+10%)</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>
                    No direct referrals registered yet. Share your code to start earning!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Play, ChevronDown, User, Wallet, LogIn, LogOut, Menu } from 'lucide-react';

export default function Header({
  activeTab,
  user,
  isLoggedIn,
  wallets,
  onStartWatch,
  onOpenAuth,
  onLogout,
  setActiveTab,
  setIsMobileOpen,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Financial Dashboard', subtitle: 'Real-time ledger overview, active plan, and ads performance' };
      case 'watch-ads':
        return { title: 'Watch Ads & Earn', subtitle: 'View sponsored videos and disburse funds to your Earning Wallet' };
      case 'plans':
        return { title: 'Subscription Plans', subtitle: 'Choose high-yielding tiers funded from your Deposit Wallet' };
      case 'wallets':
        return { title: 'Wallets & Financial Ledger', subtitle: 'Manage your 4 segregated wallets and audit complete history' };
      case 'referrals':
        return { title: 'Affiliate Network', subtitle: 'Invite partners and earn commissions on plan activations' };
      case 'profile':
        return { title: 'Account Settings', subtitle: 'Personal profile details and permanently bound email identity' };
      default:
        return { title: 'Dashboard', subtitle: 'Welcome to AdPulse' };
    }
  };

  const { title, subtitle } = getPageInfo();
  const totalBalance = wallets?.total_balance ?? 0;

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="modal-close-btn mobile-menu-btn"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="topbar-right">
        {/* Currency Tag */}
        <div className="currency-tag">
          <span>🇵🇰</span>
          <span>PKR (₨)</span>
        </div>

        {/* Total Balance Pill — only when logged in */}
        {isLoggedIn && (
          <div className="topbar-balance-pill" title="Consolidated aggregate of all 4 individual wallets">
            <span className="pill-label">Total Balance:</span>
            <span className="pill-amount">₨ {Number(totalBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        )}

        {/* Watch Ads CTA */}
        {isLoggedIn && (
          <button className="primary-gradient-btn" onClick={onStartWatch}>
            <Play size={15} fill="white" />
            <span>Watch Ads</span>
          </button>
        )}

        {/* Auth Area */}
        {isLoggedIn ? (
          <div className="user-menu-wrapper">
            <button className="user-menu-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {(user?.full_name || 'U')[0].toUpperCase()}
              </div>
              <ChevronDown size={14} color="#9CA3AF" />
            </button>

            {dropdownOpen && (
              <div className="dropdown-popover">
                <div className="dropdown-header">
                  <div className="dd-name">{user?.full_name || 'User'}</div>
                  <div className="dd-email">{user?.email || ''}</div>
                  {user?.referral_code && (
                    <div className="dd-ref">
                      Ref Code: <span className="code-badge">{user.referral_code}</span>
                    </div>
                  )}
                </div>

                <ul className="dropdown-links">
                  <li>
                    <button
                      className="dd-link"
                      onClick={() => { setActiveTab('profile'); setDropdownOpen(false); }}
                    >
                      <User size={15} />
                      <span>Profile Settings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="dd-link"
                      onClick={() => { setActiveTab('wallets'); setDropdownOpen(false); }}
                    >
                      <Wallet size={15} />
                      <span>Wallets & Ledger</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="dd-link"
                      style={{ color: '#EF4444' }}
                      onClick={() => { onLogout(); setDropdownOpen(false); }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button className="primary-gradient-btn" onClick={onOpenAuth}>
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}

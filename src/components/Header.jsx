import React, { useState } from 'react';
import { Play, ChevronDown, User, Wallet, UserPlus, Menu } from 'lucide-react';

export default function Header({ 
  activeTab, 
  user, 
  wallets, 
  onStartWatch, 
  onOpenAuth, 
  setActiveTab,
  setIsMobileOpen
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
        return { title: 'Affiliate Network', subtitle: 'Invite partners and earn 10% instant commission on tier upgrades' };
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
          className="modal-close-btn" 
          style={{ display: 'none' }}
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

        {/* Total Consolidated Balance Pill */}
        <div className="topbar-balance-pill" title="Consolidated aggregate of all 4 individual wallets">
          <span className="pill-label">Total Balance:</span>
          <span className="pill-amount">₨ {Number(totalBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>

        {/* Watch Ads CTA Button */}
        <button className="primary-gradient-btn" onClick={onStartWatch}>
          <Play size={15} fill="white" />
          <span>Watch Ads</span>
        </button>

        {/* Profile Dropdown */}
        <div className="user-menu-wrapper">
          <button className="user-menu-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              alt="Avatar" 
              className="mini-avatar" 
            />
            <ChevronDown size={14} color="#9CA3AF" />
          </button>

          {dropdownOpen && (
            <div className="dropdown-popover">
              <div className="dropdown-header">
                <div className="dd-name">{user?.full_name || 'Sajid Khan'}</div>
                <div className="dd-email">{user?.email || 'sajid.khan@example.com'}</div>
                <div className="dd-ref">
                  Ref Code: <span className="code-badge">{user?.referral_code || 'EARN9482'}</span>
                </div>
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
                    onClick={() => { onOpenAuth(); setDropdownOpen(false); }}
                  >
                    <UserPlus size={15} />
                    <span>Switch / Register User</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

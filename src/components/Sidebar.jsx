import React from 'react';
import {
  LayoutDashboard,
  PlayCircle,
  Award,
  Wallet,
  Users,
  User,
  ArrowDownCircle,
  ArrowUpCircle,
  RotateCcw,
  Zap,
  X,
  LogIn,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  isLoggedIn,
  activePlan,
  onOpenDeposit,
  onOpenWithdraw,
  onResetDemo,
  isMobileOpen,
  setIsMobileOpen,
  onOpenAuth,
}) {
  const adsRemaining = activePlan
    ? Math.max(0, activePlan.daily_limit - activePlan.ads_watched_today)
    : 0;

  const navClick = (tab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-logo">
          <div className="logo-icon">
            <Zap size={22} fill="white" />
          </div>
          <div>
            <span className="brand-title">Ad<span className="highlight">Pulse</span></span>
            <span className="brand-badge">PRO</span>
          </div>
        </div>
        {isMobileOpen && (
          <button className="modal-close-btn" onClick={() => setIsMobileOpen(false)}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* User Quick Snapshot */}
      <div className="user-quick-profile">
        <div className="avatar-ring">
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: isLoggedIn
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {isLoggedIn && user?.full_name ? user.full_name[0].toUpperCase() : '?'}
          </div>
          {isLoggedIn && <span className="status-dot"></span>}
        </div>
        <div className="user-meta">
          <div className="user-name">
            {isLoggedIn ? (user?.full_name || 'Loading...') : 'Guest User'}
          </div>
          <div className="user-tier-tag">
            <span className="tier-indicator"></span>
            <span>{isLoggedIn ? (activePlan?.plan_name || 'No Active Plan') : 'Please sign in'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">MAIN MENU</div>

        <button
          className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => navClick('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'watch-ads' ? 'active' : ''}`}
          onClick={() => navClick('watch-ads')}
        >
          <PlayCircle size={18} />
          <span>Watch Ads</span>
          {isLoggedIn && <span className="nav-counter">{adsRemaining} Left</span>}
        </button>

        <button
          className={`nav-link ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => navClick('plans')}
        >
          <Award size={18} />
          <span>Subscription Plans</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'wallets' ? 'active' : ''}`}
          onClick={() => navClick('wallets')}
        >
          <Wallet size={18} />
          <span>Wallets &amp; Ledger</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'referrals' ? 'active' : ''}`}
          onClick={() => navClick('referrals')}
        >
          <Users size={18} />
          <span>Referrals</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => navClick('profile')}
        >
          <User size={18} />
          <span>My Profile</span>
        </button>

        {isLoggedIn && (
          <>
            <div className="nav-section-title">FINANCIAL ACTIONS</div>
            <div className="sidebar-actions">
              <button className="action-card-btn" onClick={onOpenDeposit}>
                <div className="action-icon deposit-icon">
                  <ArrowDownCircle size={18} />
                </div>
                <div className="action-info">
                  <span className="action-title">Instant Deposit</span>
                  <span className="action-sub">JazzCash / EasyPaisa</span>
                </div>
              </button>

              <button className="action-card-btn" onClick={onOpenWithdraw}>
                <div className="action-icon withdraw-icon">
                  <ArrowUpCircle size={18} />
                </div>
                <div className="action-info">
                  <span className="action-title">Fast Withdraw</span>
                  <span className="action-sub">From Earning Wallet</span>
                </div>
              </button>
            </div>
          </>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {isLoggedIn ? (
          <button
            className="outline-glass-btn full-width-btn"
            style={{ fontSize: '0.78rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
            onClick={onResetDemo}
            title="Simulate ad daily quota reset (for testing)"
          >
            <RotateCcw size={14} />
            <span>Simulate Daily Reset</span>
          </button>
        ) : (
          <button
            className="primary-gradient-btn full-width-btn"
            onClick={onOpenAuth}
          >
            <LogIn size={14} />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </aside>
  );
}

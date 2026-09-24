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
  X
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  activePlan, 
  onOpenDeposit, 
  onOpenWithdraw, 
  onResetDemo,
  isMobileOpen,
  setIsMobileOpen
}) {
  const adsRemaining = activePlan ? Math.max(0, activePlan.daily_limit - activePlan.ads_watched_today) : 0;

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
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
            alt="Avatar" 
            className="avatar-img" 
          />
          <span className="status-dot"></span>
        </div>
        <div className="user-meta">
          <div className="user-name">{user?.full_name || 'Sajid Khan'}</div>
          <div className="user-tier-tag">
            <span className="tier-indicator"></span>
            <span>{activePlan?.plan_name || 'No Active Plan'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">MAIN MENU</div>

        <button 
          className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => { setActiveTab('dashboard'); setIsMobileOpen(false); }}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button 
          className={`nav-link ${activeTab === 'watch-ads' ? 'active' : ''}`}
          onClick={() => { setActiveTab('watch-ads'); setIsMobileOpen(false); }}
        >
          <PlayCircle size={18} />
          <span>Watch Ads</span>
          <span className="nav-counter">{adsRemaining} Left</span>
        </button>

        <button 
          className={`nav-link ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => { setActiveTab('plans'); setIsMobileOpen(false); }}
        >
          <Award size={18} />
          <span>Subscription Plans</span>
        </button>

        <button 
          className={`nav-link ${activeTab === 'wallets' ? 'active' : ''}`}
          onClick={() => { setActiveTab('wallets'); setIsMobileOpen(false); }}
        >
          <Wallet size={18} />
          <span>Wallets & Ledger</span>
        </button>

        <button 
          className={`nav-link ${activeTab === 'referrals' ? 'active' : ''}`}
          onClick={() => { setActiveTab('referrals'); setIsMobileOpen(false); }}
        >
          <Users size={18} />
          <span>Referrals</span>
        </button>

        <button 
          className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => { setActiveTab('profile'); setIsMobileOpen(false); }}
        >
          <User size={18} />
          <span>My Profile</span>
        </button>

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
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button 
          className="outline-glass-btn full-width-btn" 
          style={{ fontSize: '0.78rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
          onClick={onResetDemo}
          title="Reset daily quota and demo records"
        >
          <RotateCcw size={14} />
          <span>Simulate Daily Reset</span>
        </button>
      </div>
    </aside>
  );
}

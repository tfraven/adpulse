import React from 'react';
import { 
  Play, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Users, 
  Sparkles, 
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import GoogleAdBanner from './GoogleAdBanner';

export default function Dashboard({ 
  user, 
  isLoggedIn,
  wallets, 
  activePlan, 
  stats, 
  transactions, 
  ads, 
  onStartWatch, 
  onOpenDeposit, 
  onOpenWithdraw,
  onClaimStreak,
  setActiveTab 
}) {
  const adsWatchedToday = activePlan ? activePlan.ads_watched_today : (stats?.adsWatchedToday || 0);
  const dailyLimit = activePlan ? activePlan.daily_limit : (stats?.dailyLimit || 0);
  const adsRemaining = Math.max(0, dailyLimit - adsWatchedToday);
  const earningPerAd = activePlan ? Number(activePlan.earning_per_ad) : 0;
  const potentialEarnings = adsRemaining * earningPerAd;

  const quotaPercent = dailyLimit > 0 ? Math.min(100, Math.round((adsWatchedToday / dailyLimit) * 100)) : 0;

  // Format currency
  const fmt = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      {/* Hero Welcome Card */}
      <div className="hero-welcome-card">
        <div>
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>High Yield PTC Earning Network</span>
          </div>
          <h2 className="hero-heading">Welcome back, {user?.full_name?.split(' ')[0] || 'Member'}!</h2>
          <p className="hero-description">
            Your <strong>{activePlan?.plan_name || 'Active'}</strong> plan is running. You have{' '}
            <span className="highlight-text">{adsRemaining} ads available</span> to watch today for an estimated earning of{' '}
            <strong>₨ {fmt(potentialEarnings)}</strong>.
          </p>

          <div className="hero-btn-row">
            <button className="primary-gradient-btn" onClick={onStartWatch}>
              <Play size={16} fill="white" />
              <span>Watch Ads Now</span>
            </button>
            <button className="outline-glass-btn" onClick={onOpenDeposit}>
              <ArrowDownCircle size={16} />
              <span>Add Deposit</span>
            </button>
            <button className="outline-glass-btn" onClick={onOpenWithdraw}>
              <ArrowUpCircle size={16} />
              <span>Withdraw Earning</span>
            </button>
          </div>
        </div>

        {/* Active Plan Card inside Hero */}
        <div className="hero-plan-card">
          <div className="plan-card-header">
            <span className="plan-badge-pill">{activePlan?.plan_name || 'NO ACTIVE PLAN'}</span>
            <span className="plan-status-active">● Active</span>
          </div>

          <div className="plan-earning-rate">
            <span className="rate-number">₨ {fmt(earningPerAd)}</span>
            <span className="rate-sub">per ad viewed</span>
          </div>

          <div className="plan-progress-metrics">
            <div className="progress-info-row">
              <span>Daily Quota</span>
              <span>{adsWatchedToday} / {dailyLimit} Ads</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${quotaPercent}%` }}></div>
            </div>
            <div className="progress-info-row secondary">
              <span>Total Plan Validity</span>
              <span>120 Days Cycle</span>
            </div>
          </div>

          <div className="plan-footer-row">
            <button className="text-link-btn" onClick={() => setActiveTab('plans')}>
              Upgrade Plan &rarr;
            </button>
            <span className="daily-reset-clock">Resets at 00:00 AM</span>
          </div>
        </div>
      </div>

      {/* Google Ads Leaderboard Unit */}
      <GoogleAdBanner type="leaderboard" />

      {/* 4 Distinct Wallets Grid */}
      <div className="section-title-row">
        <div>
          <h3 className="section-heading">Multi-Wallet Financial Ledger</h3>
          <p className="section-subtext">Four segregated transparent balances mapped to distinct financial streams</p>
        </div>
        <div className="total-aggregate-chip">
          <span className="chip-label">Aggregate Total:</span>
          <span className="chip-value">₨ {fmt(wallets?.total_balance)}</span>
        </div>
      </div>

      <div className="wallets-grid">
        {/* Wallet 1: Deposit Wallet */}
        <div className="wallet-card">
          <div className="wallet-header">
            <div className="wallet-icon-box deposit-icon">
              <CreditCard size={18} />
            </div>
            <span className="wallet-tag">Deposit Wallet</span>
          </div>
          <div className="wallet-balance-row">
            <span className="currency-prefix">₨</span>
            <span className="wallet-amount">{fmt(wallets?.deposit_balance)}</span>
          </div>
          <p className="wallet-purpose">Used exclusively to purchase & upgrade subscription plans.</p>
          <div className="wallet-action-row">
            <button className="wallet-btn deposit-btn" onClick={onOpenDeposit}>
              <ArrowDownCircle size={14} />
              <span>Deposit Funds</span>
            </button>
          </div>
        </div>

        {/* Wallet 2: Earning Wallet (Only one withdrawable!) */}
        <div className="wallet-card featured">
          <div className="wallet-header">
            <div className="wallet-icon-box earning-icon">
              <TrendingUp size={18} />
            </div>
            <span className="wallet-tag highlight-tag">Earning Wallet ★</span>
          </div>
          <div className="wallet-balance-row">
            <span className="currency-prefix">₨</span>
            <span className="wallet-amount">{fmt(wallets?.earning_balance)}</span>
          </div>
          <p className="wallet-purpose">Generated strictly from watched ads. <strong>Only wallet eligible for withdrawals!</strong></p>
          <div className="wallet-action-row">
            <button className="wallet-btn withdraw-btn" onClick={onOpenWithdraw}>
              <ArrowUpCircle size={14} />
              <span>Withdraw Now</span>
            </button>
          </div>
        </div>

        {/* Wallet 3: Referral Wallet */}
        <div className="wallet-card">
          <div className="wallet-header">
            <div className="wallet-icon-box referral-icon">
              <Users size={18} />
            </div>
            <span className="wallet-tag">Referral Wallet</span>
          </div>
          <div className="wallet-balance-row">
            <span className="currency-prefix">₨</span>
            <span className="wallet-amount">{fmt(wallets?.referral_balance)}</span>
          </div>
          <p className="wallet-purpose">Earned through team commissions and invite tier bonuses.</p>
          <div className="wallet-action-row">
            <button className="wallet-btn outline-btn" onClick={() => setActiveTab('referrals')}>
              <Users size={14} />
              <span>Invite Friends</span>
            </button>
          </div>
        </div>

        {/* Wallet 4: Rewards Wallet */}
        <div className="wallet-card">
          <div className="wallet-header">
            <div className="wallet-icon-box rewards-icon">
              <Sparkles size={18} />
            </div>
            <span className="wallet-tag">Rewards Wallet</span>
          </div>
          <div className="wallet-balance-row">
            <span className="currency-prefix">₨</span>
            <span className="wallet-amount">{fmt(wallets?.rewards_balance)}</span>
          </div>
          <p className="wallet-purpose">Daily login streak bonuses, milestone achievements & promo gifts.</p>
          <div className="wallet-action-row">
            <button className="wallet-btn outline-btn" onClick={onClaimStreak}>
              <Sparkles size={14} />
              <span>Claim Streak</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Performance Metrics */}
      <div className="section-title-row">
        <div>
          <h3 className="section-heading">Real-Time Performance Analytics</h3>
          <p className="section-subtext">Live metrics tracked across ad views, earnings, and referrals</p>
        </div>
      </div>

      <div className="kpi-metrics-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Today's Earnings</span>
            <span className="kpi-badge positive">+14.2%</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-symbol">₨</span>
            <span className="kpi-value">{fmt(adsWatchedToday * earningPerAd)}</span>
          </div>
          <div className="kpi-foot">From {adsWatchedToday} ads viewed today</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Ads Watched Today</span>
            <span className="kpi-badge neutral">{adsWatchedToday} / {dailyLimit}</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{adsWatchedToday}</span>
            <span className="kpi-unit">/ {dailyLimit} Max</span>
          </div>
          <div className="kpi-foot">{adsRemaining} ads remaining today</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Direct Referrals</span>
            <span className="kpi-badge accent">Active Tier</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{stats?.directReferrals ?? 0}</span>
            <span className="kpi-unit">Members</span>
          </div>
          <div className="kpi-foot">₨ {fmt(wallets?.referral_balance)} commission earned</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Total Lifetime Earnings</span>
            <span className="kpi-badge gold">All-Time</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-symbol">₨</span>
            <span className="kpi-value">{fmt(stats?.totalEarnings ?? 0)}</span>
          </div>
          <div className="kpi-foot">Historical total ads: <strong>{stats?.totalHistoricalAds ?? 0}</strong></div>
        </div>
      </div>

      {/* Split Row: Mini Financial Ledger + Instant Ad Queue */}
      <div className="dashboard-split-row">
        {/* Ledger Panel */}
        <div className="content-panel">
          <div className="panel-header">
            <div>
              <h4 className="panel-title">Recent Financial Ledger</h4>
              <span className="panel-subtitle">Latest movements across all four wallets</span>
            </div>
            <button className="text-link-btn" onClick={() => setActiveTab('wallets')}>
              Full Ledger &rarr;
            </button>
          </div>

          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Category</th>
                  <th>Wallet</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions && transactions.length > 0 ? (
                  transactions.slice(0, 5).map((tx) => (
                    <tr key={tx.id || tx.tx_id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{tx.description}</div>
                        <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>{tx.tx_id}</div>
                      </td>
                      <td>
                        <span className={`tx-type-badge badge-${tx.type}`}>{tx.type}</span>
                      </td>
                      <td style={{ color: '#9CA3AF' }}>{tx.target_wallet}</td>
                      <td>
                        <span className={tx.amount >= 0 ? 'amount-pos' : 'amount-neg'}>
                          {tx.amount >= 0 ? `+₨ ${fmt(tx.amount)}` : `-₨ ${fmt(Math.abs(tx.amount))}`}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 600 }}>● {tx.status}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>
                      No recent transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instant Ad Stream */}
        <div className="content-panel">
          <div className="panel-header">
            <div>
              <h4 className="panel-title">Instant Ad Stream</h4>
              <span className="panel-subtitle">Sponsored ads ready to watch</span>
            </div>
            <span className="kpi-badge positive">● Live</span>
          </div>

          <div className="ad-quick-cards-list">
            {ads && ads.slice(0, 3).map((ad) => (
              <div className="quick-ad-item" key={ad.id}>
                <img src={ad.banner_url} alt={ad.title} className="ad-thumb" />
                <div className="ad-quick-info">
                  <div className="ad-quick-title">{ad.title}</div>
                  <div className="ad-quick-sponsor">{ad.sponsor}</div>
                </div>
                <div className="ad-quick-reward">
                  <span className="reward-rate">+₨ {fmt(earningPerAd)}</span>
                  <span className="duration-tag">{ad.duration_seconds}s</span>
                </div>
              </div>
            ))}
          </div>

          <button className="primary-gradient-btn full-width-btn" onClick={() => setActiveTab('watch-ads')}>
            <span>Open Full Ad Hub</span>
            <ExternalLink size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

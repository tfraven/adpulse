import React, { useState } from 'react';
import { Play, AlertCircle, Clock, Sparkles, Filter, ExternalLink } from 'lucide-react';

export default function WatchAds({ 
  ads, 
  activePlan, 
  onWatchAd, 
  setActiveTab 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const adsWatchedToday = activePlan ? activePlan.ads_watched_today : 0;
  const dailyLimit = activePlan ? activePlan.daily_limit : 0;
  const adsRemaining = Math.max(0, dailyLimit - adsWatchedToday);
  const earningPerAd = activePlan ? Number(activePlan.earning_per_ad) : 0;

  const quotaPercent = dailyLimit > 0 ? Math.min(100, Math.round((adsWatchedToday / dailyLimit) * 100)) : 0;

  const filteredAds = ads.filter(ad => {
    if (selectedCategory === 'all') return true;
    return ad.category === selectedCategory;
  });

  const fmt = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      {/* Engine Status Header */}
      <div className="hero-welcome-card" style={{ gridTemplateColumns: '1fr auto', marginBottom: '24px' }}>
        <div>
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Ad Engagement Engine</span>
          </div>
          <h2 className="hero-heading">Watch Sponsored Ads & Claim Instant Cash</h2>
          <p className="hero-description" style={{ marginBottom: 0 }}>
            Each ad requires 10 to 15 seconds of watch time and a quick anti-bot verification to disburse funds straight to your <strong>Earning Wallet</strong>.
          </p>
        </div>

        <div className="hero-plan-card" style={{ minWidth: '280px' }}>
          <div className="plan-card-header">
            <span className="plan-badge-pill">{activePlan?.plan_name || 'NO ACTIVE PLAN'}</span>
            <span className="daily-reset-clock">Resets 00:00 AM</span>
          </div>
          <div style={{ margin: '14px 0' }}>
            <div className="progress-info-row">
              <span>Daily Ad Quota</span>
              <span><strong>{adsWatchedToday} / {dailyLimit}</strong> Viewed</span>
            </div>
            <div className="progress-bar-track" style={{ marginTop: '6px' }}>
              <div className="progress-bar-fill" style={{ width: `${quotaPercent}%` }}></div>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700 }}>
            {adsRemaining > 0 ? `${adsRemaining} Ads Available Today` : 'Daily Limit Reached!'}
          </div>
        </div>
      </div>

      {/* Plan Guard Warning (If user has no active plan) */}
      {!activePlan && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '14px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EF4444',
              flexShrink: 0
            }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                Active Subscription Plan Required
              </h4>
              <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
                Per platform rules, you cannot earn from watching ads without an active subscription plan. Please select a plan from your Deposit Wallet.
              </p>
            </div>
          </div>
          <button className="primary-gradient-btn" onClick={() => setActiveTab('plans')} style={{ flexShrink: 0 }}>
            <span>Browse Plans</span>
            <ExternalLink size={16} />
          </button>
        </div>
      )}

      {/* Category Filter Bar */}
      <div className="ads-filter-bar">
        <div className="filter-tabs-group">
          <button 
            className={`filter-tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Ads ({ads.length})
          </button>
          <button 
            className={`filter-tab-btn ${selectedCategory === 'fintech' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('fintech')}
          >
            Fintech & Banking
          </button>
          <button 
            className={`filter-tab-btn ${selectedCategory === 'crypto' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('crypto')}
          >
            Crypto & Trading
          </button>
          <button 
            className={`filter-tab-btn ${selectedCategory === 'tech' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('tech')}
          >
            AI & Software
          </button>
          <button 
            className={`filter-tab-btn ${selectedCategory === 'ecommerce' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('ecommerce')}
          >
            E-Commerce
          </button>
        </div>
      </div>

      {/* Ads Stream Grid */}
      <div className="ads-stream-grid">
        {filteredAds.map((ad) => {
          const isQuotaOver = activePlan && adsRemaining <= 0;
          const isDisabled = !activePlan || isQuotaOver;

          return (
            <div className="ad-card" key={ad.id}>
              <img src={ad.banner_url} alt={ad.title} className="ad-banner-img" />
              <div className="ad-card-body">
                <div className="ad-meta-top">
                  <span className="ad-sponsor-tag">{ad.sponsor}</span>
                  <span className="ad-duration-pill">
                    <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />
                    {ad.duration_seconds}s
                  </span>
                </div>

                <h4 className="ad-title">{ad.title}</h4>
                <p className="ad-tagline">{ad.tagline}</p>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginTop: 'auto',
                  paddingTop: '14px',
                  borderTop: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'block' }}>Reward Payout:</span>
                    <strong style={{ fontSize: '1.1rem', color: '#10B981' }}>+₨ {fmt(earningPerAd)}</strong>
                  </div>

                  <button 
                    className="primary-gradient-btn"
                    disabled={isDisabled}
                    onClick={() => onWatchAd(ad)}
                    title={!activePlan ? 'Requires active plan' : isQuotaOver ? 'Daily limit reached' : 'Watch ad and earn'}
                  >
                    <Play size={14} fill="white" />
                    <span>Watch & Earn</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

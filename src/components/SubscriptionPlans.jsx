import React from 'react';
import { Award, Check, Sparkles, PlusCircle } from 'lucide-react';

export default function SubscriptionPlans({ 
  plans, 
  activePlan, 
  wallets, 
  onSelectPlan, 
  onOpenDeposit 
}) {
  const depositBalance = wallets?.deposit_balance ?? 0;
  const fmt = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      {/* Plans Intro Header */}
      <div className="hero-welcome-card" style={{ gridTemplateColumns: '1fr auto', marginBottom: '32px' }}>
        <div>
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>High-Yield Earning Tiers</span>
          </div>
          <h2 className="hero-heading">Choose Your Earning Tier</h2>
          <p className="hero-description" style={{ marginBottom: 0 }}>
            Subscription plans are funded exclusively from your <strong>Deposit Wallet</strong>. Upgrading increases your daily limit, lifetime ad quota, and earning rate per ad.
          </p>
        </div>

        <div className="hero-plan-card" style={{ minWidth: '280px', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Available Deposit Balance:</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', margin: '8px 0' }}>
            ₨ {fmt(depositBalance)}
          </div>
          <button className="outline-glass-btn" onClick={onOpenDeposit} style={{ width: '100%' }}>
            <PlusCircle size={15} />
            <span>Deposit Funds</span>
          </button>
        </div>
      </div>

      {/* Plans Matrix Grid */}
      <div className="plans-matrix-grid">
        {plans.map((plan) => {
          const isCurrentActive = activePlan && activePlan.plan_name?.toLowerCase().includes(plan.name.toLowerCase());
          const isFeatured = plan.slug === 'pioneer';

          return (
            <div className={`plan-tier-card ${isFeatured ? 'featured' : ''}`} key={plan.id}>
              {plan.badge && <span className="plan-top-badge">{plan.badge}</span>}

              <h3 className="plan-name">{plan.name} Tier</h3>
              <p className="plan-desc">{plan.description}</p>

              <div className="plan-price-block">
                <span className="price-currency">₨ </span>
                <span className="price-val">{fmt(plan.price)}</span>
                <span className="price-validity"> / 120 Days</span>
              </div>

              <ul className="plan-specs-list">
                <li className="plan-spec-item">
                  <span className="spec-label">Daily Ad Limit:</span>
                  <span className="spec-value">{plan.daily_limit} Ads / Day</span>
                </li>
                <li className="plan-spec-item">
                  <span className="spec-label">Earning Per Ad:</span>
                  <span className="spec-value" style={{ color: '#10B981' }}>₨ {fmt(plan.earning_per_ad)}</span>
                </li>
                <li className="plan-spec-item">
                  <span className="spec-label">Daily Potential:</span>
                  <span className="spec-value">₨ {fmt(plan.daily_limit * plan.earning_per_ad)}</span>
                </li>
                <li className="plan-spec-item">
                  <span className="spec-label">Total Ad Quota:</span>
                  <span className="spec-value">{Number(plan.total_ads).toLocaleString()} Ads</span>
                </li>
                <li className="plan-spec-item">
                  <span className="spec-label">Validity Period:</span>
                  <span className="spec-value">{plan.validity_days} Days Guaranteed</span>
                </li>
              </ul>

              {isCurrentActive ? (
                <button className="outline-glass-btn full-width-btn" disabled style={{ borderColor: '#10B981', color: '#10B981', cursor: 'default' }}>
                  <Check size={16} />
                  <span>Current Active Plan</span>
                </button>
              ) : (
                <button 
                  className="primary-gradient-btn full-width-btn"
                  onClick={() => onSelectPlan(plan)}
                >
                  <Award size={16} />
                  <span>Activate {plan.name}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

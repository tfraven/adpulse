import React, { useState } from 'react';
import { X, Award, AlertCircle, Check, ArrowDownCircle } from 'lucide-react';

export default function PlanConfirmModal({ 
  plan, 
  wallets, 
  onClose, 
  onConfirmPurchase, 
  onOpenDeposit 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const depositBalance = wallets?.deposit_balance ?? 0;
  const planPrice = parseFloat(plan.price);
  const isSufficient = depositBalance >= planPrice;
  const remainingDeposit = depositBalance - planPrice;

  const fmt = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleConfirm = async () => {
    if (!isSufficient) {
      setErrorMsg('Insufficient Deposit Wallet balance. Please add funds first.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      await onConfirmPurchase(plan.slug);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Plan purchase failed.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="wallet-icon-box" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
              <Award size={20} />
            </div>
            <div>
              <h3 className="modal-title">Activate {plan.name} Tier</h3>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                Purchase will be deducted strictly from your Deposit Wallet
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Plan Specs Strip */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '18px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>Plan Price:</span>
              <strong style={{ fontSize: '1.4rem', color: '#10B981' }}>₨ {fmt(planPrice)}</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
              <div style={{ color: '#9CA3AF' }}>Daily Ad Limit: <strong style={{ color: '#fff' }}>{plan.daily_limit} Ads/day</strong></div>
              <div style={{ color: '#9CA3AF' }}>Earning Per Ad: <strong style={{ color: '#10B981' }}>₨ {fmt(plan.earning_per_ad)}</strong></div>
              <div style={{ color: '#9CA3AF' }}>Total Allocation: <strong style={{ color: '#fff' }}>{plan.total_ads.toLocaleString()} Ads</strong></div>
              <div style={{ color: '#9CA3AF' }}>Validity Period: <strong style={{ color: '#fff' }}>{plan.validity_days} Days</strong></div>
            </div>
          </div>

          {/* Balance Comparison Breakdown */}
          <div style={{
            background: isSufficient ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${isSufficient ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: '#9CA3AF' }}>Your Current Deposit Wallet:</span>
              <strong style={{ color: '#fff' }}>₨ {fmt(depositBalance)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: '#9CA3AF' }}>Plan Deduction:</span>
              <strong style={{ color: '#EF4444' }}>-₨ {fmt(planPrice)}</strong>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.9rem',
              fontWeight: 800,
              paddingTop: '8px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              color: isSufficient ? '#10B981' : '#EF4444'
            }}>
              <span>Remaining Deposit Balance:</span>
              <span>₨ {fmt(remainingDeposit)}</span>
            </div>
          </div>

          {errorMsg && (
            <div style={{ color: '#EF4444', fontSize: '0.8rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="outline-glass-btn" onClick={onClose}>
              Cancel
            </button>

            {!isSufficient ? (
              <button 
                type="button" 
                className="primary-gradient-btn"
                onClick={() => { onClose(); onOpenDeposit(); }}
              >
                <ArrowDownCircle size={16} />
                <span>Deposit Funds to Purchase</span>
              </button>
            ) : (
              <button 
                type="button" 
                className="primary-gradient-btn"
                disabled={isProcessing}
                onClick={handleConfirm}
              >
                <Check size={16} />
                <span>{isProcessing ? 'Activating...' : 'Confirm & Deduct Deposit'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

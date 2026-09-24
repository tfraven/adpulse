import React, { useState } from 'react';
import { X, ArrowUpCircle, AlertCircle, Send } from 'lucide-react';

export default function WithdrawModal({ 
  wallets, 
  onClose, 
  onWithdrawSubmit, 
  showToast 
}) {
  const [method, setMethod] = useState('EasyPaisa');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('1000');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const earningBalance = wallets?.earning_balance ?? 0;
  const fmt = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(amount);

    if (!num || num < 300) {
      setErrorMsg('Minimum withdrawal amount is ₨ 300.');
      return;
    }
    if (num > 50000) {
      setErrorMsg('Maximum single withdrawal is ₨ 50,000.');
      return;
    }
    // STRICT ENFORCEMENT: ONLY FROM EARNING WALLET
    if (num > earningBalance) {
      setErrorMsg(`Insufficient Earning Wallet balance! You only have ₨ ${fmt(earningBalance)} available. Note: Platform rules strictly forbid withdrawals from Deposit, Referral, or Rewards wallets.`);
      return;
    }
    if (!accountTitle || !accountNumber) {
      setErrorMsg('Account holder title and mobile/account number are required.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await onWithdrawSubmit({
        method,
        account_title: accountTitle,
        account_number: accountNumber,
        amount: num
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Withdrawal failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="wallet-icon-box withdraw-icon">
              <ArrowUpCircle size={20} />
            </div>
            <div>
              <h3 className="modal-title">Withdraw From Earning Wallet</h3>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                Disbursed strictly from watched sponsored ads earnings
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Earning Wallet Notice */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block' }}>
                Withdrawable Earning Balance:
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>
                ₨ {fmt(earningBalance)}
              </div>
            </div>
            <span className="locked-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
              Strict Rule: Earning Wallet Only
            </span>
          </div>

          <form onSubmit={handleSubmit} className="standard-form">
            {/* Method Selection */}
            <div className="form-group">
              <label>Select Payout Method</label>
              <div className="gateway-selector-grid">
                {['EasyPaisa', 'JazzCash', 'Bank Transfer'].map((m) => (
                  <label className="gateway-option" key={m}>
                    <input 
                      type="radio" 
                      name="withdraw_m" 
                      value={m} 
                      checked={method === m}
                      onChange={() => setMethod(m)}
                    />
                    <div className="gateway-card">
                      <span className={`gw-badge ${m === 'EasyPaisa' ? 'easypaisa-badge' : m === 'JazzCash' ? 'jazzcash-badge' : 'bank-badge'}`}>
                        {m}
                      </span>
                      <span className="gw-name">{m}</span>
                      <span className="gw-limits">Min: ₨ 300</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label>Account Holder Title *</label>
                <input 
                  type="text" 
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  placeholder="e.g. Sajid Khan"
                  className="form-input" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Account / Mobile Number *</label>
                <input 
                  type="text" 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Withdrawal Amount (₨) *</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="300"
                max="50000"
                className="form-input" 
                required 
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {[500, 1000, 3000].map((amt) => (
                  <button 
                    type="button" 
                    key={amt} 
                    className="outline-glass-btn" 
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    onClick={() => setAmount(String(amt))}
                  >
                    ₨ {amt}
                  </button>
                ))}
                <button 
                  type="button" 
                  className="outline-glass-btn" 
                  style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#10B981' }}
                  onClick={() => setAmount(String(Math.floor(earningBalance)))}
                >
                  Withdraw All
                </button>
              </div>
            </div>

            {errorMsg && (
              <div style={{ color: '#EF4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" className="outline-glass-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="primary-gradient-btn" disabled={isSubmitting}>
                <Send size={15} />
                <span>{isSubmitting ? 'Processing...' : 'Submit Withdrawal'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

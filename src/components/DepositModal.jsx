import React, { useState } from 'react';
import { X, ArrowDownCircle, Check, AlertCircle } from 'lucide-react';

export default function DepositModal({ 
  onClose, 
  onDepositSubmit, 
  showToast 
}) {
  const [gateway, setGateway] = useState('JazzCash');
  const [amount, setAmount] = useState('2500');
  const [senderNumber, setSenderNumber] = useState('03001234567');
  const [trxReference, setTrxReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const gatewayDetails = {
    JazzCash: {
      account: '0301-8472910',
      title: 'AdPulse Media Official Ltd',
      min: 500,
      max: 100000
    },
    EasyPaisa: {
      account: '0345-9182740',
      title: 'AdPulse Digital Holdings',
      min: 500,
      max: 100000
    },
    'Bank Transfer': {
      account: 'PK36MEZN0099382910029301',
      title: 'AdPulse Global Tech (Meezan Bank)',
      min: 1000,
      max: 500000
    }
  };

  const currentGw = gatewayDetails[gateway];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num < currentGw.min) {
      setErrorMsg(`Minimum deposit for ${gateway} is ₨ ${currentGw.min.toLocaleString()}.`);
      return;
    }
    if (num > currentGw.max) {
      setErrorMsg(`Maximum deposit for ${gateway} is ₨ ${currentGw.max.toLocaleString()}.`);
      return;
    }
    if (!senderNumber || !trxReference) {
      setErrorMsg('Please enter your sender mobile/account and Transaction ID (TID).');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await onDepositSubmit({
        gateway,
        amount: num,
        sender_number: senderNumber,
        trx_reference: trxReference
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Deposit submission failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="wallet-icon-box deposit-icon">
              <ArrowDownCircle size={20} />
            </div>
            <div>
              <h3 className="modal-title">Deposit to Deposit Wallet</h3>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                Fund your balance to activate and upgrade subscription plans
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="standard-form">
            {/* Gateway Selection */}
            <div className="form-group">
              <label>Select Payment Gateway</label>
              <div className="gateway-selector-grid">
                {['JazzCash', 'EasyPaisa', 'Bank Transfer'].map((gw) => (
                  <label className="gateway-option" key={gw}>
                    <input 
                      type="radio" 
                      name="deposit_gw" 
                      value={gw} 
                      checked={gateway === gw}
                      onChange={() => setGateway(gw)}
                    />
                    <div className="gateway-card">
                      <span className={`gw-badge ${gw === 'JazzCash' ? 'jazzcash-badge' : gw === 'EasyPaisa' ? 'easypaisa-badge' : 'bank-badge'}`}>
                        {gw}
                      </span>
                      <span className="gw-name">{gw}</span>
                      <span className="gw-limits">Min: ₨ {gatewayDetails[gw].min.toLocaleString()}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Receiver Info Callout */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 800 }}>
                OFFICIAL {gateway.toUpperCase()} RECEIVER DETAILS:
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#9CA3AF' }}>Account / IBAN:</span>
                <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{currentGw.account}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#9CA3AF' }}>Account Title:</span>
                <strong style={{ color: '#fff' }}>{currentGw.title}</strong>
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label>Deposit Amount (₨) *</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={currentGw.min}
                  max={currentGw.max}
                  className="form-input" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Your Sender Mobile / Account *</label>
                <input 
                  type="text" 
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Transaction ID (TID / Reference) *</label>
              <input 
                type="text" 
                value={trxReference}
                onChange={(e) => setTrxReference(e.target.value)}
                placeholder="e.g. 84920491823"
                className="form-input" 
                required 
              />
              <span className="form-hint">Enter the transaction ID received in SMS / app receipt.</span>
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
                <Check size={16} />
                <span>{isSubmitting ? 'Verifying...' : 'Confirm & Deposit'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

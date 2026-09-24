import React, { useState } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  Users, 
  Sparkles, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Search,
  CheckCircle2
} from 'lucide-react';

export default function WalletLedger({ 
  wallets, 
  transactions, 
  onOpenDeposit, 
  onOpenWithdraw 
}) {
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fmt = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filterType === 'All' || tx.type === filterType;
    const matchesSearch = searchQuery === '' || 
      tx.tx_id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Ledger Top Header */}
      <div className="hero-welcome-card" style={{ gridTemplateColumns: '1fr auto', marginBottom: '28px' }}>
        <div>
          <div className="hero-badge">
            <CreditCard size={14} />
            <span>Financial Ledger System</span>
          </div>
          <h2 className="hero-heading">Multi-Wallet Management & Audit Trail</h2>
          <p className="hero-description" style={{ marginBottom: 0 }}>
            Unified financial movements tracked in real-time across four distinct, segregated wallets.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="primary-gradient-btn" onClick={onOpenDeposit}>
            <ArrowDownCircle size={16} />
            <span>Deposit</span>
          </button>
          <button className="outline-glass-btn" onClick={onOpenWithdraw}>
            <ArrowUpCircle size={16} />
            <span>Withdraw Earning</span>
          </button>
        </div>
      </div>

      {/* 4 Wallets Breakdown */}
      <div className="wallets-grid">
        <div className="wallet-card">
          <div className="wallet-header">
            <span className="wallet-tag">Deposit Wallet</span>
            <div className="wallet-icon-box deposit-icon"><CreditCard size={16} /></div>
          </div>
          <div className="wallet-balance-row">
            <span className="currency-prefix">₨</span>
            <span className="wallet-amount">{fmt(wallets?.deposit_balance)}</span>
          </div>
          <p className="wallet-purpose">Funded via JazzCash, EasyPaisa, Bank Transfer. Used for subscription tiers.</p>
        </div>

        <div className="wallet-card featured">
          <div className="wallet-header">
            <span className="wallet-tag highlight-tag">Earning Wallet (Withdrawable)</span>
            <div className="wallet-icon-box earning-icon"><TrendingUp size={16} /></div>
          </div>
          <div className="wallet-balance-row">
            <span className="currency-prefix">₨</span>
            <span className="wallet-amount">{fmt(wallets?.earning_balance)}</span>
          </div>
          <p className="wallet-purpose">Earnings from watched ads. <strong>Only wallet eligible for withdrawals!</strong></p>
        </div>

        <div className="wallet-card">
          <div className="wallet-header">
            <span className="wallet-tag">Referral Wallet</span>
            <div className="wallet-icon-box referral-icon"><Users size={16} /></div>
          </div>
          <div className="wallet-balance-row">
            <span className="currency-prefix">₨</span>
            <span className="wallet-amount">{fmt(wallets?.referral_balance)}</span>
          </div>
          <p className="wallet-purpose">Affiliate rewards earned from network invitations and signups.</p>
        </div>

        <div className="wallet-card">
          <div className="wallet-header">
            <span className="wallet-tag">Rewards Wallet</span>
            <div className="wallet-icon-box rewards-icon"><Sparkles size={16} /></div>
          </div>
          <div className="wallet-balance-row">
            <span className="currency-prefix">₨</span>
            <span className="wallet-amount">{fmt(wallets?.rewards_balance)}</span>
          </div>
          <p className="wallet-purpose">Promotions, daily streak rewards, and loyalty bonus distributions.</p>
        </div>
      </div>

      {/* Unified Transaction History Panel */}
      <div className="content-panel">
        <div className="ads-filter-bar">
          <div className="filter-tabs-group">
            {['All', 'Deposit', 'Earning', 'Withdrawal', 'Referral', 'Rewards'].map((type) => (
              <button
                key={type}
                className={`filter-tab-btn ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type} Transactions
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
            <input 
              type="text"
              placeholder="Search TxID or Description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', height: '38px', fontSize: '0.82rem' }}
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Transaction ID</th>
                <th>Category</th>
                <th>Target Wallet</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id || tx.tx_id}>
                    <td style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                      {new Date(tx.created_at || Date.now()).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <span className="code-badge">{tx.tx_id}</span>
                    </td>
                    <td>
                      <span className={`tx-type-badge badge-${tx.type}`}>{tx.type}</span>
                    </td>
                    <td style={{ color: '#E5E7EB', fontWeight: 600 }}>{tx.target_wallet}</td>
                    <td style={{ color: '#D1D5DB' }}>{tx.description}</td>
                    <td>
                      <span className={tx.amount >= 0 ? 'amount-pos' : 'amount-neg'}>
                        {tx.amount >= 0 ? `+₨ ${fmt(tx.amount)}` : `-₨ ${fmt(Math.abs(tx.amount))}`}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 600 }}>
                        ● {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#6B7280' }}>
                    No transactions found for filter "{filterType}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import WatchAds from './components/WatchAds';
import SubscriptionPlans from './components/SubscriptionPlans';
import WalletLedger from './components/WalletLedger';
import Referrals from './components/Referrals';
import Profile from './components/Profile';

import AdModal from './components/AdModal';
import DepositModal from './components/DepositModal';
import WithdrawModal from './components/WithdrawModal';
import PlanConfirmModal from './components/PlanConfirmModal';
import AuthModal from './components/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userId, setUserId] = useState(() => {
    return parseInt(localStorage.getItem('adpulse_user_id')) || 1;
  });

  const [user, setUser] = useState(null);
  const [wallets, setWallets] = useState({
    deposit_balance: 0,
    earning_balance: 0,
    referral_balance: 0,
    rewards_balance: 0,
    total_balance: 0
  });
  const [activePlan, setActivePlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [ads, setAds] = useState([]);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Modals state
  const [activeAd, setActiveAd] = useState(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch all user state
  const refreshAllData = async (targetUserId = userId) => {
    try {
      // 1. Profile
      const profRes = await fetch(`/api/auth/profile?userId=${targetUserId}`).then((r) => r.json());
      if (profRes.success) setUser(profRes.user);

      // 2. Wallets
      const wallRes = await fetch(`/api/wallets?userId=${targetUserId}`).then((r) => r.json());
      if (wallRes.success) setWallets(wallRes.wallets);

      // 3. Active Plan
      const planRes = await fetch(`/api/plans/active?userId=${targetUserId}`).then((r) => r.json());
      if (planRes.success) setActivePlan(planRes.activePlan);

      // 4. Stats
      const statRes = await fetch(`/api/stats/dashboard?userId=${targetUserId}`).then((r) => r.json());
      if (statRes.success) setStats(statRes.stats);

      // 5. Transactions
      const txRes = await fetch(`/api/wallets/transactions?userId=${targetUserId}`).then((r) => r.json());
      if (txRes.success) setTransactions(txRes.transactions);

      // 6. Users list for switching
      const uRes = await fetch('/api/auth/users').then((r) => r.json());
      if (uRes.success) setAllUsers(uRes.users);

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // Fetch static plans & ads catalog once
  useEffect(() => {
    fetch('/api/plans')
      .then((r) => r.json())
      .then((res) => { if (res.success) setPlans(res.plans); });

    fetch('/api/ads')
      .then((r) => r.json())
      .then((res) => { if (res.success) setAds(res.ads); });
  }, []);

  // Fetch dynamic user data when userId changes
  useEffect(() => {
    localStorage.setItem('adpulse_user_id', userId);
    refreshAllData(userId);
  }, [userId]);

  // Actions
  const handleDepositSubmit = async (data) => {
    const res = await fetch('/api/wallets/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data })
    }).then((r) => r.json());

    if (!res.success) throw new Error(res.message);
    showToast(res.message, 'success');
    refreshAllData();
  };

  const handleWithdrawSubmit = async (data) => {
    const res = await fetch('/api/wallets/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data })
    }).then((r) => r.json());

    if (!res.success) throw new Error(res.message);
    showToast(res.message, 'success');
    refreshAllData();
  };

  const handleWatchAdComplete = async (payload) => {
    const res = await fetch('/api/ads/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...payload })
    }).then((r) => r.json());

    if (!res.success) throw new Error(res.message);
    setActiveAd(null);
    showToast(res.message, 'success');
    refreshAllData();
  };

  const handleConfirmPlanPurchase = async (planSlug) => {
    const res = await fetch('/api/plans/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, planSlug })
    }).then((r) => r.json());

    if (!res.success) throw new Error(res.message);
    showToast(res.message, 'success');
    refreshAllData();
  };

  const handleRegister = async (data) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then((r) => r.json());

    if (!res.success) throw new Error(res.message);
    showToast(`Welcome ${res.user.full_name}! Unique Referral Code assigned: ${res.user.referral_code}`, 'success');
    setUserId(res.user.id);
  };

  const handleUpdateProfile = async (data) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data })
    }).then((r) => r.json());

    if (!res.success) throw new Error(res.message);
    showToast(res.message, 'success');
    refreshAllData();
  };

  const handleResetDaily = async () => {
    const res = await fetch('/api/ads/reset-daily', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    }).then((r) => r.json());

    if (res.success) {
      showToast('Daily ad limits have been reset to 0! You can watch more ads.', 'success');
      refreshAllData();
    }
  };

  const handleSimulateReferral = async () => {
    const names = ['Hamza Malik', 'Zainab Bibi', 'Ali Raza', 'Usman Qureshi', 'Sara Tariq'];
    const randomName = names[Math.floor(Math.random() * names.length)] + ' ' + Math.floor(Math.random() * 99);
    const randomEmail = randomName.toLowerCase().replace(/\s+/g, '.') + '@example.com';

    await handleRegister({
      full_name: randomName,
      email: randomEmail,
      mobile: '+92 312 9876543',
      country: 'Pakistan',
      referral_code: user?.referral_code
    });
    showToast(`Simulated new referral from ${randomName}! Commission credited to your Referral Wallet.`, 'success');
  };

  return (
    <div className="app-layout">
      {/* Background Glow Elements */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      {/* Floating Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type === 'success' ? '✓' : '⚠'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        activePlan={activePlan}
        onOpenDeposit={() => setDepositOpen(true)}
        onOpenWithdraw={() => setWithdrawOpen(true)}
        onResetDemo={handleResetDaily}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Canvas Area */}
      <div className="main-wrapper">
        <Header 
          activeTab={activeTab}
          user={user}
          wallets={wallets}
          onStartWatch={() => setActiveTab('watch-ads')}
          onOpenAuth={() => setAuthOpen(true)}
          setActiveTab={setActiveTab}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="content-canvas">
          {activeTab === 'dashboard' && (
            <Dashboard 
              user={user}
              wallets={wallets}
              activePlan={activePlan}
              stats={stats}
              transactions={transactions}
              ads={ads}
              onStartWatch={() => setActiveTab('watch-ads')}
              onOpenDeposit={() => setDepositOpen(true)}
              onOpenWithdraw={() => setWithdrawOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'watch-ads' && (
            <WatchAds 
              ads={ads}
              activePlan={activePlan}
              onWatchAd={(ad) => setActiveAd(ad)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'plans' && (
            <SubscriptionPlans 
              plans={plans}
              activePlan={activePlan}
              wallets={wallets}
              onSelectPlan={(p) => setSelectedPlanForPurchase(p)}
              onOpenDeposit={() => setDepositOpen(true)}
            />
          )}

          {activeTab === 'wallets' && (
            <WalletLedger 
              wallets={wallets}
              transactions={transactions}
              onOpenDeposit={() => setDepositOpen(true)}
              onOpenWithdraw={() => setWithdrawOpen(true)}
            />
          )}

          {activeTab === 'referrals' && (
            <Referrals 
              user={user}
              wallets={wallets}
              stats={stats}
              onSimulateReferral={handleSimulateReferral}
              showToast={showToast}
            />
          )}

          {activeTab === 'profile' && (
            <Profile 
              user={user}
              activePlan={activePlan}
              onUpdateProfile={handleUpdateProfile}
              onSignOut={() => setAuthOpen(true)}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {activeAd && (
        <AdModal 
          ad={activeAd}
          activePlan={activePlan}
          onClose={() => setActiveAd(null)}
          onComplete={handleWatchAdComplete}
          showToast={showToast}
        />
      )}

      {depositOpen && (
        <DepositModal 
          onClose={() => setDepositOpen(false)}
          onDepositSubmit={handleDepositSubmit}
          showToast={showToast}
        />
      )}

      {withdrawOpen && (
        <WithdrawModal 
          wallets={wallets}
          onClose={() => setWithdrawOpen(false)}
          onWithdrawSubmit={handleWithdrawSubmit}
          showToast={showToast}
        />
      )}

      {selectedPlanForPurchase && (
        <PlanConfirmModal 
          plan={selectedPlanForPurchase}
          wallets={wallets}
          onClose={() => setSelectedPlanForPurchase(null)}
          onConfirmPurchase={handleConfirmPlanPurchase}
          onOpenDeposit={() => {
            setSelectedPlanForPurchase(null);
            setDepositOpen(true);
          }}
        />
      )}

      {authOpen && (
        <AuthModal 
          allUsers={allUsers}
          onClose={() => setAuthOpen(false)}
          onRegister={handleRegister}
          onSwitchUser={(id) => setUserId(id)}
          showToast={showToast}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Layout Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import WatchAds from './components/WatchAds';
import SubscriptionPlans from './components/SubscriptionPlans';
import WalletLedger from './components/WalletLedger';
import Referrals from './components/Referrals';
import Profile from './components/Profile';

// Modals
import AdModal from './components/AdModal';
import DepositModal from './components/DepositModal';
import WithdrawModal from './components/WithdrawModal';
import PlanConfirmModal from './components/PlanConfirmModal';

// API
import {
  apiGetProfile,
  apiGetWallets,
  apiGetActivePlan,
  apiGetDashboardStats,
  apiGetTransactions,
  apiGetPlans,
  apiGetAds,
  apiDeposit,
  apiWithdraw,
  apiCompleteAd,
  apiPurchasePlan,
  apiUpdateProfile,
  apiResetDaily,
  apiClaimStreak,
} from './api';

// ── Auth helpers ──────────────────────────────────────────────────────────────
function getStoredUser() {
  try {
    const raw = localStorage.getItem('adpulse_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function storeUser(user, token) {
  if (user) {
    localStorage.setItem('adpulse_user', JSON.stringify(user));
    if (token) localStorage.setItem('adpulse_token', token);
  } else {
    localStorage.removeItem('adpulse_user');
    localStorage.removeItem('adpulse_token');
  }
}

// ── Protected Route Wrapper ────────────────────────────────────────────────────
function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

// ── Main Dashboard Layout ─────────────────────────────────────────────────────
function DashboardLayout({
  user, isLoggedIn, wallets, activePlan, plans, ads, stats, transactions,
  activeTab, setActiveTab, isMobileOpen, setIsMobileOpen,
  onOpenDeposit, onOpenWithdraw, onSelectPlan, onWatchAd,
  handleUpdateProfile, handleLogout, handleResetDaily, handleClaimStreak,
  showToast,
}) {
  return (
    <div className="app-layout">
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isLoggedIn={isLoggedIn}
        activePlan={activePlan}
        onOpenDeposit={onOpenDeposit}
        onOpenWithdraw={onOpenWithdraw}
        onResetDemo={handleResetDaily}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="main-wrapper">
        <Header
          activeTab={activeTab}
          user={user}
          isLoggedIn={isLoggedIn}
          wallets={wallets}
          onStartWatch={() => setActiveTab('watch-ads')}
          onLogout={handleLogout}
          setActiveTab={setActiveTab}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="content-canvas">
          {activeTab === 'dashboard' && (
            <Dashboard
              user={user}
              isLoggedIn={isLoggedIn}
              wallets={wallets}
              activePlan={activePlan}
              stats={stats}
              transactions={transactions}
              ads={ads}
              onStartWatch={() => setActiveTab('watch-ads')}
              onOpenDeposit={onOpenDeposit}
              onOpenWithdraw={onOpenWithdraw}
              onClaimStreak={handleClaimStreak}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'watch-ads' && (
            <WatchAds
              ads={ads}
              activePlan={activePlan}
              onWatchAd={onWatchAd}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'plans' && (
            <SubscriptionPlans
              plans={plans}
              activePlan={activePlan}
              wallets={wallets}
              onSelectPlan={onSelectPlan}
              onOpenDeposit={onOpenDeposit}
            />
          )}
          {activeTab === 'wallets' && (
            <WalletLedger
              wallets={wallets}
              transactions={transactions}
              onOpenDeposit={onOpenDeposit}
              onOpenWithdraw={onOpenWithdraw}
            />
          )}
          {activeTab === 'referrals' && (
            <Referrals
              user={user}
              wallets={wallets}
              stats={stats}
              showToast={showToast}
            />
          )}
          {activeTab === 'profile' && (
            <Profile
              user={user}
              activePlan={activePlan}
              onUpdateProfile={handleUpdateProfile}
              onSignOut={handleLogout}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();

  // Auth state
  const [user, setUser] = useState(getStoredUser);
  const isLoggedIn = !!user;

  // App state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [wallets, setWallets] = useState({
    deposit_balance: 0, earning_balance: 0,
    referral_balance: 0, rewards_balance: 0, total_balance: 0,
  });
  const [activePlan, setActivePlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [ads, setAds] = useState([]);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Modal state
  const [activeAd, setActiveAd] = useState(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  // Refresh user data
  const refreshAllData = useCallback(async (uid) => {
    if (!uid) return;
    try {
      const [profRes, wallRes, planRes, statRes, txRes] = await Promise.all([
        apiGetProfile(uid),
        apiGetWallets(uid),
        apiGetActivePlan(uid),
        apiGetDashboardStats(uid),
        apiGetTransactions(uid),
      ]);
      if (profRes.success) {
        setUser(profRes.user);
        storeUser(profRes.user);
      }
      if (wallRes.success) setWallets(wallRes.wallets);
      if (planRes.success) setActivePlan(planRes.activePlan);
      if (statRes.success) setStats(statRes.stats);
      if (txRes.success) setTransactions(txRes.transactions);
    } catch (err) {
      console.error('Refresh error:', err);
    }
  }, []);

  // Fetch catalog once
  useEffect(() => {
    apiGetPlans().then((r) => { if (r.success) setPlans(r.plans); });
    apiGetAds().then((r) => { if (r.success) setAds(r.ads); });
  }, []);

  // Refresh on login
  useEffect(() => {
    if (isLoggedIn && user?.id) refreshAllData(user.id);
  }, [isLoggedIn, user?.id]);

  // ── Auth handlers ──────────────────────────────────────────────────────────
  const handleLogin = (userData, token) => {
    storeUser(userData, token);
    setUser(userData);
  };

  const handleLogout = () => {
    storeUser(null, null);
    setUser(null);
    setWallets({ deposit_balance: 0, earning_balance: 0, referral_balance: 0, rewards_balance: 0, total_balance: 0 });
    setActivePlan(null);
    setStats(null);
    setTransactions([]);
    setActiveTab('dashboard');
    showToast('Signed out successfully.', 'success');
    navigate('/login');
  };

  // ── Action handlers ────────────────────────────────────────────────────────
  const handleDepositSubmit = async (data) => {
    const res = await apiDeposit({ userId: user.id, ...data });
    if (!res.success) throw new Error(res.message);
    showToast(res.message, 'success');
    refreshAllData(user.id);
  };

  const handleWithdrawSubmit = async (data) => {
    const res = await apiWithdraw({ userId: user.id, ...data });
    if (!res.success) throw new Error(res.message);
    showToast(res.message, 'success');
    refreshAllData(user.id);
  };

  const handleWatchAdComplete = async (payload) => {
    const res = await apiCompleteAd({ userId: user.id, ...payload });
    if (!res.success) throw new Error(res.message);
    setActiveAd(null);
    showToast(res.message, 'success');
    refreshAllData(user.id);
  };

  const handleConfirmPlanPurchase = async (planSlug) => {
    const res = await apiPurchasePlan(user.id, planSlug);
    if (!res.success) throw new Error(res.message);
    showToast(res.message, 'success');
    refreshAllData(user.id);
  };

  const handleUpdateProfile = async (data) => {
    const res = await apiUpdateProfile({ userId: user.id, ...data });
    if (!res.success) throw new Error(res.message);
    showToast(res.message, 'success');
    refreshAllData(user.id);
  };

  const handleResetDaily = async () => {
    const res = await apiResetDaily(user.id);
    if (res.success) {
      showToast('Daily ad limits reset!', 'success');
      refreshAllData(user.id);
    }
  };

  const handleClaimStreak = async () => {
    try {
      const res = await apiClaimStreak(user.id);
      if (!res.success) {
        showToast(res.message, 'warning');
        return;
      }
      showToast(res.message, 'success');
      refreshAllData(user.id);
    } catch (err) {
      showToast(err.message || 'Streak claim failed.', 'warning');
    }
  };

  const sharedLayoutProps = {
    user, isLoggedIn, wallets, activePlan, plans, ads, stats, transactions,
    activeTab, setActiveTab, isMobileOpen, setIsMobileOpen,
    onOpenDeposit: () => setDepositOpen(true),
    onOpenWithdraw: () => setWithdrawOpen(true),
    onSelectPlan: (p) => setSelectedPlan(p),
    onWatchAd: (ad) => setActiveAd(ad),
    handleUpdateProfile,
    handleLogout,
    handleResetDaily,
    handleClaimStreak,
    showToast,
  };

  return (
    <>
      {/* Global Toast Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type === 'success' ? '✓' : '⚠'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <RegisterPage onLogin={handleLogin} />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <DashboardLayout {...sharedLayoutProps} />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />}
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />}
        />
      </Routes>

      {/* Global Modals (available across dashboard) */}
      {activeAd && (
        <AdModal
          ad={activeAd}
          activePlan={activePlan}
          user={user}
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
      {selectedPlan && (
        <PlanConfirmModal
          plan={selectedPlan}
          wallets={wallets}
          onClose={() => setSelectedPlan(null)}
          onConfirmPurchase={handleConfirmPlanPurchase}
          onOpenDeposit={() => { setSelectedPlan(null); setDepositOpen(true); }}
        />
      )}
    </>
  );
}

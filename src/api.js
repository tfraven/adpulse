// Dynamic API configuration: automatically detects local dev vs production
const BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : 'https://adpulse-server.vercel.app/api'
);

async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    return await response.json();
  } catch (error) {
    console.error(`API Fetch Error [${path}]:`, error);
    return {
      success: false,
      message: 'Network error or server unreachable. Please check your internet connection.'
    };
  }
}

// Auth
export const apiRegister = (data) =>
  apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) });

export const apiLogin = (email) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email }) });

export const apiGetProfile = (userId) =>
  apiFetch(`/auth/profile?userId=${userId}`);

export const apiUpdateProfile = (data) =>
  apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(data) });

// Wallets
export const apiGetWallets = (userId) =>
  apiFetch(`/wallets?userId=${userId}`);

export const apiDeposit = (data) =>
  apiFetch('/wallets/deposit', { method: 'POST', body: JSON.stringify(data) });

export const apiWithdraw = (data) =>
  apiFetch('/wallets/withdraw', { method: 'POST', body: JSON.stringify(data) });

export const apiClaimStreak = (userId) =>
  apiFetch('/wallets/claim-streak', { method: 'POST', body: JSON.stringify({ userId }) });

export const apiGetTransactions = (userId, type = 'All') =>
  apiFetch(`/wallets/transactions?userId=${userId}&type=${type}`);

// Plans
export const apiGetPlans = () => apiFetch('/plans');

export const apiGetActivePlan = (userId) =>
  apiFetch(`/plans/active?userId=${userId}`);

export const apiPurchasePlan = (userId, planSlug) =>
  apiFetch('/plans/purchase', { method: 'POST', body: JSON.stringify({ userId, planSlug }) });

// Ads
export const apiGetAds = () => apiFetch('/ads');

export const apiStartAd = (data) =>
  apiFetch('/ads/start', { method: 'POST', body: JSON.stringify(data) });

export const apiCompleteAd = (data) =>
  apiFetch('/ads/complete', { method: 'POST', body: JSON.stringify(data) });

export const apiResetDaily = (userId) =>
  apiFetch('/ads/reset-daily', { method: 'POST', body: JSON.stringify({ userId }) });

// Stats
export const apiGetDashboardStats = (userId) =>
  apiFetch(`/stats/dashboard?userId=${userId}`);

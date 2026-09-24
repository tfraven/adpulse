import React, { useState, useEffect } from 'react';
import { X, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdModal({ 
  ad, 
  activePlan, 
  onClose, 
  onComplete, 
  showToast 
}) {
  const [secondsLeft, setSecondsLeft] = useState(ad.duration_seconds || 10);
  const [isCompletedWatching, setIsCompletedWatching] = useState(false);
  const [num1, setNum1] = useState(Math.floor(Math.random() * 9) + 1);
  const [num2, setNum2] = useState(Math.floor(Math.random() * 9) + 1);
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const totalDuration = ad.duration_seconds || 10;
  const progressPercent = Math.min(100, Math.round(((totalDuration - secondsLeft) / totalDuration) * 100));
  const earningPerAd = activePlan ? Number(activePlan.earning_per_ad) : 0;

  // Countdown timer effect
  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsCompletedWatching(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!userAnswer || isNaN(userAnswer)) {
      setErrorMsg('Please enter a valid numeric answer.');
      return;
    }

    const expected = num1 + num2;
    if (parseInt(userAnswer) !== expected) {
      setErrorMsg(`Incorrect answer (${userAnswer}). What is ${num1} + ${num2}?`);
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);

    try {
      await onComplete({
        adId: ad.id,
        watchedSeconds: totalDuration,
        mathAnswer: parseInt(userAnswer),
        expectedAnswer: expected
      });
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed');
      setIsVerifying(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: ad.is_google_ad ? '#4285F4' : '#10B981' }}></span>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>{ad.sponsor}</span>
            <span className="brand-badge" style={{
              background: ad.is_google_ad ? 'rgba(66, 133, 244, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: ad.is_google_ad ? '#4285F4' : '#10B981',
              borderColor: ad.is_google_ad ? 'rgba(66, 133, 244, 0.3)' : 'rgba(16, 185, 129, 0.3)'
            }}>
              {ad.is_google_ad ? 'GOOGLE ADS CAMPAIGN' : 'SPONSORED CAMPAIGN'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.06)',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: secondsLeft > 0 ? '#F59E0B' : '#10B981'
            }}>
              <Clock size={13} />
              <span>{secondsLeft > 0 ? `${secondsLeft}s Remaining` : 'Completed!'}</span>
            </div>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Watch Progress Linear Bar */}
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)' }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #10B981, #3B82F6)',
            transition: 'width 1s linear'
          }}></div>
        </div>

        {/* Ad Video / Creative Frame */}
        <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
          <img 
            src={ad.banner_url} 
            alt={ad.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '20px'
          }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
              {ad.title}
            </h3>
            <p style={{ color: '#D1D5DB', fontSize: '0.85rem', lineHeight: 1.4 }}>
              {ad.tagline}
            </p>
          </div>
        </div>

        {/* Anti-Bot Math Challenge */}
        {isCompletedWatching ? (
          <div style={{
            padding: '24px',
            background: 'rgba(16, 185, 129, 0.05)',
            borderTop: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '0.88rem', marginBottom: '8px' }}>
              <ShieldCheck size={18} />
              <span>Anti-Bot Reward Verification</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '16px' }}>
              To ensure authentic engagement and disburse earnings, solve this quick math puzzle:
            </p>

            <form onSubmit={handleVerify} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{
                background: '#1F2937',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#fff',
                fontFamily: 'monospace'
              }}>
                {num1} + {num2} = ?
              </div>

              <input 
                type="number"
                placeholder="Enter Answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                autoFocus
                className="form-input"
                style={{ width: '140px' }}
                required
              />

              <button 
                type="submit" 
                className="primary-gradient-btn"
                disabled={isVerifying}
                style={{ flex: 1 }}
              >
                <span>{isVerifying ? 'Verifying...' : 'Disburse Reward'}</span>
              </button>
            </form>

            {errorMsg && (
              <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            padding: '16px 24px',
            background: 'rgba(255,255,255,0.02)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>
              Watch progress: <strong>{progressPercent}%</strong>. Please do not close this window.
            </div>
            <div style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 700 }}>
              Reward: +₨ {earningPerAd.toFixed(2)} → Earning Wallet
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

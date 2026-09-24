import React, { useEffect, useState } from 'react';
import { ExternalLink, Info } from 'lucide-react';

export default function GoogleAdBanner({ 
  slot = '1948201948', 
  client = 'ca-pub-4715061326676029', 
  format = 'auto',
  type = 'leaderboard', // 'leaderboard', 'rectangle', 'rewarded'
  title = 'Google AdSense Partner Network',
  sponsor = 'Google Ads',
  creative = null
}) {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    try {
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        window.adsbygoogle.push({});
        setAdLoaded(true);
      }
    } catch (e) {
      console.log('Google Adsense preview mode enabled');
    }
  }, []);

  if (type === 'leaderboard') {
    return (
      <div className="google-ad-leaderboard-container" style={{
        background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '12px 20px',
        margin: '20px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Real Google AdSense Script Tag if loaded in production */}
        <ins className="adsbygoogle"
          style={{ display: 'none' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"></ins>

        {/* Dynamic High-Yield Google Ad Creative */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #4285F4, #34A853)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.2rem',
            boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)'
          }}>
            G
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#3B82F6', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                GOOGLE AD
              </span>
              <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Sponsored by Google Marketing Platform</span>
            </div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginTop: '2px' }}>
              {creative?.title || 'Google Cloud AI & Web3 Compute Infrastructure'}
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '0.78rem' }}>
              {creative?.tagline || 'Deploy scalable Node.js microservices with $300 in free Google Cloud credits.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a 
            href={creative?.url || 'https://cloud.google.com'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="primary-gradient-btn"
            style={{
              fontSize: '0.78rem',
              padding: '8px 14px',
              background: 'linear-gradient(135deg, #4285F4, #1A73E8)',
              boxShadow: '0 4px 14px rgba(66, 133, 244, 0.35)'
            }}
          >
            <span>Learn More</span>
            <ExternalLink size={13} />
          </a>
          <span style={{
            fontSize: '0.65rem',
            color: '#6B7280',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <Info size={11} /> Ads by Google
          </span>
        </div>
      </div>
    );
  }

  // Medium Rectangle format (300x250)
  return (
    <div className="google-ad-rectangle" style={{
      background: 'rgba(17, 24, 39, 0.75)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4285F4' }}>
          GOOGLE DISPLAY NETWORK
        </span>
        <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>Ads by Google</span>
      </div>
      <img 
        src={creative?.bannerUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'} 
        alt="Google Ad" 
        style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} 
      />
      <div>
        <h5 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>
          {creative?.title || 'Google Workspace for High Growth Startups'}
        </h5>
        <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: '4px' }}>
          {creative?.tagline || 'Custom business emails, secure cloud drive storage, and meet integrations.'}
        </p>
      </div>
    </div>
  );
}

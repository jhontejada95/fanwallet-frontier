import React, { useEffect } from 'react';
import { useApp } from '../../lib/appContext';
import { LogoMark } from '../LogoMark';

export default function Splash() {
  const { setFanScreen } = useApp();

  useEffect(() => {
    const t = setTimeout(() => setFanScreen('onboarding'), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Pitch background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,166,81,0.06) 0%, transparent 60%), repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 80px)',
      }} />
      {/* Center circle */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '200%', aspectRatio: '1', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
      {/* Center glow */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,81,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div className="animate-bounce-in">
          <LogoMark size={72} />
        </div>
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 36, letterSpacing: '-0.04em', color: '#fff' }}>
            fanwallet<span style={{ color: '#00A651' }}>.</span>
          </div>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, color: '#00A651', letterSpacing: '0.32em', textTransform: 'uppercase' }}>
            FRONTIER · WC26
          </div>
        </div>
        <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: 8, padding: '0 32px' }}>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 22, lineHeight: 1.1, color: '#fff', letterSpacing: '-0.02em' }}>
            Pay like a local.<br />Earn like a <span style={{ color: '#FFD700' }}>champion.</span>
          </div>
        </div>
      </div>

      {/* Loading bar */}
      <div style={{ position: 'absolute', bottom: 56, width: 140, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
        <div className="animate-load-bar" style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #00A651, #FFD700)', width: '0%' }} />
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: 28, display: 'flex', alignItems: 'center', gap: 8, color: '#4b5563', fontSize: 11 }}>
        <span>Powered by</span>
        <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, color: '#6b7280' }}>SOLANA</span>
        <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#4b5563', display: 'inline-block' }} />
        <span>USDC</span>
      </div>
    </div>
  );
}

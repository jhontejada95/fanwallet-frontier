import React from 'react';
import { useApp } from '../lib/appContext';
import { LogoMark } from './LogoMark';
import { useIsDesktop } from '../hooks/useIsDesktop';

const S = {
  root: {
    minHeight: '100vh',
    background: '#0a0e1a',
    position: 'relative' as const,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '24px 22px 110px',
  },
  pitchCenter: {
    position: 'absolute' as const,
    left: '50%',
    top: '52%',
    transform: 'translate(-50%,-50%)',
    width: '180%',
    aspectRatio: '1',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '50%',
    pointerEvents: 'none' as const,
  },
  pitchLine: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    top: '52%',
    height: 1,
    background: 'rgba(255,255,255,0.06)',
    pointerEvents: 'none' as const,
  },
  pitchBg: {
    position: 'absolute' as const,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,166,81,0.06) 0%, transparent 60%), repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 80px)',
    pointerEvents: 'none' as const,
  },
  glowTop: {
    position: 'absolute' as const,
    inset: 0,
    background:
      'radial-gradient(60% 40% at 50% 15%, rgba(0,166,81,0.18) 0%, transparent 70%), radial-gradient(50% 30% at 50% 95%, rgba(255,215,0,0.10) 0%, transparent 70%)',
    pointerEvents: 'none' as const,
  },
};

const FanCard = ({ onClick }: { onClick: () => void }) => (
  <div onClick={onClick} style={{
    background: 'linear-gradient(135deg, #00A651 0%, #007a3c 100%)',
    borderRadius: 22, padding: '28px 26px', position: 'relative', overflow: 'hidden',
    boxShadow: '0 18px 50px -16px rgba(0,166,81,0.7)', cursor: 'pointer', flex: 1,
  }}>
    <div style={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', right: 20, top: 20 }}>
      <svg viewBox="0 0 24 24" width={64} height={64} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <polygon points="12,7 16,10 14.5,15 9.5,15 8,10"/>
        <path d="M12 3v4M3 12l5-2M21 12l-5-2M5.5 18.5l4-3.5M18.5 18.5l-4-3.5"/>
      </svg>
    </div>
    <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, opacity: 0.85, marginBottom: 8, color: '#fff' }}>FOR TRAVELERS</div>
    <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 38, lineHeight: 0.95, color: '#fff' }}>I'm a Fan</div>
    <div style={{ marginTop: 10, fontSize: 14, opacity: 0.92, maxWidth: 220, color: '#fff', lineHeight: 1.5 }}>
      Pay merchants, send to friends, earn GoalPoints at every match.
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 22, fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 14, color: '#fff' }}>
      Get Started
      <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
    </div>
  </div>
);

const BizCard = ({ onClick }: { onClick: () => void }) => (
  <div onClick={onClick} style={{
    background: 'linear-gradient(135deg, #FFD700 0%, #c99800 100%)',
    color: '#1a1300',
    borderRadius: 22, padding: '28px 26px', position: 'relative', overflow: 'hidden',
    boxShadow: '0 18px 50px -16px rgba(255,215,0,0.55)', cursor: 'pointer', flex: 1,
  }}>
    <div style={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(0,0,0,0.08)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', right: 20, top: 20 }}>
      <svg viewBox="0 0 24 24" width={64} height={64} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7a2 2 0 012-2h12a2 2 0 012 2v2H5a2 2 0 00-2 2V7z"/>
        <path d="M3 9h17a1 1 0 011 1v9a1 1 0 01-1 1H5a2 2 0 01-2-2V9z"/>
        <circle cx="17" cy="14.5" r="1.4"/>
      </svg>
    </div>
    <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, opacity: 0.7, marginBottom: 8 }}>FOR MERCHANTS</div>
    <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 38, lineHeight: 0.95 }}>I'm a Business</div>
    <div style={{ marginTop: 10, fontSize: 14, opacity: 0.85, maxWidth: 240, lineHeight: 1.5 }}>
      Accept USDC, settle instantly, reach 5M+ visiting fans.
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 22, fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 14 }}>
      Get Started
      <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
    </div>
  </div>
);

export default function RolePicker() {
  const { setRole, setFanScreen, setBizScreen } = useApp();
  const isDesktop = useIsDesktop();

  const enterFan = () => { setRole('fan'); setFanScreen('splash'); };
  const enterBiz = () => { setRole('business'); setBizScreen('dashboard'); };

  /* ── Desktop layout ─────────────────────────────────────────────────────── */
  if (isDesktop) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e1a', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={S.pitchBg} />
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '140%', aspectRatio: '1', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={S.glowTop} />

        <div style={{ position: 'relative', width: '100%', maxWidth: 1100, padding: '0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          {/* Logo + headline */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 56 }}>
            <LogoMark size={64} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 42, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>
                fanwallet<span style={{ color: '#00A651' }}>.</span>
              </div>
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, color: '#00A651', letterSpacing: '0.32em', textTransform: 'uppercase' as const, marginTop: 6 }}>
                FRONTIER · WC26
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff' }}>
                Pay like a local. Earn like a <span style={{ color: '#FFD700' }}>champion.</span>
              </div>
              <div style={{ color: '#B6BECB', marginTop: 12, fontSize: 16 }}>Choose how you're joining the tournament</div>
            </div>
          </div>

          {/* Side-by-side cards */}
          <div style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 900 }}>
            <FanCard onClick={enterFan} />
            <BizCard onClick={enterBiz} />
          </div>

          {/* Footer */}
          <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 8, color: '#6b7280', fontSize: 12 }}>
            <span>Powered by</span>
            <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, color: '#B6BECB', fontSize: 13 }}>SOLANA</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
            <span>USDC</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
            <span>World ID</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Mobile layout ──────────────────────────────────────────────────────── */
  return (
    <div style={S.root}>
      <div style={S.pitchBg} />
      <div style={S.pitchCenter} />
      <div style={S.pitchLine} />
      <div style={S.glowTop} />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 6 }}>
        <LogoMark size={56} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 30, letterSpacing: '-0.04em', color: '#fff' }}>
            fanwallet<span style={{ color: '#00A651' }}>.</span>
          </div>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 9, color: '#00A651', letterSpacing: '0.32em', textTransform: 'uppercase' as const }}>
            FRONTIER · WC26
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', textAlign: 'center', marginTop: 36, padding: '0 8px' }}>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 28, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#fff' }}>
          Pay like a local.<br />Earn like a{' '}
          <span style={{ color: '#FFD700' }}>champion.</span>
        </div>
        <div style={{ color: '#B6BECB', marginTop: 14, fontSize: 14, lineHeight: 1.4 }}>
          How are you joining the tournament?
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28 }}>
        <FanCard onClick={enterFan} />
        <BizCard onClick={enterBiz} />
      </div>

      <div style={{ position: 'relative', marginTop: 'auto', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#6b7280', fontSize: 11 }}>
        <span>Powered by</span>
        <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, color: '#B6BECB', fontSize: 12 }}>SOLANA</span>
        <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
        <span>USDC</span>
        <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
        <span>World ID</span>
      </div>
    </div>
  );
}

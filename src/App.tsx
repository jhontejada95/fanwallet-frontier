import React from 'react';
import { AppProvider, useApp } from './lib/appContext';
import RolePicker from './components/RolePicker';
import FanApp from './components/fan/FanApp';
import BizApp from './components/business/BizApp';
import { LogoMark } from './components/LogoMark';

function AppInner() {
  const { role } = useApp();
  if (role === 'picker') return <RolePicker />;
  if (role === 'fan') return <FanApp />;
  if (role === 'business') return <BizApp />;
  return null;
}

function DesktopPanel() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 64px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Radial glow */}
      <div style={{ position: 'absolute', left: '40%', top: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,81,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Logo + wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
        <LogoMark size={56} />
        <div>
          <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 28, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>fanwallet.</div>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00A651', marginTop: 4 }}>FRONTIER · WC26</div>
        </div>
      </div>

      {/* Headline */}
      <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 42, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 16 }}>
        Pay like a local.<br />
        <span style={{ color: '#00A651' }}>Earn like a</span>{' '}
        <span style={{ color: '#FFD700' }}>champion.</span>
      </div>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, color: '#6b7280', marginBottom: 48, maxWidth: 420, lineHeight: 1.6 }}>
        The crypto wallet built for FIFA World Cup 2026 fans. Pay with USDC, earn GoalPoints at every match, verify your humanity with World ID.
      </div>

      {/* Feature pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
        {[
          { icon: '⚡', label: 'Instant USDC payments', sub: 'Settle in under 1 second on Solana' },
          { icon: '⭐', label: 'GoalPoints rewards', sub: 'Earn & redeem at 342 partner merchants' },
          { icon: '🌍', label: 'World ID verified', sub: '2× points multiplier for verified humans' },
          { icon: '⚽', label: 'Built for WC26', sub: 'USA · Canada · Mexico host cities' },
        ].map(f => (
          <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#131826', border: '1px solid rgba(255,255,255,0.06)', display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>{f.icon}</div>
            <div>
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 13, color: '#fff' }}>{f.label}</div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#6b7280' }}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tech badges */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['Solana', 'USDC', 'Anchor', 'World ID', 'PWA'].map(t => (
          <div key={t} style={{ padding: '6px 12px', borderRadius: 999, background: '#131826', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 11, color: '#B6BECB', letterSpacing: '0.05em' }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      {/* ── Desktop layout (md+): left branding panel + right app panel ── */}
      <div
        className="hidden md:flex min-h-screen"
        style={{ background: '#070a12' }}
      >
        {/* Pitch lines on the left panel */}
        <div className="pitch-lines" style={{ position: 'fixed', inset: 0, opacity: 0.6, pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', width: '100%' }}>
          <DesktopPanel />
          {/* Divider */}
          <div style={{ width: 1, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
          {/* App shell — fixed phone width */}
          <div style={{ width: 430, flexShrink: 0, minHeight: '100vh', background: '#0a0e1a', position: 'relative', overflowY: 'auto' }}>
            <AppInner />
          </div>
        </div>
      </div>

      {/* ── Mobile layout (< md): full screen ── */}
      <div className="md:hidden min-h-screen" style={{ background: '#0a0e1a' }}>
        <AppInner />
      </div>
    </AppProvider>
  );
}

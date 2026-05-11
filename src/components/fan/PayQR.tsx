import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';
import { LogoMark } from '../LogoMark';

function QRDisplay({ data }: { data: string }) {
  const pattern = React.useMemo(() => {
    let seed = 0;
    for (let c = 0; c < data.length; c++) seed = (seed * 31 + data.charCodeAt(c)) >>> 0;
    return Array.from({ length: 49 }, (_, i) => {
      const isCorner = (i < 3) || (i > 5 && i < 7) ||
                       (i > 41 && i < 44) || (i === 48) ||
                       (i % 7 === 0 && i < 28) || (i % 7 === 6 && i < 14);
      if (isCorner) return true;
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return (seed >>> 16 & 1) === 1;
    });
  }, [data]);

  return (
    <div style={{ width: 200, height: 200, position: 'relative', padding: 8 }}>
      <div style={{ position: 'absolute', inset: 8, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {pattern.map((dark, i) => (
          <div key={i} style={{ borderRadius: 2, background: dark ? '#0a0e1a' : '#fff', minHeight: 4 }} />
        ))}
      </div>
      {/* Center logo cutout */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', borderRadius: 8, padding: 4 }}>
        <LogoMark size={32} />
      </div>
    </div>
  );
}

function CornerBracket({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const styles: Record<string, React.CSSProperties> = {
    tl: { top: 8, left: 8, borderTop: '2.5px solid #00A651', borderLeft: '2.5px solid #00A651', borderTopLeftRadius: 8 },
    tr: { top: 8, right: 8, borderTop: '2.5px solid #00A651', borderRight: '2.5px solid #00A651', borderTopRightRadius: 8 },
    bl: { bottom: 8, left: 8, borderBottom: '2.5px solid #00A651', borderLeft: '2.5px solid #00A651', borderBottomLeftRadius: 8 },
    br: { bottom: 8, right: 8, borderBottom: '2.5px solid #00A651', borderRight: '2.5px solid #00A651', borderBottomRightRadius: 8 },
  };
  return <div style={{ position: 'absolute', width: 22, height: 22, ...styles[pos] }} />;
}

export default function PayQR() {
  const { setFanScreen, balance, walletAddress: ctxAddr } = useApp();
  const [copied, setCopied] = useState(false);
  const walletAddress = ctxAddr || 'CFi91VLHPRFBYdKtNSJst56DTQ5jPQ6oxRvMjx9eYP3g';
  const displayBalance = balance > 0 ? balance : 124.50;
  const shortAddr = walletAddress.slice(0, 4) + '…' + walletAddress.slice(-4);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px 8px', position: 'relative', zIndex: 2 }}>
        <button onClick={() => setFanScreen('dashboard')} style={{ width: 36, height: 36, borderRadius: 12, background: '#131826', display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,0.06)', color: '#B6BECB', cursor: 'pointer' }}>
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 15, color: '#fff' }}>Receive payment</div>
        <button onClick={handleCopy} style={{ width: 36, height: 36, borderRadius: 12, background: '#131826', display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,0.06)', color: '#B6BECB', cursor: 'pointer' }}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v13M7 8l5-5 5 5"/><path d="M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5"/>
          </svg>
        </button>
      </div>

      {/* Green glow */}
      <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,81,0.32) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Balance pill */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8, position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#131826', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ color: '#00A651', fontSize: 14 }}>💰</span>
          <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, color: '#fff', fontSize: 14 }}>${displayBalance.toFixed(2)} USDC</span>
          <span style={{ color: '#6b7280', fontSize: 12 }}>available</span>
        </div>
      </div>

      {/* QR card */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, position: 'relative', zIndex: 2 }}>
        <div style={{ position: 'relative', background: '#fff', borderRadius: 26, padding: 18, boxShadow: '0 0 0 1px rgba(0,166,81,0.5), 0 30px 80px -20px rgba(0,166,81,0.6)' }}>
          <QRDisplay data={walletAddress} />
          <CornerBracket pos="tl" />
          <CornerBracket pos="tr" />
          <CornerBracket pos="bl" />
          <CornerBracket pos="br" />
        </div>
      </div>

      {/* Info */}
      <div style={{ textAlign: 'center', marginTop: 24, padding: '0 22px', position: 'relative', zIndex: 2 }}>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b7280' }}>YOUR WALLET</div>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, color: '#00A651', marginTop: 4 }}>Solana Pay · Devnet</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#fff' }}>{shortAddr}</span>
          <button onClick={handleCopy} style={{ fontSize: 11, color: '#00A651', fontFamily: 'Archivo, sans-serif', fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: 'rgba(0,166,81,0.1)', border: 'none', cursor: 'pointer' }}>
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Info cards */}
      <div style={{ padding: '20px 22px 0', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 2 }}>
        {[
          { emoji: '⚡', title: 'Instant Settlement', sub: 'Payments confirm in under 1 second on Solana' },
          { emoji: '⭐', title: 'Earn GoalPoints', sub: '1 point per $1 spent · Redeem for discounts' },
        ].map((info, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#131826', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: i === 0 ? 'rgba(0,166,81,0.15)' : 'rgba(255,215,0,0.12)', display: 'grid', placeItems: 'center', fontSize: 16 }}>{info.emoji}</div>
            <div>
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 13, color: '#fff' }}>{info.title}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{info.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 24, padding: '0 22px', zIndex: 2 }}>
        <button style={{ width: '100%', padding: '18px 22px', borderRadius: 999, background: '#00A651', color: '#001b0b', fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 16, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM18 18h3v3h-3z"/>
          </svg>
          Show to merchant
        </button>
        <div style={{ textAlign: 'center', marginTop: 10, color: '#6b7280', fontSize: 11 }}>
          Or share your address · earns <span style={{ color: '#FFD700', fontFamily: 'Archivo, sans-serif', fontWeight: 800 }}>GoalPoints</span>
        </div>
      </div>
    </div>
  );
}

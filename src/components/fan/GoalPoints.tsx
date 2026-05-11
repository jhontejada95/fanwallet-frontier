import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';
import { redeemPoints as redeemOnChain, explorerUrl } from '../../lib/solana';

const EARN_WAYS = [
  { emoji: '💳', title: 'Pay at a partner merchant', sub: '342 merchants across host cities', pts: '+10–50', color: '#00A651' },
  { emoji: '⚽', title: 'Predict match outcomes', sub: 'Daily streak up to 7×', pts: '+50', color: '#FFD700' },
  { emoji: '🏟️', title: 'Check in at a stadium', sub: 'Geofenced to host venues', pts: '+250', color: '#EF4444' },
  { emoji: '👥', title: 'Refer a fellow fan', sub: 'Both of you earn', pts: '+500', color: '#00A651' },
  { emoji: '🔥', title: 'Leave a verified review', sub: 'After any FanWallet payment', pts: '+50', color: '#FFD700' },
  { emoji: '🌍', title: 'World ID verification', sub: 'Verify humanity → 2× on all payments', pts: '2×', color: '#FFD700' },
];

const REDEEM_OPTIONS = [
  { title: 'Match Ticket Upgrade', pts: 5000, color: '#EF4444' },
  { title: 'Stadium F&B Voucher', pts: 750, color: '#00A651' },
  { title: 'WC26 Limited Scarf', pts: 1200, color: '#FFD700' },
  { title: '$10 USDC Cashback', pts: 1000, color: '#00A651' },
];

const HISTORY = [
  { emoji: '💳', label: 'Paid · Tacos El Azteca', pts: +12, date: 'Today 1:42 PM' },
  { emoji: '⚽', label: 'Predicted USA vs GER', pts: +50, date: 'Today 11:00 AM' },
  { emoji: '🏟️', label: 'Check-in · AT&T Stadium', pts: +250, date: 'Yesterday' },
  { emoji: '👥', label: 'Refer · Lukas P.', pts: +500, date: 'Mar 11' },
  { emoji: '🎁', label: 'Redeemed · Hotel voucher', pts: -100, date: 'Mar 10' },
];

export default function GoalPoints() {
  const {
    goalPoints, setGoalPoints, walletConnected, chainLoading,
    worldIdVerified, getProvider, refreshBalances,
  } = useApp();

  const [tab, setTab] = useState<'earn' | 'redeem' | 'history'>('earn');
  const [redeemAmt, setRedeemAmt] = useState<number | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const handleRedeem = async (pts: number) => {
    if (goalPoints < pts) return;
    setRedeemAmt(pts);
    setRedeeming(true);
    setTxError(null);
    try {
      if (walletConnected) {
        const provider = getProvider();
        if (!provider) throw new Error('No wallet');
        const sig = await redeemOnChain(provider, pts);
        setTxSig(sig);
        await refreshBalances();
      } else {
        await new Promise(r => setTimeout(r, 900));
        setGoalPoints(goalPoints - pts);
      }
      setRedeemed(true);
      setTimeout(() => { setRedeemed(false); setRedeemAmt(null); setTxSig(null); }, 4000);
    } catch (err: unknown) {
      setTxError((err instanceof Error ? err.message : 'Redemption failed').slice(0, 80));
      setRedeemAmt(null);
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px 8px' }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: '#131826', display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6"/>
          </svg>
        </div>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 15, color: '#fff' }}>GoalPoints</div>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: '#131826', display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,0.06)', color: '#B6BECB' }}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v13M7 8l5-5 5 5"/><path d="M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5"/>
          </svg>
        </div>
      </div>

      {/* Balance card */}
      <div style={{ margin: '8px 16px 0' }}>
        <div style={{ position: 'relative', background: '#131826', border: '1px solid rgba(255,215,0,0.25)', borderRadius: 24, padding: '24px 22px 22px', overflow: 'hidden', boxShadow: '0 20px 60px -20px rgba(255,215,0,0.4)' }}>
          <div style={{ position: 'absolute', right: -50, top: -50, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.16) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 18, top: 18, width: 40, height: 40, borderRadius: 12, background: 'rgba(255,215,0,0.12)', display: 'grid', placeItems: 'center', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}>
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 4h8v4a4 4 0 11-8 0V4z"/>
              <path d="M16 6h3v2a3 3 0 01-3 3M8 6H5v2a3 3 0 003 3"/>
              <path d="M9 13h6v2H9z"/><path d="M8 19h8M10 17v2M14 17v2"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FFD700', opacity: 0.85 }}>YOUR BALANCE</div>
          {chainLoading ? (
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #FFD700', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', marginTop: 8 }} />
          ) : (
            <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 72, color: '#FFD700', lineHeight: 0.9, marginTop: 6, letterSpacing: '-0.05em' }}>{goalPoints.toLocaleString()}</div>
          )}
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,215,0,0.7)', marginTop: 6 }}>
            POINTS · ≈ ${(goalPoints / 100).toFixed(2)} redeemable
          </div>

          {/* 2× multiplier banner */}
          {worldIdVerified && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '8px 12px', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', borderRadius: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#FFD700', color: '#1a1300', display: 'grid', placeItems: 'center' }}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L4 14h7l-2 8 10-13h-7l1-7z"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 12, color: '#FFD700' }}>2× Multiplier Active</div>
                <div style={{ fontSize: 10.5, color: '#d1c280' }}>World ID verified</div>
              </div>
            </div>
          )}

          {walletConnected && (
            <button onClick={refreshBalances} style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,215,0,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>↻ Refresh balance</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ margin: '18px 16px 0', display: 'flex', gap: 4, padding: 4, background: '#131826', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
        {(['earn', 'redeem', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '9px 0', textAlign: 'center', borderRadius: 11, background: tab === t ? '#FFD700' : 'transparent', color: tab === t ? '#1a1300' : '#B6BECB', fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 12, textTransform: 'capitalize', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: '14px 16px 100px', flex: 1, overflowY: 'auto' }} className="no-scrollbar">
        {/* EARN */}
        {tab === 'earn' && EARN_WAYS.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', background: '#131826', borderRadius: 16, border: '1px solid rgba(255,255,255,0.04)', marginBottom: 8, cursor: 'pointer' }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(255,255,255,0.04)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>
              {it.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 13, color: '#fff' }}>{it.title}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{it.sub}</div>
            </div>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 13, color: it.color, flexShrink: 0 }}>{it.pts}</div>
          </div>
        ))}

        {/* REDEEM */}
        {tab === 'redeem' && (
          <div>
            {txError && (
              <div style={{ fontSize: 12, color: '#EF4444', background: 'rgba(239,68,68,0.1)', borderRadius: 12, padding: '10px 12px', marginBottom: 12 }}>⚠ {txError}</div>
            )}
            {redeemed && (
              <div style={{ fontSize: 12, color: '#00A651', background: 'rgba(0,166,81,0.1)', borderRadius: 12, padding: '10px 12px', marginBottom: 12, textAlign: 'center' }}>
                ✓ {redeemAmt} GoalPoints redeemed!{txSig && <> · <a href={explorerUrl(txSig)} target="_blank" rel="noreferrer" style={{ color: '#00A651', textDecoration: 'underline' }}>View tx</a></>}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {REDEEM_OPTIONS.map(r => (
                <div key={r.pts} style={{ background: '#131826', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 12, opacity: goalPoints >= r.pts ? 1 : 0.4 }}>
                  <div style={{ height: 56, borderRadius: 10, background: r.color, marginBottom: 10, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0 6px, transparent 6px 14px)' }} />
                  </div>
                  <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 12, color: '#fff' }}>{r.title}</div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#FFD700', marginTop: 4 }}>{r.pts.toLocaleString()} pts</div>
                  <button
                    onClick={() => handleRedeem(r.pts)}
                    disabled={goalPoints < r.pts || redeeming}
                    style={{ marginTop: 10, width: '100%', padding: '8px 0', borderRadius: 10, background: goalPoints >= r.pts ? '#00A651' : '#1a2030', color: '#fff', fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 12, border: 'none', cursor: goalPoints >= r.pts ? 'pointer' : 'default' }}
                  >
                    {redeeming && redeemAmt === r.pts ? 'Burning…' : 'Redeem'}
                  </button>
                </div>
              ))}
            </div>
            {!walletConnected && (
              <div style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 16 }}>
                Connect wallet to burn GoalPoints on-chain
              </div>
            )}
          </div>
        )}

        {/* HISTORY */}
        {tab === 'history' && HISTORY.map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: '#131826', display: 'grid', placeItems: 'center', fontSize: 16 }}>{h.emoji}</div>
              <div>
                <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff' }}>{h.label}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{h.date}</div>
              </div>
            </div>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 13, color: h.pts > 0 ? '#FFD700' : '#EF4444' }}>
              {h.pts > 0 ? '+' : ''}{h.pts}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

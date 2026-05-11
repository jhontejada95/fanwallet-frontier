import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';
import { useIsDesktop } from '../../hooks/useIsDesktop';
import { MATCHES, MERCHANTS, TRANSACTIONS } from '../../lib/mockData';
import FanAgent from './FanAgent';
import WorldIDVerify from './WorldIDVerify';
import { LogoMark } from '../LogoMark';

const IDeposit = () => <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12m0 0l-5-5m5 5l5-5"/><path d="M4 19h16"/></svg>;
const IQr = () => <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM18 18h3v3h-3z"/></svg>;
const ISend = () => <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 3L11 13"/><path d="M21 3l-7 18-3-8-8-3 18-7z"/></svg>;
const ISplit = () => <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="12" cy="17" r="3"/><path d="M9 9l2 5M15 9l-2 5"/></svg>;
const ITrophy = () => <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M8 4h8v4a4 4 0 11-8 0V4z"/><path d="M16 6h3v2a3 3 0 01-3 3M8 6H5v2a3 3 0 003 3"/><path d="M9 13h6v2H9z"/><path d="M8 19h8M10 17v2M14 17v2"/></svg>;
const IChevron = () => <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>;

const DEAL_COLORS = ['#00A651', '#FFD700', '#EF4444', '#00A651', '#3B82F6'];

const ACTIONS = [
  { id: 'dep', label: 'Deposit', screen: 'deposit' as const, Icon: IDeposit },
  { id: 'pay', label: 'Pay',     screen: 'pay'     as const, Icon: IQr },
  { id: 'snd', label: 'Send',    screen: 'send'    as const, Icon: ISend },
  { id: 'spl', label: 'Split',   screen: 'split'   as const, Icon: ISplit },
];

export default function Dashboard() {
  const {
    balance, goalPoints, selectedCountry, setFanScreen, setSelectedMerchant,
    walletAddress, walletConnected, worldIdVerified, chainLoading, refreshBalances,
  } = useApp();
  const isDesktop = useIsDesktop();
  const [showAgent, setShowAgent] = useState(false);
  const [showWorldID, setShowWorldID] = useState(false);

  const displayBalance = walletConnected ? balance : (balance > 0 ? balance : 124.50);
  const shortAddr = walletAddress ? walletAddress.slice(0, 4) + '…' + walletAddress.slice(-4) : null;
  const initials = walletAddress ? walletAddress.slice(0, 2).toUpperCase() : 'FW';
  const balInt = Math.floor(displayBalance);
  const balDec = (displayBalance % 1).toFixed(2).slice(1);

  /* ── Shared sub-components ─────────────────────────────────────────────── */

  const BalanceCard = () => (
    <div style={{ position: 'relative', background: 'linear-gradient(135deg, #00C962 0%, #00A651 50%, #007a3c 100%)', borderRadius: 24, padding: isDesktop ? '28px 28px' : '20px 22px', overflow: 'hidden', boxShadow: '0 20px 50px -18px rgba(0,166,81,0.6)' }}>
      <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 14, top: 14 }}>
        <LogoMark size={28} bg="rgba(0,0,0,0.18)" fg="#fff" dot="#FFD700" radius={0.28} />
      </div>
      <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.85, color: '#fff' }}>USDC BALANCE</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
        {chainLoading
          ? <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)', borderTopColor: '#fff', animation: 'spin 1s linear infinite' }} />
          : <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: isDesktop ? 52 : 46, lineHeight: 1, color: '#fff', letterSpacing: '-0.02em' }}>${balInt}<span style={{ opacity: 0.7 }}>{balDec}</span></div>
        }
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.22)', padding: '4px 10px', borderRadius: 999, fontSize: 11, color: '#fff' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFD700', display: 'inline-block' }} />
          {selectedCountry?.currency === 'MXN' ? `≈ MXN ${(displayBalance * 17.6).toFixed(0)}` : `≈ $${displayBalance.toFixed(2)} USD`}
        </div>
        {walletConnected && <button onClick={refreshBalances} style={{ fontSize: 13, background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0 }}>↻</button>}
      </div>
      {shortAddr && <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>⚡ {shortAddr} · devnet</div>}
    </div>
  );

  const QuickActions = () => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isDesktop ? 2 : 4}, 1fr)`, gap: isDesktop ? 12 : 10 }}>
      {ACTIONS.map(a => (
        <div key={a.id} onClick={() => setFanScreen(a.screen)} style={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', alignItems: 'center', gap: isDesktop ? 12 : 8, cursor: 'pointer', background: isDesktop ? '#131826' : 'transparent', border: isDesktop ? '1px solid rgba(255,255,255,0.06)' : 'none', borderRadius: isDesktop ? 14 : 0, padding: isDesktop ? '12px 16px' : 0 }}>
          <div style={{ width: isDesktop ? 40 : 54, height: isDesktop ? 40 : 54, borderRadius: isDesktop ? 12 : 18, background: '#131826', border: '1px solid rgba(255,255,255,0.06)', display: 'grid', placeItems: 'center', color: '#00A651', flexShrink: 0 }}>
            <a.Icon />
          </div>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: isDesktop ? 14 : 11, color: '#fff' }}>{a.label}</div>
        </div>
      ))}
    </div>
  );

  const GoalPointsBanner = () => (
    <div onClick={() => setFanScreen('goalpoints')} style={{ position: 'relative', background: 'linear-gradient(95deg, #2a1f00 0%, #4a3500 100%)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, overflow: 'hidden', cursor: 'pointer' }}>
      <div style={{ position: 'absolute', right: -10, top: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ width: 44, height: 44, borderRadius: 14, background: '#FFD700', display: 'grid', placeItems: 'center', color: '#1a1300', flexShrink: 0 }}><ITrophy /></div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 26, color: '#FFD700', lineHeight: 0.9 }}>{goalPoints}</div>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FFD700' }}>GOALPOINTS</div>
        </div>
        <div style={{ fontSize: 11, color: '#d1c280', marginTop: 2 }}>{worldIdVerified ? '2× Multiplier active · World ID verified' : `≈ $${(goalPoints / 100).toFixed(2)} redeemable`}</div>
      </div>
      <IChevron />
    </div>
  );

  const MatchCards = () => (
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
      {MATCHES.map(match => (
        <div key={match.id} style={{ background: '#131826', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: 14, minWidth: isDesktop ? 240 : 210, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b7280' }}>{match.city}</div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#B6BECB' }}>{match.time}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 22 }}>{match.home.flag}</span><span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 13, color: '#fff' }}>{match.home.code}</span></div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', color: '#6b7280', fontSize: 11 }}>vs</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 13, color: '#fff' }}>{match.away.code}</span><span style={{ fontSize: 22 }}>{match.away.flag}</span></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 11, color: '#B6BECB' }}>Predict · <span style={{ color: '#FFD700', fontFamily: 'Archivo, sans-serif', fontWeight: 800 }}>+50 pts</span></div>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.18em', color: '#00A651' }}>GO →</div>
          </div>
        </div>
      ))}
    </div>
  );

  const DealCards = () => (
    <div style={{ display: isDesktop ? 'grid' : 'flex', gridTemplateColumns: isDesktop ? 'repeat(3,1fr)' : undefined, gap: 10, overflowX: isDesktop ? 'visible' : 'auto', scrollbarWidth: 'none' }}>
      {MERCHANTS.filter(m => m.deal).slice(0, isDesktop ? 6 : 5).map((merchant, idx) => (
        <div key={merchant.id} onClick={() => { setSelectedMerchant(merchant.id); setFanScreen('merchant'); }} style={{ background: '#131826', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, minWidth: isDesktop ? 0 : 160, flexShrink: 0, overflow: 'hidden', cursor: 'pointer' }}>
          <div style={{ height: 72, background: DEAL_COLORS[idx % DEAL_COLORS.length], position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0 6px, transparent 6px 14px)' }} />
            <span style={{ fontSize: 28, position: 'relative', zIndex: 1 }}>{merchant.emoji}</span>
            <div style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', borderRadius: 999, background: '#0a0e1a', color: '#FFD700', fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 10 }}>{merchant.deal?.title?.split(' ')[0]}</div>
          </div>
          <div style={{ padding: '10px 12px 12px' }}>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 12, color: '#fff' }}>{merchant.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6b7280', fontSize: 11, marginTop: 3 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00A651', display: 'inline-block' }} />
              {merchant.distance}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const Transactions = () => (
    <>
      {TRANSACTIONS.map(tx => (
        <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(0,166,81,0.12)', display: 'grid', placeItems: 'center', fontSize: 16 }}>{tx.emoji}</div>
            <div>
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff' }}>{tx.merchant}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{tx.date}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 13, color: '#fff' }}>${tx.amount.toFixed(2)}</div>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 11, color: '#FFD700' }}>+{tx.points} pts</div>
          </div>
        </div>
      ))}
    </>
  );

  const SectionHeader = ({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: isDesktop ? 18 : 16, color: '#fff' }}>{title}</div>
      {action && <button onClick={onAction} style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#00A651', background: 'none', border: 'none', cursor: 'pointer' }}>{action} →</button>}
    </div>
  );

  /* ── Desktop layout ──────────────────────────────────────────────────────── */
  if (isDesktop) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e1a' }} className="no-scrollbar">
        {showAgent && <FanAgent onClose={() => setShowAgent(false)} />}
        {showWorldID && <WorldIDVerify onVerified={() => setShowWorldID(false)} onSkip={() => setShowWorldID(false)} />}

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 40px 60px' }}>

          {/* Desktop top bar (inside content, below fixed nav) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Welcome back</div>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 22, color: '#fff', letterSpacing: '-0.02em' }}>
                FanWallet {selectedCountry && <span style={{ color: '#6b7280', fontFamily: 'Archivo, sans-serif', fontWeight: 400, fontSize: 16 }}>· {selectedCountry.flag} {selectedCountry.name}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAgent(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, background: '#131826', border: '1px solid rgba(255,255,255,0.06)', color: '#B6BECB', cursor: 'pointer', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13 }}>
                🤖 AI Agent
              </button>
              <button onClick={() => setShowWorldID(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, background: worldIdVerified ? 'rgba(0,166,81,0.15)' : '#131826', border: `1px solid ${worldIdVerified ? 'rgba(0,166,81,0.4)' : 'rgba(255,255,255,0.06)'}`, color: worldIdVerified ? '#00A651' : '#B6BECB', cursor: 'pointer', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13 }}>
                🌍 {worldIdVerified ? 'Verified ✓' : 'Verify Human'}
              </button>
            </div>
          </div>

          {/* Main grid: 3 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 28 }}>
            {/* Balance card spans 2 cols */}
            <div style={{ gridColumn: 'span 2' }}><BalanceCard /></div>
            {/* Quick actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <QuickActions />
            </div>
          </div>

          {/* GoalPoints banner */}
          <div style={{ marginBottom: 28 }}><GoalPointsBanner /></div>

          {/* Matches + Deals side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 28 }}>
            <div>
              <SectionHeader title="Today's Matches" action="SEE ALL" />
              <MatchCards />
            </div>
            <div>
              <SectionHeader title="Deals Near You" action="MAP" onAction={() => setFanScreen('map')} />
              <DealCards />
            </div>
          </div>

          {/* Recent transactions */}
          <div>
            <SectionHeader title="Recent Transactions" action="VIEW ALL" onAction={() => setFanScreen('profile')} />
            <div style={{ background: '#131826', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '0 20px' }}>
              <Transactions />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Mobile layout ───────────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', overflowY: 'auto', paddingBottom: 120 }} className="no-scrollbar">
      {showAgent && <FanAgent onClose={() => setShowAgent(false)} />}
      {showWorldID && <WorldIDVerify onVerified={() => setShowWorldID(false)} onSkip={() => setShowWorldID(false)} />}

      {/* Mobile top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#131826', display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 13, color: '#FFD700' }}>{initials}</span>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>Welcome back</div>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 14, color: '#fff' }}>FanWallet {selectedCountry && <span style={{ color: '#6b7280' }}>· {selectedCountry.flag}</span>}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowAgent(true)} style={{ width: 36, height: 36, borderRadius: 12, background: '#131826', display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,0.06)', color: '#B6BECB', cursor: 'pointer', fontSize: 16 }}>🤖</button>
          <button onClick={() => setShowWorldID(true)} style={{ width: 36, height: 36, borderRadius: 12, background: worldIdVerified ? 'rgba(0,166,81,0.2)' : '#131826', display: 'grid', placeItems: 'center', border: `1px solid ${worldIdVerified ? 'rgba(0,166,81,0.5)' : 'rgba(255,255,255,0.06)'}`, color: worldIdVerified ? '#00A651' : '#B6BECB', cursor: 'pointer' }}>🌍</button>
        </div>
      </div>

      <div style={{ margin: '4px 16px 0' }}><BalanceCard /></div>
      <div style={{ padding: '18px 16px 0' }}><QuickActions /></div>
      <div style={{ margin: '18px 16px 0' }}><GoalPointsBanner /></div>

      <div style={{ padding: '22px 0 0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16, marginBottom: 12 }}>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 16, color: '#fff' }}>Today's matches</div>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#00A651', cursor: 'pointer' }}>SEE ALL →</div>
        </div>
        <div style={{ paddingRight: 16 }}><MatchCards /></div>
      </div>

      <div style={{ padding: '22px 0 0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16, marginBottom: 12 }}>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 16, color: '#fff' }}>Deals near you</div>
          <button onClick={() => setFanScreen('map')} style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>See all →</button>
        </div>
        <div style={{ paddingRight: 16 }}><DealCards /></div>
      </div>

      <div style={{ padding: '22px 16px 0' }}>
        <SectionHeader title="Recent" action="VIEW ALL" onAction={() => setFanScreen('profile')} />
        <Transactions />
      </div>
    </div>
  );
}

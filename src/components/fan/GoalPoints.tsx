/**
 * GoalPoints — Level 3 upgrade
 *
 * Real on-chain SPL token balance from Solana devnet.
 * Redeem burns tokens via the fanwallet program.
 * Falls back to mock state when wallet not connected.
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../lib/appContext';
import { redeemPoints as redeemOnChain, explorerUrl } from '../../lib/solana';

const EARN_WAYS = [
  { icon: '💳', label: 'Per payment', desc: '1 pt per $1 spent', pts: '+1/USD' },
  { icon: '⭐', label: 'Leave a review', desc: 'After verified purchase', pts: '+50' },
  { icon: '📸', label: 'Add photo', desc: 'To your review', pts: '+25' },
  { icon: '👥', label: 'Refer a friend', desc: 'When they make first payment', pts: '+100' },
];

const REDEEM_OPTIONS = [
  { pts: 100, value: '$1.00', desc: 'Minimum redemption' },
  { pts: 500, value: '$5.00', desc: 'Great for a meal' },
  { pts: 1000, value: '$10.00', desc: 'Match day savings' },
  { pts: 2000, value: '$20.00', desc: 'Premium experience' },
];

const HISTORY = [
  { icon: '💳', label: 'Payment at Tacos El Azteca', pts: +13, date: 'Today' },
  { icon: '💳', label: 'Payment at Café Estadio', pts: +24, date: 'Today' },
  { icon: '⭐', label: 'Review verified on-chain', pts: +50, date: 'Yesterday' },
  { icon: '📸', label: 'Photo bonus', pts: +25, date: 'Yesterday' },
  { icon: '💳', label: 'Payment at Merch Store', pts: +65, date: 'Jun 12' },
  { icon: '🎁', label: 'Redeemed at Hotel Azteca', pts: -100, date: 'Jun 11' },
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
        // Mock fallback
        await new Promise(r => setTimeout(r, 900));
        setGoalPoints(goalPoints - pts);
      }
      setRedeemed(true);
      setTimeout(() => {
        setRedeemed(false);
        setRedeemAmt(null);
        setTxSig(null);
      }, 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Redemption failed';
      setTxError(msg.slice(0, 80));
      setRedeemAmt(null);
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="min-h-screen field-bg flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-6"
           style={{ background: 'linear-gradient(180deg, rgba(255,215,0,0.08) 0%, transparent 100%)' }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-white">GoalPoints</h1>
          {walletConnected && (
            <span className="text-xs text-green-400 font-semibold bg-green-400/10 px-2 py-1 rounded-full">
              ⚡ On-chain SPL
            </span>
          )}
        </div>

        {/* Balance card */}
        <div className="rounded-3xl p-6 text-center relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #1a1500, #2d2400, #1a1500)', border: '1px solid rgba(255,215,0,0.3)' }}>
          <div className="absolute inset-0 opacity-5 flex items-center justify-center text-[120px]">⚽</div>
          <p className="text-yellow-500/70 text-sm font-medium mb-1">Your Balance</p>
          {chainLoading ? (
            <div className="flex items-center justify-center gap-2 py-3">
              <span className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <h2 className="text-5xl font-black text-yellow-400 mb-1">{goalPoints.toLocaleString()}</h2>
              <p className="text-yellow-500/70 text-sm">≈ ${(goalPoints / 100).toFixed(2)} redeemable</p>
            </>
          )}

          {/* World ID 2x multiplier badge */}
          {worldIdVerified && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1">
              <span className="text-xs">🌐</span>
              <span className="text-xs text-yellow-400 font-bold">2x Multiplier Active (World ID)</span>
            </div>
          )}

          <div className="mt-4 flex justify-center gap-4 text-xs text-yellow-800">
            <span>🏪 Valid at all FanWallet merchants</span>
          </div>

          {/* Refresh */}
          {walletConnected && (
            <button
              onClick={refreshBalances}
              className="mt-2 text-xs text-yellow-700 hover:text-yellow-500"
            >
              ↻ Refresh balance
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5">
        <div className="flex glass-card rounded-2xl border border-gray-700 p-1 mb-5">
          {(['earn', 'redeem', 'history'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                tab === t
                  ? 'bg-brand-green text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* EARN */}
        {tab === 'earn' && (
          <div className="space-y-3 pb-8">
            {EARN_WAYS.map((way, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 border border-gray-700 flex items-center gap-4">
                <span className="text-2xl">{way.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white">{way.label}</p>
                  <p className="text-xs text-gray-400">{way.desc}</p>
                </div>
                <span className="font-black text-brand-green">{way.pts}</span>
              </div>
            ))}

            {/* World ID bonus info */}
            <div className="glass-card rounded-2xl p-4 border border-yellow-500/30 flex items-center gap-4"
                 style={{ background: 'rgba(255,215,0,0.04)' }}>
              <span className="text-2xl">🌐</span>
              <div className="flex-1">
                <p className="font-semibold text-yellow-400">World ID Verification</p>
                <p className="text-xs text-gray-400">Verify humanity → earn 2x on all payments</p>
              </div>
              <span className="font-black text-yellow-400">2×</span>
            </div>
          </div>
        )}

        {/* REDEEM */}
        {tab === 'redeem' && (
          <div className="space-y-3 pb-8">
            {txError && (
              <div className="text-xs text-red-400 bg-red-900/20 rounded-xl px-3 py-2">
                ⚠ {txError}
              </div>
            )}
            {redeemed && txSig && (
              <div className="text-xs text-green-400 bg-green-900/20 rounded-xl px-3 py-2 text-center">
                ✓ Burned on-chain ·{' '}
                <a href={explorerUrl(txSig)} target="_blank" rel="noreferrer" className="underline">
                  View tx
                </a>
              </div>
            )}
            {redeemed && !txSig && (
              <div className="text-xs text-green-400 bg-green-900/20 rounded-xl px-3 py-2 text-center">
                ✓ {redeemAmt} GoalPoints redeemed!
              </div>
            )}

            {REDEEM_OPTIONS.map(opt => (
              <div
                key={opt.pts}
                className={`glass-card rounded-2xl p-4 border flex items-center gap-4 ${
                  goalPoints >= opt.pts ? 'border-gray-700' : 'border-gray-800 opacity-40'
                }`}
              >
                <div className="text-center">
                  <p className="text-yellow-400 font-black text-lg">{opt.pts}</p>
                  <p className="text-xs text-gray-500">pts</p>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">{opt.value} USDC</p>
                  <p className="text-xs text-gray-400">{opt.desc}</p>
                </div>
                <button
                  onClick={() => handleRedeem(opt.pts)}
                  disabled={goalPoints < opt.pts || redeeming}
                  className="px-4 py-2 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
                >
                  {redeeming && redeemAmt === opt.pts ? (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {walletConnected ? 'Burning...' : 'Redeeming...'}
                    </span>
                  ) : (
                    'Redeem'
                  )}
                </button>
              </div>
            ))}

            {!walletConnected && (
              <p className="text-xs text-gray-600 text-center py-4">
                Connect wallet to burn GoalPoints on-chain
              </p>
            )}
          </div>
        )}

        {/* HISTORY */}
        {tab === 'history' && (
          <div className="space-y-2 pb-8">
            {HISTORY.map((h, i) => (
              <div key={i} className="flex items-center gap-3 glass-card rounded-2xl p-3 border border-gray-800">
                <span className="text-xl">{h.icon}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{h.label}</p>
                  <p className="text-xs text-gray-600">{h.date}</p>
                </div>
                <span className={`font-black text-sm ${h.pts > 0 ? 'text-brand-green' : 'text-red-400'}`}>
                  {h.pts > 0 ? '+' : ''}{h.pts}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

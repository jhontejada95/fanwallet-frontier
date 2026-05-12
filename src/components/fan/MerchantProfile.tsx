/**
 * MerchantProfile — Level 3 upgrade
 *
 * Payment options:
 *  1. ⚡ Pay on-chain — real Solana USDC transfer via processPayment()
 *  2. 🌑 Private Pay via Vanish — ZK-shielded payment
 *  3. 📊 x402 Insights — Coinbase x402 micropayment for merchant data
 *
 * Falls back to mock 1.5s confirmation when wallet not connected.
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../lib/appContext';
import { MERCHANTS, REVIEWS } from '../../lib/mockData';
import { processPayment, explorerUrl } from '../../lib/solana';
import VanishPayment from './VanishPayment';
import MerchantInsights from './MerchantInsights';
import { useIsDesktop } from '../../hooks/useIsDesktop';

// Pre-computed stable confetti (no Math.random on render)
const CONFETTI_PIECES = Array.from({ length: 24 }, (_, i) => {
  let s = (i * 1664525 + 1013904223) >>> 0;
  s = (s * 1664525 + 1013904223) >>> 0;
  return {
    left: `${(s >>> 8) % 100}%`,
    color: ['#00A651','#FFD700','#FF6B6B','#4ECDC4','#7C3AED','#45B7D1'][i % 6],
    circle: (s & 1) === 0,
    delay: `${((s >>> 16) % 600) / 1000}s`,
    duration: `${1 + ((s >>> 8) % 1000) / 1000}s`,
  };
});

export default function MerchantProfile() {
  const {
    selectedMerchant, setFanScreen, setShowPaymentSuccess,
    walletConnected, balance, setBalance, setGoalPoints, goalPoints,
    getProvider, refreshBalances, bizWalletAddress,
  } = useApp();
  const isDesktop = useIsDesktop();

  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [showVanish, setShowVanish] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const merchant = MERCHANTS.find(m => m.id === selectedMerchant) || MERCHANTS[0];
  const displayBalance = balance > 0 ? balance : 124.50;
  const payAmount = parseFloat(merchant.priceRange?.replace(/[^0-9.]/g, '') || '15');

  const handlePay = async () => {
    setPaying(true);
    setTxError(null);

    try {
      if (walletConnected) {
        // ── REAL on-chain payment ──
        const provider = getProvider();
        if (!provider) throw new Error('No wallet provider');

        const merchantWallet = merchant.walletAddress || bizWalletAddress || 'CFi9X3i1hB6eFfLsapSmkPovCRDqhFAGa5a3LeYP3g';
        const sig = await processPayment(provider, payAmount, merchantWallet);
        setTxSig(sig);
        // Optimistic GoalPoints — ensures fan sees points even if on-chain mint failed
        setGoalPoints(goalPoints + Math.floor(payAmount * merchant.pointsMultiplier));
        await refreshBalances();
      } else {
        // ── Mock fallback ──
        await new Promise(r => setTimeout(r, 1500));
        setBalance(displayBalance - payAmount);
        setGoalPoints(goalPoints + Math.floor(payAmount * merchant.pointsMultiplier));
      }

      setPaying(false);
      setPaid(true);
      setConfetti(true);
      setTimeout(() => {
        setConfetti(false);
        setShowPaymentSuccess(true);
        setFanScreen('review');
      }, 2200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      setTxError(msg.length > 80 ? msg.slice(0, 80) + '...' : msg);
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen field-bg overflow-y-auto" style={isDesktop ? { display: 'flex', justifyContent: 'center' } : {}}>
    <div style={isDesktop ? { maxWidth: 720, width: '100%', padding: '0 0 60px' } : {}}>
      {/* ── Vanish overlay ── */}
      {showVanish && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end"
             style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="bg-[#0a0e1a] rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <VanishPayment
              amount={payAmount}
              merchantName={merchant.name}
              onSuccess={() => {
                setShowVanish(false);
                setPaid(true);
                setConfetti(true);
                setTimeout(() => {
                  setConfetti(false);
                  setShowPaymentSuccess(true);
                  setFanScreen('review');
                }, 2200);
              }}
              onCancel={() => setShowVanish(false)}
            />
          </div>
        </div>
      )}

      {/* ── x402 Insights overlay ── */}
      {showInsights && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end"
             style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="bg-[#0a0e1a] rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-white">Merchant Insights</p>
              <button onClick={() => setShowInsights(false)} className="text-gray-400 text-xl">×</button>
            </div>
            <MerchantInsights merchantId={merchant.id} merchantName={merchant.name} />
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <div className="relative h-52 overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #0d1a0d, #1a3d1a)' }}>
        <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-20">
          {merchant.emoji}
        </div>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, transparent 40%, rgba(10,14,26,0.95))'
        }} />
        <button
          onClick={() => setFanScreen('map')}
          className="absolute top-12 left-5 w-10 h-10 rounded-2xl glass-card border border-gray-700 flex items-center justify-center z-10"
        >
          ←
        </button>
        <div className="absolute bottom-4 left-5 right-5">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">{merchant.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-400">★ {merchant.rating}</span>
                <span className="text-gray-400 text-sm">({merchant.reviewCount} verified reviews)</span>
              </div>
            </div>
            <div className="text-4xl">{merchant.emoji}</div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-40">
        {/* Badges */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {merchant.badges.map(badge => (
            <span key={badge} className="text-xs px-3 py-1 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20 font-semibold">
              {badge}
            </span>
          ))}
        </div>

        {/* Active Deal */}
        {merchant.deal && (
          <div className="mt-4 rounded-2xl p-4 border border-brand-green"
               style={{ background: 'linear-gradient(135deg, rgba(0,166,81,0.15), rgba(0,166,81,0.05))' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-bold text-brand-green">{merchant.deal.title}</p>
                <p className="text-sm text-gray-300 mt-0.5">Active today · {merchant.deal.multiplier}x GoalPoints</p>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="glass-card rounded-2xl p-4 border border-gray-700 mt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-1">Address</p>
              <p className="text-white text-sm">{merchant.address}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Hours</p>
              <p className="text-white text-sm">{merchant.hours}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Distance</p>
              <p className="text-white text-sm">{merchant.distance}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Languages</p>
              <div className="flex gap-1 flex-wrap">
                {merchant.languages.map(l => (
                  <span key={l} className="text-xs text-gray-300">{l.split(' ')[0]}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GoalPoints multiplier */}
        <div className="mt-3 glass-card rounded-2xl p-3 border border-yellow-500/20 flex items-center gap-3">
          <span className="text-2xl">⚽</span>
          <div>
            <p className="text-yellow-400 font-bold text-sm">{merchant.pointsMultiplier}x GoalPoints</p>
            <p className="text-xs text-gray-400">
              {walletConnected
                ? 'Real SPL tokens minted on Solana devnet'
                : `Earn ${merchant.pointsMultiplier} pts per $1 spent here`}
            </p>
          </div>
          {walletConnected && (
            <span className="ml-auto text-xs text-green-400 font-semibold">⚡ On-chain</span>
          )}
        </div>

        {/* x402 Insights CTA */}
        <button
          onClick={() => setShowInsights(true)}
          className="mt-3 w-full glass-card rounded-2xl p-3 border border-blue-500/30 flex items-center gap-3 text-left transition-all active:scale-95"
          style={{ background: 'rgba(59,130,246,0.05)' }}
        >
          <span className="text-xl">📊</span>
          <div className="flex-1">
            <p className="text-blue-400 font-bold text-sm">Live Insights · x402</p>
            <p className="text-xs text-gray-400">Crowd level, wait time, deals · $0.10 USDC</p>
          </div>
          <span className="text-blue-400 text-xs">→</span>
        </button>

        {/* Reviews */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white">Verified Reviews</h3>
            <span className="text-xs text-gray-500">🔐 On-chain proof</span>
          </div>
          <div className="space-y-3">
            {REVIEWS.map(review => (
              <div key={review.id} className="glass-card rounded-2xl p-4 border border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{review.fanFlag}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}</span>
                        {review.verified && (
                          <span className="text-xs text-brand-green bg-brand-green/10 px-1.5 py-0.5 rounded font-semibold">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{review.text}</p>
                    {review.businessResponse && (
                      <div className="mt-2 bg-gray-800 rounded-xl p-2 border-l-2 border-brand-green">
                        <p className="text-xs text-gray-500 mb-0.5">🏪 Business response</p>
                        <p className="text-xs text-gray-300">{review.businessResponse}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky pay buttons ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 py-4 z-40 space-y-2"
           style={{ background: 'linear-gradient(to top, rgba(10,14,26,1) 60%, transparent)' }}>
        {/* Tx error */}
        {txError && (
          <div className="text-xs text-red-400 text-center mb-1 bg-red-900/20 rounded-xl px-3 py-2">
            ⚠ {txError}
          </div>
        )}
        {/* Tx success link */}
        {txSig && (
          <div className="text-xs text-center">
            <a
              href={explorerUrl(txSig)}
              target="_blank"
              rel="noreferrer"
              className="text-brand-green underline"
            >
              View on Solana Explorer ↗
            </a>
          </div>
        )}

        {/* Vanish private pay */}
        {!paid && (
          <button
            onClick={() => setShowVanish(true)}
            className="w-full py-3 rounded-2xl font-bold text-white text-sm border border-purple-500/40 transition-all active:scale-95"
            style={{ background: 'rgba(124,58,237,0.15)' }}
          >
            🌑 Private Pay via Vanish
          </button>
        )}

        {/* Main pay */}
        {!paid ? (
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full py-4 rounded-2xl font-black text-lg text-white transition-all active:scale-95 glow-green"
            style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
          >
            {paying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {walletConnected ? 'Confirming on Solana...' : 'Processing...'}
              </span>
            ) : (
              `⚡ Pay Here · ${merchant.pointsMultiplier}x Points`
            )}
          </button>
        ) : (
          <div className="w-full py-4 rounded-2xl font-black text-lg text-center text-white glow-green"
               style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}>
            ✅ Payment Confirmed!
          </div>
        )}
      </div>

      {/* Confetti */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {CONFETTI_PIECES.map((p, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: p.left,
                top: '-10px',
                background: p.color,
                borderRadius: p.circle ? '50%' : '2px',
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center text-6xl animate-bounce-in">⚽</div>
        </div>
      )}
    </div></div>
  );
}

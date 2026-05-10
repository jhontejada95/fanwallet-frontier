import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';
import { MATCHES, MERCHANTS, TRANSACTIONS } from '../../lib/mockData';
import FanAgent from './FanAgent';
import WorldIDVerify from './WorldIDVerify';

export default function Dashboard() {
  const {
    balance, goalPoints, selectedCountry, setFanScreen, setSelectedMerchant,
    walletAddress, walletConnected, worldIdVerified, chainLoading,
    refreshBalances,
  } = useApp();
  const [showAgent, setShowAgent] = useState(false);
  const [showWorldID, setShowWorldID] = useState(false);

  const worldVerified = worldIdVerified;
  const displayBalance = walletConnected ? balance : (balance > 0 ? balance : 124.50);
  const shortAddr = walletAddress
    ? walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4)
    : null;

  return (
    <div className="min-h-screen field-bg overflow-y-auto">
      {showAgent && <FanAgent onClose={() => setShowAgent(false)} />}
      {showWorldID && (
        <WorldIDVerify
          onVerified={() => { setShowWorldID(false); }}
          onSkip={() => setShowWorldID(false)}
        />
      )}

      {/* Header */}
      <div className="px-5 pt-12 pb-6"
           style={{ background: 'linear-gradient(180deg, rgba(0,166,81,0.08) 0%, transparent 100%)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-400 text-sm">Good afternoon</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedCountry?.flag || '🌍'}</span>
              <h1 className="text-xl font-black text-white">FanWallet</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAgent(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg border border-brand-green/40"
              style={{ background: 'rgba(0,166,81,0.15)' }}
              title="FanAgent AI"
            >
              🤖
            </button>
            <button
              onClick={() => setShowWorldID(true)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm border transition-all ${
                worldVerified ? 'border-brand-green bg-brand-green/20' : 'border-gray-700 bg-gray-800'
              }`}
              title="World ID"
            >
              {worldVerified ? '✓' : '🌍'}
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="rounded-3xl p-6 relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #007A3D, #00A651, #00C661)' }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(30%, -30%)' }} />
          <div className="flex items-center justify-between mb-1">
            <p className="text-green-100 text-sm font-medium">Total Balance</p>
            {walletConnected && (
              <button onClick={refreshBalances} className="text-green-200/60 text-xs hover:text-white">↻</button>
            )}
          </div>
          <h2 className="text-4xl font-black text-white mb-1">
            {chainLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
              </span>
            ) : (
              <>{walletConnected ? `$${balance.toFixed(2)}` : `$${displayBalance.toFixed(2)}`}{' '}
              <span className="text-xl font-medium opacity-80">USDC</span></>
            )}
          </h2>
          {shortAddr && (
            <p className="text-green-200/60 text-xs font-mono mb-1">⚡ {shortAddr} · devnet</p>
          )}
          <p className="text-green-100 text-sm">
            {selectedCountry?.currency === 'MXN'
              ? '≈ MXN 2,190'
              : selectedCountry?.currency === 'BRL'
              ? '≈ BRL 624'
              : '≈ USD 124.50'}
          </p>
          <div className="mt-4 flex items-center gap-2 bg-black/20 rounded-xl px-3 py-2 w-fit">
            <span className="text-green-200 text-xs">🏦</span>
            <span className="text-green-100 text-xs font-medium">Saved $10.20 vs airport exchange</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mt-5">
          {[
            { icon: '⬇️', label: 'Deposit', screen: 'deposit' as const },
            { icon: '📱', label: 'Pay', screen: 'pay' as const },
            { icon: '↗️', label: 'Send', screen: 'send' as const },
            { icon: '✂️', label: 'Split', screen: 'split' as const },
          ].map(({ icon, label, screen }) => (
            <button
              key={label}
              onClick={() => setFanScreen(screen)}
              className="flex-1 glass-card rounded-2xl py-3 flex flex-col items-center gap-1 border border-gray-700 hover:border-brand-green transition-all active:scale-95"
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs text-gray-300 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GoalPoints Banner */}
      <div className="px-5 mb-5">
        <button
          onClick={() => setFanScreen('goalpoints')}
          className="w-full rounded-2xl p-4 flex items-center gap-3 border border-yellow-500/30 active:scale-98 transition-all"
          style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.05))' }}
        >
          <span className="text-3xl">⚽</span>
          <div className="flex-1 text-left">
            <p className="font-bold text-yellow-400">{goalPoints} GoalPoints</p>
            <p className="text-xs text-gray-400">
              ≈ ${(goalPoints / 100).toFixed(2)} redeemable at any merchant
            </p>
          </div>
          {worldVerified && (
            <span className="text-xs bg-brand-green/20 text-brand-green border border-brand-green/30 px-2 py-0.5 rounded-full font-bold">
              2x ✓
            </span>
          )}
          <span className="text-yellow-500">→</span>
        </button>
      </div>

      {/* Today's Matches */}
      <div className="px-5 mb-6">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <span>🏟️</span> Today's Matches
        </h3>
        <div className="space-y-3">
          {MATCHES.slice(0, 2).map(match => (
            <div key={match.id} className="glass-card rounded-2xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{match.home.flag}</span>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">{match.time}</p>
                    <p className="font-black text-white">VS</p>
                    <p className="text-xs text-gray-400">{match.group}</p>
                  </div>
                  <span className="text-2xl">{match.away.flag}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{match.stadium}</p>
                  <p className="text-xs text-brand-green font-medium">{match.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deals Near You */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white flex items-center gap-2">
            <span>🔥</span> Deals Near You
          </h3>
          <button
            onClick={() => setFanScreen('map')}
            className="text-brand-green text-sm font-medium"
          >
            See all →
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {MERCHANTS.filter(m => m.deal).map(merchant => (
            <button
              key={merchant.id}
              onClick={() => { setSelectedMerchant(merchant.id); setFanScreen('merchant'); }}
              className="glass-card rounded-2xl p-4 border border-gray-700 min-w-[180px] text-left active:scale-95 transition-all hover:border-brand-green flex-shrink-0"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{merchant.emoji}</span>
                <div>
                  <p className="font-bold text-white text-sm">{merchant.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-400">{merchant.rating}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-brand-green font-medium bg-brand-green/10 rounded-lg px-2 py-1">
                {merchant.deal?.title}
              </p>
              <p className="text-xs text-yellow-400 mt-2 font-semibold">
                {merchant.pointsMultiplier}x GoalPoints
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-5 mb-28">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white flex items-center gap-2">
            <span>🕐</span> Recent
          </h3>
          <button
            onClick={() => setFanScreen('profile')}
            className="text-brand-green text-sm font-medium"
          >
            View all →
          </button>
        </div>
        <div className="space-y-2">
          {TRANSACTIONS.map(tx => (
            <div key={tx.id} className="glass-card rounded-2xl px-4 py-3 border border-gray-700 flex items-center gap-3">
              <span className="text-xl">{tx.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">{tx.merchant}</p>
                <p className="text-xs text-gray-500">{tx.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white text-sm">${tx.amount.toFixed(2)}</p>
                <p className="text-xs text-yellow-400">+{tx.points} pts</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

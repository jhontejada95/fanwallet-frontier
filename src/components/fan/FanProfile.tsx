import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { TRANSACTIONS, STAMPS } from '../../lib/mockData';

export default function FanProfile() {
  const { selectedCountry, goalPoints, balance, setRole } = useApp();
  const [budget, setBudget] = useState(500);
  const [spent] = useState(205.50);

  const country = selectedCountry || { flag: '🌍', name: 'World', currency: 'USD' };
  const earnedStamps = STAMPS.filter(s => s.earned).length;
  const pct = Math.min((spent / budget) * 100, 100);

  return (
    <div className="min-h-screen field-bg flex flex-col overflow-y-auto">
      <div className="px-5 pt-12 pb-6"
           style={{ background: 'linear-gradient(180deg, rgba(0,166,81,0.06) 0%, transparent 100%)' }}>

        {/* Profile header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl border-2 border-brand-green"
               style={{ background: 'linear-gradient(135deg, rgba(0,166,81,0.2), rgba(0,166,81,0.05))' }}>
            {country.flag}
          </div>
          <div>
            <h1 className="text-xl font-black text-white">@fan_{country.name.toLowerCase().slice(0, 6)}</h1>
            <p className="text-gray-400 text-sm">{country.name} · Member since Jun 2026</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-green/20 text-brand-green font-semibold border border-brand-green/20">
                ✓ Verified Fan
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: 'Spent', value: `$${spent.toFixed(0)}` },
            { label: 'Places', value: '4' },
            { label: 'Reviews', value: '3' },
            { label: 'Stamps', value: `${earnedStamps}` },
          ].map(stat => (
            <div key={stat.label} className="glass-card rounded-2xl p-3 border border-gray-700 text-center">
              <p className="font-black text-white text-lg">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Wallet */}
        <div className="glass-card rounded-2xl p-4 border border-gray-700 mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Solana Wallet</p>
          <div className="flex items-center justify-between">
            <p className="font-mono text-sm text-brand-green">CFi9...eYP3g</p>
            <button
            className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-lg active:bg-gray-700 transition-all"
            onClick={() => navigator.clipboard.writeText('CFi91VLHPRFBYdKtNSJst56DTQ5jPQ6oxRvMjx9eYP3g').catch(() => {})}
          >Copy</button>
          </div>
          <p className="text-white font-bold mt-2">${balance > 0 ? balance.toFixed(2) : '124.50'} USDC</p>
        </div>

        {/* Trip Budget */}
        <div className="glass-card rounded-2xl p-4 border border-gray-700 mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold text-white text-sm">Trip Budget</p>
            <p className="text-sm text-gray-400">${spent.toFixed(0)} / ${budget}</p>
          </div>
          <div className="bg-gray-800 rounded-full h-2.5 mb-2">
            <div className="h-2.5 rounded-full transition-all"
                 style={{
                   width: `${pct}%`,
                   background: pct > 80 ? 'linear-gradient(90deg, #FF6B6B, #FF8E53)' : 'linear-gradient(90deg, #00A651, #FFD700)'
                 }} />
          </div>
          <p className="text-xs text-gray-500">${(budget - spent).toFixed(2)} remaining</p>
          <div className="flex gap-2 mt-3">
            {[300, 500, 1000].map(b => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`flex-1 py-1 rounded-xl text-xs font-bold transition-all ${
                  budget === b ? 'bg-brand-green text-white' : 'glass-card text-gray-400 border border-gray-700'
                }`}
              >
                ${b}
              </button>
            ))}
          </div>
        </div>

        {/* GoalPoints */}
        <div className="glass-card rounded-2xl p-4 border border-yellow-500/20 mb-6"
             style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.05), transparent)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black text-gold-gradient text-2xl">{goalPoints} pts</p>
              <p className="text-xs text-gray-400">≈ ${(goalPoints / 100).toFixed(2)} redeemable</p>
            </div>
            <span className="text-4xl">⚽</span>
          </div>
        </div>

        {/* Recent Transactions */}
        <h3 className="font-bold text-white mb-3">Transaction History</h3>
        <div className="space-y-2">
          {TRANSACTIONS.map(tx => (
            <div key={tx.id} className="glass-card rounded-xl px-4 py-3 border border-gray-700 flex items-center gap-3">
              <span className="text-xl">{tx.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">{tx.merchant}</p>
                <p className="text-xs text-gray-500">{tx.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white text-sm">${tx.amount}</p>
                <p className="text-xs text-yellow-400">+{tx.points} pts</p>
              </div>
            </div>
          ))}
        </div>

        {/* Switch role */}
        <button
          onClick={() => setRole('picker')}
          className="w-full mt-6 py-3 rounded-2xl border border-gray-700 text-gray-400 font-semibold glass-card text-sm"
        >
          ← Switch Role
        </button>
      </div>
    </div>
  );
}

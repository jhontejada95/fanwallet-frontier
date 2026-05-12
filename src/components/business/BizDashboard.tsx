import React, { useState, useEffect, useRef } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useApp } from '../../lib/appContext';
import { subscribeToPayments, getUsdcBalance } from '../../lib/solana';
import { MATCHES, ANALYTICS_DATA } from '../../lib/mockData';

interface LiveTx {
  id: string;
  fanFlag: string;
  fanCountry: string;
  amount: number;
  points: number;
  time: string;
  items: string;
}

const FLAGS = ['🇺🇸','🇧🇷','🇩🇪','🇰🇷','🇦🇷','🇯🇵','🇲🇽','🇫🇷'];
const COUNTRIES = ['USA','Brazil','Germany','South Korea','Argentina','Japan','Mexico','France'];

export default function BizDashboard() {
  const { setBizScreen, bizWalletAddress, bizName, setBizWalletAddress } = useApp();

  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [sessionRevenue, setSessionRevenue] = useState(0);
  const [sessionTxCount, setSessionTxCount] = useState(0);
  const [recentTxs, setRecentTxs] = useState<LiveTx[]>([]);
  const [newTx, setNewTx] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);

  const prevBalanceRef = useRef<number>(0);

  // Fetch initial USDC balance
  useEffect(() => {
    if (!bizWalletAddress) return;
    setLoadingBalance(true);
    const pk = new PublicKey(bizWalletAddress);
    getUsdcBalance(pk).then(bal => {
      setCurrentBalance(bal);
      prevBalanceRef.current = bal;
      setLoadingBalance(false);
    });
  }, [bizWalletAddress]);

  // Subscribe to real incoming payments
  useEffect(() => {
    if (!bizWalletAddress) return;
    let pk: PublicKey;
    try {
      pk = new PublicKey(bizWalletAddress);
    } catch {
      return;
    }

    const unsub = subscribeToPayments(pk, (newBalance) => {
      const delta = +(newBalance - prevBalanceRef.current).toFixed(6);
      if (delta > 0.001) {
        prevBalanceRef.current = newBalance;
        setCurrentBalance(newBalance);

        const i = Math.floor(Math.random() * FLAGS.length);
        const newEntry: LiveTx = {
          id: `tx_${Date.now()}`,
          fanFlag: FLAGS[i],
          fanCountry: COUNTRIES[i],
          amount: delta,
          points: Math.round(delta * 2),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          items: 'On-chain payment',
        };

        setSessionRevenue(r => +(r + delta).toFixed(2));
        setSessionTxCount(c => c + 1);
        setNewTx(true);
        setRecentTxs(prev => [newEntry, ...prev.slice(0, 9)]);
        setTimeout(() => setNewTx(false), 2500);
      }
    });

    return unsub;
  }, [bizWalletAddress]);

  const match = MATCHES[1];
  const avgTicket = sessionTxCount > 0 ? (sessionRevenue / sessionTxCount).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen field-bg overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-12 pb-5"
           style={{ background: 'linear-gradient(180deg, rgba(0,166,81,0.06) 0%, transparent 100%)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-gray-400 text-sm">Business Dashboard</p>
            <h1 className="text-xl font-black text-white">🌮 {bizName}</h1>
            {bizWalletAddress && (
              <p className="text-xs text-gray-600 font-mono mt-0.5">
                {bizWalletAddress.slice(0, 6)}...{bizWalletAddress.slice(-4)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {newTx && (
              <div className="flex items-center gap-1 bg-brand-green/20 border border-brand-green/30 rounded-full px-3 py-1 animate-bounce-in">
                <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                <span className="text-xs text-brand-green font-bold">New payment!</span>
              </div>
            )}
            <button
              onClick={() => setBizWalletAddress(null)}
              className="text-xs text-gray-600 hover:text-red-400 transition-colors"
            >
              Switch wallet
            </button>
          </div>
        </div>

        {/* Revenue card */}
        <div className="rounded-3xl p-5 relative overflow-hidden mb-4"
             style={{ background: 'linear-gradient(135deg, #007A3D, #00A651)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full"
               style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(30%,-30%)' }} />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-green-200 text-xs mb-1">Session Revenue</p>
              <p className="text-2xl font-black text-white">${sessionRevenue.toFixed(2)}</p>
              <p className="text-green-300 text-xs">USDC received</p>
            </div>
            <div>
              <p className="text-green-200 text-xs mb-1">Transactions</p>
              <p className="text-2xl font-black text-white">{sessionTxCount}</p>
              <p className="text-green-300 text-xs">this session</p>
            </div>
            <div>
              <p className="text-green-200 text-xs mb-1">Avg. Ticket</p>
              <p className="text-2xl font-black text-white">${avgTicket}</p>
              <p className="text-green-300 text-xs">per payment</p>
            </div>
          </div>
        </div>

        {/* Wallet balance */}
        <div className="glass-card rounded-2xl p-4 border border-brand-green/20 mb-4"
             style={{ background: 'rgba(0,166,81,0.04)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Current USDC Balance</p>
              {loadingBalance ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-400">Fetching from chain...</span>
                </div>
              ) : (
                <p className="text-2xl font-black text-brand-green">
                  ${currentBalance !== null ? currentBalance.toFixed(2) : '—'}
                  <span className="text-sm font-normal text-gray-400 ml-1">USDC</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
              <span className="text-xs text-brand-green font-semibold">Live · Devnet</span>
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="flex gap-3">
          <button
            onClick={() => setBizScreen('analytics')}
            className="flex-1 glass-card rounded-2xl p-3 border border-gray-700 text-center hover:border-brand-green transition-all">
            <p className="text-xl font-black text-white">$2,840</p>
            <p className="text-xs text-gray-400">This week</p>
          </button>
          <button
            onClick={() => setBizScreen('analytics')}
            className="flex-1 glass-card rounded-2xl p-3 border border-gray-700 text-center hover:border-brand-green transition-all">
            <p className="text-xl font-black text-white">$18,920</p>
            <p className="text-xs text-gray-400">Tournament</p>
          </button>
          <div className="flex-1 glass-card rounded-2xl p-3 border border-gray-700 text-center">
            <p className="text-xl font-black text-brand-green">6</p>
            <p className="text-xs text-gray-400">Nations today</p>
          </div>
        </div>
      </div>

      <div className="px-5">
        {/* POS button */}
        <button
          onClick={() => setBizScreen('pos')}
          className="w-full rounded-3xl p-5 mb-5 flex items-center justify-between active:scale-98 transition-all glow-green"
          style={{ background: 'linear-gradient(135deg, #007A3D, #00A651)' }}
        >
          <div>
            <p className="font-black text-white text-xl">Open POS Mode</p>
            <p className="text-green-200 text-sm">Accept payments via QR</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
            📱
          </div>
        </button>

        {/* Today's match widget */}
        <div className="glass-card rounded-2xl p-4 border border-yellow-500/20 mb-5"
             style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.05), transparent)' }}>
          <p className="text-xs text-yellow-500 font-bold uppercase tracking-wider mb-3">🏟️ Today's Match</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{match.home.flag}</span>
              <div className="text-center">
                <p className="text-white font-black">VS</p>
                <p className="text-xs text-gray-400">{match.time}</p>
              </div>
              <span className="text-3xl">{match.away.flag}</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">{match.stadium}</p>
              <p className="text-brand-green text-xs font-bold">Expected: {match.home.name} + {match.away.name} fans</p>
            </div>
          </div>
        </div>

        {/* Live transactions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white">Live Payments</h3>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
              <span className="text-xs text-brand-green">Real-time</span>
            </div>
          </div>

          {recentTxs.length === 0 ? (
            <div className="glass-card rounded-2xl p-6 border border-gray-800 text-center">
              <p className="text-4xl mb-3">⏳</p>
              <p className="text-gray-400 text-sm font-semibold">Waiting for payments</p>
              <p className="text-gray-600 text-xs mt-1">
                Open POS Mode, show the QR to a fan, and the payment will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTxs.map((tx, i) => (
                <div key={tx.id}
                     className={`glass-card rounded-2xl px-4 py-3 border flex items-center gap-3 transition-all ${
                       i === 0 && newTx ? 'border-brand-green animate-scale-in' : 'border-gray-700'
                     }`}>
                  <span className="text-2xl">{tx.fanFlag}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{tx.fanCountry} fan</p>
                    <p className="text-xs text-gray-500">{tx.time} · {tx.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-brand-green">+${tx.amount.toFixed(2)}</p>
                    <p className="text-xs text-yellow-400">+{tx.points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Country breakdown */}
        <div className="mb-8">
          <h3 className="font-bold text-white mb-3">Today's customers by nation</h3>
          <div className="space-y-2">
            {ANALYTICS_DATA.countries.slice(0, 4).map(c => {
              const maxCount = ANALYTICS_DATA.countries[0].count;
              const pct = (c.count / maxCount) * 100;
              return (
                <div key={c.country} className="flex items-center gap-3">
                  <span className="text-xl w-8">{c.flag}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{c.country}</span>
                      <span className="text-gray-500">{c.count} fans</span>
                    </div>
                    <div className="bg-gray-800 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all"
                           style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #00A651, #00C661)' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

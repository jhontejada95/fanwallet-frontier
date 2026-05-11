/**
 * Onboarding — Level 3 upgrade
 *
 * Step 1: Select country (UX personalization)
 * Step 2: Connect wallet (Phantom / Backpack / Solflare via adapter modal)
 *         — or continue without wallet for demo mode
 * Step 3: Ready screen shows real wallet address + real USDC balance
 */

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useApp } from '../../lib/appContext';
import { COUNTRIES } from '../../lib/mockData';
import { useIsDesktop } from '../../hooks/useIsDesktop';

export default function Onboarding() {
  const {
    setSelectedCountry,
    setFanScreen,
    walletAddress,
    walletConnected,
    balance,
    chainLoading,
    refreshBalances,
  } = useApp();
  const { disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const isDesktop = useIsDesktop();

  const [step, setStep] = useState<'country' | 'wallet' | 'ready'>('country');
  const [selected, setSelected] = useState<typeof COUNTRIES[0] | null>(null);
  const [search, setSearch] = useState('');

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Auto-advance to ready when wallet connects during wallet step
  useEffect(() => {
    if (step === 'wallet' && walletConnected) {
      setStep('ready');
    }
  }, [walletConnected, step]);

  const handleCountrySelect = (c: typeof COUNTRIES[0]) => {
    setSelected(c);
    setTimeout(() => setStep('wallet'), 300);
  };

  const handleConnectWallet = () => {
    setVisible(true); // Opens wallet adapter modal
  };

  const handleSkipWallet = () => {
    // Demo mode — no real wallet
    setStep('ready');
  };

  const handleStart = () => {
    setSelectedCountry(selected);
    setFanScreen('dashboard');
  };

  // ── READY ──────────────────────────────────────────────────────────────────
  if (step === 'ready' && selected) {
    const shortAddr = walletAddress
      ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
      : 'Demo Mode';

    return (
      <div className="min-h-screen field-bg flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center animate-bounce-in" style={{ width: '100%', maxWidth: isDesktop ? 480 : '100%' }}>
          <div className="text-8xl mb-4">{selected.flag}</div>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 glow-green animate-scale-in"
            style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
          >
            ✓
          </div>
          <h2 className="text-3xl font-black text-white mb-2">
            FanWallet Ready!
          </h2>
          <p className="text-gray-400 mb-6">Welcome, {selected.name} fan 🎉</p>

          {/* Wallet info card */}
          <div className="glass-card rounded-2xl p-4 mb-3 text-left border border-gray-700 w-full">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
              {walletConnected ? 'Connected Wallet · Solana Devnet' : 'Demo Mode'}
            </p>
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm text-brand-green">{shortAddr}</p>
              {walletConnected && (
                <button
                  onClick={disconnect}
                  className="text-xs text-gray-600 hover:text-red-400"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>

          {/* Balance card */}
          {walletConnected && (
            <div className="glass-card rounded-2xl p-4 mb-6 border border-brand-green/30 w-full"
                 style={{ background: 'rgba(0,166,81,0.05)' }}>
              <p className="text-xs text-gray-500 mb-1">USDC Balance (devnet)</p>
              {chainLoading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-400">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-black text-brand-green">
                  ${balance.toFixed(2)} <span className="text-sm font-normal text-gray-400">USDC</span>
                </p>
              )}
              {balance === 0 && !chainLoading && (
                <p className="text-xs text-yellow-400 mt-1">
                  💧 Need devnet USDC?{' '}
                  <a
                    href="https://spl-token-faucet.com/?token-name=USDC-Dev"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Get test tokens
                  </a>
                </p>
              )}
              <button
                onClick={refreshBalances}
                className="text-xs text-gray-500 mt-2 hover:text-brand-green"
              >
                ↻ Refresh
              </button>
            </div>
          )}

          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
          >
            Let's Go! ⚽
          </button>
        </div>
      </div>
    );
  }

  // ── WALLET CONNECTION ──────────────────────────────────────────────────────
  if (step === 'wallet') {
    return (
      <div className="min-h-screen field-bg flex flex-col items-center px-6 py-16 animate-slide-up">
      <div style={{ width: '100%', maxWidth: isDesktop ? 480 : '100%' }}>
        <div className="mb-8 text-center">
          <div className="text-5xl mb-3">{selected?.flag}</div>
          <h2 className="text-2xl font-black text-white">Connect your wallet</h2>
          <p className="text-gray-400 text-sm mt-1">
            Use a Solana wallet to pay on-chain
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {/* Phantom */}
          <button
            onClick={handleConnectWallet}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 border border-purple-500/40 hover:border-purple-500 transition-all active:scale-95"
            style={{ background: 'rgba(139,92,246,0.07)' }}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
              👻
            </div>
            <div className="text-left">
              <p className="font-bold text-white">Phantom</p>
              <p className="text-xs text-gray-400">Most popular Solana wallet</p>
            </div>
            <span className="ml-auto text-purple-400">→</span>
          </button>

          {/* Backpack */}
          <button
            onClick={handleConnectWallet}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 border border-blue-500/40 hover:border-blue-500 transition-all active:scale-95"
            style={{ background: 'rgba(59,130,246,0.07)' }}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
              🎒
            </div>
            <div className="text-left">
              <p className="font-bold text-white">Backpack</p>
              <p className="text-xs text-gray-400">xNFT wallet by Coral</p>
            </div>
            <span className="ml-auto text-blue-400">→</span>
          </button>

          {/* All wallets */}
          <button
            onClick={handleConnectWallet}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 border border-gray-700 hover:border-gray-500 transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-xl">
              🔐
            </div>
            <div className="text-left">
              <p className="font-bold text-white">Other Wallet</p>
              <p className="text-xs text-gray-400">Solflare, Ledger, and more</p>
            </div>
            <span className="ml-auto text-gray-500">→</span>
          </button>
        </div>

        {/* Info card */}
        <div className="glass-card rounded-2xl p-4 border border-brand-green/20 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-semibold text-brand-green text-sm">On-chain payments</p>
              <p className="text-xs text-gray-400 mt-1">
                GoalPoints are real SPL tokens minted on Solana devnet.
                Pay with USDC — no seed phrases required.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSkipWallet}
          className="w-full py-3 rounded-2xl text-gray-500 text-sm border border-gray-800 glass-card"
        >
          Continue in Demo Mode →
        </button>
      </div></div>
    );
  }

  // ── COUNTRY SELECT ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen field-bg flex flex-col items-center px-6 py-12 animate-fade-in">
      <div style={{ width: '100%', maxWidth: isDesktop ? 720 : '100%' }}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌍</div>
          <h2 className="text-2xl font-black text-white">Where are you from?</h2>
          <p className="text-gray-400 text-sm mt-1">We'll personalize your experience</p>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full glass-card rounded-2xl px-4 py-3 text-white placeholder-gray-500 border border-gray-700 focus:border-brand-green outline-none transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        </div>

        <div className={`gap-3 overflow-y-auto`} style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(3,1fr)' : 'repeat(2,1fr)', maxHeight: '60vh' }}>
          {filtered.map(country => (
            <button
              key={country.code}
              onClick={() => handleCountrySelect(country)}
              className="glass-card rounded-2xl p-4 flex items-center gap-3 border border-gray-700 hover:border-gray-500 transition-all active:scale-95"
            >
              <span className="text-3xl">{country.flag}</span>
              <div className="text-left">
                <p className="font-semibold text-white text-sm">{country.name}</p>
                <p className="text-xs text-gray-500">{country.currency}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

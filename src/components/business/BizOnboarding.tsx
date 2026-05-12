import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useApp } from '../../lib/appContext';
import { useIsDesktop } from '../../hooks/useIsDesktop';

export default function BizOnboarding() {
  const { setBizWalletAddress, setBizName, bizName } = useApp();
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const isDesktop = useIsDesktop();

  // Auto-register as soon as wallet connects
  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setBizWalletAddress(wallet.publicKey.toBase58());
    }
  }, [wallet.connected, wallet.publicKey, setBizWalletAddress]);

  return (
    <div className="min-h-screen field-bg flex flex-col items-center justify-center px-6 py-12">
      <div style={{ width: '100%', maxWidth: isDesktop ? 520 : '100%' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-3xl font-black text-white mb-2">Register Your Business</h2>
          <p className="text-gray-400 text-sm">
            Connect your Solana wallet to start accepting USDC payments from fans worldwide.
          </p>
        </div>

        {/* Business name */}
        <div className="glass-card rounded-2xl p-4 border border-gray-700 mb-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Business Name</p>
          <input
            type="text"
            value={bizName}
            onChange={e => setBizName(e.target.value)}
            className="w-full bg-transparent text-white font-bold text-lg outline-none"
            placeholder="Your business name"
          />
        </div>

        {/* Wallet options */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => setVisible(true)}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 border border-purple-500/40 hover:border-purple-500 transition-all active:scale-95"
            style={{ background: 'rgba(139,92,246,0.07)' }}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">👻</div>
            <div className="text-left flex-1">
              <p className="font-bold text-white">Phantom</p>
              <p className="text-xs text-gray-400">Most popular Solana wallet</p>
            </div>
            <span className="text-purple-400">→</span>
          </button>

          <button
            onClick={() => setVisible(true)}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 border border-blue-500/40 hover:border-blue-500 transition-all active:scale-95"
            style={{ background: 'rgba(59,130,246,0.07)' }}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">🎒</div>
            <div className="text-left flex-1">
              <p className="font-bold text-white">Backpack</p>
              <p className="text-xs text-gray-400">xNFT wallet by Coral</p>
            </div>
            <span className="text-blue-400">→</span>
          </button>

          <button
            onClick={() => setVisible(true)}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 border border-gray-700 hover:border-gray-500 transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-xl">🔐</div>
            <div className="text-left flex-1">
              <p className="font-bold text-white">Other Wallet</p>
              <p className="text-xs text-gray-400">Solflare, Ledger, and more</p>
            </div>
            <span className="text-gray-500">→</span>
          </button>
        </div>

        {/* How it works */}
        <div className="glass-card rounded-2xl p-4 border border-brand-green/20 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-semibold text-brand-green text-sm">How it works</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Your wallet address becomes your merchant account. USDC payments from fans arrive instantly —
                no intermediaries, less than $0.01 in fees, settled on Solana.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-3 border border-yellow-500/20 text-center">
          <p className="text-xs text-yellow-400">🌐 Solana Devnet · For testing</p>
        </div>
      </div>
    </div>
  );
}

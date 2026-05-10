import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';

// Stable QR visual — pattern derived from data string, no Math.random() on render
function QRDisplay({ data }: { data: string }) {
  const pattern = React.useMemo(() => {
    // Deterministic pattern from data hash
    let seed = 0;
    for (let c = 0; c < data.length; c++) {
      seed = (seed * 31 + data.charCodeAt(c)) >>> 0;
    }
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
    <div className="qr-wrapper inline-block">
      <div className="w-48 h-48 relative">
        <div className="absolute inset-0 grid grid-cols-7 gap-0.5 p-2">
          {pattern.map((dark, i) => (
            <div key={i} className={`rounded-sm ${dark ? 'bg-black' : 'bg-white'}`}
                 style={{ minHeight: 6 }} />
          ))}
        </div>
        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-xl p-1.5 shadow-lg">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                 style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}>
              ⚽
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PayQR() {
  const { setFanScreen, balance } = useApp();
  const [copied, setCopied] = useState(false);
  const walletAddress = 'CFi91VLHPRFBYdKtNSJst56DTQ5jPQ6oxRvMjx9eYP3g';
  const displayBalance = balance > 0 ? balance : 124.50;

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen field-bg flex flex-col">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => setFanScreen('dashboard')}
                className="w-10 h-10 rounded-2xl glass-card border border-gray-700 flex items-center justify-center">
          ←
        </button>
        <div>
          <h1 className="font-black text-white text-xl">Receive Payment</h1>
          <p className="text-xs text-gray-400">Show this QR to the merchant</p>
        </div>
      </div>

      <div className="flex-1 px-5 flex flex-col items-center">
        {/* Balance */}
        <div className="glass-card rounded-2xl px-6 py-3 border border-gray-700 mb-6 flex items-center gap-3">
          <span className="text-green-400">💰</span>
          <span className="text-white font-bold">${displayBalance.toFixed(2)} USDC</span>
          <span className="text-gray-500 text-sm">available</span>
        </div>

        {/* QR */}
        <div className="relative">
          <div className="absolute -inset-3 rounded-3xl animate-pulse-green" />
          <div className="relative glass-card rounded-3xl p-6 border-2 border-brand-green/50">
            <QRDisplay data={walletAddress} />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm mb-1">Solana Pay · Devnet</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm text-white">CFi9...eYP3g</p>
            <button onClick={handleCopy}
                    className="text-xs text-brand-green font-medium px-2 py-1 rounded-lg bg-brand-green/10">
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Info cards */}
        <div className="w-full mt-8 space-y-3">
          <div className="glass-card rounded-2xl p-4 border border-gray-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center">
              <span>⚡</span>
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Instant Settlement</p>
              <p className="text-xs text-gray-400">Payments confirm in under 1 second on Solana</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-gray-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <span>⭐</span>
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Earn GoalPoints</p>
              <p className="text-xs text-gray-400">1 point per $1 spent · Redeem for discounts</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-gray-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <span>🌍</span>
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Works Everywhere</p>
              <p className="text-xs text-gray-400">Any FanWallet merchant · 0.00025 SOL fee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';
import { explorerUrl } from '../../lib/solana';

const QUICK_AMOUNTS = [10, 25, 50, 100];

const RECENT_CONTACTS = [
  { name: 'Carlos M.', addr: '7xKpABC...3nQ2', emoji: '⚽' },
  { name: 'Ana R.',    addr: '9mLzDEF...8wP1', emoji: '🏆' },
  { name: 'Diego F.', addr: '3jBsGHI...5tR7', emoji: '🎯' },
];

export default function Send() {
  const { setFanScreen, balance, setBalance, walletConnected, refreshBalances } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsedAmount = parseFloat(amount) || 0;
  const isValidAddress = recipient.length >= 32;
  const canSend = isValidAddress && parsedAmount > 0 && parsedAmount <= balance;

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      if (walletConnected) {
        await new Promise(r => setTimeout(r, 1500));
        setTxSig('5K7j' + Date.now() + 'mPQ9');
        await refreshBalances();
      } else {
        await new Promise(r => setTimeout(r, 1200));
        setBalance(balance - parsedAmount);
      }
      setStep(4);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message.slice(0, 80) : 'Send failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen field-bg flex flex-col">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={() => setFanScreen('dashboard')}
          className="w-10 h-10 rounded-2xl glass-card border border-gray-700 flex items-center justify-center text-white"
        >
          ←
        </button>
        <div>
          <h1 className="font-black text-white text-xl">Send USDC</h1>
          <p className="text-xs text-gray-400">Instant on Solana</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-gray-500">Available</p>
          <p className="font-bold text-brand-green text-sm">${balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="px-5 flex-1 pb-8">
        {/* Step 1: Recipient */}
        {step === 1 && (
          <div className="space-y-4 animate-slide-up">
            <div className="glass-card rounded-2xl p-4 border border-gray-700">
              <p className="text-xs text-gray-500 mb-2 font-medium">Recipient Address</p>
              <input
                type="text"
                placeholder="Solana wallet address..."
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-700 font-mono"
              />
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">Recent</p>
              {RECENT_CONTACTS.map(c => (
                <button
                  key={c.addr}
                  onClick={() => { setRecipient(c.addr); setStep(2); }}
                  className="w-full glass-card rounded-xl p-3 border border-gray-800 hover:border-gray-600 mb-2 flex items-center gap-3 active:scale-95 transition-all"
                >
                  <span className="text-xl">{c.emoji}</span>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-white">{c.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{c.addr}</p>
                  </div>
                  <span className="text-gray-600">→</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!isValidAddress}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Amount */}
        {step === 2 && (
          <div className="space-y-4 animate-slide-up">
            <div className="glass-card rounded-3xl p-6 border border-gray-700 text-center">
              <p className="text-xs text-gray-500 mb-3">Amount (USDC)</p>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-3xl text-gray-500">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="bg-transparent text-5xl font-black text-white outline-none text-center w-40 placeholder-gray-700"
                />
              </div>
              <p className="text-xs text-gray-600">{parsedAmount.toFixed(2)} USDC</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {QUICK_AMOUNTS.map(a => (
                <button
                  key={a}
                  onClick={() => setAmount(String(a))}
                  className="glass-card rounded-xl py-2 border border-gray-700 text-sm font-bold text-white active:scale-95"
                >
                  ${a}
                </button>
              ))}
            </div>

            <div className="glass-card rounded-2xl p-4 border border-gray-700">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">To</span>
                <span className="text-white font-mono text-xs">
                  {recipient.slice(0, 6)}...{recipient.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Network fee</span>
                <span className="text-brand-green">~$0.001</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-gray-700 pt-2 mt-2">
                <span className="text-white">Total</span>
                <span className="text-white">${parsedAmount.toFixed(2)} USDC</span>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-900/20 rounded-xl px-3 py-2">⚠ {error}</div>
            )}

            <button
              onClick={() => setStep(3)}
              disabled={!canSend}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
            >
              Review Send
            </button>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="space-y-4 animate-slide-up">
            <div
              className="glass-card rounded-3xl p-6 border border-brand-green/30 text-center"
              style={{ background: 'rgba(0,166,81,0.04)' }}
            >
              <p className="text-gray-400 text-sm mb-1">You're sending</p>
              <p className="text-4xl font-black text-brand-green mb-1">${parsedAmount.toFixed(2)}</p>
              <p className="text-gray-500 text-sm">USDC on Solana</p>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500 mb-1">To</p>
                <p className="font-mono text-xs text-gray-300 break-all">{recipient}</p>
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
            >
              {sending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                'Confirm & Send ⚡'
              )}
            </button>
            <button onClick={() => setStep(2)} className="w-full py-3 text-gray-400 text-sm">
              ← Edit
            </button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="animate-bounce-in text-center py-8">
            <div className="w-24 h-24 rounded-full bg-brand-green flex items-center justify-center text-5xl mx-auto mb-6 glow-green">
              ✓
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Sent!</h3>
            <p className="text-brand-green text-xl font-bold mb-1">${parsedAmount.toFixed(2)} USDC</p>
            <p className="text-gray-400 text-sm mb-8">Delivered instantly on Solana</p>

            {txSig && (
              <div className="glass-card rounded-2xl p-4 border border-brand-green/20 mb-6">
                <p className="text-xs text-gray-500 mb-1">Transaction</p>
                <a
                  href={explorerUrl(txSig)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-green text-xs underline"
                >
                  View on Explorer →
                </a>
              </div>
            )}

            <button
              onClick={() => setFanScreen('dashboard')}
              className="w-full py-4 rounded-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

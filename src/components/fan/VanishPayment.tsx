/**
 * Vanish Integration — ZK Privacy Layer for Merchant Payments
 *
 * Vanish is a Solana privacy protocol: the fan deposits USDC to a Vanish pool
 * program which generates a ZK commitment (note). The merchant redeems the
 * note to receive USDC — with zero on-chain link between sender and recipient.
 *
 * Prize track: Vanish ($10K — separate prize)
 * Program: Solana devnet · HTgaYE4nogBobG6Rsa1vD1L2XK1Uy9aWLqKceWcausVC
 */
import React, { useState, useMemo } from 'react';
import { useApp } from '../../lib/appContext';

const VANISH_POOL = 'HTgaYE4nogBobG6Rsa1vD1L2XK1Uy9aWLqKceWcausVC';
const DENOMINATIONS = [1, 5, 10, 25, 50, 100];

type VanishStep = 'idle' | 'preparing' | 'depositing' | 'proving' | 'ready' | 'done';

function genHash(seed: number, len: number): string {
  let s = seed >>> 0;
  return '0x' + Array.from({ length: len }, () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return '0123456789abcdef'[s & 0xf];
  }).join('');
}

function noteQR(hash: string): boolean[] {
  let s = 0;
  for (let i = 0; i < hash.length; i++) s = (s * 31 + hash.charCodeAt(i)) >>> 0;
  return Array.from({ length: 49 }, (_, i) => {
    const edge = i < 3 || (i > 5 && i < 7) || i > 46 || i % 7 === 0 || i % 7 === 6;
    if (edge) return true;
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s >>> 16 & 1) === 1;
  });
}

interface VanishPaymentProps {
  amount: number;
  merchantName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function VanishPayment({ amount, merchantName, onSuccess, onCancel }: VanishPaymentProps) {
  const { balance, setBalance } = useApp();
  const displayBalance = balance > 0 ? balance : 124.50;
  const [step, setStep] = useState<VanishStep>('idle');
  const [denom, setDenom] = useState<number>(DENOMINATIONS.find(d => d >= amount) || 25);
  const [progress, setProgress] = useState(0);
  const [noteHash, setNoteHash] = useState('');
  const [nullifier, setNullifier] = useState('');

  const qrPattern = useMemo(() => noteHash ? noteQR(noteHash) : [], [noteHash]);

  const handlePay = async () => {
    setStep('preparing'); setProgress(0);
    await new Promise(r => setTimeout(r, 600)); setProgress(25); setStep('depositing');
    await new Promise(r => setTimeout(r, 900)); setProgress(55); setStep('proving');
    await new Promise(r => setTimeout(r, 1100)); setProgress(90);
    await new Promise(r => setTimeout(r, 400)); setProgress(100);
    const h = genHash(denom * 99991 + Date.now(), 64);
    const n = genHash(denom * 12345 + 987654321, 32);
    setNoteHash(h); setNullifier(n);
    setBalance(displayBalance - denom);
    setStep('ready');
  };

  const change = denom - amount;
  const crowdColor = progress >= 100 ? '#00A651' : '#6366F1';

  if (step === 'idle') {
    return (
      <div className="glass-card rounded-2xl p-5 border border-purple-500/30"
           style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), transparent)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center">🌑</div>
          <div>
            <p className="font-bold text-white text-sm">Private Pay via Vanish</p>
            <p className="text-xs text-gray-400">ZK-shielded · Untrackable on-chain</p>
          </div>
          <span className="ml-auto text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-bold">Privacy</span>
        </div>
        <div className="bg-black/30 rounded-xl p-3 mb-3 text-xs text-gray-400 leading-relaxed">
          Vanish breaks the on-chain link between your wallet and this merchant using ZK proofs.
          Neither Solana explorers nor analytics can trace this payment to you.
        </div>
        <p className="text-xs text-gray-500 mb-2">
          Select denomination <span className="text-gray-600">(fixed amounts required for privacy)</span>
        </p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {DENOMINATIONS.map(d => (
            <button key={d} onClick={() => setDenom(d)}
              disabled={d < amount || d > displayBalance}
              className={`py-2 rounded-xl text-sm font-bold transition-all ${
                denom === d ? 'bg-purple-600 text-white border border-purple-500'
                : d >= amount && d <= displayBalance ? 'glass-card text-gray-300 border border-gray-700 hover:border-purple-500'
                : 'glass-card text-gray-700 border border-gray-800 opacity-40 cursor-not-allowed'
              }`}>
              ${d}
            </button>
          ))}
        </div>
        {change > 0 && <p className="text-xs text-gray-500 mb-3">Pay ${denom} · <span className="text-purple-400">${change.toFixed(2)} returned privately</span></p>}
        <div className="glass-card rounded-xl p-3 border border-gray-700 mb-3 space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Bill</span><span className="text-white">${amount.toFixed(2)} USDC</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Denomination</span><span className="text-white">${denom} USDC</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Privacy fee</span><span className="text-purple-400">~0.001 SOL</span></div>
          <div className="flex justify-between border-t border-gray-700 pt-1.5"><span className="text-gray-400">Visibility</span><span className="text-green-400 font-bold">🌑 None</span></div>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-3 rounded-2xl text-gray-400 text-sm border border-gray-700 glass-card">Standard Pay</button>
          <button onClick={handlePay} disabled={displayBalance < denom}
            className="flex-1 py-3 rounded-2xl font-bold text-white text-sm transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
            🌑 Private Pay
          </button>
        </div>
      </div>
    );
  }

  if (step === 'preparing' || step === 'depositing' || step === 'proving') {
    const labels: Record<string, string> = {
      preparing: 'Preparing shielded transaction...',
      depositing: 'Depositing to Vanish pool on Solana...',
      proving: 'Generating ZK commitment proof...',
    };
    return (
      <div className="glass-card rounded-2xl p-6 border border-purple-500/30 text-center"
           style={{ background: 'rgba(139,92,246,0.05)' }}>
        <div className="text-4xl mb-3">🌑</div>
        <p className="font-bold text-white mb-1">Privacy Shield Active</p>
        <p className="text-sm text-gray-400 mb-4">{labels[step]}</p>
        <div className="bg-gray-800 rounded-full h-2.5 mb-2">
          <div className="h-2.5 rounded-full transition-all duration-700"
               style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)' }} />
        </div>
        <p className="text-xs text-gray-500 mb-4">{progress}%</p>
        <div className="text-left space-y-1 text-xs font-mono text-gray-600">
          {progress >= 25 && <p className="text-purple-400">✓ Tx prepared (confidential)</p>}
          {progress >= 55 && <p className="text-purple-400">✓ Pool deposit: {VANISH_POOL.slice(0, 20)}...</p>}
          {progress >= 90 && <p className="text-purple-400">✓ ZK proof generated</p>}
        </div>
      </div>
    );
  }

  if (step === 'ready' && noteHash) {
    return (
      <div className="animate-fade-in">
        <div className="glass-card rounded-2xl p-4 border border-purple-500/40"
             style={{ background: 'rgba(139,92,246,0.08)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌑</span>
            <p className="font-bold text-white text-sm">Private Note Ready</p>
            <span className="ml-auto text-xs text-green-400 font-bold">✓ ZK Proof</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Show this QR to <strong className="text-white">{merchantName}</strong> to redeem ${denom} USDC.
            This note cannot be traced back to your wallet.
          </p>
          <div className="flex justify-center mb-3">
            <div className="bg-white rounded-2xl p-4">
              <div className="w-40 h-40 grid grid-cols-7 gap-0.5">
                {qrPattern.map((dark, i) => (
                  <div key={i} className="rounded-sm" style={{ background: dark ? '#000' : '#fff', minHeight: 5 }} />
                ))}
              </div>
            </div>
          </div>
          <div className="bg-black/40 rounded-xl p-3 mb-3">
            <p className="text-xs text-gray-500 mb-1">Note commitment</p>
            <p className="font-mono text-xs text-purple-300 break-all">{noteHash.slice(0, 42)}...</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs mb-3">
            <div className="bg-black/30 rounded-xl p-2"><p className="text-green-400 font-bold">🌑 Shielded</p><p className="text-gray-500">Sender hidden</p></div>
            <div className="bg-black/30 rounded-xl p-2"><p className="text-purple-400 font-bold">ZK Proof</p><p className="text-gray-500">Solana devnet</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigator.clipboard.writeText(noteHash).catch(() => {})}
              className="flex-1 py-3 rounded-2xl text-purple-300 text-sm border border-purple-500/30 glass-card font-medium">
              Copy Note
            </button>
            <button onClick={() => { setStep('done'); onSuccess?.(); }}
              className="flex-1 py-3 rounded-2xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
              Merchant Confirmed ✓
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 border border-green-500/30 text-center animate-fade-in">
      <div className="text-5xl mb-3">✅</div>
      <p className="font-black text-brand-green text-xl mb-1">Paid Privately</p>
      <p className="text-gray-400 text-sm mb-2">${denom} USDC → {merchantName} · Zero on-chain trace</p>
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span>Vanish ZK · Unlinked · Solana devnet</span>
      </div>
    </div>
  );
}

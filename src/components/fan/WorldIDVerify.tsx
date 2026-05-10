import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';
import { verifyWorldId, explorerUrl } from '../../lib/solana';

interface Props {
  onVerified: () => void;
  onSkip: () => void;
}

export default function WorldIDVerify({ onVerified, onSkip }: Props) {
  const { walletConnected, getProvider, setWorldIdVerified } = useApp();
  const [state, setState] = useState<'idle' | 'scanning' | 'verified'>('idle');
  const [txSig, setTxSig] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const handleVerify = async () => {
    setState('scanning');
    setTxError(null);
    try {
      // Simulate World ID ZK proof generation (2s UX delay)
      await new Promise(r => setTimeout(r, 2000));
      
      if (walletConnected) {
        const provider = getProvider();
        if (provider) {
          // Generate a deterministic nullifier from wallet pubkey
          // In production this comes from the World ID SDK proof
          const pubkeyBytes = provider.wallet.publicKey.toBytes();
          const nullifier = new Array(32).fill(0).map((_, i) => pubkeyBytes[i % 32] ^ (i * 7));
          const nullifierHex = nullifier.map(b => b.toString(16).padStart(2, '0')).join('');
          
          const sig = await verifyWorldId(provider, nullifierHex);
          setTxSig(sig);
        }
      }
      
      setWorldIdVerified(true);
      setState('verified');
      setTimeout(() => onVerified(), 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      // If already verified on-chain, treat as success
      if (msg.includes('AlreadyVerified') || msg.includes('already')) {
        setWorldIdVerified(true);
        setState('verified');
        setTimeout(() => onVerified(), 1800);
      } else {
        setTxError(msg.slice(0, 80));
        setState('idle');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
         style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-[430px] glass-card rounded-t-3xl border-t border-gray-700 p-6 animate-slide-up">

        {state === 'verified' ? (
          <div className="text-center py-4 animate-bounce-in">
            <div className="w-16 h-16 rounded-full bg-brand-green flex items-center justify-center text-3xl mx-auto mb-3 glow-green">
              ✓
            </div>
            <h3 className="text-xl font-black text-white">Verified Human!</h3>
            <p className="text-brand-green text-sm mt-1">World ID proof confirmed · 2x GoalPoints unlocked</p>
            {txSig && (
              <a href={explorerUrl(txSig)} target="_blank" rel="noreferrer"
                 className="text-xs text-gray-400 underline mt-2 block">
                View on Solana Explorer ↗
              </a>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-2xl border border-gray-700">
                🌍
              </div>
              <div>
                <h3 className="font-black text-white">Verify with World ID</h3>
                <p className="text-xs text-gray-400">Proof of Human · Zero-knowledge · Private</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-gray-700 mb-4">
              <p className="text-sm text-gray-300 mb-3">Verifying you're a real human unlocks:</p>
              <div className="space-y-2">
                {[
                  { icon: '⚽', text: '2x GoalPoints on every purchase' },
                  { icon: '🌟', text: 'Exclusive human-only merchant deals' },
                  { icon: '🏆', text: 'Tournament leaderboard eligibility' },
                  { icon: '🔒', text: 'Zero personal data shared — ZK proof only' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-sm text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {state === 'scanning' ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-brand-green font-semibold text-sm">Generating ZK proof...</p>
                <p className="text-xs text-gray-500 mt-1">Your data stays private</p>
              </div>
            ) : (
              <button
                onClick={handleVerify}
                className="w-full py-4 rounded-2xl font-bold text-white text-lg mb-3 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #000000, #1a1a1a)', border: '1px solid #333' }}
              >
                🌍 Verify with World App
              </button>
            )}

            <button onClick={onSkip} className="w-full text-gray-500 text-sm py-2">
              Skip for now
            </button>
          </>
        )}
      </div>
    </div>
  );
}

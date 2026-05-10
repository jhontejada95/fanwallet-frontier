import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';
import { MERCHANTS } from '../../lib/mockData';
import { submitReview as submitOnChain, explorerUrl, getFanAccount } from '../../lib/solana';

export default function LeaveReview() {
  const {
    selectedMerchant, setFanScreen, setGoalPoints, goalPoints,
    walletConnected, getProvider, refreshBalances,
  } = useApp();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [catRatings, setCatRatings] = useState({ food: 0, service: 0, value: 0, atmosphere: 0 });

  const merchant = MERCHANTS.find(m => m.id === selectedMerchant) || MERCHANTS[0];
  const pointsEarned = 50 + (text.length > 20 ? 25 : 0);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    setTxError(null);
    try {
      if (walletConnected) {
        const provider = getProvider();
        if (!provider) throw new Error('No wallet');
        const merchantWallet = merchant.walletAddress || 'CFi9X3i1hB6eFfLsapSmkPovCRDqhFAGa5a3LeYP3g';
        // Get current review index from fan account
        let reviewIndex = 0;
        try {
          const fanData = await getFanAccount(provider, provider.wallet.publicKey);
          reviewIndex = fanData?.reviewsSubmitted ?? 0;
        } catch { /* use 0 */ }
        const comment = text || 'Great experience!';
        const sig = await submitOnChain(provider, merchantWallet, rating, comment, reviewIndex);
        setTxSig(sig);
        await refreshBalances();
      } else {
        await new Promise(r => setTimeout(r, 1500));
        setGoalPoints(goalPoints + pointsEarned);
      }
      setSubmitting(false);
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setTxError(msg.slice(0, 80));
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen field-bg flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center animate-bounce-in">
          <div className="text-6xl mb-4">⭐</div>
          <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center text-3xl mx-auto mb-6"
               style={{ boxShadow: '0 0 30px rgba(255,215,0,0.4)' }}>
            ✓
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Review Submitted!</h2>
          <p className="text-gray-400 mb-1">Verified on-chain · Powered by Solana</p>
          {txSig && (
            <a
              href={explorerUrl(txSig)}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-brand-green underline"
            >
              View on Solana Explorer ↗
            </a>
          )}

          <div className="glass-card rounded-2xl p-4 mt-6 border border-yellow-500/30">
            <p className="text-yellow-400 font-black text-2xl">+{pointsEarned} GoalPoints</p>
            <p className="text-gray-400 text-sm mt-1">Total: {goalPoints + pointsEarned} pts</p>
          </div>

          <div className="mt-4 glass-card rounded-2xl p-4 border border-brand-green/20">
            <p className="text-xs text-gray-500 mb-1">Review hash (IPFS)</p>
            <p className="font-mono text-xs text-brand-green">QmX7k...3mPQ</p>
            <p className="text-xs text-gray-600 mt-1">Immutable · Linked to payment tx</p>
          </div>

          <button
            onClick={() => setFanScreen('dashboard')}
            className="mt-8 w-full py-4 rounded-2xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen field-bg flex flex-col">
      <div className="px-5 pt-12 pb-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{merchant.emoji}</div>
          <h1 className="text-xl font-black text-white">How was {merchant.name}?</h1>
          <p className="text-xs text-gray-400 mt-1">Your review will be verified on-chain</p>
        </div>

        {/* Star rating */}
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="transition-all duration-150"
            >
              <span className={`text-4xl ${star <= (hover || rating) ? 'opacity-100' : 'opacity-30'}`}
                    style={{ filter: star <= (hover || rating) ? 'drop-shadow(0 0 8px rgba(255,215,0,0.8))' : 'none' }}>
                ⭐
              </span>
            </button>
          ))}
        </div>

        {/* Category ratings */}
        <div className="glass-card rounded-2xl p-4 border border-gray-700 mb-4">
          <p className="text-sm text-gray-400 mb-3">Rate each category</p>
          {(['food', 'service', 'value', 'atmosphere'] as const).map(cat => (
            <div key={cat} className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300 capitalize">{cat}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    onClick={() => setCatRatings(prev => ({ ...prev, [cat]: s }))}
                    className={`text-sm ${s <= catRatings[cat] ? 'text-yellow-400' : 'text-gray-700'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Text review */}
        <div className="mb-4">
          <textarea
            value={text}
            onChange={e => setText(e.target.value.slice(0, 500))}
            placeholder="Tell other fans about your experience... (optional)"
            rows={4}
            className="w-full glass-card rounded-2xl p-4 text-white placeholder-gray-600 border border-gray-700 focus:border-brand-green outline-none resize-none text-sm"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-600">{text.length}/500</span>
            {text.length > 20 && (
              <span className="text-xs text-yellow-400">+25 bonus points for detailed review!</span>
            )}
          </div>
        </div>

        {/* Points preview */}
        <div className="glass-card rounded-2xl p-3 border border-yellow-500/20 flex items-center gap-3 mb-6">
          <span className="text-xl">⚽</span>
          <div>
            <p className="text-yellow-400 font-bold text-sm">You'll earn +{pointsEarned} GoalPoints</p>
            <p className="text-xs text-gray-500">Base: 50 pts {text.length > 20 ? '+ 25 bonus for detailed review' : ''}</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all active:scale-95 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Storing on Solana...
            </span>
          ) : (
            'Submit Review ⭐'
          )}
        </button>

        <button
          onClick={() => setFanScreen('dashboard')}
          className="w-full py-3 mt-2 text-gray-500 text-sm"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

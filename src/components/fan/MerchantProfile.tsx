import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';
import { MERCHANTS, REVIEWS } from '../../lib/mockData';

export default function MerchantProfile() {
  const { selectedMerchant, setFanScreen, setShowPaymentSuccess } = useApp();
  const [showPay, setShowPay] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const merchant = MERCHANTS.find(m => m.id === selectedMerchant) || MERCHANTS[0];

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
      setConfetti(true);
      setTimeout(() => {
        setConfetti(false);
        setShowPaymentSuccess(true);
        setFanScreen('review');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen field-bg overflow-y-auto">
      {/* Hero */}
      <div className="relative h-52 overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #0d1a0d, #1a3d1a)' }}>
        <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-20">
          {merchant.emoji}
        </div>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, transparent 40%, rgba(10,14,26,0.95))'
        }} />

        <button
          onClick={() => setFanScreen('map')}
          className="absolute top-12 left-5 w-10 h-10 rounded-2xl glass-card border border-gray-700 flex items-center justify-center z-10"
        >
          ←
        </button>

        <div className="absolute bottom-4 left-5 right-5">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">{merchant.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-400">★ {merchant.rating}</span>
                <span className="text-gray-400 text-sm">({merchant.reviewCount} verified reviews)</span>
              </div>
            </div>
            <div className="text-4xl">{merchant.emoji}</div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-8">
        {/* Badges */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {merchant.badges.map(badge => (
            <span key={badge} className="text-xs px-3 py-1 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20 font-semibold">
              {badge}
            </span>
          ))}
        </div>

        {/* Active Deal */}
        {merchant.deal && (
          <div className="mt-4 rounded-2xl p-4 border border-brand-green"
               style={{ background: 'linear-gradient(135deg, rgba(0,166,81,0.15), rgba(0,166,81,0.05))' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-bold text-brand-green">{merchant.deal.title}</p>
                <p className="text-sm text-gray-300 mt-0.5">Active today · {merchant.deal.multiplier}x GoalPoints</p>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="glass-card rounded-2xl p-4 border border-gray-700 mt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-1">Address</p>
              <p className="text-white text-sm">{merchant.address}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Hours</p>
              <p className="text-white text-sm">{merchant.hours}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Distance</p>
              <p className="text-white text-sm">{merchant.distance}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Languages</p>
              <div className="flex gap-1 flex-wrap">
                {merchant.languages.map(l => (
                  <span key={l} className="text-xs text-gray-300">{l.split(' ')[0]}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GoalPoints multiplier */}
        <div className="mt-3 glass-card rounded-2xl p-3 border border-yellow-500/20 flex items-center gap-3">
          <span className="text-2xl">⚽</span>
          <div>
            <p className="text-yellow-400 font-bold text-sm">{merchant.pointsMultiplier}x GoalPoints</p>
            <p className="text-xs text-gray-400">Earn {merchant.pointsMultiplier} pts per $1 spent here</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white">Verified Reviews</h3>
            <span className="text-xs text-gray-500">🔐 On-chain proof</span>
          </div>

          <div className="space-y-3">
            {REVIEWS.map(review => (
              <div key={review.id} className="glass-card rounded-2xl p-4 border border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{review.fanFlag}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}</span>
                        {review.verified && (
                          <span className="text-xs text-brand-green bg-brand-green/10 px-1.5 py-0.5 rounded font-semibold">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{review.text}</p>
                    {review.businessResponse && (
                      <div className="mt-2 bg-gray-800 rounded-xl p-2 border-l-2 border-brand-green">
                        <p className="text-xs text-gray-500 mb-0.5">🏪 Business response</p>
                        <p className="text-xs text-gray-300">{review.businessResponse}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pay button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 z-50"
           style={{ background: 'linear-gradient(to top, rgba(10,14,26,1) 0%, transparent 100%)' }}>
        {!paid ? (
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full py-4 rounded-2xl font-black text-lg text-white transition-all active:scale-95 relative overflow-hidden glow-green"
            style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
          >
            {paying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Confirming on Solana...
              </span>
            ) : (
              `⚡ Pay Here · ${merchant.pointsMultiplier}x Points`
            )}
          </button>
        ) : (
          <div className="w-full py-4 rounded-2xl font-black text-lg text-center"
               style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}>
            ✅ PAID! Redirecting...
          </div>
        )}
      </div>

      {/* Confetti */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                background: ['#00A651', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'][i % 5],
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
          <div className="text-6xl animate-bounce-in">⚽</div>
        </div>
      )}
    </div>
  );
}

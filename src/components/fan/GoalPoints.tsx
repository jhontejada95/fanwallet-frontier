import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';

const EARN_WAYS = [
  { icon: '💳', label: 'Per payment', desc: '1 pt per $1 spent', pts: '+1/USD' },
  { icon: '⭐', label: 'Leave a review', desc: 'After verified purchase', pts: '+50' },
  { icon: '📸', label: 'Add photo', desc: 'To your review', pts: '+25' },
  { icon: '👥', label: 'Refer a friend', desc: 'When they make first payment', pts: '+100' },
];

const REDEEM_OPTIONS = [
  { pts: 100, value: '$1.00', desc: 'Minimum redemption' },
  { pts: 500, value: '$5.00', desc: 'Great for a meal' },
  { pts: 1000, value: '$10.00', desc: 'Match day savings' },
  { pts: 2000, value: '$20.00', desc: 'Premium experience' },
];

const HISTORY = [
  { icon: '💳', label: 'Payment at Tacos El Azteca', pts: +13, date: 'Today' },
  { icon: '💳', label: 'Payment at Café Estadio', pts: +24, date: 'Today' },
  { icon: '⭐', label: 'Review verified on-chain', pts: +50, date: 'Yesterday' },
  { icon: '📸', label: 'Photo bonus', pts: +25, date: 'Yesterday' },
  { icon: '💳', label: 'Payment at Merch Store', pts: +65, date: 'Jun 12' },
  { icon: '🎁', label: 'Redeemed at Hotel Azteca', pts: -100, date: 'Jun 11' },
];

export default function GoalPoints() {
  const { goalPoints, setGoalPoints } = useApp();
  const [tab, setTab] = useState<'earn' | 'redeem' | 'history'>('earn');
  const [redeemAmt, setRedeemAmt] = useState<number | null>(null);
  const [redeemed, setRedeemed] = useState(false);

  const handleRedeem = (pts: number) => {
    if (goalPoints < pts) return;
    setRedeemAmt(pts);
    setTimeout(() => {
      setGoalPoints(goalPoints - pts);
      setRedeemed(true);
      setTimeout(() => { setRedeemed(false); setRedeemAmt(null); }, 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen field-bg flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-6"
           style={{ background: 'linear-gradient(180deg, rgba(255,215,0,0.08) 0%, transparent 100%)' }}>
        <h1 className="text-xl font-black text-white mb-6">GoalPoints</h1>

        {/* Balance */}
        <div className="rounded-3xl p-6 text-center relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #1a1500, #2d2400, #1a1500)', border: '1px solid rgba(255,215,0,0.3)' }}>
          <div className="absolute inset-0 opacity-5 flex items-center justify-center text-[120px]">⚽</div>
          <p className="text-yellow-500/70 text-sm font-medium mb-1">Your Balance</p>
          <h2 className="text-5xl font-black text-gold-gradient mb-1">{goalPoints.toLocaleString()}</h2>
          <p className="text-yellow-500/70 text-sm">≈ ${(goalPoints / 100).toFixed(2)} redeemable</p>
          <div className="mt-4 flex justify-center gap-4 text-xs text-yellow-800">
            <span>🏪 Valid at all FanWallet merchants</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex glass-card rounded-2xl p-1 border border-gray-700">
          {(['earn', 'redeem', 'history'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                tab === t ? 'bg-yellow-500 text-black' : 'text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 flex-1 overflow-y-auto pb-8">
        {tab === 'earn' && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-gray-400 text-sm mb-4">Ways to earn GoalPoints</p>
            {EARN_WAYS.map(way => (
              <div key={way.label} className="glass-card rounded-2xl p-4 border border-gray-700 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-2xl">
                  {way.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">{way.label}</p>
                  <p className="text-xs text-gray-400">{way.desc}</p>
                </div>
                <span className="font-black text-yellow-400 text-sm">{way.pts} pts</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'redeem' && (
          <div className="animate-fade-in">
            <p className="text-gray-400 text-sm mb-4">Redeem at any FanWallet merchant</p>
            {redeemed && (
              <div className="rounded-2xl p-4 border border-brand-green bg-brand-green/10 mb-4 animate-bounce-in text-center">
                <p className="text-brand-green font-bold">✓ Redeemed! QR discount applied</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {REDEEM_OPTIONS.map(opt => (
                <button
                  key={opt.pts}
                  onClick={() => handleRedeem(opt.pts)}
                  disabled={goalPoints < opt.pts}
                  className={`glass-card rounded-2xl p-4 border text-center transition-all active:scale-95 disabled:opacity-40 ${
                    goalPoints >= opt.pts ? 'border-yellow-500/30 hover:border-yellow-500' : 'border-gray-700'
                  }`}
                >
                  <p className="text-2xl font-black text-gold-gradient">{opt.value}</p>
                  <p className="text-yellow-500/70 text-sm font-bold">{opt.pts.toLocaleString()} pts</p>
                  <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 glass-card rounded-2xl p-4 border border-gray-700">
              <p className="text-sm font-bold text-white mb-1">How redemption works</p>
              <p className="text-xs text-gray-400">Select amount above → Show QR at merchant → Discount applied automatically to your payment.</p>
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-2 animate-fade-in">
            {HISTORY.map((item, i) => (
              <div key={i} className="glass-card rounded-2xl px-4 py-3 border border-gray-700 flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <span className={`font-black text-sm ${item.pts > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {item.pts > 0 ? '+' : ''}{item.pts} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

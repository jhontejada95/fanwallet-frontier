import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';
import { STAMPS } from '../../lib/mockData';

export default function Stamps() {
  const [selected, setSelected] = useState<typeof STAMPS[0] | null>(null);

  const earned = STAMPS.filter(s => s.earned);
  const notEarned = STAMPS.filter(s => !s.earned);

  return (
    <div className="min-h-screen field-bg flex flex-col">
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-xl font-black text-white mb-1">Stamps & Badges</h1>
        <p className="text-gray-400 text-sm">{earned.length} of {STAMPS.length} collected</p>

        {/* Progress bar */}
        <div className="mt-4 bg-gray-800 rounded-full h-2">
          <div className="h-2 rounded-full transition-all"
               style={{
                 width: `${(earned.length / STAMPS.length) * 100}%`,
                 background: 'linear-gradient(90deg, #00A651, #FFD700)',
               }} />
        </div>
      </div>

      <div className="px-5 flex-1 overflow-y-auto pb-8">
        {/* Earned */}
        <p className="text-sm font-bold text-brand-green mb-3 uppercase tracking-wider">Collected ✓</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {earned.map(stamp => (
            <button
              key={stamp.id}
              onClick={() => setSelected(stamp)}
              className="glass-card rounded-2xl p-4 border border-brand-green/30 flex flex-col items-center gap-2 active:scale-95 transition-all hover:border-brand-green"
              style={{ background: 'rgba(0,166,81,0.05)' }}
            >
              <span className="text-4xl">{stamp.emoji}</span>
              <p className="text-xs text-center font-semibold text-white leading-tight">{stamp.name}</p>
              <p className="text-xs text-gray-500">{stamp.date}</p>
            </button>
          ))}
        </div>

        {/* Not earned */}
        <p className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider">Locked 🔒</p>
        <div className="grid grid-cols-3 gap-3">
          {notEarned.map(stamp => (
            <button
              key={stamp.id}
              onClick={() => setSelected(stamp)}
              className="glass-card rounded-2xl p-4 border border-gray-800 flex flex-col items-center gap-2 opacity-40"
            >
              <span className="text-4xl grayscale">{stamp.emoji}</span>
              <p className="text-xs text-center font-semibold text-gray-500 leading-tight">{stamp.name}</p>
              <p className="text-xs text-gray-700">Locked</p>
            </button>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-[430px] glass-card rounded-t-3xl p-6 border-t border-gray-700 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <div className={`text-8xl mb-4 ${!selected.earned ? 'grayscale opacity-50' : ''}`}>
                {selected.emoji}
              </div>
              <h3 className="text-xl font-black text-white mb-1">{selected.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{selected.description}</p>

              {selected.earned ? (
                <>
                  <div className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/30 rounded-full px-4 py-2 mb-4">
                    <span className="text-brand-green text-sm font-bold">✓ Earned on {selected.date}</span>
                  </div>
                  <button className="w-full py-3 rounded-2xl font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}>
                    Share Stamp 🌍
                  </button>
                </>
              ) : (
                <div className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-2">
                  <span className="text-gray-400 text-sm">🔒 Keep exploring to unlock this!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

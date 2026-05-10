import React, { useState } from 'react';
import { useApp } from '../lib/appContext';

export default function RolePicker() {
  const { setRole, setFanScreen, setBizScreen } = useApp();
  const [hoveredFan, setHoveredFan] = useState(false);
  const [hoveredBiz, setHoveredBiz] = useState(false);

  const enterFan = () => { setRole('fan'); setFanScreen('splash'); };
  const enterBiz = () => { setRole('business'); setBizScreen('dashboard'); };

  return (
    <div className="min-h-screen field-bg flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
           style={{ background: 'radial-gradient(circle, #00A651, transparent 70%)' }} />

      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="text-6xl mb-4">⚽</div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Fan<span className="text-gold-gradient">Wallet</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm font-medium tracking-widest uppercase">
          FIFA World Cup 2026
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-brand-green/20 text-brand-green font-semibold border border-brand-green/30">
            Powered by Solana
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
            LI.FI Bridge
          </span>
        </div>
      </div>

      {/* Role cards */}
      <div className="w-full space-y-4 animate-slide-up">
        <button
          onClick={enterFan}
          onMouseEnter={() => setHoveredFan(true)}
          onMouseLeave={() => setHoveredFan(false)}
          className="w-full rounded-3xl p-6 border-2 transition-all duration-300 text-left relative overflow-hidden group"
          style={{
            background: hoveredFan
              ? 'linear-gradient(135deg, rgba(0,166,81,0.2), rgba(0,166,81,0.05))'
              : 'rgba(17,24,39,0.9)',
            borderColor: hoveredFan ? '#00A651' : 'rgba(31,41,55,0.8)',
            boxShadow: hoveredFan ? '0 0 30px rgba(0,166,81,0.2)' : 'none',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                 style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}>
              ✈️
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-xl text-white">I'm a Fan</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-green/20 text-brand-green font-semibold">
                  Tourist
                </span>
              </div>
              <p className="text-gray-400 text-sm">Pay everywhere with crypto from any chain. Earn points, collect stamps, discover the best spots.</p>
              <div className="flex gap-2 mt-3">
                {['🌍 48 nations', '⚡ <1s payments', '🎁 GoalPoints'].map(t => (
                  <span key={t} className="text-xs text-gray-500">{t}</span>
                ))}
              </div>
            </div>
            <div className="text-brand-green text-2xl">→</div>
          </div>
        </button>

        <button
          onClick={enterBiz}
          onMouseEnter={() => setHoveredBiz(true)}
          onMouseLeave={() => setHoveredBiz(false)}
          className="w-full rounded-3xl p-6 border-2 transition-all duration-300 text-left relative overflow-hidden"
          style={{
            background: hoveredBiz
              ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.05))'
              : 'rgba(17,24,39,0.9)',
            borderColor: hoveredBiz ? '#FFD700' : 'rgba(31,41,55,0.8)',
            boxShadow: hoveredBiz ? '0 0 30px rgba(255,215,0,0.15)' : 'none',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                 style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>
              🏪
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-xl text-white">I'm a Business</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-semibold">
                  Merchant
                </span>
              </div>
              <p className="text-gray-400 text-sm">Accept crypto from fans of 48 nations. Manage reviews, deals, and grow your business during the Cup.</p>
              <div className="flex gap-2 mt-3">
                {['💰 0% fees', '📊 Analytics', '⭐ Reviews'].map(t => (
                  <span key={t} className="text-xs text-gray-500">{t}</span>
                ))}
              </div>
            </div>
            <div className="text-yellow-400 text-2xl">→</div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="text-xs text-gray-600">
          Secured by Solana · Bridged by LI.FI · Built for World Cup 2026
        </p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="text-xs text-gray-700">🇺🇸 USA</span>
          <span className="text-xs text-gray-700">🇲🇽 Mexico</span>
          <span className="text-xs text-gray-700">🇨🇦 Canada</span>
        </div>
      </div>
    </div>
  );
}

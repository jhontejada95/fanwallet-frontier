import React, { useEffect } from 'react';
import { useApp } from '../../lib/appContext';

export default function Splash() {
  const { setFanScreen } = useApp();

  useEffect(() => {
    const t = setTimeout(() => setFanScreen('onboarding'), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
         style={{ background: 'linear-gradient(160deg, #0A0E1A 0%, #0d1f0d 50%, #0A0E1A 100%)' }}>

      {/* Field lines decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 rounded-t-full border-t border-x border-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 rounded-b-full border-b border-x border-white" />
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, rgba(0,166,81,0.15) 0%, transparent 70%)'
      }} />

      {/* Ball animation */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-8xl mb-6 animate-bounce-in" style={{ animationDelay: '0.2s' }}>⚽</div>

        <h1 className="text-5xl font-black tracking-tight text-white animate-fade-in"
            style={{ animationDelay: '0.5s' }}>
          Fan<span className="text-gold-gradient">Wallet</span>
        </h1>

        <p className="mt-3 text-brand-green font-semibold tracking-widest text-sm uppercase animate-fade-in"
           style={{ animationDelay: '0.8s' }}>
          FIFA World Cup 2026
        </p>

        <div className="flex gap-2 mt-6 animate-fade-in" style={{ animationDelay: '1.1s' }}>
          <span className="text-2xl">🇺🇸</span>
          <span className="text-2xl">🇲🇽</span>
          <span className="text-2xl">🇨🇦</span>
        </div>

        {/* Loading bar */}
        <div className="mt-12 w-40 h-1 bg-gray-800 rounded-full overflow-hidden animate-fade-in"
             style={{ animationDelay: '1.4s' }}>
          <div className="h-full rounded-full animate-pulse"
               style={{
                 background: 'linear-gradient(90deg, #00A651, #FFD700)',
                 animation: 'loadBar 2s ease-out forwards',
                 width: '0%',
               }} />
        </div>
      </div>

      {/* Bottom tag */}
      <div className="absolute bottom-8 text-center animate-fade-in" style={{ animationDelay: '1.6s' }}>
        <p className="text-xs text-gray-600">Powered by Solana · LI.FI · Privy</p>
      </div>

      <style>{`
        @keyframes loadBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

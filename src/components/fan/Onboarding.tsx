import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';
import { COUNTRIES } from '../../lib/mockData';

export default function Onboarding() {
  const { setSelectedCountry, setFanScreen, setBalance } = useApp();
  const [step, setStep] = useState<'country' | 'login' | 'ready'>('country');
  const [selected, setSelected] = useState<typeof COUNTRIES[0] | null>(null);
  const [loginMethod, setLoginMethod] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCountrySelect = (c: typeof COUNTRIES[0]) => {
    setSelected(c);
    setTimeout(() => setStep('login'), 300);
  };

  const handleLogin = (method: string) => {
    setLoginMethod(method);
    setTimeout(() => setStep('ready'), 800);
  };

  const handleStart = () => {
    setSelectedCountry(selected);
    setBalance(0);
    setFanScreen('dashboard');
  };

  if (step === 'ready' && selected) {
    return (
      <div className="min-h-screen field-bg flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center animate-bounce-in">
          <div className="text-8xl mb-4">{selected.flag}</div>
          <div className="w-20 h-20 rounded-full bg-brand-green flex items-center justify-center text-4xl mx-auto mb-6 glow-green animate-scale-in">
            ✓
          </div>
          <h2 className="text-3xl font-black text-white mb-2">
            Your FanWallet is Ready!
          </h2>
          <p className="text-gray-400 mb-2">Welcome, {selected.name} fan 🎉</p>
          <div className="glass-card rounded-2xl p-4 mt-6 text-left">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Your Solana Wallet</p>
            <p className="font-mono text-sm text-brand-green">CFi9...eYP3g</p>
            <p className="text-xs text-gray-600 mt-1">Auto-created · Secured by Privy</p>
          </div>
          <button
            onClick={handleStart}
            className="mt-8 w-full py-4 rounded-2xl font-bold text-lg text-white transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
          >
            Let's Go! ⚽
          </button>
        </div>
      </div>
    );
  }

  if (step === 'login') {
    return (
      <div className="min-h-screen field-bg flex flex-col px-6 py-16 animate-slide-up">
        <div className="mb-8 text-center">
          <div className="text-5xl mb-3">{selected?.flag}</div>
          <h2 className="text-2xl font-black text-white">Create your account</h2>
          <p className="text-gray-400 text-sm mt-1">We'll create your Solana wallet automatically</p>
        </div>

        <div className="space-y-4">
          {[
            { method: 'google', label: 'Continue with Google', icon: '🔵' },
            { method: 'apple', label: 'Continue with Apple', icon: '🍎' },
            { method: 'email', label: 'Continue with Email', icon: '📧' },
          ].map(({ method, label, icon }) => (
            <button
              key={method}
              onClick={() => handleLogin(method)}
              className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 border border-gray-700 hover:border-brand-green transition-all active:scale-95"
            >
              <span className="text-2xl">{icon}</span>
              <span className="font-semibold text-white">{label}</span>
              <span className="ml-auto text-gray-500">→</span>
            </button>
          ))}
        </div>

        <div className="mt-8 glass-card rounded-2xl p-4 border border-brand-green/20">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔐</span>
            <div>
              <p className="font-semibold text-brand-green text-sm">Auto-created Solana Wallet</p>
              <p className="text-xs text-gray-400 mt-1">No seed phrases. No downloads. Just log in and start paying anywhere with crypto in seconds.</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-600 text-center mt-6">
          By continuing you agree to our Terms of Service
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen field-bg flex flex-col px-6 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🌍</div>
        <h2 className="text-2xl font-black text-white">Where are you from?</h2>
        <p className="text-gray-400 text-sm mt-1">We'll personalize your experience</p>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search country..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full glass-card rounded-2xl px-4 py-3 text-white placeholder-gray-500 border border-gray-700 focus:border-brand-green outline-none transition-colors"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
      </div>

      <div className="grid grid-cols-2 gap-3 overflow-y-auto" style={{ maxHeight: '60vh' }}>
        {filtered.map(country => (
          <button
            key={country.code}
            onClick={() => handleCountrySelect(country)}
            className={`glass-card rounded-2xl p-4 flex items-center gap-3 border transition-all active:scale-95 ${
              selected?.code === country.code
                ? 'border-brand-green bg-brand-green/10'
                : 'border-gray-700 hover:border-gray-500'
            }`}
          >
            <span className="text-3xl">{country.flag}</span>
            <div className="text-left">
              <p className="font-semibold text-white text-sm">{country.name}</p>
              <p className="text-xs text-gray-500">{country.currency}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';

const CHAINS = [
  { id: 'eth', name: 'Ethereum', icon: '⟠', color: '#627EEA' },
  { id: 'arb', name: 'Arbitrum', icon: '🔵', color: '#12AAFF' },
  { id: 'base', name: 'Base', icon: '🔷', color: '#0052FF' },
  { id: 'op', name: 'Optimism', icon: '🔴', color: '#FF0420' },
  { id: 'poly', name: 'Polygon', icon: '🟣', color: '#8247E5' },
  { id: 'bnb', name: 'BNB Chain', icon: '🟡', color: '#F3BA2F' },
  { id: 'avax', name: 'Avalanche', icon: '🔺', color: '#E84142' },
];

export default function Deposit() {
  const { setFanScreen, setBalance } = useApp();
  const [step, setStep] = useState(1);
  const [selectedChain, setSelectedChain] = useState<typeof CHAINS[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [progress, setProgress] = useState(0);

  const quote = amount ? {
    receive: (parseFloat(amount) * 0.9912).toFixed(2),
    fee: (parseFloat(amount) * 0.0088).toFixed(3),
    time: '~15 seconds',
    route: `${selectedChain?.name} → Solana`,
  } : null;

  const handleBridge = () => {
    setStep(4);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setBalance(parseFloat(quote?.receive || '0'));
        setStep(5);
      }
    }, 100);
  };

  const steps = ['Select Chain', 'Connect Wallet', 'Enter Amount', 'Bridging...', 'Success!'];

  return (
    <div className="min-h-screen field-bg flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => setFanScreen('dashboard')}
                className="w-10 h-10 rounded-2xl glass-card border border-gray-700 flex items-center justify-center">
          ←
        </button>
        <div>
          <h1 className="font-black text-white text-xl">Deposit</h1>
          <p className="text-xs text-gray-400">Bridge any token → USDC on Solana</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-1">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                i + 1 < step ? 'bg-brand-green text-white' :
                i + 1 === step ? 'bg-brand-green text-white ring-2 ring-brand-green/30' :
                'bg-gray-800 text-gray-500'
              }`}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 rounded ${i + 1 < step ? 'bg-brand-green' : 'bg-gray-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="text-center text-sm font-medium text-gray-300 mt-2">{steps[step - 1]}</p>
      </div>

      <div className="px-5 flex-1">
        {/* Step 1: Select Chain */}
        {step === 1 && (
          <div className="animate-slide-up">
            <p className="text-gray-400 text-sm mb-4">Where is your crypto now?</p>
            <div className="grid grid-cols-2 gap-3">
              {CHAINS.map(chain => (
                <button
                  key={chain.id}
                  onClick={() => { setSelectedChain(chain); setStep(2); }}
                  className="glass-card rounded-2xl p-4 border border-gray-700 hover:border-brand-green transition-all active:scale-95 flex items-center gap-3"
                >
                  <span className="text-2xl">{chain.icon}</span>
                  <span className="font-semibold text-white text-sm">{chain.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Connect Wallet */}
        {step === 2 && selectedChain && (
          <div className="animate-slide-up">
            <p className="text-gray-400 text-sm mb-4">Connect your {selectedChain.name} wallet</p>
            {['MetaMask', 'Phantom', 'WalletConnect', 'Coinbase Wallet'].map(w => (
              <button
                key={w}
                onClick={() => setStep(3)}
                className="w-full glass-card rounded-2xl p-4 border border-gray-700 hover:border-brand-green mb-3 flex items-center gap-4 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-xl">
                  {w === 'MetaMask' ? '🦊' : w === 'Phantom' ? '👻' : w === 'WalletConnect' ? '🔗' : '🔵'}
                </div>
                <span className="font-semibold text-white">{w}</span>
                <span className="ml-auto text-gray-500">→</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Amount */}
        {step === 3 && (
          <div className="animate-slide-up">
            <div className="glass-card rounded-3xl p-6 border border-gray-700 mb-4">
              <p className="text-gray-400 text-sm mb-2">Amount to bridge ({selectedChain?.name})</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedChain?.icon}</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="flex-1 bg-transparent text-4xl font-black text-white outline-none placeholder-gray-700"
                />
                <span className="text-gray-400 font-bold">ETH</span>
              </div>
            </div>

            {quote && (
              <div className="glass-card rounded-2xl p-4 border border-brand-green/30 mb-4 animate-fade-in">
                <p className="text-brand-green font-bold text-sm mb-3 flex items-center gap-2">
                  <span>⚡</span> LI.FI Best Route
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">You receive</span>
                    <span className="font-bold text-white">${quote.receive} USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Bridge fee</span>
                    <span className="text-gray-300">{quote.fee} ETH (~0.88%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated time</span>
                    <span className="text-brand-green font-semibold">{quote.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Route</span>
                    <span className="text-gray-300">{quote.route}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleBridge}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all active:scale-95 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
            >
              Bridge via LI.FI ⚡
            </button>
          </div>
        )}

        {/* Step 4: Progress */}
        {step === 4 && (
          <div className="animate-fade-in text-center py-12">
            <div className="w-20 h-20 rounded-full border-4 border-brand-green border-t-transparent rounded-full mx-auto mb-6 animate-spin" />
            <h3 className="text-xl font-bold text-white mb-2">Bridging via LI.FI...</h3>
            <p className="text-gray-400 text-sm mb-8">Cross-chain magic in progress</p>
            <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
              <div className="h-3 rounded-full transition-all duration-200"
                   style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #00A651, #FFD700)' }} />
            </div>
            <p className="text-sm text-gray-400">{progress}% — {progress < 30 ? 'Initiating bridge...' : progress < 60 ? 'Swapping tokens...' : progress < 90 ? 'Sending to Solana...' : 'Finalizing...'}</p>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <div className="animate-bounce-in text-center py-8">
            <div className="w-24 h-24 rounded-full bg-brand-green flex items-center justify-center text-5xl mx-auto mb-6 glow-green">
              ✓
            </div>
            <h3 className="text-2xl font-black text-white mb-2">USDC Arrived!</h3>
            <p className="text-brand-green text-lg font-bold mb-1">${quote?.receive} USDC</p>
            <p className="text-gray-400 text-sm mb-2">In your FanWallet on Solana</p>
            <p className="text-xs text-gray-600 mb-8">Transaction confirmed in ~12 seconds ⚡</p>

            <div className="glass-card rounded-2xl p-4 border border-brand-green/20 mb-6">
              <p className="text-xs text-gray-500 mb-1">Transaction</p>
              <p className="font-mono text-xs text-gray-400">5K7j...mPQ9</p>
              <a href="#" className="text-brand-green text-xs mt-1 block">View on Solana Explorer →</a>
            </div>

            <button
              onClick={() => setFanScreen('dashboard')}
              className="w-full py-4 rounded-2xl font-bold text-lg text-white"
              style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

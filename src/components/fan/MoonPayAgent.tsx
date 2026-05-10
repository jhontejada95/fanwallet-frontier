/**
 * MoonPay Agents Integration
 *
 * Enables autonomous on/off ramp within the AI agent flow.
 * FanAgent detects low balance or "buy crypto" intent and triggers
 * this MoonPay hosted widget for fiat → USDC (or USDC → fiat).
 *
 * Prize track: MoonPay Agents ($10K)
 */
import React, { useState, useEffect } from 'react';
import { useApp } from '../../lib/appContext';

type MoonPayMode = 'buy' | 'sell';
type MoonPayStep = 'select' | 'amount' | 'widget' | 'processing' | 'success';

interface MoonPayAgentProps {
  mode?: MoonPayMode;
  suggestedAmount?: number;
  onComplete?: (amount: number) => void;
  onDismiss?: () => void;
  triggeredByAgent?: boolean;
}

const MOONPAY_CONFIG = {
  apiKey: 'pk_test_fanwallet_2026',
  baseUrl: 'https://buy.moonpay.com',
  sellBaseUrl: 'https://sell.moonpay.com',
  defaultCurrencyCode: 'usdc_sol',
  colorCode: '%2300A651',
};

async function getMoonPayQuote(fiatAmount: number, mode: MoonPayMode) {
  await new Promise(r => setTimeout(r, 600));
  if (mode === 'buy') {
    const fee = fiatAmount * 0.045;
    return { fiatAmount, fee, cryptoAmount: fiatAmount - fee, fiatReceived: 0 };
  }
  const fee = fiatAmount * 0.035;
  return { fiatAmount, fee, cryptoAmount: fiatAmount, fiatReceived: fiatAmount - fee };
}

const QUICK_BUY = [25, 50, 100, 250];
const QUICK_SELL = [10, 25, 50, 100];

export default function MoonPayAgent({
  mode = 'buy', suggestedAmount, onComplete, onDismiss, triggeredByAgent = false,
}: MoonPayAgentProps) {
  const { setBalance, balance } = useApp();
  const [step, setStep] = useState<MoonPayStep>(suggestedAmount ? 'amount' : 'select');
  const [activeMode, setActiveMode] = useState<MoonPayMode>(mode);
  const [amount, setAmount] = useState(suggestedAmount ? String(suggestedAmount) : '');
  const [quote, setQuote] = useState<Awaited<ReturnType<typeof getMoonPayQuote>> | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const displayBalance = balance > 0 ? balance : 124.50;
  const numericAmount = parseFloat(amount) || 0;

  useEffect(() => {
    if (numericAmount < 1) { setQuote(null); return; }
    const t = setTimeout(async () => {
      setLoadingQuote(true);
      const q = await getMoonPayQuote(numericAmount, activeMode);
      setQuote(q); setLoadingQuote(false);
    }, 400);
    return () => clearTimeout(t);
  }, [numericAmount, activeMode]);

  useEffect(() => {
    if (step !== 'widget') return;
    const t = setTimeout(() => setWidgetReady(true), 1500);
    return () => clearTimeout(t);
  }, [step]);

  const handleWidgetComplete = () => {
    setStep('processing');
    setTimeout(() => {
      if (activeMode === 'buy') setBalance(displayBalance + (quote?.cryptoAmount || 0));
      setStep('success');
      onComplete?.(quote?.cryptoAmount || 0);
    }, 2000);
  };

  if (step === 'select') {
    return (
      <div className="flex flex-col px-5 py-6">
        {triggeredByAgent && (
          <div className="flex items-center gap-2 mb-5 bg-brand-green/10 border border-brand-green/20 rounded-2xl px-4 py-3">
            <span className="text-xl">🤖</span>
            <p className="text-sm text-green-300">FanAgent detected you may need funds. MoonPay can top you up instantly.</p>
          </div>
        )}
        <h2 className="text-xl font-black text-white mb-2">MoonPay</h2>
        <p className="text-gray-400 text-sm mb-6">Buy or sell crypto instantly with your card or bank.</p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button onClick={() => { setActiveMode('buy'); setStep('amount'); }}
            className="rounded-3xl p-6 flex flex-col items-center gap-3 border border-brand-green/40 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, rgba(0,166,81,0.15), rgba(0,166,81,0.05))' }}>
            <div className="w-14 h-14 rounded-2xl bg-brand-green/20 flex items-center justify-center text-3xl">💳</div>
            <div className="text-center">
              <p className="font-black text-white">Buy USDC</p>
              <p className="text-xs text-gray-400 mt-1">Fiat → Crypto</p>
              <p className="text-xs text-brand-green mt-1">Cards · Bank · Apple Pay</p>
            </div>
          </button>
          <button onClick={() => { setActiveMode('sell'); setStep('amount'); }}
            className="rounded-3xl p-6 flex flex-col items-center gap-3 border border-gray-700 active:scale-95 transition-all glass-card">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-3xl">🏦</div>
            <div className="text-center">
              <p className="font-black text-white">Sell USDC</p>
              <p className="text-xs text-gray-400 mt-1">Crypto → Fiat</p>
              <p className="text-xs text-blue-400 mt-1">Direct bank payout</p>
            </div>
          </button>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-gray-700 mb-4">
          <div className="flex justify-around text-center">
            {[{ icon: '🔒', label: 'KYC\nVerified' }, { icon: '⚡', label: 'Instant\nSettlement' }, { icon: '🌍', label: '160+\nCountries' }].map(b => (
              <div key={b.label}><p className="text-2xl mb-1">{b.icon}</p><p className="text-xs text-gray-400 whitespace-pre-line">{b.label}</p></div>
            ))}
          </div>
        </div>
        {onDismiss && <button onClick={onDismiss} className="w-full py-3 text-gray-500 text-sm">Maybe later</button>}
      </div>
    );
  }

  if (step === 'amount') {
    return (
      <div className="flex flex-col px-5 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep('select')} className="w-10 h-10 rounded-2xl glass-card border border-gray-700 flex items-center justify-center text-white">←</button>
          <div>
            <h2 className="font-black text-white text-lg">{activeMode === 'buy' ? 'Buy USDC' : 'Sell USDC'}</h2>
            <p className="text-xs text-gray-400">{activeMode === 'buy' ? 'Top up your FanWallet' : `Available: $${displayBalance.toFixed(2)} USDC`}</p>
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6 border border-gray-700 mb-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{activeMode === 'buy' ? 'You pay (USD)' : 'You sell (USDC)'}</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-black text-gray-500">$</span>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
              className="text-5xl font-black text-white bg-transparent outline-none w-36 text-center" />
          </div>
          {activeMode === 'sell' && numericAmount > displayBalance && <p className="text-red-400 text-xs mt-2 font-semibold">Exceeds balance</p>}
        </div>
        <div className="flex gap-2 mb-4">
          {(activeMode === 'buy' ? QUICK_BUY : QUICK_SELL).map(a => (
            <button key={a} onClick={() => setAmount(String(a))}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${parseFloat(amount) === a ? 'bg-brand-green text-white' : 'glass-card text-gray-400 border border-gray-700'}`}>
              ${a}
            </button>
          ))}
        </div>
        <div className="glass-card rounded-2xl p-4 border border-gray-700 mb-6 min-h-[90px] flex flex-col justify-center">
          {loadingQuote ? (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Getting quote...</span>
            </div>
          ) : quote ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">{activeMode === 'buy' ? 'You receive' : 'Fiat received'}</span><span className="text-white font-bold">{activeMode === 'buy' ? `${quote.cryptoAmount.toFixed(2)} USDC` : `$${quote.fiatReceived.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">MoonPay fee</span><span className="text-gray-300">${quote.fee.toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-gray-700 pt-2"><span className="text-gray-400">Network</span><span className="text-brand-green font-medium">Solana · ~2s</span></div>
            </div>
          ) : <p className="text-center text-gray-600 text-sm">Enter an amount to see quote</p>}
        </div>
        <button onClick={() => setStep('widget')} disabled={!quote || numericAmount < 1 || (activeMode === 'sell' && numericAmount > displayBalance)}
          className="w-full py-5 rounded-3xl font-black text-xl text-white glow-green transition-all active:scale-95 disabled:opacity-30"
          style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}>
          Continue with MoonPay →
        </button>
      </div>
    );
  }

  if (step === 'widget') {
    return (
      <div className="flex flex-col" style={{ minHeight: 500 }}>
        <div className="px-5 pt-6 pb-4 flex items-center gap-3">
          <button onClick={() => setStep('amount')} className="w-10 h-10 rounded-2xl glass-card border border-gray-700 flex items-center justify-center text-white">←</button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-sm font-black">M</div>
            <h2 className="font-black text-white">MoonPay Checkout</h2>
          </div>
        </div>
        <div className="flex-1 mx-5 mb-5 rounded-3xl overflow-hidden border border-gray-700 bg-gray-900 relative" style={{ minHeight: 380 }}>
          {!widgetReady ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-3xl">🌙</div>
              <p className="text-gray-400 text-sm">Loading MoonPay...</p>
              <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            /* Production: replace with actual iframe
             * <iframe src={widgetUrl} className="w-full h-full border-0"
             *   allow="camera; microphone; payment"
             *   sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
             */
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-black">M</div>
                <span className="text-xs text-gray-500 font-mono">sandbox · fanwallet</span>
              </div>
              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm mb-1">{activeMode === 'buy' ? 'Pay with card' : 'Withdraw to bank'}</p>
                <p className="text-4xl font-black text-white">${numericAmount.toFixed(2)}</p>
                <p className="text-gray-400 text-sm">→ {quote?.cryptoAmount.toFixed(2)} USDC on Solana</p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="bg-gray-800 rounded-2xl p-4"><p className="text-xs text-gray-500 mb-1">Card number</p><p className="text-white font-mono">•••• •••• •••• 4242</p></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 rounded-2xl p-4"><p className="text-xs text-gray-500 mb-1">Expiry</p><p className="text-white font-mono">12/27</p></div>
                  <div className="bg-gray-800 rounded-2xl p-4"><p className="text-xs text-gray-500 mb-1">CVV</p><p className="text-white font-mono">•••</p></div>
                </div>
              </div>
              <button onClick={handleWidgetComplete} className="w-full py-4 rounded-2xl font-black text-white text-lg" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>
                Pay ${numericAmount.toFixed(2)} →
              </button>
              <p className="text-center text-xs text-gray-600 mt-3">🔒 Secured by MoonPay · PCI DSS compliant</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="text-6xl mb-6 animate-pulse">🌙</div>
        <h2 className="text-xl font-black text-white mb-2">Processing...</h2>
        <p className="text-gray-400 text-sm text-center mb-6">MoonPay is converting your funds to USDC on Solana</p>
        <div className="w-full glass-card rounded-2xl p-4 border border-brand-green/30 space-y-3">
          {[{ label: 'Payment verified', done: true }, { label: 'Converting to USDC', done: true }, { label: 'Sending to Solana wallet', done: false }].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${s.done ? 'bg-brand-green text-white' : 'border-2 border-brand-green border-t-transparent rounded-full animate-spin'}`}>{s.done ? '✓' : ''}</div>
              <span className={`text-sm ${s.done ? 'text-white' : 'text-gray-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
      <div className="text-8xl mb-4 animate-bounce-in">✅</div>
      <h2 className="text-3xl font-black text-brand-green mb-1">{activeMode === 'buy' ? 'Topped Up!' : 'Withdrawn!'}</h2>
      <p className="text-5xl font-black text-white mb-6">{activeMode === 'buy' ? `+${quote?.cryptoAmount.toFixed(2)} USDC` : `+$${quote?.fiatReceived.toFixed(2)}`}</p>
      <div className="glass-card rounded-3xl p-5 border border-brand-green/40 w-full mb-6">
        <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">Via MoonPay</span><span className="text-brand-green font-bold">✓ Confirmed</span></div>
        <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">Network</span><span className="text-white">Solana · &lt;2s</span></div>
        <div className="flex justify-between text-sm border-t border-gray-700 pt-2">
          <span className="text-gray-400">New balance</span>
          <span className="text-white font-black">${(activeMode === 'buy' ? displayBalance + (quote?.cryptoAmount || 0) : displayBalance - numericAmount).toFixed(2)} USDC</span>
        </div>
      </div>
      <button onClick={() => onDismiss?.()} className="w-full py-5 rounded-3xl font-black text-xl text-white glow-green" style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}>
        Back to FanWallet
      </button>
    </div>
  );
}

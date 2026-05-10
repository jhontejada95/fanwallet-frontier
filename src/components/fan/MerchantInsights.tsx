/**
 * Coinbase x402 Integration — Premium Merchant Insights
 *
 * x402 is Coinbase's HTTP micropayment protocol: the server returns HTTP 402
 * when a resource requires payment. The client pays on-chain (USDC on Base)
 * and retries with the payment proof in the X-PAYMENT header.
 *
 * Here we gate "Merchant Insights" — real-time crowd density, wait times,
 * live deals, and insider tips — behind a $0.10 USDC micropayment per fetch.
 *
 * Prize track: Coinbase x402 ($5K)
 * Spec: https://x402.org
 */
import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';

interface X402Challenge {
  x402Version: number;
  accepts: Array<{
    scheme: 'exact';
    network: 'base-sepolia';
    maxAmountRequired: string;
    resource: string;
    description: string;
    payTo: string;
    maxTimeoutSeconds: number;
    asset: string;
  }>;
  error: string;
}

type InsightsState = 'idle' | 'fetching_402' | 'paying' | 'fetching_data' | 'success' | 'error';

const PREMIUM_DATA: Record<string, {
  crowdLevel: string; crowdPercent: number; waitMinutes: number;
  liveDeals: Array<{ title: string; expires: string }>;
  insiderTip: string; popularDish: string; nextQuietWindow: string;
}> = {
  biz1: {
    crowdLevel: 'medium', crowdPercent: 62, waitMinutes: 8,
    liveDeals: [
      { title: '2-for-1 tacos until 19:00', expires: '18:59' },
      { title: 'Free agua fresca with Brazil combo', expires: 'today' },
    ],
    insiderTip: 'Ask for the "Copa Menu" — exclusive to FanWallet users.',
    popularDish: 'Taco árabe with habanero salsa',
    nextQuietWindow: '19:30 – 20:00',
  },
  biz2: {
    crowdLevel: 'busy', crowdPercent: 88, waitMinutes: 20,
    liveDeals: [{ title: 'Happy hour — 30% off cocktails', expires: '17:00' }],
    insiderTip: 'Rooftop seats available — ask the host, no waitlist.',
    popularDish: 'Mezcal Negroni + chips',
    nextQuietWindow: '22:00 – 23:00',
  },
  biz3: {
    crowdLevel: 'low', crowdPercent: 35, waitMinutes: 2,
    liveDeals: [{ title: '15% off official FIFA jerseys', expires: 'today' }],
    insiderTip: 'New stock arrives at 18:00 — Brazil and Argentina jerseys.',
    popularDish: 'Limited edition Copa del Mundo scarf',
    nextQuietWindow: 'Now',
  },
  biz4: {
    crowdLevel: 'medium', crowdPercent: 55, waitMinutes: 5,
    liveDeals: [{ title: 'Match day package — breakfast included', expires: 'Jun 30' }],
    insiderTip: 'Request the stadium-view rooms — same price, much better view.',
    popularDish: 'Fan breakfast buffet',
    nextQuietWindow: '14:00 – 15:30',
  },
};

interface MerchantInsightsProps {
  merchantId: string;
  merchantName: string;
}

export default function MerchantInsights({ merchantId, merchantName }: MerchantInsightsProps) {
  const { balance, setBalance } = useApp();
  const [state, setState] = useState<InsightsState>('idle');
  const [challenge, setChallenge] = useState<X402Challenge | null>(null);
  const [txHash, setTxHash] = useState('');
  const [insights, setInsights] = useState<typeof PREMIUM_DATA[string] | null>(null);
  const displayBalance = balance > 0 ? balance : 124.50;
  const PRICE = 0.10;

  const fetchInsights = async () => {
    setState('fetching_402');
    await new Promise(r => setTimeout(r, 500));
    // Simulates HTTP 402 response
    setChallenge({
      x402Version: 1,
      accepts: [{
        scheme: 'exact', network: 'base-sepolia',
        maxAmountRequired: '100000',
        resource: `https://api.fanwallet.app/v1/merchant/${merchantId}/insights`,
        description: 'Premium merchant insights — real-time data',
        payTo: '0xFanWalletTreasury000000000000000000',
        maxTimeoutSeconds: 300,
        asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      }],
      error: 'Payment required',
    });
    setState('paying');
  };

  const handlePay = async () => {
    if (!challenge) return;
    setState('paying');
    // Simulate signing EIP-3009 transferWithAuthorization + retry with X-PAYMENT header
    await new Promise(r => setTimeout(r, 800));
    const hash = '0x' + Array.from({ length: 64 }, (_, i) => '0123456789abcdef'[(i * 7 + 3) % 16]).join('');
    setTxHash(hash);
    setState('fetching_data');
    await new Promise(r => setTimeout(r, 900));
    setBalance(displayBalance - PRICE);
    setInsights(PREMIUM_DATA[merchantId] || PREMIUM_DATA['biz1']);
    setState('success');
  };

  if (state === 'idle') {
    return (
      <div className="glass-card rounded-2xl p-4 border border-indigo-500/20 mb-2"
           style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), transparent)' }}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔮</span>
            <div>
              <p className="font-bold text-white text-sm">Premium Insights</p>
              <p className="text-xs text-gray-400">Live crowd · Wait time · Secret deals</p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-brand-green font-black text-sm">$0.10</p>
            <p className="text-xs text-gray-500">one-time</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
          <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">C</div>
          <span>Powered by Coinbase x402 · HTTP micropayment</span>
        </div>
        <button onClick={fetchInsights} disabled={displayBalance < PRICE}
          className="w-full py-3 rounded-2xl font-bold text-white text-sm transition-all active:scale-95 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
          Unlock for $0.10 USDC 🔮
        </button>
      </div>
    );
  }

  if (state === 'fetching_402') {
    return (
      <div className="glass-card rounded-2xl p-5 border border-indigo-500/30 mb-2 text-center">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-300">Checking payment requirements...</p>
      </div>
    );
  }

  if (state === 'paying' && challenge) {
    const accept = challenge.accepts[0];
    return (
      <div className="glass-card rounded-2xl p-5 border border-indigo-500/30 mb-2"
           style={{ background: 'rgba(99,102,241,0.05)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-xs font-black">C</div>
          <p className="font-bold text-white text-sm">x402 Payment Required</p>
          <span className="text-xs text-gray-500 ml-auto font-mono">HTTP 402</span>
        </div>
        <div className="bg-gray-900 rounded-xl p-3 mb-4 font-mono text-xs space-y-1">
          <p className="text-gray-500">{'// Server challenge'}</p>
          <p><span className="text-indigo-400">scheme:</span> <span className="text-green-400">"{accept.scheme}"</span></p>
          <p><span className="text-indigo-400">network:</span> <span className="text-green-400">"{accept.network}"</span></p>
          <p><span className="text-indigo-400">amount:</span> <span className="text-yellow-400">"$0.10 USDC"</span></p>
          <p><span className="text-indigo-400">asset:</span> <span className="text-gray-400">USDC on Base Sepolia</span></p>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Your wallet signs an EIP-3009 transfer authorization — no gas required.
          The API retries automatically with the X-PAYMENT header.
        </p>
        <button onClick={handlePay}
          className="w-full py-3 rounded-2xl font-bold text-white text-sm transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
          Sign & Pay $0.10 USDC ⚡
        </button>
        <button onClick={() => setState('idle')} className="w-full py-2 text-xs text-gray-600 mt-1">Cancel</button>
      </div>
    );
  }

  if (state === 'fetching_data') {
    return (
      <div className="glass-card rounded-2xl p-5 border border-indigo-500/30 mb-2">
        <div className="space-y-1.5 text-xs font-mono mb-3">
          <p className="text-gray-500">{'// Retrying with X-PAYMENT header'}</p>
          <p><span className="text-indigo-400">GET</span> <span className="text-gray-300">/insights</span></p>
          <p><span className="text-indigo-400">X-PAYMENT:</span> <span className="text-green-400">✓ signed</span></p>
          <p><span className="text-indigo-400">Status:</span> <span className="text-green-400">200 OK</span></p>
        </div>
        <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (state === 'success' && insights) {
    const crowdColor = insights.crowdLevel === 'low' ? '#00A651' : insights.crowdLevel === 'medium' ? '#FFD700' : '#EF4444';
    return (
      <div className="glass-card rounded-2xl p-4 border border-indigo-500/40 mb-2"
           style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), transparent)' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔮</span>
          <p className="font-bold text-white text-sm">Live Insights · {merchantName}</p>
          <span className="ml-auto text-xs text-indigo-400 font-mono">x402 ✓</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-black/30 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Crowd</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div className="h-2 rounded-full" style={{ width: `${insights.crowdPercent}%`, background: crowdColor }} />
              </div>
              <span className="text-xs font-bold capitalize" style={{ color: crowdColor }}>{insights.crowdLevel}</span>
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Wait time</p>
            <p className="font-black text-white">{insights.waitMinutes} min</p>
            <p className="text-xs text-gray-500">Quiet: {insights.nextQuietWindow}</p>
          </div>
        </div>
        {insights.liveDeals.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">🔥 Live deals now</p>
            {insights.liveDeals.map((d, i) => (
              <div key={i} className="bg-brand-green/10 border border-brand-green/20 rounded-xl px-3 py-2 mb-1 flex justify-between">
                <p className="text-xs text-brand-green font-medium">{d.title}</p>
                <p className="text-xs text-gray-500">until {d.expires}</p>
              </div>
            ))}
          </div>
        )}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-2">
          <p className="text-xs text-yellow-500 font-bold mb-1">🤫 Insider Tip</p>
          <p className="text-xs text-gray-300">{insights.insiderTip}</p>
        </div>
        <div className="pt-2 border-t border-gray-700 flex justify-between text-xs text-gray-600">
          <span>Paid $0.10 via Base Sepolia</span>
          <span className="font-mono">{txHash.slice(0, 14)}...</span>
        </div>
      </div>
    );
  }

  return null;
}

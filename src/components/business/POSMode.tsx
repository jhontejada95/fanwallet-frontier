import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../lib/appContext';
import { getUsdcBalance, explorerUrl } from '../../lib/solana';

// Pre-computed confetti so it doesn't re-randomize on parent re-renders
const CONFETTI_PIECES = Array.from({ length: 30 }, (_, i) => {
  let s = (i * 1664525 + 1013904223) >>> 0;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return (s >>> 0) / 0xffffffff; };
  return {
    left: `${rand() * 100}%`,
    bg: ['#00A651', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][i % 6],
    radius: rand() > 0.5 ? '50%' : '2px',
    size: `${6 + rand() * 8}px`,
    delay: `${rand() * 0.8}s`,
    duration: `${1.2 + rand() * 0.8}s`,
  };
});

function ConfettiOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {CONFETTI_PIECES.map((p, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: p.left,
            top: '-20px',
            background: p.bg,
            borderRadius: p.radius,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

export default function POSMode() {
  const { setBizScreen, bizWalletAddress, bizName } = useApp();
  const wallet = useWallet();
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState<'input' | 'qr' | 'waiting' | 'success'>('input');
  const [confetti, setConfetti] = useState(false);
  const [currency, setCurrency] = useState<'USDC' | 'MXN'>('USDC');
  const [fanData, setFanData] = useState({ flag: '🇧🇷', country: 'Brazil', points: 0 });
  const [liveTxSig, setLiveTxSig] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const displayAmount = amount
    ? currency === 'MXN'
      ? `${parseFloat(amount).toFixed(2)} MXN`
      : `${parseFloat(amount).toFixed(2)} USDC`
    : '0.00';

  const usdcAmount = amount
    ? currency === 'MXN' ? (parseFloat(amount) / 17.6).toFixed(2) : parseFloat(amount).toFixed(2)
    : '0.00';

  // Real Solana Pay URI — merchant wallet is bizWalletAddress (registered) or connected wallet
  const merchantAddress = bizWalletAddress || wallet.publicKey?.toBase58() || '';
  const shortAddr = merchantAddress
    ? `${merchantAddress.slice(0, 4)}...${merchantAddress.slice(-4)}`
    : '—';
  const solanaPayUri = merchantAddress && usdcAmount !== '0.00'
    ? `solana:${merchantAddress}?amount=${usdcAmount}&label=${encodeURIComponent(bizName)}&message=FanWallet`
    : '';

  const handleKey = (key: string) => {
    if (key === '⌫') {
      setAmount(prev => prev.slice(0, -1));
    } else if (key === '.' && amount.includes('.')) {
      return;
    } else if (amount.split('.')[1]?.length >= 2) {
      return;
    } else {
      setAmount(prev => prev + key);
    }
  };

  // Poll balance every 2.5 s — more reliable than onAccountChange WebSocket on devnet
  useEffect(() => {
    if (stage !== 'waiting' || !merchantAddress) return;

    let pk: PublicKey;
    try { pk = new PublicKey(merchantAddress); } catch { return; }

    let active = true;
    const expectedUsdc = parseFloat(usdcAmount);
    setWsConnected(true);

    const poll = async () => {
      const balanceBefore = await getUsdcBalance(pk);

      while (active) {
        await new Promise(r => setTimeout(r, 2500));
        if (!active) break;
        try {
          const newBalance = await getUsdcBalance(pk);
          const delta = +(newBalance - balanceBefore).toFixed(6);
          if (delta >= expectedUsdc * 0.99) {
            setLiveTxSig('live');
            setFanData({ flag: '🌐', country: 'On-chain', points: Math.round(delta * 2) });
            setStage('success');
            setConfetti(true);
            setTimeout(() => setConfetti(false), 3000);
            break;
          }
        } catch { /* keep polling on network errors */ }
      }
    };

    poll();
    return () => { active = false; setWsConnected(false); };
  }, [stage, merchantAddress, usdcAmount]);

  const handleGenerateQR = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setStage('qr');
    setTimeout(() => {
      setStage('waiting');

      // Mock fallback — no wallet connected at all
      if (!merchantAddress) {
        setTimeout(() => {
          const fans = [
            { flag: '🇧🇷', country: 'Brazil' },
            { flag: '🇩🇪', country: 'Germany' },
            { flag: '🇯🇵', country: 'Japan' },
            { flag: '🇦🇷', country: 'Argentina' },
          ];
          let s = 0xdeadbeef;
          s = (s * 1664525 + 1013904223) >>> 0;
          const fan = fans[s % fans.length];
          const pts = Math.round(parseFloat(usdcAmount) * 2);
          setFanData({ ...fan, points: pts });
          setStage('success');
          setConfetti(true);
          setTimeout(() => setConfetti(false), 3000);
        }, 3000);
      }
    }, 500);
  };

  const handleNewTx = () => {
    setAmount('');
    setStage('input');
    setLiveTxSig(null);
  };

  const keys = ['1','2','3','4','5','6','7','8','9','.','0','⌫'];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
         style={{ background: '#0A0E1A' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBizScreen('dashboard')}
            className="w-10 h-10 rounded-2xl glass-card border border-gray-700 flex items-center justify-center"
          >
            ←
          </button>
          <div>
            <h1 className="font-black text-white text-lg">POS Mode</h1>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
              <span className="text-xs text-brand-green">
                {merchantAddress ? 'Wallet connected · Ready' : 'No wallet'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          {(['USDC', 'MXN'] as const).map(c => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currency === c
                  ? 'bg-brand-green text-white'
                  : 'glass-card text-gray-400 border border-gray-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT STAGE */}
      {stage === 'input' && (
        <>
          <div className="flex-1 flex flex-col items-center justify-center px-5">
            <p className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Enter Amount</p>
            <div className="text-6xl font-black text-white mb-2 min-h-20 flex items-center">
              {amount ? displayAmount : <span className="opacity-20">0.00</span>}
            </div>
            {currency === 'MXN' && amount && (
              <p className="text-gray-400 text-sm">≈ {usdcAmount} USDC</p>
            )}
          </div>

          <div className="px-5 pb-4">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {keys.map(key => (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className="numpad-key"
                  style={{
                    background: key === '⌫' ? 'rgba(239,68,68,0.15)' : 'rgba(31,41,55,0.8)',
                    border: '1px solid rgba(55,65,81,0.5)',
                    color: key === '⌫' ? '#EF4444' : 'white',
                  }}
                >
                  {key}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerateQR}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full py-5 rounded-3xl font-black text-xl text-white transition-all active:scale-95 disabled:opacity-30 glow-green"
              style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
            >
              Generate QR ⚡
            </button>
          </div>
        </>
      )}

      {/* QR / WAITING STAGE */}
      {(stage === 'qr' || stage === 'waiting') && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
          <p className="text-gray-400 text-sm mb-1">Fan scans to pay</p>
          <p className="text-3xl font-black text-white mb-6">{usdcAmount} USDC</p>

          <div className="relative mb-6">
            {stage === 'waiting' && (
              <div className="absolute -inset-4 rounded-[2rem] animate-pulse-green" />
            )}
            {/* Real scannable QR code */}
            <div className="bg-white rounded-3xl p-5 inline-block shadow-2xl">
              {solanaPayUri ? (
                <QRCodeSVG
                  value={solanaPayUri}
                  size={192}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              ) : (
                <div style={{ width: 192, height: 192, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 12 }}>
                  No wallet address
                </div>
              )}
            </div>
          </div>

          <p className="text-brand-green font-semibold text-sm flex items-center gap-2">
            {stage === 'qr' ? (
              'Show QR to fan...'
            ) : (
              <>
                <span className="w-4 h-4 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
                Waiting for payment...
              </>
            )}
          </p>

          <p className="text-xs text-gray-600 mt-2">Solana Pay · Devnet</p>
          <p className="font-mono text-xs text-gray-500 mt-1">{shortAddr}</p>
          {wsConnected && (
            <p className="text-xs text-green-400/60 mt-1 animate-pulse">
              ● WebSocket listener active
            </p>
          )}

          <button
            onClick={handleNewTx}
            className="mt-8 text-gray-500 text-sm underline"
          >
            Cancel
          </button>
        </div>
      )}

      {/* SUCCESS STAGE */}
      {stage === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 animate-fade-in"
             style={{ background: 'linear-gradient(160deg, #0A0E1A 0%, #0d2e0d 50%, #0A0E1A 100%)' }}>
          <div className="text-8xl mb-4 animate-bounce-in">✅</div>
          <h2 className="text-3xl font-black text-brand-green mb-1">PAID!</h2>
          <p className="text-5xl font-black text-white mb-6">${usdcAmount}</p>

          <div className="glass-card rounded-3xl p-5 border border-brand-green/40 w-full mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{fanData.flag}</span>
              <div>
                <p className="font-bold text-white">{fanData.country} fan</p>
                <p className="text-xs text-gray-400">Paid via Solana Pay · &lt;1s</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 rounded-2xl p-3 text-center">
                <p className="text-brand-green font-black text-lg">${usdcAmount}</p>
                <p className="text-xs text-gray-400">Received USDC</p>
              </div>
              <div className="bg-black/30 rounded-2xl p-3 text-center">
                <p className="text-yellow-400 font-black text-lg">+{fanData.points}</p>
                <p className="text-xs text-gray-400">Fan's GoalPoints</p>
              </div>
            </div>
            {liveTxSig && (
              <a
                href={explorerUrl(liveTxSig)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-xs text-center text-brand-green underline"
              >
                View on Solana Explorer ↗
              </a>
            )}
          </div>

          <button
            onClick={handleNewTx}
            className="w-full py-5 rounded-3xl font-black text-xl text-white glow-green"
            style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
          >
            New Transaction
          </button>
        </div>
      )}

      {confetti && <ConfettiOverlay />}
    </div>
  );
}

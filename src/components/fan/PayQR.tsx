import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { useApp } from '../../lib/appContext';
import { LogoMark } from '../LogoMark';
import { useIsDesktop } from '../../hooks/useIsDesktop';
import { processPayment, explorerUrl } from '../../lib/solana';

/* ── QR code display (for receive tab) ─────────────────────────────────── */
function QRDisplay({ data }: { data: string }) {
  const pattern = React.useMemo(() => {
    let seed = 0;
    for (let c = 0; c < data.length; c++) seed = (seed * 31 + data.charCodeAt(c)) >>> 0;
    return Array.from({ length: 49 }, (_, i) => {
      const isCorner = (i < 3) || (i > 5 && i < 7) ||
                       (i > 41 && i < 44) || (i === 48) ||
                       (i % 7 === 0 && i < 28) || (i % 7 === 6 && i < 14);
      if (isCorner) return true;
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return (seed >>> 16 & 1) === 1;
    });
  }, [data]);

  return (
    <div style={{ width: 200, height: 200, position: 'relative', padding: 8 }}>
      <div style={{ position: 'absolute', inset: 8, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {pattern.map((dark, i) => (
          <div key={i} style={{ borderRadius: 2, background: dark ? '#0a0e1a' : '#fff', minHeight: 4 }} />
        ))}
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', borderRadius: 8, padding: 4 }}>
        <LogoMark size={32} />
      </div>
    </div>
  );
}

function CornerBracket({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const styles: Record<string, React.CSSProperties> = {
    tl: { top: 8, left: 8, borderTop: '2.5px solid #00A651', borderLeft: '2.5px solid #00A651', borderTopLeftRadius: 8 },
    tr: { top: 8, right: 8, borderTop: '2.5px solid #00A651', borderRight: '2.5px solid #00A651', borderTopRightRadius: 8 },
    bl: { bottom: 8, left: 8, borderBottom: '2.5px solid #00A651', borderLeft: '2.5px solid #00A651', borderBottomLeftRadius: 8 },
    br: { bottom: 8, right: 8, borderBottom: '2.5px solid #00A651', borderRight: '2.5px solid #00A651', borderBottomRightRadius: 8 },
  };
  return <div style={{ position: 'absolute', width: 22, height: 22, ...styles[pos] }} />;
}

/* ── Solana Pay QR parser ───────────────────────────────────────────────── */
interface SolanaPayData {
  address: string;
  amount?: number;
  label?: string;
  message?: string;
}

function parseSolanaPayQR(raw: string): SolanaPayData | null {
  const trimmed = raw.trim();
  if (trimmed.startsWith('solana:')) {
    const withoutScheme = trimmed.slice(7);
    const [address, queryString] = withoutScheme.split('?');
    if (!address || address.length < 32) return null;
    const params = new URLSearchParams(queryString || '');
    return {
      address,
      amount: params.get('amount') ? parseFloat(params.get('amount')!) : undefined,
      label: params.get('label') || undefined,
      message: params.get('message') || undefined,
    };
  }
  // Raw base58 Solana address (32–44 chars, no special chars)
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed)) {
    return { address: trimmed };
  }
  return null;
}

/* ── Camera QR scanner — jsQR for universal browser support ─────────────── */
interface ScannerProps {
  onResult: (data: SolanaPayData) => void;
  onManual: () => void;
}

function QRScanner({ onResult, onManual }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Stable callback ref to avoid restarting the effect on every render
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let rafId: number;
    let active = true;

    const scan = () => {
      if (!active) return;
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (canvas && video && video.readyState === 4) {
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (w > 0 && h > 0) {
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, w, h);
            const imgData = ctx.getImageData(0, 0, w, h);
            const code = jsQR(imgData.data, w, h, { inversionAttempts: 'dontInvert' });
            if (code?.data) {
              const parsed = parseSolanaPayQR(code.data);
              if (parsed) {
                onResultRef.current(parsed);
                return; // stop loop — result found
              }
            }
          }
        }
      }
      rafId = requestAnimationFrame(scan);
    };

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        setReady(true);
        rafId = requestAnimationFrame(scan);
      } catch {
        setCameraError('Camera access denied. Allow camera permissions or enter the address manually.');
      }
    };

    start();
    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []); // run once

  if (cameraError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '24px 0' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', display: 'grid', placeItems: 'center', fontSize: 24 }}>📵</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 14, color: '#fff', marginBottom: 6 }}>Camera unavailable</div>
          <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{cameraError}</div>
        </div>
        <button onClick={onManual} style={{ padding: '12px 24px', borderRadius: 999, background: '#00A651', color: '#001b0b', fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer' }}>
          Enter address manually
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Hidden canvas used for frame capture — never displayed */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', background: '#000', aspectRatio: '1', width: '100%' }}>
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Scan frame overlay */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          {/* Dark vignette outside scan area */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
          <div style={{ width: '62%', aspectRatio: '1', position: 'relative', zIndex: 1 }}>
            {/* Cutout: transparent inside, dark outside (via box-shadow) */}
            <div style={{ position: 'absolute', inset: 0, boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)', borderRadius: 4 }} />
            {(['tl','tr','bl','br'] as const).map(pos => <CornerBracket key={pos} pos={pos} />)}
          </div>
        </div>

        {/* Scan line — only shown once camera is ready */}
        {ready && (
          <div style={{ position: 'absolute', left: '19%', right: '19%', height: 2.5, borderRadius: 2, background: 'linear-gradient(90deg, transparent, #00A651 20%, #00C962 50%, #00A651 80%, transparent)', animation: 'scanLine 2s ease-in-out infinite', zIndex: 2 }} />
        )}
        <style>{`@keyframes scanLine { 0%,100%{top:19%} 50%{top:81%} }`}</style>

        {/* Status badge */}
        {ready && (
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', borderRadius: 999, padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 6, zIndex: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00A651', animation: 'pulse 1.5s ease-in-out infinite', display: 'inline-block' }} />
            <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 11, color: '#fff' }}>Scanning…</span>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', fontSize: 12, color: '#6b7280' }}>
        Point the camera at the merchant's Solana Pay QR code
      </div>

      <button onClick={onManual} style={{ padding: '10px', borderRadius: 12, background: 'transparent', color: '#6b7280', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 12, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
        Enter address manually instead
      </button>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
type PayStep = 'scan' | 'manual' | 'confirm' | 'paying' | 'success';

export default function PayQR() {
  const { setFanScreen, balance, setBalance, walletAddress: ctxAddr, walletConnected, getProvider, setGoalPoints, goalPoints } = useApp();
  const isDesktop = useIsDesktop();

  const [tab, setTab] = useState<'receive' | 'pay'>('receive');
  const [payStep, setPayStep] = useState<PayStep>(isDesktop ? 'manual' : 'scan');
  const [scannedData, setScannedData] = useState<SolanaPayData | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [txSig, setTxSig] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const walletAddress = ctxAddr || 'CFi91VLHPRFBYdKtNSJst56DTQ5jPQ6oxRvMjx9eYP3g';
  const displayBalance = balance > 0 ? balance : 124.50;
  const shortAddr = walletAddress.slice(0, 4) + '…' + walletAddress.slice(-4);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScanResult = (data: SolanaPayData) => {
    setScannedData(data);
    if (data.amount) setPayAmount(String(data.amount));
    setPayStep('confirm');
  };

  const confirmAddress = scannedData?.address || manualAddress;
  const parsedAmount = parseFloat(payAmount) || 0;
  const canPay = confirmAddress.length >= 32 && parsedAmount > 0 && parsedAmount <= displayBalance;

  const handlePay = async () => {
    if (!canPay) return;
    setPayStep('paying');
    setTxError(null);
    try {
      if (walletConnected) {
        const provider = getProvider();
        if (!provider) throw new Error('No wallet provider');
        const sig = await processPayment(provider, parsedAmount, confirmAddress);
        setTxSig(sig);
        // Optimistic update + earn points
        setBalance(displayBalance - parsedAmount);
        setGoalPoints(goalPoints + Math.round(parsedAmount * 10));
      } else {
        await new Promise(r => setTimeout(r, 1500));
        setBalance(displayBalance - parsedAmount);
        setGoalPoints(goalPoints + Math.round(parsedAmount * 10));
      }
      setPayStep('success');
    } catch (err: unknown) {
      setTxError((err instanceof Error ? err.message : 'Payment failed').slice(0, 100));
      setPayStep('confirm');
    }
  };

  const resetPay = () => {
    setScannedData(null);
    setManualAddress('');
    setPayAmount('');
    setTxSig(null);
    setTxError(null);
    setPayStep(isDesktop ? 'manual' : 'scan');
  };

  /* ── Tab toggle ──────────────────────────────────────────────────────── */
  const tabBar = (
    <div style={{ display: 'flex', gap: 4, padding: 4, background: '#131826', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, marginBottom: 20 }}>
      {(['receive', 'pay'] as const).map(t => (
        <button key={t} onClick={() => { setTab(t); if (t === 'pay') resetPay(); }}
          style={{ flex: 1, padding: '10px 0', textAlign: 'center' as const, borderRadius: 11,
            background: tab === t ? (t === 'pay' ? '#00A651' : '#FFD700') : 'transparent',
            color: tab === t ? (t === 'pay' ? '#001b0b' : '#1a1300') : '#B6BECB',
            fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 13,
            border: 'none', cursor: 'pointer', transition: 'all 0.15s',
          }}>
          {t === 'receive' ? '⬇ Receive' : '📷 Pay / Scan'}
        </button>
      ))}
    </div>
  );

  /* ── Pay tab: manual input ──────────────────────────────────────────── */
  const manualInputView = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ padding: '14px 16px', background: '#131826', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#6b7280', marginBottom: 8 }}>Recipient address</div>
        <input
          type="text"
          placeholder="Solana wallet address or solana:..."
          value={manualAddress}
          onChange={e => setManualAddress(e.target.value)}
          style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#fff', placeholder: '#6b7280' }}
        />
      </div>
      <div style={{ padding: '14px 16px', background: '#131826', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#6b7280', marginBottom: 8 }}>Amount (USDC)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#6b7280', fontSize: 18 }}>$</span>
          <input
            type="number"
            placeholder="0.00"
            value={payAmount}
            onChange={e => setPayAmount(e.target.value)}
            min="0"
            step="0.01"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 22, color: '#fff' }}
          />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {[10, 25, 50, 100].map(a => (
          <button key={a} onClick={() => setPayAmount(String(a))}
            style={{ padding: '8px 0', borderRadius: 10, background: parseFloat(payAmount) === a ? '#00A651' : '#131826', color: parseFloat(payAmount) === a ? '#001b0b' : '#B6BECB', fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 12, border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
            ${a}
          </button>
        ))}
      </div>
      {txError && (
        <div style={{ fontSize: 12, color: '#EF4444', background: 'rgba(239,68,68,0.08)', borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(239,68,68,0.2)' }}>⚠ {txError}</div>
      )}
      <button onClick={handlePay} disabled={!canPay}
        style={{ padding: '16px', borderRadius: 999, background: canPay ? '#00A651' : '#1a2030', color: canPay ? '#001b0b' : '#6b7280', fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 15, border: 'none', cursor: canPay ? 'pointer' : 'default', transition: 'all 0.15s' }}>
        {payStep === 'paying' ? 'Sending…' : `Pay $${parsedAmount > 0 ? parsedAmount.toFixed(2) : '0.00'} USDC ⚡`}
      </button>
    </div>
  );

  /* ── Pay tab: confirm after scan ───────────────────────────────────── */
  const confirmView = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ padding: '16px', background: 'rgba(0,166,81,0.06)', borderRadius: 16, border: '1px solid rgba(0,166,81,0.2)' }}>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#00A651', marginBottom: 6 }}>QR detected</div>
        {scannedData?.label && (
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 4 }}>{scannedData.label}</div>
        )}
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#6b7280', wordBreak: 'break-all' as const }}>{confirmAddress}</div>
        {scannedData?.message && (
          <div style={{ fontSize: 12, color: '#B6BECB', marginTop: 6 }}>{scannedData.message}</div>
        )}
      </div>

      <div style={{ padding: '14px 16px', background: '#131826', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#6b7280', marginBottom: 8 }}>Amount (USDC)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#6b7280', fontSize: 18 }}>$</span>
          <input
            type="number"
            placeholder="0.00"
            value={payAmount}
            onChange={e => setPayAmount(e.target.value)}
            min="0"
            step="0.01"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 22, color: '#fff' }}
          />
        </div>
      </div>

      {txError && (
        <div style={{ fontSize: 12, color: '#EF4444', background: 'rgba(239,68,68,0.08)', borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(239,68,68,0.2)' }}>⚠ {txError}</div>
      )}

      <button onClick={handlePay} disabled={!canPay || payStep === 'paying'}
        style={{ padding: '16px', borderRadius: 999, background: canPay ? '#00A651' : '#1a2030', color: canPay ? '#001b0b' : '#6b7280', fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 15, border: 'none', cursor: canPay ? 'pointer' : 'default' }}>
        {payStep === 'paying'
          ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#001b0b', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
              Sending…
            </span>
          : `Confirm Pay $${parsedAmount > 0 ? parsedAmount.toFixed(2) : '0.00'} ⚡`
        }
      </button>

      <button onClick={resetPay} style={{ padding: '10px', borderRadius: 12, background: 'transparent', color: '#6b7280', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 12, border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
        ← Scan again
      </button>
    </div>
  );

  /* ── Success view ────────────────────────────────────────────────────── */
  const successView = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '16px 0', textAlign: 'center' as const }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#00A651', display: 'grid', placeItems: 'center', fontSize: 32, boxShadow: '0 0 0 1px rgba(0,166,81,0.4), 0 16px 48px -8px rgba(0,166,81,0.6)' }}>✓</div>
      <div>
        <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 24, color: '#fff', marginBottom: 4 }}>Payment Sent!</div>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 18, color: '#00A651' }}>${parsedAmount.toFixed(2)} USDC</div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Delivered instantly on Solana</div>
      </div>
      <div style={{ padding: '10px 16px', background: 'rgba(255,215,0,0.08)', borderRadius: 12, border: '1px solid rgba(255,215,0,0.2)' }}>
        <div style={{ fontSize: 12, color: '#FFD700', fontFamily: 'Archivo, sans-serif', fontWeight: 800 }}>
          +{Math.round(parsedAmount * 10)} GoalPoints earned!
        </div>
      </div>
      {txSig && (
        <a href={explorerUrl(txSig)} target="_blank" rel="noreferrer"
          style={{ fontSize: 12, color: '#00A651', textDecoration: 'underline', fontFamily: 'Archivo, sans-serif', fontWeight: 700 }}>
          View on Explorer →
        </a>
      )}
      <button onClick={() => setFanScreen('dashboard')} style={{ width: '100%', padding: '14px', borderRadius: 999, background: '#00A651', color: '#001b0b', fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer' }}>
        Back to Dashboard
      </button>
      <button onClick={resetPay} style={{ fontSize: 13, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Archivo, sans-serif', fontWeight: 700 }}>
        Make another payment
      </button>
    </div>
  );

  /* ── Desktop layout ──────────────────────────────────────────────────── */
  if (isDesktop) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,81,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 960, width: '100%', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, position: 'relative', zIndex: 2 }}>
          {/* Left: Receive QR */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ width: '100%' }}>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 26, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>My Receive QR</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>Share this code to receive USDC payments</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#131826', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
              <span style={{ fontSize: 14 }}>💰</span>
              <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, color: '#fff', fontSize: 14 }}>${displayBalance.toFixed(2)} USDC</span>
              <span style={{ color: '#6b7280', fontSize: 12 }}>available</span>
            </div>
            <div style={{ position: 'relative', background: '#fff', borderRadius: 26, padding: 20, boxShadow: '0 0 0 1px rgba(0,166,81,0.5), 0 30px 80px -20px rgba(0,166,81,0.6)' }}>
              <QRDisplay data={walletAddress} />
              <CornerBracket pos="tl" /><CornerBracket pos="tr" />
              <CornerBracket pos="bl" /><CornerBracket pos="br" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#6b7280' }}>YOUR WALLET</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#00A651', marginTop: 4 }}>Solana Pay · Devnet</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#fff' }}>{shortAddr}</span>
                <button onClick={handleCopy} style={{ fontSize: 11, color: '#00A651', fontFamily: 'Archivo, sans-serif', fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: 'rgba(0,166,81,0.1)', border: 'none', cursor: 'pointer' }}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Pay section */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 16 }}>
            <div>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 26, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>Pay a Merchant</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>Enter a wallet address or Solana Pay URI</div>
            </div>

            {/* Desktop camera limitation notice */}
            <div style={{ padding: '14px 16px', background: 'rgba(255,215,0,0.06)', borderRadius: 16, border: '1px solid rgba(255,215,0,0.2)', display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
              <div>
                <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 13, color: '#FFD700', marginBottom: 4 }}>Camera not available on desktop</div>
                <div style={{ fontSize: 12, color: '#B6BECB', lineHeight: 1.5 }}>
                  On desktop you can only receive via QR or pay by entering an address manually.
                  For camera QR scanning, install <strong style={{ color: '#FFD700' }}>FanWallet as a PWA</strong> on your phone — tap the browser's "Add to Home Screen" option.
                </div>
              </div>
            </div>

            {payStep === 'success' ? successView : (
              <>
                {(payStep === 'manual' || payStep === 'paying') && manualInputView}
                {payStep === 'confirm' && confirmView}
              </>
            )}

            <button onClick={() => setFanScreen('dashboard')} style={{ padding: '10px', borderRadius: 12, background: 'transparent', color: '#6b7280', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', marginTop: 'auto' }}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Mobile layout ────────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 8px' }}>
        <button onClick={() => setFanScreen('dashboard')} style={{ width: 36, height: 36, borderRadius: 12, background: '#131826', display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,0.06)', color: '#B6BECB', cursor: 'pointer' }}>
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 15, color: '#fff' }}>Pay / Receive</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: '#131826', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 10 }}>💰</span>
          <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, color: '#fff', fontSize: 12 }}>${displayBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ padding: '4px 20px 0' }}>
        {tabBar}
      </div>

      <div style={{ flex: 1, padding: '0 20px', overflowY: 'auto', paddingBottom: 100 }} className="no-scrollbar">
        {/* RECEIVE TAB */}
        {tab === 'receive' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ position: 'relative', background: '#fff', borderRadius: 26, padding: 18, boxShadow: '0 0 0 1px rgba(0,166,81,0.5), 0 24px 60px -16px rgba(0,166,81,0.6)' }}>
                <QRDisplay data={walletAddress} />
                <CornerBracket pos="tl" /><CornerBracket pos="tr" />
                <CornerBracket pos="bl" /><CornerBracket pos="br" />
              </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#6b7280' }}>YOUR WALLET</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#00A651', marginTop: 4 }}>Solana Pay · Devnet</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#fff' }}>{shortAddr}</span>
                <button onClick={handleCopy} style={{ fontSize: 11, color: '#00A651', fontFamily: 'Archivo, sans-serif', fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: 'rgba(0,166,81,0.1)', border: 'none', cursor: 'pointer' }}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            {[
              { emoji: '⚡', title: 'Instant Settlement', sub: 'Payments confirm in under 1 second on Solana', bg: 'rgba(0,166,81,0.15)' },
              { emoji: '⭐', title: 'Earn GoalPoints', sub: '1 point per $1 spent · Redeem for discounts', bg: 'rgba(255,215,0,0.12)' },
            ].map((info, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#131826', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: info.bg, display: 'grid', placeItems: 'center', fontSize: 16 }}>{info.emoji}</div>
                <div>
                  <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 13, color: '#fff' }}>{info.title}</div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{info.sub}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* PAY TAB */}
        {tab === 'pay' && (
          <>
            {payStep === 'success' && successView}
            {payStep === 'scan' && (
              <QRScanner onResult={handleScanResult} onManual={() => setPayStep('manual')} />
            )}
            {(payStep === 'manual' || payStep === 'paying') && manualInputView}
            {payStep === 'confirm' && confirmView}
          </>
        )}
      </div>
    </div>
  );
}

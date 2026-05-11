import React, { useState } from 'react';
import { IDKitRequestWidget, IDKitResult } from '@worldcoin/idkit';
import { deviceLegacy } from '@worldcoin/idkit';
import { useApp } from '../../lib/appContext';
import { verifyWorldId, explorerUrl } from '../../lib/solana';

const APP_ID = (import.meta.env.VITE_WORLDID_APP_ID ?? 'app_staging_placeholder') as `app_${string}`;
const ACTION = 'verify-fan-wc26';

type RpCtx = {
  rp_id: string;
  nonce: string;
  created_at: number;
  expires_at: number;
  signature: string;
};

interface Props {
  onVerified: () => void;
  onSkip: () => void;
}

function getNullifierHex(result: IDKitResult): string {
  if ('session_id' in result) {
    const raw = (result as any).responses?.[0]?.session_nullifier?.[0] ?? '';
    return raw.replace('0x', '').padStart(64, '0').slice(0, 64);
  }
  const raw = (result as any).responses?.[0]?.nullifier ?? '';
  return raw.replace('0x', '').padStart(64, '0').slice(0, 64);
}

export default function WorldIDVerify({ onVerified, onSkip }: Props) {
  const { walletConnected, getProvider, setWorldIdVerified } = useApp();
  const [rpCtx, setRpCtx] = useState<RpCtx | null>(null);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'fetching' | 'open' | 'recording' | 'done' | 'error'>('idle');
  const [txSig, setTxSig] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const environment: 'staging' | 'production' = APP_ID.startsWith('app_staging') ? 'staging' : 'production';

  const handleStart = async () => {
    setPhase('fetching');
    setErrMsg(null);
    try {
      const res = await fetch('/api/worldid-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: ACTION }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
      setRpCtx(data.rp_context);
      setPhase('open');
      setWidgetOpen(true);
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Could not start verification');
      setPhase('error');
    }
  };

  const handleSuccess = async (result: IDKitResult) => {
    setWidgetOpen(false);
    setPhase('recording');
    try {
      const nullifierHex = getNullifierHex(result);
      if (walletConnected) {
        const provider = getProvider();
        if (provider) {
          const sig = await verifyWorldId(provider, nullifierHex);
          setTxSig(sig);
        }
      }
      setWorldIdVerified(true);
      setPhase('done');
      setTimeout(() => onVerified(), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'On-chain recording failed';
      if (msg.includes('AlreadyVerified') || msg.includes('already')) {
        setWorldIdVerified(true);
        setPhase('done');
        setTimeout(() => onVerified(), 2000);
      } else {
        setErrMsg(msg.slice(0, 100));
        setPhase('error');
      }
    }
  };

  const handleWidgetError = () => {
    setWidgetOpen(false);
    setPhase('error');
    setErrMsg('World ID verification was cancelled or failed. Try again.');
  };

  return (
    <>
      {/* IDKit widget — rendered in DOM portal, only when rp_context is ready */}
      {rpCtx && (
        <IDKitRequestWidget
          app_id={APP_ID}
          action={ACTION}
          rp_context={rpCtx}
          allow_legacy_proofs={true}
          preset={deviceLegacy()}
          environment={environment}
          open={widgetOpen}
          onOpenChange={(open) => {
            setWidgetOpen(open);
            if (!open && phase === 'open') setPhase('idle');
          }}
          onSuccess={handleSuccess}
          onError={handleWidgetError}
          autoClose
        />
      )}

      {/* Bottom sheet */}
      <div
        className="fixed inset-0 z-50 flex items-end justify-center"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(14px)' }}
      >
        <div
          className="w-full max-w-[480px]"
          style={{
            background: '#131826',
            borderRadius: '28px 28px 0 0',
            border: '1px solid rgba(255,255,255,0.08)',
            borderBottom: 'none',
            padding: '28px 22px 40px',
          }}
        >
          {/* Done state */}
          {phase === 'done' && (
            <div style={{ textAlign: 'center', padding: '20px 0 12px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#00A651', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 0 1px rgba(0,166,81,0.4), 0 20px 60px -10px rgba(0,166,81,0.5)' }}>
                <svg viewBox="0 0 24 24" width={36} height={36} fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 22, color: '#fff', letterSpacing: '-0.02em' }}>Verified Human</div>
              <div style={{ color: '#00A651', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, marginTop: 6 }}>
                2× GoalPoints multiplier unlocked
              </div>
              {txSig && (
                <a href={explorerUrl(txSig)} target="_blank" rel="noreferrer"
                  style={{ display: 'block', color: '#6b7280', fontSize: 11, marginTop: 10, textDecoration: 'underline' }}>
                  View on Solana Explorer ↗
                </a>
              )}
            </div>
          )}

          {/* Recording on-chain */}
          {phase === 'recording' && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 48, height: 48, border: '3px solid #00A651', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 14px' }} />
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, color: '#fff', fontSize: 15 }}>Recording proof on Solana…</div>
              <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Storing ZK proof on-chain</div>
            </div>
          )}

          {/* Fetching rp_context */}
          {phase === 'fetching' && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 48, height: 48, border: '3px solid rgba(255,215,0,0.5)', borderTopColor: '#FFD700', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 14px' }} />
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, color: '#fff', fontSize: 15 }}>Preparing verification…</div>
              <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Connecting to World ID</div>
            </div>
          )}

          {/* Widget is open — show a holding message */}
          {phase === 'open' && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🌍</div>
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, color: '#fff', fontSize: 15 }}>World ID is open</div>
              <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>
                Scan the QR code with World App on your phone
              </div>
            </div>
          )}

          {/* Idle / error — main CTA screen */}
          {(phase === 'idle' || phase === 'error') && (
            <>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center', fontSize: 26 }}>
                  🌍
                </div>
                <div>
                  <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 17, color: '#fff', letterSpacing: '-0.02em' }}>Verify with World ID</div>
                  <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>Proof of Human · Zero-knowledge · Private</div>
                </div>
              </div>

              {/* Benefits */}
              <div style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: '14px 16px', marginBottom: 16 }}>
                {[
                  { icon: '⭐', text: '2× GoalPoints on every purchase' },
                  { icon: '🏆', text: 'Tournament leaderboard eligibility' },
                  { icon: '🎯', text: 'Exclusive human-only merchant deals' },
                  { icon: '🔒', text: 'Zero personal data shared — ZK proof only' },
                ].map(item => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: '#131826', display: 'grid', placeItems: 'center', fontSize: 15 }}>{item.icon}</div>
                    <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: '#B6BECB' }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Desktop note */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: 'rgba(0,166,81,0.08)', border: '1px solid rgba(0,166,81,0.2)', borderRadius: 12, marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#00A651" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
                <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11.5, color: '#00A651', lineHeight: 1.5 }}>
                  On desktop, a QR code will appear. Scan it with World App on your phone to verify.
                </span>
              </div>

              {/* Error message */}
              {errMsg && (
                <div style={{ fontSize: 12, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}>
                  ⚠ {errMsg}
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleStart}
                style={{ width: '100%', padding: '18px 22px', borderRadius: 999, background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}
              >
                <span style={{ fontSize: 20 }}>🌍</span>
                Verify with World App
              </button>
              <button onClick={onSkip} style={{ width: '100%', padding: '12px 0', color: '#6b7280', fontFamily: 'Archivo, sans-serif', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}>
                Skip for now
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

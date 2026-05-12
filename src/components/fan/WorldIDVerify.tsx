import React from 'react';

interface Props {
  onVerified: () => void;
  onSkip: () => void;
}

export default function WorldIDVerify({ onSkip }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#131826', borderRadius: 24, padding: 32, textAlign: 'center', maxWidth: 320 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌍</div>
        <div style={{ color: '#fff', fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>World ID</div>
        <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Not available in this build.</div>
        <button onClick={onSkip} style={{ padding: '12px 32px', borderRadius: 14, background: '#00A651', color: '#fff', fontFamily: 'Archivo, sans-serif', fontWeight: 800, border: 'none', cursor: 'pointer' }}>Close</button>
      </div>
    </div>
  );
}

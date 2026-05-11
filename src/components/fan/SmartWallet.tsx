import React, { useState } from 'react';

interface Policy {
  id: string;
  icon: string;
  label: string;
  description: string;
  value: string;
  enabled: boolean;
  type: 'limit' | 'auto' | 'block';
}

const DEFAULT_POLICIES: Policy[] = [
  {
    id: 'daily-limit',
    icon: '💰',
    label: 'Daily spending limit',
    description: 'Auto-reject payments over this amount',
    value: '$50.00',
    enabled: true,
    type: 'limit',
  },
  {
    id: 'auto-approve',
    icon: '⚡',
    label: 'Auto-approve under $10',
    description: 'Skip confirmation for small payments',
    value: '$10.00',
    enabled: true,
    type: 'auto',
  },
  {
    id: 'goalpoints-auto',
    icon: '⚽',
    label: 'Auto-redeem GoalPoints',
    description: 'Apply points discount automatically',
    value: 'On',
    enabled: false,
    type: 'auto',
  },
  {
    id: 'block-unknown',
    icon: '🛡️',
    label: 'Block unverified merchants',
    description: 'Only pay FanWallet-verified businesses',
    value: 'Active',
    enabled: true,
    type: 'block',
  },
  {
    id: 'gasless',
    icon: '🆓',
    label: 'Gasless transactions',
    description: 'Swig sponsors your Solana fees',
    value: 'Enabled',
    enabled: true,
    type: 'auto',
  },
];

export default function SmartWallet({ onClose }: { onClose: () => void }) {
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1500);
  };

  const typeColor: Record<Policy['type'], string> = {
    limit: 'text-red-400',
    auto: 'text-brand-green',
    block: 'text-blue-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
         style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-[700px] glass-card rounded-t-3xl border-t border-gray-700 p-6 animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xl">
              🧠
            </div>
            <div>
              <h3 className="font-black text-white">Smart Wallet</h3>
              <p className="text-xs text-blue-400">Powered by Swig · Programmable policies</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-2xl glass-card border border-gray-700 flex items-center justify-center text-gray-400 text-sm">
            ✕
          </button>
        </div>

        <div className="glass-card rounded-2xl p-3 border border-blue-500/20 mb-5">
          <p className="text-xs text-blue-300 font-semibold">🛡️ Swig on-chain policy engine</p>
          <p className="text-xs text-gray-400 mt-0.5">Rules enforced at the smart contract level — no one can override them, not even FanWallet.</p>
        </div>

        <div className="space-y-3 mb-5">
          {policies.map(policy => (
            <div key={policy.id} className="glass-card rounded-2xl p-4 border border-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{policy.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white text-sm">{policy.label}</p>
                    <button
                      onClick={() => toggle(policy.id)}
                      className={`w-11 h-6 rounded-full transition-all relative ${policy.enabled ? 'bg-brand-green' : 'bg-gray-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${policy.enabled ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{policy.description}</p>
                  <span className={`text-xs font-bold mt-1 inline-block ${typeColor[policy.type]}`}>
                    {policy.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
        >
          {saved ? '✓ Policies saved on-chain!' : 'Save Policies · Deploy to Swig'}
        </button>
      </div>
    </div>
  );
}

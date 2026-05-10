import React from 'react';
import { useApp, BizScreen } from '../../lib/appContext';

const NAV_ITEMS: { icon: string; label: string; screen: BizScreen }[] = [
  { icon: '📊', label: 'Dashboard', screen: 'dashboard' },
  { icon: '💳', label: 'POS Mode', screen: 'pos' },
  { icon: '📈', label: 'Analytics', screen: 'analytics' },
  { icon: '🔥', label: 'Deals', screen: 'deals' },
  { icon: '⭐', label: 'Reviews', screen: 'reviews' },
];

export default function SideNav() {
  const { bizScreen, setBizScreen, setRole } = useApp();

  return (
    <div className="fixed left-0 top-0 bottom-0 w-16 z-40 flex flex-col items-center py-6 gap-4"
         style={{ background: 'rgba(10,14,26,0.98)', borderRight: '1px solid rgba(31,41,55,0.8)', backdropFilter: 'blur(20px)' }}>

      {/* Logo */}
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl mb-2"
           style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}>
        ⚽
      </div>

      <div className="w-8 h-px bg-gray-800 mb-2" />

      {NAV_ITEMS.map(({ icon, label, screen }) => {
        const active = bizScreen === screen;
        return (
          <button
            key={screen}
            onClick={() => setBizScreen(screen)}
            title={label}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition-all duration-200 ${
              active
                ? 'glow-green'
                : 'hover:bg-gray-800'
            }`}
            style={{
              background: active ? 'linear-gradient(135deg, rgba(0,166,81,0.3), rgba(0,166,81,0.1))' : 'transparent',
              border: active ? '1px solid rgba(0,166,81,0.4)' : '1px solid transparent',
            }}
          >
            {icon}
          </button>
        );
      })}

      <div className="flex-1" />

      <button
        onClick={() => setRole('picker')}
        title="Switch role"
        className="w-10 h-10 rounded-2xl bg-gray-800 flex items-center justify-center text-lg hover:bg-gray-700 transition-all border border-gray-700"
      >
        ↩️
      </button>
    </div>
  );
}

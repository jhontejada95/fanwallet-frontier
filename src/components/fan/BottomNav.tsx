import React from 'react';
import { useApp, FanScreen } from '../../lib/appContext';

const NAV_ITEMS: { icon: string; label: string; screen: FanScreen }[] = [
  { icon: '🏠', label: 'Home', screen: 'dashboard' },
  { icon: '🗺️', label: 'Discover', screen: 'map' },
  { icon: '📱', label: 'Pay', screen: 'pay' },
  { icon: '⚽', label: 'Points', screen: 'goalpoints' },
  { icon: '👤', label: 'Profile', screen: 'profile' },
];

export default function BottomNav() {
  const { fanScreen, setFanScreen } = useApp();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bottom-nav">
      <div className="mx-3 mb-3 rounded-3xl border border-gray-800"
           style={{ background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ icon, label, screen }) => {
            const active = fanScreen === screen;
            return (
              <button
                key={screen}
                onClick={() => setFanScreen(screen)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200"
                style={{
                  background: active ? 'rgba(0,166,81,0.15)' : 'transparent',
                  minWidth: 56,
                }}
              >
                {screen === 'pay' ? (
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl -mt-6 shadow-lg glow-green"
                       style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}>
                    {icon}
                  </div>
                ) : (
                  <span className={`text-xl transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                    {icon}
                  </span>
                )}
                <span className={`text-[10px] font-semibold transition-colors duration-200 ${
                  active ? 'text-brand-green' : 'text-gray-500'
                } ${screen === 'pay' ? 'mt-1' : ''}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

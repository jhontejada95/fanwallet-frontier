import React from 'react';
import { AppProvider, useApp } from './lib/appContext';
import RolePicker from './components/RolePicker';
import FanApp from './components/fan/FanApp';
import BizApp from './components/business/BizApp';

function AppInner() {
  const { role } = useApp();
  if (role === 'picker') return <RolePicker />;
  if (role === 'fan') return <FanApp />;
  if (role === 'business') return <BizApp />;
  return null;
}

export default function App() {
  return (
    <AppProvider>
      {/* Desktop pitch background */}
      <div className="fixed inset-0 pitch-lines pointer-events-none hidden sm:block" style={{ zIndex: 0 }} />
      <div className="relative z-10 flex justify-center min-h-screen" style={{ background: 'transparent' }}>
        <div className="mobile-container">
          <AppInner />
        </div>
      </div>
    </AppProvider>
  );
}

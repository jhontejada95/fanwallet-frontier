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
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="mobile-container shadow-2xl">
          <AppInner />
        </div>
      </div>
    </AppProvider>
  );
}

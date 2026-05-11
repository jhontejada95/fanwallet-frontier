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
      <div style={{ minHeight: '100vh', background: '#0a0e1a' }}>
        <AppInner />
      </div>
    </AppProvider>
  );
}

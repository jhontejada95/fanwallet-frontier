import React from 'react';
import { useApp } from '../../lib/appContext';
import BizDashboard from './BizDashboard';
import POSMode from './POSMode';
import Analytics from './Analytics';
import Deals from './Deals';
import BizReviews from './BizReviews';
import SideNav from './SideNav';
import BizOnboarding from './BizOnboarding';

const NO_NAV = ['pos'];

export default function BizApp() {
  const { bizScreen, bizWalletAddress } = useApp();

  if (!bizWalletAddress) return <BizOnboarding />;

  const renderScreen = () => {
    switch (bizScreen) {
      case 'dashboard': return <BizDashboard />;
      case 'pos': return <POSMode />;
      case 'analytics': return <Analytics />;
      case 'deals': return <Deals />;
      case 'reviews': return <BizReviews />;
      default: return <BizDashboard />;
    }
  };

  const showNav = !NO_NAV.includes(bizScreen);

  return (
    <div className="flex min-h-screen">
      {showNav && <SideNav />}
      <div className={`flex-1 ${showNav ? 'ml-16' : ''} overflow-hidden`}>
        {renderScreen()}
      </div>
    </div>
  );
}

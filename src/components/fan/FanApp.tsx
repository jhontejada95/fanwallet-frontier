import React from 'react';
import { useApp } from '../../lib/appContext';
import Splash from './Splash';
import Onboarding from './Onboarding';
import Dashboard from './Dashboard';
import Deposit from './Deposit';
import PayQR from './PayQR';
import MerchantMap from './MerchantMap';
import MerchantProfile from './MerchantProfile';
import LeaveReview from './LeaveReview';
import GoalPoints from './GoalPoints';
import Stamps from './Stamps';
import FanProfile from './FanProfile';
import Send from './Send';
import Split from './Split';
import FanAgent from './FanAgent';
import WorldIDVerify from './WorldIDVerify';
import SmartWallet from './SmartWallet';
import BottomNav from './BottomNav';

const NO_NAV_SCREENS = ['splash', 'onboarding', 'review'];

export default function FanApp() {
  const { fanScreen } = useApp();

  const renderScreen = () => {
    switch (fanScreen) {
      case 'splash': return <Splash />;
      case 'onboarding': return <Onboarding />;
      case 'dashboard': return <Dashboard />;
      case 'deposit': return <Deposit />;
      case 'pay': return <PayQR />;
      case 'map': return <MerchantMap />;
      case 'merchant': return <MerchantProfile />;
      case 'review': return <LeaveReview />;
      case 'goalpoints': return <GoalPoints />;
      case 'stamps': return <Stamps />;
      case 'profile': return <FanProfile />;
      case 'send': return <Send />;
      case 'split': return <Split />;
      case 'agent': return <FanAgent onClose={() => setFanScreen('dashboard')} />;
      case 'worldid': return <WorldIDVerify />;
      case 'smartWallet': return <SmartWallet />;
      default: return <Dashboard />;
    }
  };

  const showNav = !NO_NAV_SCREENS.includes(fanScreen);

  return (
    <div className="flex flex-col min-h-screen">
      <div className={`flex-1 ${showNav ? 'pb-20' : ''}`}>
        {renderScreen()}
      </div>
      {showNav && <BottomNav />}
    </div>
  );
}

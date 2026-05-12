import React from 'react';
import { useApp } from '../../lib/appContext';
import { useIsDesktop } from '../../hooks/useIsDesktop';
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
import SmartWallet from './SmartWallet';
import BottomNav from './BottomNav';

const NO_NAV_SCREENS = ['splash', 'onboarding', 'review'];

export default function FanApp() {
  const { fanScreen, setFanScreen } = useApp();
  const isDesktop = useIsDesktop();

  const renderScreen = () => {
    switch (fanScreen) {
      case 'splash':      return <Splash />;
      case 'onboarding':  return <Onboarding />;
      case 'dashboard':   return <Dashboard />;
      case 'deposit':     return <Deposit />;
      case 'pay':         return <PayQR />;
      case 'map':         return <MerchantMap />;
      case 'merchant':    return <MerchantProfile />;
      case 'review':      return <LeaveReview />;
      case 'goalpoints':  return <GoalPoints />;
      case 'stamps':      return <Stamps />;
      case 'profile':     return <FanProfile />;
      case 'send':        return <Send />;
      case 'split':       return <Split />;
      case 'agent':       return <FanAgent onClose={() => setFanScreen('dashboard')} />;
      case 'smartWallet': return <SmartWallet />;
      default:            return <Dashboard />;
    }
  };

  const showNav = !NO_NAV_SCREENS.includes(fanScreen);

  // On desktop the nav is a top bar (64px), on mobile it's a bottom bar (80px)
  const contentStyle = showNav
    ? isDesktop
      ? { paddingTop: 64 }
      : { paddingBottom: 80 }
    : {};

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', ...contentStyle }}>
      {renderScreen()}
      {showNav && <BottomNav />}
    </div>
  );
}

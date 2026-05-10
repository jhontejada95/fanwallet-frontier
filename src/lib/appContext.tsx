import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AppRole = 'picker' | 'fan' | 'business';
export type FanScreen =
  | 'splash' | 'onboarding' | 'dashboard' | 'deposit'
  | 'pay' | 'send' | 'split' | 'map' | 'merchant'
  | 'review' | 'goalpoints' | 'stamps' | 'profile';
export type BizScreen =
  | 'dashboard' | 'pos' | 'analytics' | 'deals' | 'reviews'
  | 'loyalty' | 'profile-editor' | 'reports' | 'qr-generator';

interface AppState {
  role: AppRole;
  fanScreen: FanScreen;
  bizScreen: BizScreen;
  selectedCountry: { code: string; name: string; flag: string; currency: string } | null;
  balance: number;
  goalPoints: number;
  selectedMerchant: string | null;
  showPaymentSuccess: boolean;
  posAmount: string;
  showPOSSuccess: boolean;

  setRole: (role: AppRole) => void;
  setFanScreen: (screen: FanScreen) => void;
  setBizScreen: (screen: BizScreen) => void;
  setSelectedCountry: (c: AppState['selectedCountry']) => void;
  setBalance: (b: number) => void;
  setGoalPoints: (p: number) => void;
  setSelectedMerchant: (id: string | null) => void;
  setShowPaymentSuccess: (v: boolean) => void;
  setPosAmount: (a: string) => void;
  setShowPOSSuccess: (v: boolean) => void;
  goToFan: (screen: FanScreen) => void;
  goToBiz: (screen: BizScreen) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AppRole>('picker');
  const [fanScreen, setFanScreen] = useState<FanScreen>('splash');
  const [bizScreen, setBizScreen] = useState<BizScreen>('dashboard');
  const [selectedCountry, setSelectedCountry] = useState<AppState['selectedCountry']>(null);
  const [balance, setBalance] = useState(0);
  const [goalPoints, setGoalPoints] = useState(342);
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [posAmount, setPosAmount] = useState('');
  const [showPOSSuccess, setShowPOSSuccess] = useState(false);

  const goToFan = (screen: FanScreen) => {
    setRole('fan');
    setFanScreen(screen);
  };

  const goToBiz = (screen: BizScreen) => {
    setRole('business');
    setBizScreen(screen);
  };

  return (
    <AppContext.Provider value={{
      role, fanScreen, bizScreen, selectedCountry, balance, goalPoints,
      selectedMerchant, showPaymentSuccess, posAmount, showPOSSuccess,
      setRole, setFanScreen, setBizScreen, setSelectedCountry, setBalance,
      setGoalPoints, setSelectedMerchant, setShowPaymentSuccess,
      setPosAmount, setShowPOSSuccess, goToFan, goToBiz,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

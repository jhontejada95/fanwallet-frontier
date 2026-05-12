/**
 * AppContext — FanWallet global state
 *
 * Level 3 upgrade: integrates real on-chain data when a wallet is connected.
 * Falls back to mock values (balance=0, goalPoints=342) when disconnected
 * so the app remains fully navigable as a demo without a wallet.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { AnchorProvider } from '@coral-xyz/anchor';
import {
  getUsdcBalance,
  getGoalPointsBalance,
  getFanAccount,
  initializeFan,
  makeProvider,
} from './solana';

export type AppRole = 'picker' | 'fan' | 'business';
export type FanScreen =
  | 'splash' | 'onboarding' | 'dashboard' | 'deposit'
  | 'pay' | 'send' | 'split' | 'map' | 'merchant'
  | 'review' | 'goalpoints' | 'stamps' | 'profile'
  | 'agent' | 'smartWallet';
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

  // On-chain state
  walletAddress: string | null;
  walletConnected: boolean;
  fanInitialized: boolean;
  chainLoading: boolean;

  // Business registration
  bizWalletAddress: string | null;
  bizName: string;

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
  setBizWalletAddress: (addr: string | null) => void;
  setBizName: (name: string) => void;
  goToFan: (screen: FanScreen) => void;
  goToBiz: (screen: BizScreen) => void;
  refreshBalances: () => Promise<void>;
  getProvider: () => AnchorProvider | null;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [role, setRole] = useState<AppRole>(() => {
    try { return (localStorage.getItem('fw_role') as AppRole) || 'picker'; } catch { return 'picker'; }
  });
  const [fanScreen, setFanScreen] = useState<FanScreen>(() => {
    try {
      const saved = localStorage.getItem('fw_role');
      return saved === 'fan' ? 'dashboard' : 'splash';
    } catch { return 'splash'; }
  });
  const [bizScreen, setBizScreen] = useState<BizScreen>('dashboard');
  const [selectedCountry, setSelectedCountry] = useState<AppState['selectedCountry']>(null);

  // Balance state — real on-chain when connected, mock otherwise
  const [balance, setBalance] = useState(0);
  const [goalPoints, setGoalPoints] = useState(342);

  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [posAmount, setPosAmount] = useState('');
  const [showPOSSuccess, setShowPOSSuccess] = useState(false);

  // Business registration — persisted so session survives browser navigation
  const [bizWalletAddress, setBizWalletAddress] = useState<string | null>(() => {
    try { return localStorage.getItem('fw_biz_wallet'); } catch { return null; }
  });
  const [bizName, setBizName] = useState(() => {
    try { return localStorage.getItem('fw_biz_name') || 'Tacos El Azteca'; } catch { return 'Tacos El Azteca'; }
  });

  // On-chain state
  const [fanInitialized, setFanInitialized] = useState(false);
  const [chainLoading, setChainLoading] = useState(false);

  const walletAddress = wallet.publicKey?.toBase58() ?? null;
  const walletConnected = wallet.connected && !!wallet.publicKey;

  // Build AnchorProvider from connected wallet
  const getProvider = useCallback((): AnchorProvider | null => {
    if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
      return null;
    }
    return makeProvider({
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    });
  }, [wallet]);

  // Refresh on-chain balances and fan account state
  const refreshBalances = useCallback(async () => {
    if (!wallet.publicKey) return;
    setChainLoading(true);
    try {
      const [usdc, gp] = await Promise.all([
        getUsdcBalance(wallet.publicKey),
        getGoalPointsBalance(wallet.publicKey),
      ]);
      setBalance(usdc);
      setGoalPoints(gp);

      // Also check fan account
      const provider = getProvider();
      if (provider) {
        const fanData = await getFanAccount(provider, wallet.publicKey);
        if (fanData) {
          setFanInitialized(true);
          // Use on-chain values if they differ
          if (gp > 0 || fanData.totalPointsEarned > 0) {
            setGoalPoints(Math.max(gp, fanData.totalPointsEarned));
          }
        }
      }
    } catch (err) {
      console.error('[FanWallet] Balance refresh error:', err);
    } finally {
      setChainLoading(false);
    }
  }, [wallet.publicKey, getProvider]);

  // Auto-refresh balances on wallet connect/disconnect
  useEffect(() => {
    if (walletConnected && wallet.publicKey) {
      refreshBalances();
    } else {
      // Reset to mock values when disconnected
      setBalance(0);
      setGoalPoints(342);
      setFanInitialized(false);
    }
  }, [walletConnected, wallet.publicKey]);

  // Auto-initialize fan account when a new wallet connects
  useEffect(() => {
    if (!walletConnected || fanInitialized || chainLoading) return;

    const tryInit = async () => {
      const provider = getProvider();
      if (!provider) return;
      try {
        await initializeFan(provider, 'Fan');
        setFanInitialized(true);
        console.log('[FanWallet] Fan account initialized on-chain');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        // Account may already exist (init_if_needed) — that's fine
        if (msg.includes('already in use') || msg.includes('custom program error')) {
          setFanInitialized(true);
        } else {
          console.warn('[FanWallet] Fan init (non-critical):', msg);
        }
      }
    };

    // Delay slightly to allow wallet adapter to settle
    const timer = setTimeout(tryInit, 1500);
    return () => clearTimeout(timer);
  }, [walletConnected, fanInitialized, chainLoading, getProvider]);

  // Persist session state so navigation away (e.g. Solscan) doesn't lose context
  useEffect(() => { try { localStorage.setItem('fw_role', role); } catch {} }, [role]);
  useEffect(() => {
    try {
      if (bizWalletAddress) localStorage.setItem('fw_biz_wallet', bizWalletAddress);
      else localStorage.removeItem('fw_biz_wallet');
    } catch {}
  }, [bizWalletAddress]);
  useEffect(() => { try { localStorage.setItem('fw_biz_name', bizName); } catch {} }, [bizName]);

  const goToFan = (screen: FanScreen) => {
    setRole('fan');
    setFanScreen(screen);
  };

  const goToBiz = (screen: BizScreen) => {
    setRole('business');
    setBizScreen(screen);
  };

  // Wrap setBizWalletAddress to clear localStorage when set to null (Switch wallet)
  const handleSetBizWalletAddress = (addr: string | null) => {
    setBizWalletAddress(addr);
    if (!addr) { try { localStorage.removeItem('fw_biz_wallet'); } catch {} }
  };

  return (
    <AppContext.Provider
      value={{
        role, fanScreen, bizScreen, selectedCountry,
        balance, goalPoints, selectedMerchant,
        showPaymentSuccess, posAmount, showPOSSuccess,
        walletAddress, walletConnected,
        fanInitialized, chainLoading,
        bizWalletAddress, bizName,
        setRole, setFanScreen, setBizScreen, setSelectedCountry,
        setBalance, setGoalPoints, setSelectedMerchant,
        setShowPaymentSuccess, setPosAmount, setShowPOSSuccess,
        setBizWalletAddress: handleSetBizWalletAddress, setBizName,
        goToFan, goToBiz,
        refreshBalances, getProvider,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

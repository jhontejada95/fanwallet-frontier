import React, { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  SolanaMobileWalletAdapter,
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
} from "@solana-mobile/wallet-adapter-mobile";
import { DEVNET_RPC } from "./solana";

interface SolanaWalletProviderProps {
  children: ReactNode;
}

export const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;

  const wallets = useMemo(
    () => [
      // Mobile Wallet Adapter — handles Android Phantom/Solflare via MWA protocol
      // and iOS Phantom via deep links. Auto-activated on mobile by wallet-adapter-react.
      new SolanaMobileWalletAdapter({
        addressSelector: createDefaultAddressSelector(),
        appIdentity: {
          name: "FanWallet",
          uri: "https://fanwallet-frontier.vercel.app",
          icon: "pwa-192x192.png",
        },
        authorizationResultCache: createDefaultAuthorizationResultCache(),
        cluster: network,
        onWalletNotFound: createDefaultWalletNotFoundHandler(),
      }),
      // Desktop browser extension fallbacks
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={DEVNET_RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

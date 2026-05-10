import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { SolanaWalletProvider } from './lib/wallet';
import { AppProvider } from './lib/appContext';
// Wallet adapter styles — provides modal UI for wallet selection
import '@solana/wallet-adapter-react-ui/styles.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SolanaWalletProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </SolanaWalletProvider>
  </React.StrictMode>,
);

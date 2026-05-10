# FanWallet — Level 3 Deployment Guide

## Prerequisites
- Rust + Anchor CLI 0.30.1
- Solana CLI configured for devnet
- Node.js 18+
- Phantom or Backpack wallet browser extension

## 1. Get devnet SOL
```bash
solana airdrop 2 --url devnet
```

## 2. Build & deploy the Anchor program
```bash
# Install Rust dependencies
cd programs/fanwallet
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Initialize the program (creates GoalPoints SPL mint)
anchor migrate --provider.cluster devnet
```

## 3. Get devnet USDC
Visit: https://spl-token-faucet.com/?token-name=USDC-Dev  
Mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`

## 4. Run the frontend
```bash
npm install
npm run dev
```
Open http://localhost:5173 and connect your Phantom wallet (set to Devnet).

## 5. Test the full flow
1. Connect Phantom → auto-creates FanAccount PDA
2. Dashboard shows real USDC balance
3. Pay at a merchant → real USDC transfer + GoalPoints minted
4. Leave review → +50 GoalPoints minted on-chain
5. Verify with World ID → 2× multiplier stored on-chain
6. Redeem GoalPoints → burns SPL tokens

## Program Details
| Item | Value |
|------|-------|
| Program ID | `HTgaYE4nogBobG6Rsa1vD1L2XK1Uy9aWLqKceWcausVC` |
| Network | Solana Devnet |
| USDC Mint | `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU` |
| GoalPoints Mint | Derived PDA: `[b"goal_points_mint"]` |
| ProgramState PDA | Derived: `[b"program_state"]` |

## PWA Install
On mobile Chrome/Safari: visit the deployed URL and tap "Add to Home Screen".  
The app works offline for UI browsing; blockchain calls require network.

## Sponsor Integrations
- **MoonPay** — FanAgent AI chip: "Buy USDC" → opens MoonPay widget (devnet widget URL in MoonPayAgent.tsx)
- **Coinbase x402** — MerchantProfile "📊 Live Insights" → pays $0.10 USDC for real-time merchant data
- **Vanish** — MerchantProfile "🌑 Private Pay" → ZK-shielded USDC via Vanish pool on devnet

# ⚽ FanWallet Frontier

> **AI-powered crypto payment & discovery ecosystem for FIFA World Cup 2026**
> Built for the [Colosseum Frontier Hackathon](https://arena.colosseum.org)

[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana&logoColor=white)](https://explorer.solana.com/address/HTgaYE4nogBobG6Rsa1vD1L2XK1Uy9aWLqKceWcausVC?cluster=devnet)
[![LI.FI](https://img.shields.io/badge/LI.FI-Bridge-00A651)](https://li.fi)
[![Phantom](https://img.shields.io/badge/Phantom-Wallet-AB9FF2)](https://phantom.app)
[![World ID](https://img.shields.io/badge/World_ID-Proof_of_Human-000000)](https://worldcoin.org)
[![Swig](https://img.shields.io/badge/Swig-Smart_Wallet-3B82F6)](https://swig.so)

---

## 🏆 The Problem

**48 nations. Millions of fans. One massive friction point.**

International tourists at World Cup 2026 can't easily pay at local merchants — currency exchange fees hit 8–12%, cards get declined, and merchants have no way to reach fans of 48 different nations. Meanwhile, local businesses have no intelligence about which fans are coming on which match day.

**FanWallet solves both sides with AI agents + Solana.**

---

## 🤖 What's New: The Agent Layer (Frontier)

FanWallet Frontier adds a full AI agent stack on top of the payment infrastructure:

### FanAgent
An AI assistant embedded in every fan's wallet that:
- **Recommends** merchants based on proximity, ratings, and match schedule
- **Executes** payments via natural language ("pay for my tacos")
- **Splits bills** between groups instantly
- **Manages** GoalPoints redemption autonomously
- **Bridges** crypto from any chain via LI.FI with one command

### MerchantAgent *(coming soon)*
An AI agent for business owners that:
- **Auto-creates** match day deals based on upcoming fixtures
- **Responds** to reviews using tone-matched AI
- **Adjusts** GoalPoints multipliers based on predicted fan flow
- **Alerts** owners when fans of specific nationalities are nearby

### Agent Wallets (Metaplex + Swig)
- Every FanAgent is registered on-chain as a **Metaplex Core NFT** with a built-in wallet
- **Swig smart wallet** policies enforce spending limits, auto-approval thresholds, and gasless transactions — all at the contract level

---

## 🔗 Sponsor Technology Stack

| Sponsor | Integration | Why |
|---------|-------------|-----|
| **Phantom** | Primary embedded wallet + CASH stablecoin | Recommended wallet for Frontier — seamless email onboarding |
| **LI.FI** | Cross-chain bridge (60+ chains → USDC on Solana) | Fans bridge ETH/ARB/BASE/MATIC to USDC in ~15s |
| **Privy** | Fallback embedded wallet + auth | Email/Google/Apple login → auto Solana wallet |
| **World ID** | Proof of Human verification | Verifies fans are real humans; unlocks 2x GoalPoints |
| **Swig** | Smart wallet spending policies | Programmable on-chain rules: daily limits, auto-approve, gasless |
| **Metaplex** | Agent registry as Core NFTs | FanAgent registered on-chain with identity + wallet |
| **Helius** | Solana RPC | Low-latency transactions and WebSocket event streaming |
| **Vanish** | Private merchant payments *(in progress)* | Merchants accept USDC without exposing wallet history |
| **MoonPay** | On/off ramp for non-crypto merchants | Merchants cash out USDC to local currency instantly |
| **Altitude (Squads)** | Merchant treasury multisig | Business owners secure their earnings with multi-party approval |
| **Coinbase x402** | Paid API endpoints for premium merchant data | Merchants pay per query for advanced fan flow predictions |

---

## 📱 Product Overview

### Fan App (13 screens, mobile-first PWA)

```
Splash → Onboarding (country + Phantom login) → Home Dashboard
  ├── FanAgent AI chat (🤖)
  ├── World ID verification (🌍)
  ├── Smart Wallet policies (Swig)
  ├── Deposit (LI.FI 5-step bridge)
  ├── Pay QR (Solana Pay)
  ├── Merchant Map (Mapbox)
  ├── Merchant Profile + verified reviews
  ├── Leave Review (on-chain, post-payment)
  ├── GoalPoints (earn/redeem loyalty)
  └── Stamps & Badges (NFT collectibles)
```

### Business Dashboard (5+ screens)

```
Dashboard (live revenue feed) → POS Mode (QR + confetti) → Analytics
  ├── Match Day Deals manager
  ├── Review management (respond on-chain)
  └── Real-time customer nationality tracking
```

---

## 🦀 Smart Contracts (Anchor / Solana Devnet)

**Program ID:** `HTgaYE4nogBobG6Rsa1vD1L2XK1Uy9aWLqKceWcausVC`

[View on Solana Explorer →](https://explorer.solana.com/address/HTgaYE4nogBobG6Rsa1vD1L2XK1Uy9aWLqKceWcausVC?cluster=devnet)

```rust
// 4 on-chain instructions
process_payment(fan, business, amount_usdc)  // Pay + auto-mint GoalPoints
register_review(fan, business, payment_tx, review_hash, rating)  // Verified review
register_business(owner, name)  // Merchant registration
mint_goal_points(fan, amount, multiplier)  // Loyalty points
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/jhontejada95/fanwallet-frontier
cd fanwallet-frontier
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

Select **Fan
# ⚽ FanWallet Frontier

> **Crypto payment & fan loyalty ecosystem for FIFA World Cup 2026**  
> Built for the [Colosseum Frontier Hackathon 2026](https://arena.colosseum.org)

[![Live Demo](https://img.shields.io/badge/Live-fanwallet--frontier.vercel.app-00A651?style=for-the-badge)](https://fanwallet-frontier.vercel.app/)
[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana)](https://explorer.solana.com/address/HUESSuFsC7DnDZ9bKK7p6phudZYuH7W6PC9rfKQfP7aF?cluster=devnet)
[![Anchor](https://img.shields.io/badge/Anchor-0.29-9945FF)](https://www.anchor-lang.com/)
[![Phantom](https://img.shields.io/badge/Phantom-Wallet-AB9FF2)](https://phantom.app)

---

## The Problem

**48 nations. 5 host cities. Millions of fans. One massive friction point.**

International tourists at World Cup 2026 can't easily pay at local merchants — currency exchange fees hit 8–12%, cards get declined abroad, and local businesses have zero visibility into which fans are coming on which match day.

**FanWallet solves both sides of this equation with real Solana payments.**

---

## What It Does

FanWallet is a dual-role mobile PWA:

### For Fans
- Connect Phantom wallet, pick your country, and pay any participating merchant with USDC
- Earn **GoalPoints** (real SPL tokens minted on Solana devnet) on every purchase
- Private payments via **Vanish** ZK-shielded flow
- **World ID** verification unlocks 2x points multiplier
- AI-powered **FanAgent** recommends merchants, answers questions, and splits bills
- Scan any merchant's **Solana Pay QR** to pay instantly

### For Merchants
- Register your business with a Solana wallet — that's your merchant account
- **POS Mode**: enter an amount, show QR, receive USDC in seconds
- Live balance polling confirms payment on devnet in real time
- Dashboard shows revenue, fan nationalities, and match-day deal performance
- **x402 Insights**: pay-per-query crowd level and wait time data via Coinbase x402

---

## Live Product

**[https://fanwallet-frontier.vercel.app/](https://fanwallet-frontier.vercel.app/)**

No login required — works as demo without a wallet. Connect Phantom on mobile or desktop to go fully on-chain.

### Quick Demo Flow

1. Open the link on mobile in Phantom's browser
2. Select **Business** → connect wallet → enter business name → wallet registered on-chain
3. Go to **POS Mode** → enter amount → tap **Generate QR**
4. On another device, select **Fan** → connect wallet → tap **Pay QR** → scan the QR
5. Wallet prompts for approval — one tap confirms
6. POS detects payment, shows confetti, balance updates
7. Fan earns GoalPoints (real SPL tokens on devnet)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  FanWallet PWA                       │
│  React 18 + TypeScript + Tailwind + Vite PWA        │
│                                                      │
│  Fan App (13 screens)     Business App (6 screens)  │
│  ├── Dashboard            ├── Dashboard (live bal)  │
│  ├── Pay QR (jsQR scan)   ├── POS Mode (QR + poll)  │
│  ├── Merchant Map         ├── Analytics              │
│  ├── Merchant Profile     ├── Deal Manager           │
│  ├── GoalPoints           ├── Review Manager         │
│  ├── FanAgent AI          └── QR Generator           │
│  ├── World ID verify                                  │
│  └── Vanish private pay                              │
└───────────────────┬─────────────────────────────────┘
                    │
        @solana/wallet-adapter (Phantom)
                    │
┌───────────────────▼─────────────────────────────────┐
│           Anchor Program on Solana Devnet            │
│  HUESSuFsC7DnDZ9bKK7p6phudZYuH7W6PC9rfKQfP7aF      │
│                                                      │
│  initializeFan()       — creates FanAccount PDA      │
│  initializeMerchant()  — creates MerchantAccount PDA │
│  processPayment()      — USDC transfer + GP mint     │
│  submitReview()        — verified on-chain review    │
│  redeemPoints()        — burn GoalPoints for rewards │
│  verifyWorldId()       — store nullifier on-chain    │
└─────────────────────────────────────────────────────┘

Payment fallback: direct SPL createTransferInstruction
(when merchant PDA not initialized — payment still succeeds)
```

---

## Smart Contract

**Program ID:** `HUESSuFsC7DnDZ9bKK7p6phudZYuH7W6PC9rfKQfP7aF`  
**USDC Devnet Mint:** `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`  
**GoalPoints Mint:** PDA derived from `["goal_points_mint"]`

[View Program on Solana Explorer →](https://explorer.solana.com/address/HUESSuFsC7DnDZ9bKK7p6phudZYuH7W6PC9rfKQfP7aF?cluster=devnet)

---

## Sponsor Integrations

| Sponsor | Integration |
|---------|-------------|
| **Phantom** | Primary wallet — embedded in PWA, signs all transactions |
| **Solana Pay** | QR URI standard for POS-to-fan payment flow |
| **World ID** | Proof-of-human verification stored on-chain |
| **Vanish** | ZK-shielded private merchant payments |
| **Coinbase x402** | Pay-per-query merchant insights API |
| **LI.FI** | Cross-chain bridge (60+ chains → USDC on Solana) |
| **Metaplex** | Agent registry as Core NFTs |
| **Swig** | Smart wallet spending policies (gasless, daily limits) |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| PWA | vite-plugin-pwa (installable, offline-capable) |
| Blockchain | Solana devnet, Anchor 0.29, @coral-xyz/anchor |
| Wallet | @solana/wallet-adapter-react (Phantom, Backpack, Solflare) |
| Tokens | @solana/spl-token (USDC + GoalPoints SPL) |
| QR | qrcode.react (generate), jsQR (decode), input[capture] fallback |
| Maps | Leaflet + OpenStreetMap |
| AI Agent | Claude API (FanAgent) |

---

## Local Development

```bash
git clone https://github.com/0xjh0n/fanwallet-frontier
cd fanwallet-frontier
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> Requires a Phantom wallet with devnet USDC to test on-chain flows.  
> All screens are navigable without a wallet (mock mode).

---

## Key Engineering Decisions

**Payment reliability over elegance** — `processPayment` tries the Anchor program (full GoalPoints + tracking) and falls back to a direct `createTransferInstruction` SPL transfer if the merchant PDA isn't initialized. Payment never fails because of missing program state.

**POS polling over WebSockets** — `onAccountChange` WebSocket is unreliable on devnet public RPC. Replaced with `getUsdcBalance` polling every 2.5s. Adds ~2.5s detection lag but is 100% reliable.

**Dual-mode QR scanner** — Phantom's WebView sandboxes `canvas.getImageData()` (returns black pixels). Detected via 5 consecutive all-black frames → switches to `<input type="file" capture="environment">` which uses the native OS camera, returning a real image for jsQR to decode.

**Session persistence across navigation** — Phantom opens Solscan in-app. When user closes it, they return to Phantom not FanWallet. Fixed with `localStorage` persisting `fw_role`, `fw_biz_wallet`, `fw_biz_name`.

**Optimistic GoalPoints** — `setGoalPoints` is called immediately after `processPayment` resolves so the fan sees points before on-chain mint confirmation arrives.

---

## Team

Built by **0xjh0n** for the Colosseum Frontier Hackathon 2026  
Contact: jhontejada95@gmail.com

---

*Solana devnet — for testing and demonstration purposes.*

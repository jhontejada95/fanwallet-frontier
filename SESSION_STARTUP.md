# FanWallet Frontier — Session Startup Document

Read this at the start of every new Claude session to get full context fast.

---

## Where We Are

**Live app:** https://fanwallet-frontier.vercel.app/
**Repo:** https://github.com/jhontejada95/fanwallet-frontier
**Branch:** `main` (all work is here, auto-deploys to Vercel on push)
**Status:** Submitted to Colosseum Frontier Hackathon 2026 on 2026-05-11

---

## What Works (Verified on Devnet)

- Full end-to-end payment: fan scans POS QR → Phantom approves → USDC lands in merchant wallet in <2s
- Real Solana Pay QR in POS Mode (scannable by any wallet)
- GoalPoints minted on-chain (Anchor program) or optimistic UI update on fallback
- Business onboarding: wallet connect → `initializeMerchant()` → PDA registered
- POS payment detection: balance polling every 2.5s (reliable, WebSocket was not)
- QR scanner: dual-mode — live camera + `<input capture="environment">` photo fallback (fixes Phantom WebView canvas restriction)
- Session persistence across navigation (localStorage: `fw_role`, `fw_biz_wallet`, `fw_biz_name`)
- Vanish private pay UI, Coinbase x402 insights UI, LI.FI deposit UI, FanAgent AI chat

---

## Smart Contract

| Key | Value |
|-----|-------|
| Program ID | `HUESSuFsC7DnDZ9bKK7p6phudZYuH7W6PC9rfKQfP7aF` |
| Network | Solana devnet |
| USDC mint | `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU` |
| GoalPoints mint | PDA from `["goal_points_mint"]` |
| Deploy tool | Solana Playground — no local Anchor CLI |

**Instructions in the program:**
- `initializeFan` — creates FanAccount PDA
- `initializeMerchant` — creates MerchantAccount PDA
- `processPayment` — USDC transfer + GoalPoints mint
- `submitReview` — verified on-chain review (+50 GP)
- `redeemPoints` — burn GoalPoints
- ~~`verifyWorldId`~~ — exists in IDL but removed from UI entirely

---

## Critical Files to Know

```
src/lib/appContext.tsx       Global state — balance, goalPoints, bizWalletAddress, bizName
src/lib/solana.ts            All Anchor calls + direct SPL fallback
src/lib/idl.ts               Program IDL + PROGRAM_ID constant
src/lib/wallet.tsx           Wallet adapter (Phantom + Solflare only)
src/components/fan/
  FanApp.tsx                 Screen router for fan
  MerchantProfile.tsx        On-chain payment + optimistic GoalPoints
  PayQR.tsx                  Dual-mode QR scanner
src/components/business/
  BizApp.tsx                 Gate: no wallet → BizOnboarding
  BizOnboarding.tsx          Merchant wallet registration
  POSMode.tsx                Solana Pay QR + balance polling
  BizDashboard.tsx           Real USDC balance display
```

---

## What Was Removed

**World ID** — completely stripped. Not implemented, removed from:
- `appContext.tsx` (state, interface, context value)
- `FanApp.tsx` (import, case 'worldid')
- `Dashboard.tsx` (import, state, buttons)
- `GoalPoints.tsx` (earn list item, BalanceCard prop)
- `Splash.tsx`, `RolePicker.tsx` (footer text)
- `solana.ts` (`verifyWorldId` function)
- `WorldIDVerify.tsx` → replaced with empty stub so tsc doesn't fail
- `README.md`, all submission texts, all scripts

---

## Known Issues (Pre-existing, Non-blocking)

TypeScript errors that don't affect Vite build (vercel.json uses `npx vite build` directly):
- `LeaveReview.tsx` — `walletAddress` not typed on merchant object
- `MerchantProfile.tsx` — `priceRange`, `walletAddress` optional fields
- `PayQR.tsx` — `placeholder` CSS property type
- `solana.ts` — IDL doesn't satisfy newer `Idl` constraint from anchor

These are safe to ignore unless doing a TypeScript-only refactor.

---

## Build & Deploy

```bash
npm install          # uses legacy-peer-deps=true (.npmrc)
npm run dev          # local dev at localhost:5173
npm run build        # tsc && vite build (may have TS errors — use vite build directly)
npx vite build       # clean build for Vercel
```

Vercel: auto-deploy on push to `main`. Build command in `vercel.json`: `npx vite build`.

---

## Submission Assets

| Asset | Location |
|-------|----------|
| Pitch deck (8 slides HTML) | `DECK/DECK PITCH FANWALLET.zip` |
| Claude Design handoff | `desing made by claude design/` |
| Live URL | https://fanwallet-frontier.vercel.app/ |
| README | `/README.md` |

---

## Rules for This Project

1. **All public-facing content in English** — README, scripts, form texts, pitch. Conversation can be in Spanish.
2. **No CLI Solana/Anchor commands** — user has no local Solana CLI. Use Solana Playground for contract changes.
3. **Don't list features that aren't implemented** — burned once with World ID. Only mention sponsors with at least a working UI screen.
4. **Verify visually before reporting done** — don't say "it works" until the UI confirms it.
5. **Build command is `npx vite build`** — not `npm run build` for Vercel, to bypass tsc errors.

---

## Possible Next Steps (Post-Hackathon)

- Mainnet deployment (requires real USDC, mainnet RPC)
- Fix pre-existing TypeScript errors for a clean `tsc` build
- Implement real LI.FI bridge (currently UI-only)
- Implement real Vanish ZK payments (currently UI-only)
- Fan profile with real on-chain history
- Match-day GoalPoints multiplier (2× during live games)
- Metaplex NFT stamps for real
- Mobile app (React Native) vs PWA decision

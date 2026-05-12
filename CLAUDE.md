# FanWallet Frontier — Claude Shared Context

This file is read automatically by Claude Code at session start.
Claude Desktop users: read this file first before helping with this project.

**Last updated:** 2026-05-11  
**Updated by:** Claude Code (VSCode Extension)

---

## Quick State

| Item | Value |
|------|-------|
| Live URL | https://fanwallet-frontier.vercel.app/ |
| Repo | https://github.com/jhontejada95/fanwallet-frontier |
| Branch | `main` — auto-deploys to Vercel |
| Hackathon | Colosseum Frontier 2026 — SUBMITTED 2026-05-11 |
| Contract | `HUESSuFsC7DnDZ9bKK7p6phudZYuH7W6PC9rfKQfP7aF` (Solana devnet) |

---

## What Works Right Now

- End-to-end on-chain payment (fan → merchant, USDC, devnet, confirmed)
- Solana Pay QR in POS Mode (real, scannable)
- GoalPoints SPL tokens minted on payment (Anchor) or optimistic (fallback)
- Business onboarding with wallet registration on-chain
- QR scanner: dual-mode camera + photo fallback (fixes Phantom WebView)
- Session persistence across navigation (localStorage)
- 7 sponsor integrations: Phantom, Solana Pay, Vanish, Coinbase x402, LI.FI, Metaplex, Swig

## What Was Removed

- **World ID** — completely stripped (not implemented). `WorldIDVerify.tsx` is an empty stub.

## Known Non-blocking Issues

- TypeScript errors in tsc (pre-existing) — Vite build works fine
- Vercel uses `npx vite build` directly (in `vercel.json`)

---

## Rules for This Project

1. All public-facing content (README, scripts, forms, pitch) in **English**
2. No Solana/Anchor CLI commands — user has no local CLI, uses Solana Playground
3. Only list sponsors/features that have at least a working UI screen
4. Verify visually before reporting done
5. Build command for Vercel: `npx vite build` (not `npm run build`)

---

## Full Context

See `SESSION_STARTUP.md` for complete technical details, file map, and next steps.

---

## Change Log

<!-- Claude Desktop and Claude Code both append entries here when making changes -->
<!-- Format: YYYY-MM-DD | Tool | What changed | Why -->

| Date | Tool | Change | Why |
|------|------|--------|-----|
| 2026-05-11 | Claude Code | Initial build — full Level 3 Solana dApp | Colosseum Hackathon |
| 2026-05-11 | Claude Code | Real merchant onboarding + POS polling | End-to-end payment |
| 2026-05-11 | Claude Code | Dual-mode QR scanner (camera + photo) | Phantom WebView fix |
| 2026-05-11 | Claude Code | Session localStorage persistence | Phantom navigation fix |
| 2026-05-11 | Claude Code | Optimistic GoalPoints post-payment | UX improvement |
| 2026-05-11 | Claude Code | World ID completely removed | Not implemented |
| 2026-05-11 | Claude Code | README + SESSION_STARTUP.md written | Hackathon submission |

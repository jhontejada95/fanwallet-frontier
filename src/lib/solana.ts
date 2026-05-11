/**
 * FanWallet Solana Service Layer
 *
 * All interactions with the fanwallet Anchor program and SPL tokens.
 * Falls back to mock data gracefully when program is not yet deployed
 * or wallet is not connected.
 *
 * Program: HUESSuFsC7DnDZ9bKK7p6phudZYuH7W6PC9rfKQfP7aF (devnet)
 * USDC mint (devnet): 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
 */

import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Program, AnchorProvider, BN, web3 } from "@coral-xyz/anchor";
import { IDL, PROGRAM_ID, USDC_MINT_DEVNET, type FanWallet } from "./idl";

// ── Network config ────────────────────────────────────────────────────────────
export const DEVNET_RPC = "https://api.devnet.solana.com";
export const HELIUS_RPC = "https://devnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY";

export const connection = new Connection(DEVNET_RPC, "confirmed");

export const PROGRAM_PUBKEY = new PublicKey(PROGRAM_ID);
export const USDC_MINT = new PublicKey(USDC_MINT_DEVNET);

// ── PDA derivations ───────────────────────────────────────────────────────────
export function getProgramStatePDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    PROGRAM_PUBKEY
  );
}

export function getGoalPointsMintPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("goal_points_mint")],
    PROGRAM_PUBKEY
  );
}

export function getFanAccountPDA(fanWallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("fan"), fanWallet.toBuffer()],
    PROGRAM_PUBKEY
  );
}

export function getMerchantAccountPDA(merchantWallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("merchant"), merchantWallet.toBuffer()],
    PROGRAM_PUBKEY
  );
}

export function getReviewPDA(
  fanWallet: PublicKey,
  merchantWallet: PublicKey,
  reviewIndex: number
): [PublicKey, number] {
  const indexBytes = Buffer.alloc(4);
  indexBytes.writeUInt32LE(reviewIndex, 0);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("review"), fanWallet.toBuffer(), merchantWallet.toBuffer(), indexBytes],
    PROGRAM_PUBKEY
  );
}

// ── Balance fetching ──────────────────────────────────────────────────────────

/** Returns USDC balance in human-readable units (e.g. 12.50) */
export async function getUsdcBalance(wallet: PublicKey): Promise<number> {
  try {
    const ata = await getAssociatedTokenAddress(USDC_MINT, wallet);
    const info = await connection.getTokenAccountBalance(ata);
    return parseFloat(info.value.uiAmountString ?? "0");
  } catch {
    return 0;
  }
}

/** Returns GoalPoints balance (integer) */
export async function getGoalPointsBalance(wallet: PublicKey): Promise<number> {
  try {
    const [gpMint] = getGoalPointsMintPDA();
    const ata = await getAssociatedTokenAddress(gpMint, wallet);
    const info = await connection.getTokenAccountBalance(ata);
    return parseInt(info.value.amount, 10);
  } catch {
    return 0;
  }
}

/** Returns SOL balance in SOL units */
export async function getSolBalance(wallet: PublicKey): Promise<number> {
  try {
    const lamports = await connection.getBalance(wallet);
    return lamports / LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
}

/** Fetch fan account data from chain */
export async function getFanAccount(
  provider: AnchorProvider,
  fanWallet: PublicKey
): Promise<{ totalSpentUsdc: number; totalPointsEarned: number; reviewsSubmitted: number; worldIdVerified: boolean } | null> {
  try {
    const program = getProgram(provider);
    const [fanPDA] = getFanAccountPDA(fanWallet);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const acc = await (program.account as any).fanAccount.fetch(fanPDA);
    return {
      totalSpentUsdc: acc.totalSpentUsdc.toNumber() / 1_000_000,
      totalPointsEarned: acc.totalPointsEarned.toNumber(),
      reviewsSubmitted: acc.reviewsSubmitted,
      worldIdVerified: acc.worldIdVerified,
    };
  } catch {
    return null;
  }
}

// ── Program helper ────────────────────────────────────────────────────────────
function getProgram(provider: AnchorProvider): Program<FanWallet> {
  return new Program<FanWallet>(IDL, PROGRAM_PUBKEY, provider);
}

// ── Instructions ──────────────────────────────────────────────────────────────

/**
 * Initialize fan account on-chain (call once per wallet).
 * Creates the FanAccount PDA.
 */
export async function initializeFan(
  provider: AnchorProvider,
  displayName: string
): Promise<string> {
  const program = getProgram(provider);
  const fanWallet = provider.wallet.publicKey;
  const [fanPDA] = getFanAccountPDA(fanWallet);

  const tx = await program.methods
    .initializeFan(displayName)
    .accounts({
      fanWallet,
      fanAccount: fanPDA,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}

/**
 * Process a USDC payment to a merchant.
 * Transfers USDC and mints GoalPoints to fan.
 *
 * @param amountUsdc  Human-readable USDC amount (e.g. 12.50)
 * @param merchantWalletAddress  Merchant's public key string
 */
export async function processPayment(
  provider: AnchorProvider,
  amountUsdc: number,
  merchantWalletAddress: string
): Promise<string> {
  const program = getProgram(provider);
  const fanWallet = provider.wallet.publicKey;
  const merchantWallet = new PublicKey(merchantWalletAddress);

  const amountLamports = new BN(Math.round(amountUsdc * 1_000_000));

  const [fanPDA] = getFanAccountPDA(fanWallet);
  const [merchantPDA] = getMerchantAccountPDA(merchantWallet);
  const [programStatePDA] = getProgramStatePDA();
  const [gpMint] = getGoalPointsMintPDA();

  const fanUsdcAta = await getAssociatedTokenAddress(USDC_MINT, fanWallet);
  const merchantUsdcAta = await getAssociatedTokenAddress(USDC_MINT, merchantWallet);
  const fanGpAta = await getAssociatedTokenAddress(gpMint, fanWallet);

  const tx = await program.methods
    .processPayment(amountLamports)
    .accounts({
      fanWallet,
      fanAccount: fanPDA,
      merchantAccount: merchantPDA,
      programState: programStatePDA,
      fanUsdcAta,
      merchantUsdcAta,
      fanGpAta,
      goalPointsMint: gpMint,
      usdcMint: USDC_MINT,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}

/**
 * Submit an on-chain review for a merchant.
 * Earns +50 GoalPoints.
 */
export async function submitReview(
  provider: AnchorProvider,
  merchantWalletAddress: string,
  rating: number,
  comment: string,
  reviewIndex: number
): Promise<string> {
  const program = getProgram(provider);
  const fanWallet = provider.wallet.publicKey;
  const merchantWallet = new PublicKey(merchantWalletAddress);

  const [fanPDA] = getFanAccountPDA(fanWallet);
  const [merchantPDA] = getMerchantAccountPDA(merchantWallet);
  const [reviewPDA] = getReviewPDA(fanWallet, merchantWallet, reviewIndex);
  const [programStatePDA] = getProgramStatePDA();
  const [gpMint] = getGoalPointsMintPDA();

  const fanGpAta = await getAssociatedTokenAddress(gpMint, fanWallet);

  const tx = await program.methods
    .submitReview(rating, comment)
    .accounts({
      fanWallet,
      fanAccount: fanPDA,
      merchantAccount: merchantPDA,
      review: reviewPDA,
      programState: programStatePDA,
      fanGpAta,
      goalPointsMint: gpMint,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}

/**
 * Burn GoalPoints for a reward redemption.
 * Minimum 100 points.
 */
export async function redeemPoints(
  provider: AnchorProvider,
  amount: number
): Promise<string> {
  const program = getProgram(provider);
  const fanWallet = provider.wallet.publicKey;

  const [fanPDA] = getFanAccountPDA(fanWallet);
  const [programStatePDA] = getProgramStatePDA();
  const [gpMint] = getGoalPointsMintPDA();

  const fanGpAta = await getAssociatedTokenAddress(gpMint, fanWallet);

  const tx = await program.methods
    .redeemPoints(new BN(amount))
    .accounts({
      fanWallet,
      fanAccount: fanPDA,
      programState: programStatePDA,
      fanGpAta,
      goalPointsMint: gpMint,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}

/**
 * Record World ID verification on-chain.
 * Activates 2x GoalPoints multiplier.
 *
 * @param nullifierHashHex  32-byte nullifier as hex string (from World ID)
 */
export async function verifyWorldId(
  provider: AnchorProvider,
  nullifierHashHex: string
): Promise<string> {
  const program = getProgram(provider);
  const fanWallet = provider.wallet.publicKey;

  const [fanPDA] = getFanAccountPDA(fanWallet);

  // Convert hex string to [u8; 32]
  const hex = nullifierHashHex.replace("0x", "").padStart(64, "0");
  const nullifierBytes = Array.from(Buffer.from(hex, "hex"));

  const tx = await program.methods
    .verifyWorldId(nullifierBytes)
    .accounts({
      fanWallet,
      fanAccount: fanPDA,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}

// ── Devnet airdrop helper (for testing) ───────────────────────────────────────
export async function requestDevnetAirdrop(wallet: PublicKey): Promise<string> {
  const sig = await connection.requestAirdrop(wallet, LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}

// ── Transaction explorer link ─────────────────────────────────────────────────
export function explorerUrl(txSig: string): string {
  return `https://explorer.solana.com/tx/${txSig}?cluster=devnet`;
}

// ── WebSocket payment listener (for POS/merchant) ────────────────────────────
/**
 * Subscribe to incoming USDC transfers on merchant's ATA.
 * Calls onPayment(amountUsdc) whenever a token transfer is confirmed.
 * Returns unsubscribe function.
 */
export function subscribeToPayments(
  merchantWallet: PublicKey,
  onPayment: (amountUsdc: number, fromSig: string) => void
): () => void {
  let subId: number;

  getAssociatedTokenAddress(USDC_MINT, merchantWallet).then((ata) => {
    subId = connection.onAccountChange(
      ata,
      (accountInfo) => {
        // Parse token account balance change
        // The raw data layout: [prefix 64 bytes][amount 8 bytes little-endian]
        try {
          const data = accountInfo.data;
          const amount = Number(data.readBigUInt64LE(64));
          const amountUsdc = amount / 1_000_000;
          onPayment(amountUsdc, "live");
        } catch {
          // ignore parse errors
        }
      },
      "confirmed"
    );
  });

  return () => {
    if (subId !== undefined) {
      connection.removeAccountChangeListener(subId);
    }
  };
}

// ── Anchor provider factory ───────────────────────────────────────────────────
/** Build an AnchorProvider from a @solana/wallet-adapter wallet */
export function makeProvider(wallet: {
  publicKey: PublicKey;
  signTransaction: <T extends Transaction | web3.VersionedTransaction>(tx: T) => Promise<T>;
  signAllTransactions: <T extends Transaction | web3.VersionedTransaction>(txs: T[]) => Promise<T[]>;
}): AnchorProvider {
  return new AnchorProvider(connection, wallet as never, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });
}

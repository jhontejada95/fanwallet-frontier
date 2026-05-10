/**
 * Anchor migration — deploys and initializes the fanwallet program on devnet
 *
 * Run:
 *   anchor migrate --provider.cluster devnet
 *
 * Or manually:
 *   anchor deploy --provider.cluster devnet
 *   ts-node migrations/deploy.ts
 */

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

module.exports = async function (provider: anchor.AnchorProvider) {
  anchor.setProvider(provider);

  const program = anchor.workspace.Fanwallet as Program;
  const authority = provider.wallet.publicKey;

  console.log("Authority:", authority.toBase58());
  console.log("Program ID:", program.programId.toBase58());

  // Derive PDAs
  const [programStatePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );
  const [goalPointsMintPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("goal_points_mint")],
    program.programId
  );

  console.log("ProgramState PDA:", programStatePDA.toBase58());
  console.log("GoalPoints Mint PDA:", goalPointsMintPDA.toBase58());

  // Check if already initialized
  try {
    const state = await (program.account as any).programState.fetch(programStatePDA);
    console.log("✓ Program already initialized. GoalPoints mint:", state.goalPointsMint.toBase58());
    return;
  } catch {
    console.log("Initializing program for the first time...");
  }

  // Initialize
  const tx = await program.methods
    .initializeProgram()
    .accounts({
      authority,
      programState: programStatePDA,
      goalPointsMint: goalPointsMintPDA,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc();

  console.log("✅ Program initialized! Tx:", tx);
  console.log("GoalPoints SPL Token Mint:", goalPointsMintPDA.toBase58());
  console.log("\nSave this mint address in your frontend config.");
};

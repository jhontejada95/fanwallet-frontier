//! FanWallet Frontier — Solana Smart Contract (Anchor 0.30)
//!
//! Program ID: HTgaYE4nogBobG6Rsa1vD1L2XK1Uy9aWLqKceWcausVC
//!
//! Instructions:
//!   initialize_program  — one-time setup, creates GoalPoints mint (PDA authority)
//!   initialize_fan      — create FanAccount PDA for a wallet
//!   initialize_merchant — create MerchantAccount PDA for a business wallet
//!   process_payment     — pay merchant in USDC; mint GoalPoints to fan (1 pt / $1)
//!   submit_review       — fan submits on-chain review; +50 GoalPoints
//!   redeem_points       — fan burns GoalPoints for rewards
//!   verify_world_id     — record World ID nullifier hash to mark fan as human-verified

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, MintTo, Token, TokenAccount, Burn},
};

declare_id!("HTgaYE4nogBobG6Rsa1vD1L2XK1Uy9aWLqKceWcausVC");

// ── Constants ─────────────────────────────────────────────────────────────────
/// USDC devnet mint
pub const USDC_MINT: &str = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
/// GoalPoints per USDC cent (1 point per $1 = 1_000_000 USDC lamports)
pub const POINTS_PER_USDC: u64 = 1;
/// Bonus points for submitting a review
pub const REVIEW_POINTS_BONUS: u64 = 50;
/// Bonus points for first photo upload  
pub const PHOTO_POINTS_BONUS: u64 = 25;
/// GoalPoints token decimals
pub const GP_DECIMALS: u8 = 0;

// ── Program ───────────────────────────────────────────────────────────────────
#[program]
pub mod fanwallet {
    use super::*;

    /// One-time program initialization.
    /// Creates the ProgramState PDA and the GoalPoints SPL token mint.
    /// The mint authority is a PDA so only this program can mint/burn.
    pub fn initialize_program(ctx: Context<InitializeProgram>) -> Result<()> {
        let state = &mut ctx.accounts.program_state;
        state.authority = ctx.accounts.authority.key();
        state.goal_points_mint = ctx.accounts.goal_points_mint.key();
        state.total_payments = 0;
        state.total_points_minted = 0;
        state.bump = ctx.bumps.program_state;
        state.mint_bump = ctx.bumps.goal_points_mint;
        msg!("FanWallet program initialized. GoalPoints mint: {}", state.goal_points_mint);
        Ok(())
    }

    /// Create a FanAccount for a user wallet.
    /// Idempotent — uses init_if_needed.
    pub fn initialize_fan(ctx: Context<InitializeFan>, display_name: String) -> Result<()> {
        require!(display_name.len() <= 32, FanWalletError::DisplayNameTooLong);
        let fan = &mut ctx.accounts.fan_account;
        if fan.wallet == Pubkey::default() {
            fan.wallet = ctx.accounts.fan_wallet.key();
            fan.display_name = display_name;
            fan.total_spent_usdc = 0;
            fan.total_points_earned = 0;
            fan.reviews_submitted = 0;
            fan.world_id_verified = false;
            fan.world_id_nullifier = [0u8; 32];
            fan.bump = ctx.bumps.fan_account;
            msg!("Fan account created for {}", fan.wallet);
        }
        Ok(())
    }

    /// Create a MerchantAccount for a business wallet.
    pub fn initialize_merchant(
        ctx: Context<InitializeMerchant>,
        merchant_name: String,
        category: String,
    ) -> Result<()> {
        require!(merchant_name.len() <= 64, FanWalletError::DisplayNameTooLong);
        let merchant = &mut ctx.accounts.merchant_account;
        merchant.wallet = ctx.accounts.merchant_wallet.key();
        merchant.name = merchant_name;
        merchant.category = category;
        merchant.total_received_usdc = 0;
        merchant.total_transactions = 0;
        merchant.review_count = 0;
        merchant.average_rating = 0;
        merchant.bump = ctx.bumps.merchant_account;
        msg!("Merchant account created: {}", merchant.name);
        Ok(())
    }

    /// Process a USDC payment from fan to merchant.
    /// - Transfers USDC from fan's ATA to merchant's ATA
    /// - Mints GoalPoints to fan (1 point per $1 = per 1_000_000 USDC lamports)
    /// - 2x points if fan is World-ID verified
    pub fn process_payment(ctx: Context<ProcessPayment>, amount_usdc_lamports: u64) -> Result<()> {
        require!(amount_usdc_lamports > 0, FanWalletError::InvalidAmount);

        // Transfer USDC: fan → merchant
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.fan_usdc_ata.to_account_info(),
                to: ctx.accounts.merchant_usdc_ata.to_account_info(),
                authority: ctx.accounts.fan_wallet.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, amount_usdc_lamports)?;

        // Compute GoalPoints to mint
        // 1 point per 1_000_000 lamports (= 1 USDC, 6 decimals)
        let base_points = amount_usdc_lamports / 1_000_000;
        let multiplier = if ctx.accounts.fan_account.world_id_verified { 2u64 } else { 1u64 };
        let points_to_mint = base_points * multiplier * POINTS_PER_USDC;

        if points_to_mint > 0 {
            let seeds: &[&[u8]] = &[b"program_state", &[ctx.accounts.program_state.bump]];
            let signer_seeds = &[seeds];
            let mint_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.goal_points_mint.to_account_info(),
                    to: ctx.accounts.fan_gp_ata.to_account_info(),
                    authority: ctx.accounts.program_state.to_account_info(),
                },
                signer_seeds,
            );
            token::mint_to(mint_ctx, points_to_mint)?;
        }

        // Update state
        let fan = &mut ctx.accounts.fan_account;
        fan.total_spent_usdc = fan.total_spent_usdc.saturating_add(amount_usdc_lamports);
        fan.total_points_earned = fan.total_points_earned.saturating_add(points_to_mint);

        let merchant = &mut ctx.accounts.merchant_account;
        merchant.total_received_usdc = merchant.total_received_usdc.saturating_add(amount_usdc_lamports);
        merchant.total_transactions = merchant.total_transactions.saturating_add(1);

        let state = &mut ctx.accounts.program_state;
        state.total_payments = state.total_payments.saturating_add(1);
        state.total_points_minted = state.total_points_minted.saturating_add(points_to_mint);

        msg!(
            "Payment: {} USDC lamports from {} to {}. {} GoalPoints minted.",
            amount_usdc_lamports,
            ctx.accounts.fan_wallet.key(),
            ctx.accounts.merchant_account.wallet,
            points_to_mint
        );
        Ok(())
    }

    /// Submit an on-chain review. Fan earns +50 GoalPoints.
    /// Rating: 1-5. Comment stored on-chain (max 280 chars).
    pub fn submit_review(
        ctx: Context<SubmitReview>,
        rating: u8,
        comment: String,
    ) -> Result<()> {
        require!(rating >= 1 && rating <= 5, FanWalletError::InvalidRating);
        require!(comment.len() <= 280, FanWalletError::CommentTooLong);

        // Store review
        let review = &mut ctx.accounts.review;
        review.fan = ctx.accounts.fan_wallet.key();
        review.merchant = ctx.accounts.merchant_account.wallet;
        review.rating = rating;
        review.comment = comment;
        review.timestamp = Clock::get()?.unix_timestamp;
        review.bump = ctx.bumps.review;

        // Mint bonus points
        let seeds: &[&[u8]] = &[b"program_state", &[ctx.accounts.program_state.bump]];
        let signer_seeds = &[seeds];
        let mint_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.goal_points_mint.to_account_info(),
                to: ctx.accounts.fan_gp_ata.to_account_info(),
                authority: ctx.accounts.program_state.to_account_info(),
            },
            signer_seeds,
        );
        token::mint_to(mint_ctx, REVIEW_POINTS_BONUS)?;

        // Update stats
        let fan = &mut ctx.accounts.fan_account;
        fan.reviews_submitted = fan.reviews_submitted.saturating_add(1);
        fan.total_points_earned = fan.total_points_earned.saturating_add(REVIEW_POINTS_BONUS);

        let merchant = &mut ctx.accounts.merchant_account;
        // Rolling average rating
        let new_count = merchant.review_count.saturating_add(1) as u64;
        let old_total = merchant.average_rating as u64 * merchant.review_count as u64;
        merchant.average_rating = ((old_total + rating as u64) / new_count) as u8;
        merchant.review_count = merchant.review_count.saturating_add(1);

        let state = &mut ctx.accounts.program_state;
        state.total_points_minted = state.total_points_minted.saturating_add(REVIEW_POINTS_BONUS);

        msg!("Review submitted. +{} GoalPoints to {}", REVIEW_POINTS_BONUS, fan.wallet);
        Ok(())
    }

    /// Redeem GoalPoints — burns tokens from fan's ATA.
    /// Minimum redemption: 100 points.
    pub fn redeem_points(ctx: Context<RedeemPoints>, amount: u64) -> Result<()> {
        require!(amount >= 100, FanWalletError::BelowMinimumRedemption);

        let burn_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.goal_points_mint.to_account_info(),
                from: ctx.accounts.fan_gp_ata.to_account_info(),
                authority: ctx.accounts.fan_wallet.to_account_info(),
            },
        );
        token::burn(burn_ctx, amount)?;

        msg!("{} GoalPoints redeemed (burned) by {}", amount, ctx.accounts.fan_wallet.key());
        Ok(())
    }

    /// Record World ID verification on-chain.
    /// Stores the nullifier hash so the fan is marked as human-verified.
    /// The nullifier prevents double-verification.
    pub fn verify_world_id(
        ctx: Context<VerifyWorldId>,
        nullifier_hash: [u8; 32],
    ) -> Result<()> {
        let fan = &mut ctx.accounts.fan_account;
        require!(!fan.world_id_verified, FanWalletError::AlreadyVerified);

        fan.world_id_verified = true;
        fan.world_id_nullifier = nullifier_hash;

        msg!("World ID verified for fan {}. 2x GoalPoints activated.", fan.wallet);
        Ok(())
    }
}

// ── Account Structs ───────────────────────────────────────────────────────────

#[account]
#[derive(Default)]
pub struct ProgramState {
    pub authority: Pubkey,          // 32
    pub goal_points_mint: Pubkey,   // 32
    pub total_payments: u64,        // 8
    pub total_points_minted: u64,   // 8
    pub bump: u8,                   // 1
    pub mint_bump: u8,              // 1
}

impl ProgramState {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 8 + 1 + 1 + 64; // +64 padding
}

#[account]
pub struct FanAccount {
    pub wallet: Pubkey,               // 32
    pub display_name: String,         // 4 + 32
    pub total_spent_usdc: u64,        // 8
    pub total_points_earned: u64,     // 8
    pub reviews_submitted: u32,       // 4
    pub world_id_verified: bool,      // 1
    pub world_id_nullifier: [u8; 32], // 32
    pub bump: u8,                     // 1
}

impl FanAccount {
    pub const LEN: usize = 8 + 32 + (4 + 32) + 8 + 8 + 4 + 1 + 32 + 1 + 64;
}

#[account]
pub struct MerchantAccount {
    pub wallet: Pubkey,             // 32
    pub name: String,               // 4 + 64
    pub category: String,           // 4 + 32
    pub total_received_usdc: u64,   // 8
    pub total_transactions: u64,    // 8
    pub review_count: u32,          // 4
    pub average_rating: u8,         // 1
    pub bump: u8,                   // 1
}

impl MerchantAccount {
    pub const LEN: usize = 8 + 32 + (4 + 64) + (4 + 32) + 8 + 8 + 4 + 1 + 1 + 64;
}

#[account]
pub struct Review {
    pub fan: Pubkey,         // 32
    pub merchant: Pubkey,    // 32
    pub rating: u8,          // 1
    pub comment: String,     // 4 + 280
    pub timestamp: i64,      // 8
    pub bump: u8,            // 1
}

impl Review {
    pub const LEN: usize = 8 + 32 + 32 + 1 + (4 + 280) + 8 + 1 + 64;
}

// ── Contexts ──────────────────────────────────────────────────────────────────

#[derive(Accounts)]
pub struct InitializeProgram<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = ProgramState::LEN,
        seeds = [b"program_state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,

    /// The GoalPoints SPL token mint, controlled by program_state PDA
    #[account(
        init,
        payer = authority,
        mint::decimals = GP_DECIMALS,
        mint::authority = program_state,
        seeds = [b"goal_points_mint"],
        bump
    )]
    pub goal_points_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct InitializeFan<'info> {
    #[account(mut)]
    pub fan_wallet: Signer<'info>,

    #[account(
        init_if_needed,
        payer = fan_wallet,
        space = FanAccount::LEN,
        seeds = [b"fan", fan_wallet.key().as_ref()],
        bump
    )]
    pub fan_account: Account<'info, FanAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeMerchant<'info> {
    #[account(mut)]
    pub merchant_wallet: Signer<'info>,

    #[account(
        init,
        payer = merchant_wallet,
        space = MerchantAccount::LEN,
        seeds = [b"merchant", merchant_wallet.key().as_ref()],
        bump
    )]
    pub merchant_account: Account<'info, MerchantAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProcessPayment<'info> {
    #[account(mut)]
    pub fan_wallet: Signer<'info>,

    #[account(
        mut,
        seeds = [b"fan", fan_wallet.key().as_ref()],
        bump = fan_account.bump
    )]
    pub fan_account: Account<'info, FanAccount>,

    #[account(
        mut,
        seeds = [b"merchant", merchant_account.wallet.as_ref()],
        bump = merchant_account.bump
    )]
    pub merchant_account: Account<'info, MerchantAccount>,

    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(mut)]
    pub fan_usdc_ata: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = fan_wallet,
        associated_token::mint = usdc_mint,
        associated_token::authority = merchant_account
    )]
    pub merchant_usdc_ata: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = fan_wallet,
        associated_token::mint = goal_points_mint,
        associated_token::authority = fan_wallet
    )]
    pub fan_gp_ata: Account<'info, TokenAccount>,

    #[account(mut, address = program_state.goal_points_mint)]
    pub goal_points_mint: Account<'info, Mint>,

    pub usdc_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitReview<'info> {
    #[account(mut)]
    pub fan_wallet: Signer<'info>,

    #[account(
        mut,
        seeds = [b"fan", fan_wallet.key().as_ref()],
        bump = fan_account.bump
    )]
    pub fan_account: Account<'info, FanAccount>,

    #[account(
        mut,
        seeds = [b"merchant", merchant_account.wallet.as_ref()],
        bump = merchant_account.bump
    )]
    pub merchant_account: Account<'info, MerchantAccount>,

    #[account(
        init,
        payer = fan_wallet,
        space = Review::LEN,
        seeds = [
            b"review",
            fan_wallet.key().as_ref(),
            merchant_account.wallet.as_ref(),
            &fan_account.reviews_submitted.to_le_bytes()
        ],
        bump
    )]
    pub review: Account<'info, Review>,

    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        init_if_needed,
        payer = fan_wallet,
        associated_token::mint = goal_points_mint,
        associated_token::authority = fan_wallet
    )]
    pub fan_gp_ata: Account<'info, TokenAccount>,

    #[account(mut, address = program_state.goal_points_mint)]
    pub goal_points_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RedeemPoints<'info> {
    #[account(mut)]
    pub fan_wallet: Signer<'info>,

    #[account(
        mut,
        seeds = [b"fan", fan_wallet.key().as_ref()],
        bump = fan_account.bump
    )]
    pub fan_account: Account<'info, FanAccount>,

    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        mut,
        associated_token::mint = goal_points_mint,
        associated_token::authority = fan_wallet
    )]
    pub fan_gp_ata: Account<'info, TokenAccount>,

    #[account(mut, address = program_state.goal_points_mint)]
    pub goal_points_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyWorldId<'info> {
    #[account(mut)]
    pub fan_wallet: Signer<'info>,

    #[account(
        mut,
        seeds = [b"fan", fan_wallet.key().as_ref()],
        bump = fan_account.bump
    )]
    pub fan_account: Account<'info, FanAccount>,

    pub system_program: Program<'info, System>,
}

// ── Errors ────────────────────────────────────────────────────────────────────

#[error_code]
pub enum FanWalletError {
    #[msg("Display name must be 32 characters or less")]
    DisplayNameTooLong,
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    #[msg("Rating must be between 1 and 5")]
    InvalidRating,
    #[msg("Comment must be 280 characters or less")]
    CommentTooLong,
    #[msg("Minimum redemption is 100 GoalPoints")]
    BelowMinimumRedemption,
    #[msg("Fan is already World ID verified")]
    AlreadyVerified,
}

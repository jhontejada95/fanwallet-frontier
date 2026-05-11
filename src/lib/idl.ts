/**
 * FanWallet Anchor IDL — generated from programs/fanwallet/src/lib.rs
 * Program: HUESSuFsC7DnDZ9bKK7p6phudZYuH7W6PC9rfKQfP7aF  (Solana devnet)
 */

export type FanWallet = {
  version: "0.1.0";
  name: "fanwallet";
  instructions: [
    {
      name: "initializeProgram";
      accounts: [
        { name: "authority"; isMut: true; isSigner: true },
        { name: "programState"; isMut: true; isSigner: false },
        { name: "goalPointsMint"; isMut: true; isSigner: false },
        { name: "tokenProgram"; isMut: false; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false },
        { name: "rent"; isMut: false; isSigner: false }
      ];
      args: [];
    },
    {
      name: "initializeFan";
      accounts: [
        { name: "fanWallet"; isMut: true; isSigner: true },
        { name: "fanAccount"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "displayName"; type: "string" }];
    },
    {
      name: "initializeMerchant";
      accounts: [
        { name: "merchantWallet"; isMut: true; isSigner: true },
        { name: "merchantAccount"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "merchantName"; type: "string" },
        { name: "category"; type: "string" }
      ];
    },
    {
      name: "processPayment";
      accounts: [
        { name: "fanWallet"; isMut: true; isSigner: true },
        { name: "fanAccount"; isMut: true; isSigner: false },
        { name: "merchantAccount"; isMut: true; isSigner: false },
        { name: "programState"; isMut: true; isSigner: false },
        { name: "fanUsdcAta"; isMut: true; isSigner: false },
        { name: "merchantUsdcAta"; isMut: true; isSigner: false },
        { name: "fanGpAta"; isMut: true; isSigner: false },
        { name: "goalPointsMint"; isMut: true; isSigner: false },
        { name: "usdcMint"; isMut: false; isSigner: false },
        { name: "tokenProgram"; isMut: false; isSigner: false },
        { name: "associatedTokenProgram"; isMut: false; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "amountUsdcLamports"; type: "u64" }];
    },
    {
      name: "submitReview";
      accounts: [
        { name: "fanWallet"; isMut: true; isSigner: true },
        { name: "fanAccount"; isMut: true; isSigner: false },
        { name: "merchantAccount"; isMut: true; isSigner: false },
        { name: "review"; isMut: true; isSigner: false },
        { name: "programState"; isMut: true; isSigner: false },
        { name: "fanGpAta"; isMut: true; isSigner: false },
        { name: "goalPointsMint"; isMut: true; isSigner: false },
        { name: "tokenProgram"; isMut: false; isSigner: false },
        { name: "associatedTokenProgram"; isMut: false; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "rating"; type: "u8" },
        { name: "comment"; type: "string" }
      ];
    },
    {
      name: "redeemPoints";
      accounts: [
        { name: "fanWallet"; isMut: true; isSigner: true },
        { name: "fanAccount"; isMut: true; isSigner: false },
        { name: "programState"; isMut: true; isSigner: false },
        { name: "fanGpAta"; isMut: true; isSigner: false },
        { name: "goalPointsMint"; isMut: true; isSigner: false },
        { name: "tokenProgram"; isMut: false; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "amount"; type: "u64" }];
    },
    {
      name: "verifyWorldId";
      accounts: [
        { name: "fanWallet"; isMut: true; isSigner: true },
        { name: "fanAccount"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "nullifierHash"; type: { array: ["u8", 32] } }];
    }
  ];
  accounts: [
    {
      name: "ProgramState";
      type: {
        kind: "struct";
        fields: [
          { name: "authority"; type: "publicKey" },
          { name: "goalPointsMint"; type: "publicKey" },
          { name: "totalPayments"; type: "u64" },
          { name: "totalPointsMinted"; type: "u64" },
          { name: "bump"; type: "u8" },
          { name: "mintBump"; type: "u8" }
        ];
      };
    },
    {
      name: "FanAccount";
      type: {
        kind: "struct";
        fields: [
          { name: "wallet"; type: "publicKey" },
          { name: "displayName"; type: "string" },
          { name: "totalSpentUsdc"; type: "u64" },
          { name: "totalPointsEarned"; type: "u64" },
          { name: "reviewsSubmitted"; type: "u32" },
          { name: "worldIdVerified"; type: "bool" },
          { name: "worldIdNullifier"; type: { array: ["u8", 32] } },
          { name: "bump"; type: "u8" }
        ];
      };
    },
    {
      name: "MerchantAccount";
      type: {
        kind: "struct";
        fields: [
          { name: "wallet"; type: "publicKey" },
          { name: "name"; type: "string" },
          { name: "category"; type: "string" },
          { name: "totalReceivedUsdc"; type: "u64" },
          { name: "totalTransactions"; type: "u64" },
          { name: "reviewCount"; type: "u32" },
          { name: "averageRating"; type: "u8" },
          { name: "bump"; type: "u8" }
        ];
      };
    },
    {
      name: "Review";
      type: {
        kind: "struct";
        fields: [
          { name: "fan"; type: "publicKey" },
          { name: "merchant"; type: "publicKey" },
          { name: "rating"; type: "u8" },
          { name: "comment"; type: "string" },
          { name: "timestamp"; type: "i64" },
          { name: "bump"; type: "u8" }
        ];
      };
    }
  ];
  errors: [
    { code: 6000; name: "DisplayNameTooLong"; msg: "Display name must be 32 characters or less" },
    { code: 6001; name: "InvalidAmount"; msg: "Amount must be greater than zero" },
    { code: 6002; name: "InvalidRating"; msg: "Rating must be between 1 and 5" },
    { code: 6003; name: "CommentTooLong"; msg: "Comment must be 280 characters or less" },
    { code: 6004; name: "BelowMinimumRedemption"; msg: "Minimum redemption is 100 GoalPoints" },
    { code: 6005; name: "AlreadyVerified"; msg: "Fan is already World ID verified" }
  ];
};

export const IDL: FanWallet = {
  version: "0.1.0",
  name: "fanwallet",
  instructions: [
    {
      name: "initializeProgram",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "programState", isMut: true, isSigner: false },
        { name: "goalPointsMint", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "rent", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "initializeFan",
      accounts: [
        { name: "fanWallet", isMut: true, isSigner: true },
        { name: "fanAccount", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "displayName", type: "string" }],
    },
    {
      name: "initializeMerchant",
      accounts: [
        { name: "merchantWallet", isMut: true, isSigner: true },
        { name: "merchantAccount", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "merchantName", type: "string" },
        { name: "category", type: "string" },
      ],
    },
    {
      name: "processPayment",
      accounts: [
        { name: "fanWallet", isMut: true, isSigner: true },
        { name: "fanAccount", isMut: true, isSigner: false },
        { name: "merchantAccount", isMut: true, isSigner: false },
        { name: "programState", isMut: true, isSigner: false },
        { name: "fanUsdcAta", isMut: true, isSigner: false },
        { name: "merchantUsdcAta", isMut: true, isSigner: false },
        { name: "fanGpAta", isMut: true, isSigner: false },
        { name: "goalPointsMint", isMut: true, isSigner: false },
        { name: "usdcMint", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "associatedTokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "amountUsdcLamports", type: "u64" }],
    },
    {
      name: "submitReview",
      accounts: [
        { name: "fanWallet", isMut: true, isSigner: true },
        { name: "fanAccount", isMut: true, isSigner: false },
        { name: "merchantAccount", isMut: true, isSigner: false },
        { name: "review", isMut: true, isSigner: false },
        { name: "programState", isMut: true, isSigner: false },
        { name: "fanGpAta", isMut: true, isSigner: false },
        { name: "goalPointsMint", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "associatedTokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "rating", type: "u8" },
        { name: "comment", type: "string" },
      ],
    },
    {
      name: "redeemPoints",
      accounts: [
        { name: "fanWallet", isMut: true, isSigner: true },
        { name: "fanAccount", isMut: true, isSigner: false },
        { name: "programState", isMut: true, isSigner: false },
        { name: "fanGpAta", isMut: true, isSigner: false },
        { name: "goalPointsMint", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
    {
      name: "verifyWorldId",
      accounts: [
        { name: "fanWallet", isMut: true, isSigner: true },
        { name: "fanAccount", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "nullifierHash", type: { array: ["u8", 32] } }],
    },
  ],
  accounts: [
    {
      name: "ProgramState",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "goalPointsMint", type: "publicKey" },
          { name: "totalPayments", type: "u64" },
          { name: "totalPointsMinted", type: "u64" },
          { name: "bump", type: "u8" },
          { name: "mintBump", type: "u8" },
        ],
      },
    },
    {
      name: "FanAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "wallet", type: "publicKey" },
          { name: "displayName", type: "string" },
          { name: "totalSpentUsdc", type: "u64" },
          { name: "totalPointsEarned", type: "u64" },
          { name: "reviewsSubmitted", type: "u32" },
          { name: "worldIdVerified", type: "bool" },
          { name: "worldIdNullifier", type: { array: ["u8", 32] } },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "MerchantAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "wallet", type: "publicKey" },
          { name: "name", type: "string" },
          { name: "category", type: "string" },
          { name: "totalReceivedUsdc", type: "u64" },
          { name: "totalTransactions", type: "u64" },
          { name: "reviewCount", type: "u32" },
          { name: "averageRating", type: "u8" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "Review",
      type: {
        kind: "struct",
        fields: [
          { name: "fan", type: "publicKey" },
          { name: "merchant", type: "publicKey" },
          { name: "rating", type: "u8" },
          { name: "comment", type: "string" },
          { name: "timestamp", type: "i64" },
          { name: "bump", type: "u8" },
        ],
      },
    },
  ],
  errors: [
    { code: 6000, name: "DisplayNameTooLong", msg: "Display name must be 32 characters or less" },
    { code: 6001, name: "InvalidAmount", msg: "Amount must be greater than zero" },
    { code: 6002, name: "InvalidRating", msg: "Rating must be between 1 and 5" },
    { code: 6003, name: "CommentTooLong", msg: "Comment must be 280 characters or less" },
    { code: 6004, name: "BelowMinimumRedemption", msg: "Minimum redemption is 100 GoalPoints" },
    { code: 6005, name: "AlreadyVerified", msg: "Fan is already World ID verified" },
  ],
};

// ── PDA helpers ───────────────────────────────────────────────────────────────
export const PROGRAM_ID = "HUESSuFsC7DnDZ9bKK7p6phudZYuH7W6PC9rfKQfP7aF";
export const USDC_MINT_DEVNET = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";

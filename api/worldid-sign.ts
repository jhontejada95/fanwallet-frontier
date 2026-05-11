import { signRequest } from "@worldcoin/idkit-server";

/**
 * Vercel Serverless Function — signs an rp_context for World ID v4.
 *
 * Required Vercel env vars:
 *   WORLDID_RP_ID          — your RP ID from developer.worldcoin.org (e.g. "rp_…")
 *   WORLDID_RP_SIGNING_KEY — hex private key generated during RP registration
 */
export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const rpId = process.env.WORLDID_RP_ID;
  const signingKeyHex = process.env.WORLDID_RP_SIGNING_KEY;

  if (!rpId || !signingKeyHex) {
    res.status(500).json({
      error: "World ID server not configured — set WORLDID_RP_ID and WORLDID_RP_SIGNING_KEY in Vercel env",
    });
    return;
  }

  try {
    const action: string = (req.body?.action as string) || "verify-fan-wc26";
    const { sig, nonce, createdAt, expiresAt } = signRequest({
      signingKeyHex,
      action,
      ttl: 300,
    });

    res.status(200).json({
      rp_context: {
        rp_id: rpId,
        nonce,
        created_at: createdAt,
        expires_at: expiresAt,
        signature: sig,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: `Signing failed: ${msg}` });
  }
}

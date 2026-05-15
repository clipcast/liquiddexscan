import { Router } from "express";
import { scanNewTokens } from "./scanner.js";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const router = Router();
const client = createPublicClient({ chain: base, transport: http() });

// GET /api/v1/new — New tokens from LiquidSDK
router.get("/new", async (_req, res) => {
  try {
    const tokens = await scanNewTokens();
    res.json({ success: true, tokens, count: tokens.length });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/v1/base/pairs — Top pairs (GeckoTerminal proxy for now)
router.get("/base/pairs", async (req, res) => {
  try {
    const view = req.query.view || "top";
    const url = `https://api.geckoterminal.com/api/v2/networks/base/pools?page=1`;
    const resp = await fetch(url);
    const data = await resp.json();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/v1/base/pool/:address/ohlcv
router.get("/base/pool/:address/ohlcv", async (req, res) => {
  try {
    const tf = req.query.tf || "1h";
    const url = `https://api.geckoterminal.com/api/v2/networks/base/pools/${req.params.address}/ohlcv/${tf}`;
    const resp = await fetch(url);
    const data = await resp.json();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/v1/base/pool/:address/trades
router.get("/base/pool/:address/trades", async (req, res) => {
  try {
    const url = `https://api.geckoterminal.com/api/v2/networks/base/pools/${req.params.address}/trades`;
    const resp = await fetch(url);
    const data = await resp.json();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;

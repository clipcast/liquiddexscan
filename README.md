# 🪙 LiquidDexScan

Open-source DEX scanner for **Base Network**. Monitor top pairs, discover new tokens, and analyze trends — no API paywall.

## Features

| Page | Description |
|------|-------------|
| `/` | Top Base pairs — price, 24h change, volume, liquidity |
| `/new` | New tokens detected via LiquidSDK (onchain scan) |
| `/trending` | Open trending formula (volume × buyers × liquidity) |
| `/base/{pool}` | Candlestick chart + live trades |

## Stack

- **Frontend:** Next.js 16 · React 19 · Tailwind v4 · TradingView lightweight-charts
- **Backend:** Express · LiquidSDK · viem
- **Data:** GeckoTerminal API (price/volume) + Base RPC (new tokens)

## Quick Start

```bash
# Backend
cd backend
npm install
npm run dev       # → :3001

# Frontend (another terminal)
cd frontend
npm install
npm run dev       # → :3000
```

## Public API

```
GET /api/v1/new          — New tokens from LiquidSDK
GET /api/v1/base/pairs   — Top Base pairs (GeckoTerminal)
GET /api/v1/base/pool/:address/ohlcv?tf=1h
GET /api/v1/base/pool/:address/trades
```

## Trending Formula

```
trendScore = clamp(vol1h / (vol24h / 24), 50)
           × (1 + log₁₀(1 + buyers24h))
           × √liquidityUsd
```

MIT License — Fork it, host it, improve it.

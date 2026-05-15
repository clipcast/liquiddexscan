import { LiquidSDK } from "liquid-sdk";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const client = createPublicClient({ chain: base, transport: http() });
const liquid = new LiquidSDK({ publicClient: client });

let cache: any[] = [];
let lastFetch = 0;
const TTL = 10_000;

export interface TokenInfo {
  name: string;
  symbol: string;
  deployer: string;
  address: string;
  block: string;
  age: string;
}

export async function scanNewTokens(): Promise<TokenInfo[]> {
  const now = Date.now();
  if (now - lastFetch < TTL && cache.length > 0) return cache;

  const latest = await client.getBlockNumber();
  const fromBlock = latest - 9000n;
  const tokens = await liquid.getTokens({ fromBlock, toBlock: latest });
  const blockTime = 2; // Base ~2s per block

  cache = tokens.map((t: any) => ({
    name: t.tokenName || "Unknown",
    symbol: t.tokenSymbol || "???",
    deployer: t.msgSender || "0x0",
    address: t.tokenAddress || "",
    block: t.blockNumber?.toString() || "0",
    age: t.blockNumber ? formatAge(latest - t.blockNumber, blockTime) : "N/A",
  }));

  lastFetch = now;
  return cache;
}

function formatAge(blockDiff: bigint, secPerBlock: number): string {
  const secs = Number(blockDiff) * secPerBlock;
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

import {
  LiquidSDK,
  parseMetadata,
  parseContext,
} from "liquid-sdk";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const RPC_URL = process.env.RPC_URL || "https://base.drpc.org";
const BLOCK_RANGE = 100_000n; // SDK recommended

const client = createPublicClient({ chain: base, transport: http(RPC_URL) });
const liquid = new LiquidSDK({ publicClient: client });

let cache: TokenInfo[] = [];
let lastFetch = 0;
const TTL = 15_000;

export interface TokenInfo {
  name: string;
  symbol: string;
  deployer: string;
  address: string;
  poolId: string;
  hook: string;
  locker: string;
  mevModule: string;
  image: string;
  description: string | null;
  socialLinks: { platform: string; url: string }[];
  launchedVia: string;
  block: string;
  age: string;
}

export interface TokenDetail extends TokenInfo {
  totalSupply: string;
  decimals: number;
  pairedToken: string;
  extensions: string[];
  admin: string;
  rewardRecipients: string[];
  rewardBps: number[];
  metadataRaw: string;
  contextRaw: string;
}

export async function scanNewTokens(): Promise<TokenInfo[]> {
  const now = Date.now();
  if (now - lastFetch < TTL && cache.length > 0) return cache;

  const latest = await client.getBlockNumber();
  const fromBlock = latest - BLOCK_RANGE;
  const tokens = await liquid.getTokens({ fromBlock, toBlock: latest });
  const blockTime = 2;

  cache = tokens.map((t: any) => {
    const meta = parseMetadata(t.tokenMetadata || "");
    const ctx = parseContext(t.tokenContext || "");
    return {
      name: t.tokenName || "Unknown",
      symbol: t.tokenSymbol || "???",
      deployer: t.msgSender || "0x0",
      address: t.tokenAddress || "",
      poolId: t.poolId || "",
      hook: t.poolHook || "",
      locker: t.locker || "",
      mevModule: t.mevModule || "",
      image: t.tokenImage || "",
      description: meta?.description ?? null,
      socialLinks: meta?.socialMediaUrls ?? [],
      launchedVia: ctx?.interface ?? "unknown",
      block: t.blockNumber?.toString() || "0",
      age: t.blockNumber ? formatAge(latest - t.blockNumber, blockTime) : "N/A",
    };
  });

  lastFetch = now;
  return cache;
}

export async function getTokenDetail(
  address: `0x${string}`
): Promise<TokenDetail | null> {
  try {
    const [event, info, rewards] = await Promise.all([
      liquid.getTokenEvent(address),
      liquid.getTokenInfo(address),
      liquid.getTokenRewards(address).catch(() => null),
    ]);

    if (!event) return null;

    const meta = parseMetadata(event.tokenMetadata || "");
    const ctx = parseContext(event.tokenContext || "");
    const latest = await client.getBlockNumber();

    return {
      name: info.name,
      symbol: info.symbol,
      decimals: info.decimals,
      totalSupply: info.totalSupply.toString(),
      deployer: event.msgSender,
      admin: event.tokenAdmin,
      address: event.tokenAddress,
      poolId: event.poolId,
      hook: event.poolHook,
      locker: event.locker,
      mevModule: event.mevModule,
      pairedToken: event.pairedToken,
      extensions: event.extensions || [],
      image: event.tokenImage || "",
      description: meta?.description ?? null,
      socialLinks: meta?.socialMediaUrls ?? [],
      launchedVia: ctx?.interface ?? "unknown",
      metadataRaw: event.tokenMetadata || "",
      contextRaw: event.tokenContext || "",
      rewardRecipients: rewards?.rewardRecipients ?? [],
      rewardBps: rewards?.rewardBps?.map(Number) ?? [],
      block: event.blockNumber?.toString() || "0",
      age: event.blockNumber
        ? formatAge(latest - event.blockNumber, 2)
        : "N/A",
    };
  } catch {
    return null;
  }
}

function formatAge(blockDiff: bigint, secPerBlock: number): string {
  const secs = Number(blockDiff) * secPerBlock;
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

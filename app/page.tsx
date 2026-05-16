"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ─── Types ─── */
interface Pair {
  id: string;
  attributes: {
    name: string;
    base_token_price_usd: string;
    reserve_in_usd: string;
    volume_usd: { h1: string; h24: string };
    price_change_percentage: { m5: string; h1: string; h6: string; h24: string };
    transactions: { h1: { buys: number; sells: number }; h24: { buys: number; sells: number } };
  };
}

interface Token {
  name: string;
  symbol: string;
  deployer: string;
  address: string;
  age: string;
}

/* ─── Section Wrapper ─── */
function Section({ title, subtitle, loading, empty, children }: {
  title: string;
  subtitle?: string;
  loading: boolean;
  empty: boolean;
  children: React.ReactNode;
}) {
  if (loading) return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      {subtitle && <p className="text-xs text-[var(--muted)] mb-4">{subtitle}</p>}
      <p className="text-[var(--muted)] text-sm">Loading...</p>
    </section>
  );
  if (empty) return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      {subtitle && <p className="text-xs text-[var(--muted)] mb-4">{subtitle}</p>}
      <p className="text-[var(--muted)] text-sm">No data available</p>
    </section>
  );
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      {subtitle && <p className="text-xs text-[var(--muted)] mb-4">{subtitle}</p>}
      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        {children}
      </div>
    </section>
  );
}

/* ─── Pairs Section ─── */
function PairsSection() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/base/pairs?view=top");
        const data = await res.json();
        setPairs(data.data?.slice(0, 30) || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section title="Top Base Pairs" subtitle="Auto-refresh every 30s" loading={loading} empty={pairs.length === 0}>
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="text-[var(--muted)] border-b border-[var(--border)] bg-black/20">
            <th className="text-left py-3 px-3">#</th>
            <th className="text-left py-3 px-3">Pool</th>
            <th className="text-right py-3 px-3">Price</th>
            <th className="text-right py-3 px-3">24h %</th>
            <th className="text-right py-3 px-3">Vol 24h</th>
            <th className="text-right py-3 px-3">Liquidity</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((p, i) => {
            const change = parseFloat(p.attributes.price_change_percentage?.h24 || "0");
            const poolId = p.id?.split("_").pop() || "";
            return (
              <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)]">
                <td className="py-3 px-3 text-[var(--muted)]">{i + 1}</td>
                <td className="py-3 px-3">
                  <Link href={`/base/${poolId}`} className="text-white hover:text-[var(--accent)] font-medium text-xs sm:text-sm break-all">
                    {p.attributes.name}
                  </Link>
                </td>
                <td className="py-3 px-3 text-right font-mono text-xs sm:text-sm">
                  ${parseFloat(p.attributes.base_token_price_usd || "0").toFixed(8)}
                </td>
                <td className={`py-3 px-3 text-right ${change >= 0 ? "text-[var(--green)]" : "text-[var(--red)]"}`}>
                  {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                </td>
                <td className="py-3 px-3 text-right text-xs sm:text-sm">
                  ${parseFloat(p.attributes.volume_usd?.h24 || "0").toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right text-xs sm:text-sm">
                  ${parseFloat(p.attributes.reserve_in_usd || "0").toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Section>
  );
}

/* ─── New Tokens Section ─── */
function NewTokensSection() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/new");
        const data = await res.json();
        setTokens(data.tokens || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section title="New Tokens" subtitle="Auto-refresh every 30s" loading={loading} empty={tokens.length === 0}>
      <table className="w-full text-sm min-w-[500px]">
        <thead>
          <tr className="text-[var(--muted)] border-b border-[var(--border)] bg-black/20">
            <th className="text-left py-3 px-3">#</th>
            <th className="text-left py-3 px-3">Token</th>
            <th className="text-left py-3 px-3">Symbol</th>
            <th className="text-left py-3 px-3 hidden sm:table-cell">Deployer</th>
            <th className="text-right py-3 px-3">Age</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t, i) => (
            <tr key={t.address} className="border-b border-[var(--border)] hover:bg-[var(--surface)]">
              <td className="py-3 px-3 text-[var(--muted)]">{i + 1}</td>
              <td className="py-3 px-3 font-medium text-sm">{t.name}</td>
              <td className="py-3 px-3">
                <span className="bg-[var(--surface)] px-2 py-0.5 rounded text-xs">{t.symbol}</span>
              </td>
              <td className="py-3 px-3 text-xs text-[var(--muted)] font-mono hidden sm:table-cell">
                {t.deployer?.slice(0, 6)}...{t.deployer?.slice(-4)}
              </td>
              <td className="py-3 px-3 text-right text-[var(--muted)] text-xs">{t.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

/* ─── Trending Section ─── */
function TrendingSection() {
  const [pairs, setPairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/base/pairs?view=top");
        const data = await res.json();
        const items = (data.data || []).slice(0, 30);
        const scored = items.map((p: any) => {
          const vol1h = parseFloat(p.attributes.volume_usd?.h1 || "0");
          const vol24h = parseFloat(p.attributes.volume_usd?.h24 || "1");
          const buyers = p.attributes.transactions?.h24?.buys || 0;
          const liq = parseFloat(p.attributes.reserve_in_usd || "0");
          const score = Math.min(vol1h / (vol24h / 24), 50) * (1 + Math.log10(1 + buyers)) * Math.sqrt(liq || 1);
          return { ...p, score };
        });
        scored.sort((a: any, b: any) => b.score - a.score);
        setPairs(scored);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section
      title="Trending on Base"
      subtitle="Score = clamp(vol1h / (vol24h/24), 50) x (1 + log10(1 + buyers24h)) x sqrt(liquidity)"
      loading={loading}
      empty={pairs.length === 0}
    >
      <table className="w-full text-sm min-w-[500px]">
        <thead>
          <tr className="text-[var(--muted)] border-b border-[var(--border)] bg-black/20">
            <th className="text-left py-3 px-3">#</th>
            <th className="text-left py-3 px-3">Pool</th>
            <th className="text-right py-3 px-3">Score</th>
            <th className="text-right py-3 px-3">Vol 24h</th>
            <th className="text-right py-3 px-3 hidden sm:table-cell">Liquidity</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((p: any, i: number) => {
            const poolId = p.id?.split("_").pop() || "";
            return (
              <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)]">
                <td className="py-3 px-3 text-[var(--muted)]">{i + 1}</td>
                <td className="py-3 px-3">
                  <Link href={`/base/${poolId}`} className="text-white hover:text-[var(--accent)] font-medium text-xs sm:text-sm">
                    {p.attributes.name}
                  </Link>
                </td>
                <td className="py-3 px-3 text-right font-mono text-[var(--accent)] text-xs sm:text-sm">
                  {p.score.toFixed(1)}
                </td>
                <td className="py-3 px-3 text-right text-xs sm:text-sm">
                  ${parseFloat(p.attributes.volume_usd?.h24 || "0").toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right text-xs sm:text-sm hidden sm:table-cell">
                  ${parseFloat(p.attributes.reserve_in_usd || "0").toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Section>
  );
}

/* ─── Page ─── */
export default function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">LiquidDexScan</h1>
        <p className="text-sm text-[var(--muted)] mt-1">Base Network DEX Scanner — Pairs, New Tokens, Trending</p>
      </div>
      <PairsSection />
      <NewTokensSection />
      <TrendingSection />
    </div>
  );
}

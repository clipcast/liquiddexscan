"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TrendingPage() {
  const [pairs, setPairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/base/pairs?view=top");
        const data = await res.json();
        const items = (data.data || []).slice(0, 30);
        // Sort by trending formula (1h vol / 24h vol)
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
  }, []);

  if (loading) return <p className="text-[var(--muted)]">Calculating trending...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">📈 Trending on Base</h1>
      <p className="text-xs text-[var(--muted)] mb-6">
        Score = clamp(vol1h / (vol24h/24), 50) × (1 + log₁₀(1 + buyers24h)) × √liquidity
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[var(--muted)] border-b border-[var(--border)]">
              <th className="text-left py-3 px-2">#</th>
              <th className="text-left py-3 px-2">Pool</th>
              <th className="text-right py-3 px-2">Trend Score</th>
              <th className="text-right py-3 px-2">24h Vol</th>
              <th className="text-right py-3 px-2">Liquidity</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((p: any, i: number) => {
              const poolId = p.id?.split("_").pop() || "";
              return (
                <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)]">
                  <td className="py-3 px-2 text-[var(--muted)]">{i + 1}</td>
                  <td className="py-3 px-2">
                    <Link href={`/base/${poolId}`} className="text-white hover:text-[var(--accent)]">
                      {p.attributes.name}
                    </Link>
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-[var(--accent)]">
                    {p.score.toFixed(1)}
                  </td>
                  <td className="py-3 px-2 text-right">
                    ${parseFloat(p.attributes.volume_usd?.h24 || "0").toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right">
                    ${parseFloat(p.attributes.reserve_in_usd || "0").toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

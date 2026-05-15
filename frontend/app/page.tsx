"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Pair {
  id: string;
  attributes: {
    name: string;
    base_token_price_usd: string;
    reserve_in_usd: string;
    volume_usd: { h24: string };
    price_change_percentage: { h24: string };
  };
}

export default function HomePage() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/base/pairs?view=top");
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

  if (loading) return <p className="text-[var(--muted)]">Loading pairs...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">🔥 Top Base Pairs</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[var(--muted)] border-b border-[var(--border)]">
              <th className="text-left py-3 px-2">#</th>
              <th className="text-left py-3 px-2">Pool</th>
              <th className="text-right py-3 px-2">Price</th>
              <th className="text-right py-3 px-2">24h %</th>
              <th className="text-right py-3 px-2">Volume 24h</th>
              <th className="text-right py-3 px-2">Liquidity</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((p, i) => {
              const change = parseFloat(p.attributes.price_change_percentage?.h24 || "0");
              const poolId = p.id?.split("_").pop() || "";
              return (
                <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)]">
                  <td className="py-3 px-2 text-[var(--muted)]">{i + 1}</td>
                  <td className="py-3 px-2">
                    <Link href={`/base/${poolId}`} className="text-white hover:text-[var(--accent)]">
                      {p.attributes.name}
                    </Link>
                  </td>
                  <td className="py-3 px-2 text-right font-mono">
                    ${parseFloat(p.attributes.base_token_price_usd || "0").toFixed(8)}
                  </td>
                  <td className={`py-3 px-2 text-right ${change >= 0 ? "text-[var(--green)]" : "text-[var(--red)]"}`}>
                    {change >= 0 ? "+" : ""}{change.toFixed(2)}%
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

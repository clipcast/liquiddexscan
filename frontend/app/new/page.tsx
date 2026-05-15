"use client";
import { useEffect, useState } from "react";

export default function NewTokensPage() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/new");
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🆕 New Tokens</h1>
        <span className="text-sm text-[var(--muted)]">Auto-refresh every 30s</span>
      </div>
      {loading ? (
        <p className="text-[var(--muted)]">Scanning Base chain...</p>
      ) : tokens.length === 0 ? (
        <p className="text-[var(--muted)]">No new tokens found in the last ~18h</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="text-left py-3 px-2">#</th>
                <th className="text-left py-3 px-2">Token</th>
                <th className="text-left py-3 px-2">Symbol</th>
                <th className="text-left py-3 px-2">Deployer</th>
                <th className="text-right py-3 px-2">Age</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((t: any, i: number) => (
                <tr key={t.address} className="border-b border-[var(--border)] hover:bg-[var(--surface)]">
                  <td className="py-3 px-2 text-[var(--muted)]">{i + 1}</td>
                  <td className="py-3 px-2 font-medium">{t.name}</td>
                  <td className="py-3 px-2">
                    <span className="bg-[var(--surface)] px-2 py-0.5 rounded text-xs">
                      {t.symbol}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-xs text-[var(--muted)] font-mono">
                    {t.deployer?.slice(0, 6)}...{t.deployer?.slice(-4)}
                  </td>
                  <td className="py-3 px-2 text-right text-[var(--muted)]">{t.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

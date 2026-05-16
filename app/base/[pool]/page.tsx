"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function PoolDetailPage() {
  const params = useParams();
  const poolAddress = params.pool as string;
  const chartRef = useRef<HTMLDivElement>(null);
  const [poolName, setPoolName] = useState("Loading...");

  useEffect(() => {
    if (!poolAddress) return;

    // Load TradingView chart
    const script = document.createElement("script");
    script.src = "https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js";
    script.async = true;
    script.onload = () => {
      if (!chartRef.current || typeof (window as any).LightweightCharts === "undefined") return;
      const { createChart } = (window as any).LightweightCharts;
      const chart = createChart(chartRef.current, {
        layout: { background: { type: "solid", color: "#14141a" }, textColor: "#a1a1aa" },
        grid: { vertLines: { color: "#1f1f2a" }, horzLines: { color: "#1f1f2a" } },
        width: chartRef.current.clientWidth,
        height: 450,
        crosshair: { mode: 0 },
        timeScale: { timeVisible: true, borderColor: "#1f1f2a" },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: "#22c55e", downColor: "#ef4444", borderUpColor: "#22c55e", borderDownColor: "#ef4444",
        wickUpColor: "#22c55e", wickDownColor: "#ef4444",
      });

      async function loadData() {
        try {
          const res = await fetch(`/api/base/pool/${poolAddress}/ohlcv?tf=5m`);
          const data = await res.json();
          const ohlcv = data.data?.attributes?.ohlcv_list || [];
          // Data format: [timestamp, open, high, low, close, volume]
          const candles = ohlcv.map((c: number[]) => ({
            time: c[0] as number,
            open: parseFloat(c[1]),
            high: parseFloat(c[2]),
            low: parseFloat(c[3]),
            close: parseFloat(c[4]),
          })).filter((c: any) => c.open > 0);

          if (candles.length > 0) {
            candleSeries.setData(candles);
            chart.timeScale().fitContent();
          }
        } catch (e) {
          console.error(e);
        }
      }

      loadData();
      const interval = setInterval(loadData, 60000);
      (window as any).__chartCleanup = () => { clearInterval(interval); chart.remove(); };
    };
    document.head.appendChild(script);

    // Fetch pool name
    fetch(`/api/base/pairs?view=top`)
      .then(r => r.json())
      .then(data => {
        const pool = (data.data || []).find((p: any) => p.id?.includes(poolAddress));
        if (pool) setPoolName(pool.attributes.name);
      })
      .catch(() => {});

    return () => {
      (window as any).__chartCleanup?.();
    };
  }, [poolAddress]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{poolName}</h1>
      <p className="text-xs font-mono text-[var(--muted)] mb-6">{poolAddress}</p>
      <div ref={chartRef} className="rounded-lg overflow-hidden border border-[var(--border)]" />
    </div>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LiquidDexScan — Base DEX Scanner",
  description: "Open-source DEX scanner for Base Network. Real-time token pairs, new tokens, charts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="flex items-center gap-6 px-6 h-14 border-b border-[var(--border)] bg-[var(--surface)]">
          <a href="/" className="font-bold text-lg">🪙 LiquidDexScan</a>
          <div className="flex gap-4 text-sm text-[var(--muted)]">
            <a href="/">Pairs</a>
            <a href="/new">New</a>
            <a href="/trending">Trending</a>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}

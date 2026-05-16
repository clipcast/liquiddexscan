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
        <nav className="flex items-center px-4 sm:px-6 h-12 sm:h-14 border-b border-[var(--border)] bg-[var(--surface)]">
          <a href="/" className="font-bold text-sm sm:text-lg">🪙 LiquidDexScan</a>
        </nav>
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">{children}</main>
      </body>
    </html>
  );
}

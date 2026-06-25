import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "KickBracket Pro — Enterprise Tournament Management Platform",
  description:
    "Enterprise-grade sports competition & fixture management platform. Instantaneous fixture generation for round-robin leagues, Swiss stage tournaments, and double-elimination knockout brackets with live score telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
